[![CodeFactor](https://www.codefactor.io/repository/github/redfrogsss/v2.jacky.fan/badge)](https://www.codefactor.io/repository/github/redfrogsss/v2.jacky.fan)
[![wakatime](https://wakatime.com/badge/user/2cbd8003-b8b8-4565-92d7-ad9c23ff1846/project/365135c2-65e9-4ed2-a03e-733a4b9c6fd7.svg)](https://wakatime.com/badge/user/2cbd8003-b8b8-4565-92d7-ad9c23ff1846/project/365135c2-65e9-4ed2-a03e-733a4b9c6fd7)

You can access this website via https://jacky.fan

# [v2.Jacky.Fan](https://jacky.fan) - My Personal Website

[v2.jacky.fan](https://github.com/redfrogsss/v2.jacky.fan) is a personal website built with [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), and [Framer Motion](https://www.framer.com/motion/).

## Features

-   Light / Dark Mode
-   Responsive Design
-   Contact Form
-   Site Map
-   Integration with Payload CMS
-   Project Listing / Details Page

## Screenshots

Project screenshot animations are generated with the bundled `scripts/generate-screencap.py` script.

### generate-screencap.py

Creates smooth-scrolling WebM screencaps for portfolio project pages. Composites a
website screenshot onto the editorial background (gradient, dot grid, geometric
circles) with rounded corners, drop shadow, cubic ease-in-out scroll, and fade
in/out.

**Requirements:** Python 3, Pillow, ffmpeg

```bash
pip install Pillow
brew install ffmpeg
```

**Usage:**

```bash
# Single screenshot (auto-names output as <name>-scroll.webm)
python3 scripts/generate-screencap.py screenshot.png

# Custom output path
python3 scripts/generate-screencap.py shot.png -o custom.webm

# Batch — process every .png in a directory (skips existing *_scroll.webm)
python3 scripts/generate-screencap.py --batch ~/Desktop/designo/

# Tune parameters
python3 scripts/generate-screencap.py shot.png --duration 4 --fps 24 --width 1080
```

**Options:**

| Option | Default | Description |
|--------|---------|-------------|
| `--output`, `-o` | `<input>-scroll.webm` | Output path |
| `--batch DIR` | — | Process all PNGs in a directory |
| `--width` | 1280 | Canvas width in px |
| `--viewport-ratio` | 1.78 | Viewport aspect ratio (width/height) |
| `--viewport-fill` | 0.844 | Viewport width as fraction of canvas |
| `--duration` | 6.0 | Animation duration in seconds |
| `--fps` | 30 | Frames per second |
| `--fade` | 0.10 | Fade fraction of total duration |
| `--crf` | 30 | VP9 quality (0–63, lower = better) |
| `--bitrate` | 2M | VP9 target bitrate |

## Getting Started

Start `Dev` Server:

```bash
# Clone the repo
git clone https://github.com/redfrogsss/v2.jacky.fan.git

# Install dependencies
cd v2.jacky.fan
yarn

# copy .env.local.template to .env.local and modifiy the values
cp .env.local.template .env.local

# Start dev server
yarn dev
```

Build for Production:

```bash
# Create .env in the repo root with both site and CMS settings
# Then build and start the production stack
docker compose up -d --build
```

The production compose stack now lives only in the repo root and starts three services:

- `web` on `HOST_PORT` (default `3000`)
- `cms` on `CMS_HOST_PORT` (default `3001`)
- `mongo` as the CMS database

At minimum, set `PAYLOAD_SECRET` in `.env`.

The frontend cache revalidation endpoint uses `REVALIDATE_SECRET` when provided, and otherwise falls back to `PAYLOAD_SECRET`. In the current compose setup, setting `PAYLOAD_SECRET` in the repo-root `.env` is enough for CMS publish hooks to invalidate tagged frontend content.

For deployments where you open the CMS from a real hostname, also set the CMS public URL so Payload does not fall back to `localhost` for admin auth / CSRF checks:

```bash
NEXT_PUBLIC_PAYLOAD_CMS_URL=https://cms.your-domain.tld
# Optional explicit override for the CMS container itself
PAYLOAD_SERVER_URL=https://cms.your-domain.tld
```

`PAYLOAD_CMS_URL` can still point at the internal `cms` service URL for server-to-server traffic inside the compose network.

## Learn More

This project uses the following tech:

-   [NextJS](https://nextjs.org/) - A JavaScript library for building Full Stack Website
-   [TypeScript](https://www.typescriptlang.org/) - A superset of JavaScript.
-   [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapidly building custom designs.
-   [DaisyUI](https://daisyui.com/) - A simple, responsive and customizable UI components library for Tailwind CSS.
-   [HeroIcons](https://heroicons.dev/) - A set of free MIT-licensed high-quality SVG icons for UI development.
-   [Strapi CMS](https://strapi.io/) - An open-source Content Management System (CMS)
-   [Tech Stack Icons](https://www.figma.com/community/file/1095337897898466786) - A set of free MIT-licensed high-quality SVG icons for UI development.
-   [Magnifier 3D Model](https://sketchfab.com/3d-models/magnifier-87fc0d63b7df4aa7b80d6fda5a18dc8a) - A 3D model of a magnifier.
-   [Letter 3D Modal](https://sketchfab.com/3d-models/letter-a3b88a6137864cafbf97423a30cb341c) - A 3D model of a letter.
-   [Pien Icon](https://www.iconarchive.com/show/fluentui-emoji-mono-icons-by-microsoft/Pleading-Face-icon.html) - A free icon from Microsoft.
-   [Cloudflare Pages](https://pages.cloudflare.com/) - A website hosting service.
