#!/usr/bin/env python3
# pyright: reportGeneralTypeIssues=false, reportAttributeAccessIssue=false, reportArgumentType=false, reportOperatorIssue=false
"""
Generate smooth-scrolling WebM screencaps for jacky.fan portfolio projects.

Composites a website screenshot onto the editorial background (gradient, dot grid,
geometric circles) with rounded corners, drop shadow, cubic ease-in-out scroll,
and fade in/out. Outputs VP9 WebM at 30fps.

Usage:
    python3 scripts/generate-screencap.py screenshot.png [--output out.webm]

    # Batch mode — generate for all PNGs in a directory:
    python3 scripts/generate-screencap.py --batch ~/Desktop/designo/

    # Custom duration / fps:
    python3 scripts/generate-screencap.py shot.png --duration 4 --fps 24

    # Custom canvas size:
    python3 scripts/generate-screencap.py shot.png --width 1080 --viewport-ratio 1.78

Requirements:
    pip install Pillow
    ffmpeg (brew install ffmpeg)
"""

import argparse
import math
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFilter
except ImportError:
    sys.exit("Pillow not installed. Run: pip install Pillow")

# ── defaults ──────────────────────────────────────────────────────────────
CANVAS_W = 1280
CANVAS_H = 740
VIEWPORT_W = 1080
VIEWPORT_H = 608          # 16:9
DURATION = 6.0
FPS = 30
FADE_RATIO = 0.10         # fraction of total frames for fade in/out
SHADOW_BLUR = 14
SHADOW_OFFSET = 6
BORDER_RADIUS = 20
VP9_CRF = 30
VP9_BITRATE = "2M"

# colours
BG_TOP = (250, 249, 245)   # #faf9f5
BG_BOTTOM = (243, 241, 235)  # #f3f1eb
ACCENT = (59, 92, 184)       # #3b5cb8
BORDER = (232, 228, 220)     # #e8e4dc
PALE_BLUE = (180, 195, 225)
DOT_GRID = (31, 29, 26)


# ── helpers ───────────────────────────────────────────────────────────────
def _clamp(n, lo, hi):
    return max(lo, min(n, hi))


def make_rounded_mask(w: int, h: int, r: int) -> Image.Image:
    m = Image.new("L", (w, h), 0)
    ImageDraw.Draw(m).rounded_rectangle(
        [(0, 0), (w - 1, h - 1)], radius=r, fill=255
    )
    return m


def draw_filled_circle(
    img: Image.Image, cx: int, cy: int, r: int, color: tuple, opacity: float
) -> None:
    step = max(1, r // 30)
    for dx in range(-r, r + 1, step):
        lim = int(math.sqrt(max(0, r * r - dx * dx)))
        for dy in range(-lim, lim + 1, step):
            x, y = cx + dx, cy + dy
            if 0 <= x < img.width and 0 <= y < img.height:
                pr, pg, pb, _ = img.getpixel((x, y))
                img.putpixel(
                    (x, y),
                    (
                        int(pr * (1 - opacity) + color[0] * opacity),
                        int(pg * (1 - opacity) + color[1] * opacity),
                        int(pb * (1 - opacity) + color[2] * opacity),
                        255,
                    ),
                )


def draw_stroked_circle(
    img: Image.Image,
    cx: int,
    cy: int,
    r: int,
    color: tuple,
    opacity: float,
    thickness: int = 6,
    dotted: bool = False,
) -> None:
    steps = max(2000, r * 4)
    for i in range(steps):
        angle = (i / steps) * 2 * math.pi
        if dotted and i % max(80, steps // 24) < max(40, steps // 48):
            continue
        for t_off in range(thickness):
            rr = r + t_off - thickness // 2
            x = int(cx + rr * math.cos(angle))
            y = int(cy + rr * math.sin(angle))
            if 0 <= x < img.width and 0 <= y < img.height:
                pr, pg, pb, _ = img.getpixel((x, y))
                img.putpixel(
                    (x, y),
                    (
                        int(pr * (1 - opacity) + color[0] * opacity),
                        int(pg * (1 - opacity) + color[1] * opacity),
                        int(pb * (1 - opacity) + color[2] * opacity),
                        255,
                    ),
                )


def draw_dot(
    img: Image.Image, cx: int, cy: int, r: int, color: tuple, opacity: float
) -> None:
    for dx in range(-r, r + 1):
        for dy in range(-r, r + 1):
            if dx * dx + dy * dy <= r * r:
                x, y = cx + dx, cy + dy
                if 0 <= x < img.width and 0 <= y < img.height:
                    pr, pg, pb, _ = img.getpixel((x, y))
                    img.putpixel(
                        (x, y),
                        (
                            int(pr * (1 - opacity) + color[0] * opacity),
                            int(pg * (1 - opacity) + color[1] * opacity),
                            int(pb * (1 - opacity) + color[2] * opacity),
                            255,
                        ),
                    )


# ── background ────────────────────────────────────────────────────────────
def build_background(cw: int, ch: int) -> Image.Image:
    bg = Image.new("RGBA", (cw, ch))
    for y in range(ch):
        t = y / ch
        r = int(BG_TOP[0] + (BG_BOTTOM[0] - BG_TOP[0]) * t)
        g = int(BG_TOP[1] + (BG_BOTTOM[1] - BG_TOP[1]) * t)
        b = int(BG_TOP[2] + (BG_BOTTOM[2] - BG_TOP[2]) * t)
        for x in range(cw):
            bg.putpixel((x, y), (r, g, b, 255))

    # dot grid
    spacing = int(18 * cw / 880)
    for gx in range(spacing, cw - spacing // 2, spacing):
        for gy in range(spacing, ch - spacing // 2, spacing):
            pr, pg, pb, _ = bg.getpixel((gx, gy))
            bg.putpixel(
                (gx, gy),
                (
                    int(pr * 0.94 + DOT_GRID[0] * 0.06),
                    int(pg * 0.94 + DOT_GRID[1] * 0.06),
                    int(pb * 0.94 + DOT_GRID[2] * 0.06),
                    255,
                ),
            )

    # geometric circles — scale from 2636 px reference
    s = cw / 2636
    cx, cy = int(cw * 0.90), int(ch * 0.49)
    r1 = int(2636 * 0.325 * s)
    r2 = int(2636 * 0.425 * s)
    r3 = int(2636 * 0.525 * s)
    r4 = int(2636 * 0.220 * s)

    draw_filled_circle(bg, cx, cy, r1, PALE_BLUE, 0.10)
    draw_stroked_circle(bg, cx, cy, r2, PALE_BLUE, 0.16, thickness=int(6 * s * 4), dotted=True)
    draw_stroked_circle(bg, cx, cy, r3, PALE_BLUE, 0.11, thickness=int(4 * s * 4))
    draw_stroked_circle(bg, cx, cy, r4, PALE_BLUE, 0.08, thickness=int(4 * s * 4), dotted=True)

    dot_specs = [
        (cx, cy - r2, int(12 * s * 4), 0.25),
        (cx + int(r2 * 0.707), cy + int(r2 * 0.707), int(12 * s * 4), 0.25),
        (cx - r3, cy, int(14 * s * 4), 0.20),
        (cx + int(r3 * 0.707), cy - int(r3 * 0.707), int(14 * s * 4), 0.20),
        (cx - int(r4 * 0.707), cy + int(r4 * 0.707), int(10 * s * 4), 0.20),
    ]
    for dx, dy, dr, do in dot_specs:
        draw_dot(bg, dx, dy, dr, ACCENT, do)

    # top-left corner
    tcx, tcy = int(cw * 0.068), int(ch * 0.108)
    tr = int(cw * 0.112)
    draw_filled_circle(bg, tcx, tcy, tr, PALE_BLUE, 0.08)
    draw_stroked_circle(bg, tcx, tcy, int(tr * 1.44), PALE_BLUE, 0.11, thickness=int(4 * s * 4), dotted=True)
    draw_dot(bg, tcx, tcy - int(tr * 1.44), int(8 * s * 4), ACCENT, 0.20)

    # bottom-right corner
    bcx, bcy = int(cw * 0.918), int(ch * 0.89)
    br = int(cw * 0.10)
    draw_filled_circle(bg, bcx, bcy, br, PALE_BLUE, 0.07)
    draw_stroked_circle(bg, bcx, bcy, int(br * 1.44), PALE_BLUE, 0.10, thickness=int(4 * s * 4), dotted=True)
    draw_dot(bg, bcx + int(br * 1.44), bcy, int(8 * s * 4), ACCENT, 0.20)

    return bg


# ── easing / fade ─────────────────────────────────────────────────────────
def ease_in_out_cubic(t: float) -> float:
    if t < 0.5:
        return 4 * t * t * t
    return 1 - pow(-2 * t + 2, 3) / 2


def fade_opacity(frame: int, total: int, fade_frames: int) -> float:
    if frame < fade_frames:
        return frame / fade_frames
    if frame >= total - fade_frames:
        return (total - 1 - frame) / fade_frames
    return 1.0


# ── render ────────────────────────────────────────────────────────────────
def render_screencap(
    screenshot_path: str,
    output_path: str,
    *,
    canvas_w: int = CANVAS_W,
    canvas_h: int = CANVAS_H,
    viewport_w: int = VIEWPORT_W,
    viewport_h: int = VIEWPORT_H,
    duration: float = DURATION,
    fps: int = FPS,
    fade_ratio: float = FADE_RATIO,
    crf: int = VP9_CRF,
    bitrate: str = VP9_BITRATE,
) -> str:
    """Render a scrolling WebM screencap.  Returns output_path on success."""

    # ── validate ──────────────────────────────────────────────────────
    margin_x = (canvas_w - viewport_w) // 2
    margin_y = (canvas_h - viewport_h) // 2

    assert margin_x - SHADOW_BLUR >= 0, (
        f"Shadow bleeds left ({margin_x - SHADOW_BLUR}px).  "
        f"Increase canvas width or reduce viewport."
    )
    assert margin_y - SHADOW_BLUR >= 0, (
        f"Shadow bleeds top ({margin_y - SHADOW_BLUR}px).  "
        f"Increase canvas height or reduce viewport."
    )
    assert margin_x + viewport_w + SHADOW_BLUR <= canvas_w, (
        f"Shadow bleeds right.  Increase canvas width."
    )
    assert margin_y + viewport_h + SHADOW_BLUR <= canvas_h, (
        f"Shadow bleeds bottom.  Increase canvas height."
    )

    if not shutil.which("ffmpeg"):
        sys.exit("ffmpeg not found in PATH.  Install: brew install ffmpeg")

    total_frames = int(duration * fps)
    fade_frames = int(total_frames * fade_ratio)
    print(
        f"Canvas: {canvas_w}×{canvas_h}  Viewport: {viewport_w}×{viewport_h}  "
        f"Duration: {duration}s  FPS: {fps}  Frames: {total_frames}  "
        f"Fade: {fade_frames}f ({fade_frames / fps:.1f}s)"
    )

    # ── load screenshot ───────────────────────────────────────────────
    ss = Image.open(screenshot_path).convert("RGBA")
    ss_h = int(ss.height * viewport_w / ss.width)
    ss = ss.resize((viewport_w, ss_h), Image.LANCZOS)
    total_scroll = max(ss_h - viewport_h, 1)
    print(f"Screenshot: {viewport_w}×{ss_h}  scroll-range: {total_scroll}px")

    # ── shared layers ─────────────────────────────────────────────────
    print("Building background …")
    bg_static = build_background(canvas_w, canvas_h)

    ss_mask = make_rounded_mask(viewport_w, viewport_h, BORDER_RADIUS)

    border_layer = Image.new("RGBA", (viewport_w, viewport_h), (0, 0, 0, 0))
    ImageDraw.Draw(border_layer).rounded_rectangle(
        [(0, 0), (viewport_w - 1, viewport_h - 1)],
        radius=BORDER_RADIUS,
        outline=BORDER + (255,),
        width=3,
    )

    sw_sh = viewport_w + SHADOW_BLUR * 2
    sh_sh = viewport_h + SHADOW_BLUR * 2
    sm = Image.new("L", (sw_sh, sh_sh), 0)
    ImageDraw.Draw(sm).rounded_rectangle(
        [
            (SHADOW_BLUR + SHADOW_OFFSET, SHADOW_BLUR + SHADOW_OFFSET),
            (sw_sh - SHADOW_BLUR + SHADOW_OFFSET, sh_sh - SHADOW_BLUR + SHADOW_OFFSET),
        ],
        radius=BORDER_RADIUS,
        fill=40,
    )
    sm = sm.filter(ImageFilter.GaussianBlur(radius=SHADOW_BLUR))
    shadow_rgba = Image.new("RGBA", (sw_sh, sh_sh), (0, 0, 0, 0))
    for dy in range(sh_sh):
        for dx in range(sw_sh):
            a = sm.getpixel((dx, dy))
            if a > 0:
                shadow_rgba.putpixel((dx, dy), (0, 0, 0, a))

    # ── precompute positions ──────────────────────────────────────────
    positions = [
        int(ease_in_out_cubic(i / (total_frames - 1)) * total_scroll)
        for i in range(total_frames)
    ]

    # ── render frames ─────────────────────────────────────────────────
    frames_dir = tempfile.mkdtemp(prefix="screencap_")
    print("Rendering frames …")
    for fi, y_off in enumerate(positions):
        if fi % max(1, total_frames // 4) == 0:
            print(f"  {fi + 1}/{total_frames}")

        opacity = fade_opacity(fi, total_frames, fade_frames)
        frame = bg_static.copy()

        # screenshot crop
        crop = ss.crop((0, y_off, viewport_w, y_off + viewport_h))
        crop_rounded = Image.new("RGBA", (viewport_w, viewport_h), (0, 0, 0, 0))
        crop_rounded.paste(crop, (0, 0), ss_mask)

        # shadow
        slay = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
        slay.paste(
            shadow_rgba,
            (margin_x - SHADOW_BLUR, margin_y - SHADOW_BLUR),
            shadow_rgba,
        )
        frame = Image.alpha_composite(frame, slay)

        # screenshot + border (with opacity for fade)
        if opacity < 1.0:
            ss_op = Image.new("RGBA", (viewport_w, viewport_h), (0, 0, 0, 0))
            ss_op.paste(crop_rounded, (0, 0), crop_rounded)
            for dy in range(viewport_h):
                for dx in range(viewport_w):
                    r, g, b, a = ss_op.getpixel((dx, dy))
                    if a > 0:
                        na = int(a * opacity)
                        ss_op.putpixel(
                            (dx, dy), (r, g, b, na) if na > 0 else (0, 0, 0, 0)
                        )
            bo = Image.new("RGBA", (viewport_w, viewport_h), (0, 0, 0, 0))
            for dy in range(viewport_h):
                for dx in range(viewport_w):
                    r, g, b, a = border_layer.getpixel((dx, dy))
                    if a > 0:
                        bo.putpixel((dx, dy), (r, g, b, int(a * opacity)))
            frame.paste(ss_op, (margin_x, margin_y), ss_op)
            frame.paste(bo, (margin_x, margin_y), bo)
        else:
            frame.paste(crop_rounded, (margin_x, margin_y), crop_rounded)
            frame.paste(border_layer, (margin_x, margin_y), border_layer)

        # flatten to RGB PNG for ffmpeg
        fr = Image.new("RGB", (canvas_w, canvas_h), (255, 255, 255))
        fr.paste(frame, (0, 0), frame)
        fr.save(f"{frames_dir}/f_{fi:05d}.png")

    # ── encode WebM ───────────────────────────────────────────────────
    print("Encoding WebM …")
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-framerate", str(fps),
            "-i", f"{frames_dir}/f_%05d.png",
            "-c:v", "libvpx-vp9",
            "-pix_fmt", "yuv420p",
            "-b:v", bitrate,
            "-crf", str(crf),
            "-quality", "best",
            "-speed", "2",
            "-threads", "4",
            output_path,
        ],
        check=True,
        capture_output=True,
    )
    shutil.rmtree(frames_dir)

    size_kb = os.path.getsize(output_path) / 1024
    print(f"Done  {output_path}  ({size_kb:.0f} KB)")
    return output_path


# ── batch helper ──────────────────────────────────────────────────────────
def batch_render(
    input_dir: str,
    *,
    canvas_w: int = CANVAS_W,
    canvas_h: int = CANVAS_H,
    viewport_w: int = VIEWPORT_W,
    viewport_h: int = VIEWPORT_H,
    duration: float = DURATION,
    fps: int = FPS,
    fade_ratio: float = FADE_RATIO,
    crf: int = VP9_CRF,
    bitrate: str = VP9_BITRATE,
) -> list[str]:
    """Render WebMs for every .png in *input_dir* (skips *_scroll.webm)."""
    pngs = sorted(Path(input_dir).glob("*.png"))
    if not pngs:
        print(f"No PNGs found in {input_dir}")
        return []

    outputs = []
    for png in pngs:
        out = png.with_suffix("").with_name(f"{png.stem}-scroll.webm")
        if out.exists():
            print(f"Skip (exists): {out}")
            continue
        print(f"\n── {png.name} ──")
        render_screencap(
            str(png),
            str(out),
            canvas_w=canvas_w,
            canvas_h=canvas_h,
            viewport_w=viewport_w,
            viewport_h=viewport_h,
            duration=duration,
            fps=fps,
            fade_ratio=fade_ratio,
            crf=crf,
            bitrate=bitrate,
        )
        outputs.append(str(out))
    return outputs


# ── CLI ───────────────────────────────────────────────────────────────────
def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate smooth-scrolling WebM screencap for jacky.fan",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s screenshot.png
  %(prog)s shot.png -o out.webm --duration 4 --fps 24
  %(prog)s --batch ~/Desktop/designo/
  %(prog)s shot.png --width 1080 --viewport-ratio 1.78
        """,
    )
    parser.add_argument(
        "input",
        nargs="?",
        help="Path to screenshot PNG",
    )
    parser.add_argument(
        "--output", "-o",
        help="Output WebM path (default: <input>-scroll.webm)",
    )
    parser.add_argument(
        "--batch",
        metavar="DIR",
        help="Process all PNGs in a directory",
    )
    parser.add_argument(
        "--width", type=int, default=CANVAS_W,
        help=f"Canvas width in px (default: {CANVAS_W})",
    )
    parser.add_argument(
        "--viewport-ratio", type=float, default=16 / 9,
        help=f"Viewport aspect ratio width/height (default: {16/9:.2f})",
    )
    parser.add_argument(
        "--viewport-fill", type=float, default=0.844,
        help=f"Viewport width as fraction of canvas (default: 0.844)",
    )
    parser.add_argument(
        "--duration", type=float, default=DURATION,
        help=f"Duration in seconds (default: {DURATION})",
    )
    parser.add_argument(
        "--fps", type=int, default=FPS,
        help=f"Frames per second (default: {FPS})",
    )
    parser.add_argument(
        "--fade", type=float, default=FADE_RATIO,
        help=f"Fade fraction of total duration (default: {FADE_RATIO})",
    )
    parser.add_argument(
        "--crf", type=int, default=VP9_CRF,
        help=f"VP9 CRF quality (0–63, lower=better, default: {VP9_CRF})",
    )
    parser.add_argument(
        "--bitrate", default=VP9_BITRATE,
        help=f"VP9 target bitrate (default: {VP9_BITRATE})",
    )

    args = parser.parse_args()

    # ── compute viewport from args ────────────────────────────────────
    cw = args.width
    vw = int(cw * args.viewport_fill)
    vh = int(vw / args.viewport_ratio)
    ch = vh + 2 * int((cw - vw) // 2 * (9 / 16))  # keep vertical margin proportional
    # round to even
    ch = ch if ch % 2 == 0 else ch + 1

    kwargs = dict(
        canvas_w=cw,
        canvas_h=ch,
        viewport_w=vw,
        viewport_h=vh,
        duration=args.duration,
        fps=args.fps,
        fade_ratio=args.fade,
        crf=args.crf,
        bitrate=args.bitrate,
    )

    # ── batch mode ────────────────────────────────────────────────────
    if args.batch:
        batch_render(args.batch, **kwargs)
        return

    # ── single mode ───────────────────────────────────────────────────
    if not args.input:
        parser.error("Either INPUT or --batch is required")

    out = args.output or str(Path(args.input).with_suffix("").with_name(
        f"{Path(args.input).stem}-scroll.webm"
    ))
    render_screencap(args.input, out, **kwargs)


if __name__ == "__main__":
    main()
