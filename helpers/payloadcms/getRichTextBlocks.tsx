import Image from "next/image";
import { createElement } from "react";
import { ActiveLink } from "@/components/basic";
import { resolvePayloadMediaUrl } from "./api";

/** Resolve a Payload media URL to an absolute URL. */
function resolveMediaUrl(url: string): string {
  return resolvePayloadMediaUrl(url);
}

// Lexical text format bitmask constants
const IS_BOLD        = 1;
const IS_ITALIC      = 2;
const IS_STRIKETHROUGH = 4;
const IS_UNDERLINE   = 8;
const IS_CODE        = 16;
const IS_SUBSCRIPT   = 32;
const IS_SUPERSCRIPT = 64;

/** Recursively apply all active Lexical format flags to a text node's content. */
function applyTextFormats(format: number, content: React.ReactNode): React.ReactNode {
  // Apply innermost to outermost so nesting is correct
  if (format & IS_CODE)          content = <code>{content}</code>;
  if (format & IS_STRIKETHROUGH) content = <s>{content}</s>;
  if (format & IS_UNDERLINE)     content = <u>{content}</u>;
  if (format & IS_ITALIC)        content = <em>{content}</em>;
  if (format & IS_BOLD)          content = <strong>{content}</strong>;
  if (format & IS_SUBSCRIPT)     content = <sub>{content}</sub>;
  if (format & IS_SUPERSCRIPT)   content = <sup>{content}</sup>;
  return content;
}

/** Render a Lexical `text` node, applying its bitmask format. */
function renderTextNode(node: any, key: React.Key): React.ReactNode {
  const text = node.text ?? "";
  const format: number = typeof node.format === "number" ? node.format : 0;
  return <span key={key}>{applyTextFormats(format, text)}</span>;
}

/** Render the children of any Lexical node. */
function renderChildren(children: any[]): React.ReactNode[] {
  return (children ?? []).map((child: any, i: number) => renderLexicalNode(child, i));
}

/** Render a Lexical `link` node. */
function renderLinkNode(node: any, key: React.Key): React.ReactNode {
  const fields = node.fields ?? {};
  const href: string = fields.url ?? fields.href ?? "#";
  const newTab: boolean = fields.newTab === true;
  return (
    <ActiveLink
      key={key}
      href={href}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
    >
      {renderChildren(node.children)}
    </ActiveLink>
  );
}

/** Render a Lexical `list` node (unordered or ordered). */
function renderListNode(node: any, key: React.Key): React.ReactNode {
  // Lexical sometimes serializes a nested list as a sibling of listitem nodes
  // rather than as a child of the preceding listitem. Merge it back so the HTML
  // is <li>text<ul>…</ul></li> rather than bare <ul> inside <ul>.
  const raw: any[] = node.children ?? [];
  const normalized: any[] = [];

  for (const child of raw) {
    if (child.type === "list" && normalized.length > 0) {
      const prev = normalized[normalized.length - 1];
      normalized[normalized.length - 1] = {
        ...prev,
        children: [...(prev.children ?? []), child],
      };
    } else {
      normalized.push(child);
    }
  }

  const children = normalized.map((child: any, i: number) => {
    if (child.type === "listitem") return renderListItemNode(child, i);
    // Fallback: a list node that has no preceding sibling — wrap in <li>
    if (child.type === "list") return <li key={i}>{renderListNode(child, i)}</li>;
    return null;
  });

  if (node.listType === "bullet") return <ul key={key}>{children}</ul>;
  return <ol key={key}>{children}</ol>;
}

/** Render a Lexical `listitem` node. */
function renderListItemNode(node: any, key: React.Key): React.ReactNode {
  return <li key={key}>{renderChildren(node.children)}</li>;
}

/** Dispatch a single Lexical node to the appropriate renderer. */
function renderLexicalNode(node: any, key: React.Key): React.ReactNode {
  if (!node || !node.type) return null;

  switch (node.type) {
    case "text":
      return renderTextNode(node, key);

    case "link":
    case "autolink":
      return renderLinkNode(node, key);

    case "paragraph": {
      const children = renderChildren(node.children);
      return <p key={key}>{children}</p>;
    }

    case "heading": {
      // Lexical headings use `tag`: "h1" | "h2" | ... | "h6"
      const tag: string = node.tag ?? "h2";
      const children = renderChildren(node.children);
      return createElement(tag, { key }, children);
    }

    case "quote": {
      const children = renderChildren(node.children);
      return <blockquote key={key}>{children}</blockquote>;
    }

    case "code": {
      // Lexical code blocks wrap content in text children
      const lang: string | undefined = node.language;
      const children = renderChildren(node.children);
      return (
        <pre key={key} data-language={lang}>
          <code>{children}</code>
        </pre>
      );
    }

    case "list":
      return renderListNode(node, key);

    case "listitem":
      return renderListItemNode(node, key);

    case "upload": {
      // Populated when depth >= 1; value may also be a bare string ID
      const media = node.value;
      if (!media || typeof media === "string") return null;

      const src = resolveMediaUrl(media.url ?? "");
      // If we couldn't build an absolute URL, skip — the optimizer would
      // try to fetch a relative path against the Next.js server and fail.
      if (!src || !src.startsWith("http")) return null;

      const alt: string = media.alt ?? "";
      const width: number | undefined = media.width ?? undefined;
      const height: number | undefined = media.height ?? undefined;

      if (width && height) {
        return (
          <Image
            key={key}
            src={src}
            alt={alt}
            width={width}
            height={height}
            unoptimized
            className="max-w-full h-auto"
          />
        );
      }

      // Fallback when dimensions are not available
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={key} src={src} alt={alt} className="max-w-full h-auto" />
      );
    }

    case "horizontalrule":
      return <hr key={key} />;

    case "linebreak":
      return <br key={key} />;

    case "root": {
      const children = renderChildren(node.children);
      return <>{children}</>;
    }

    default:
      return null;
  }
}

/**
 * Convert a Payload CMS Lexical rich-text value into React elements.
 *
 * Accepts either:
 *  - A SerializedEditorState object (`{ root: { children: [...] } }`)
 *  - An array of Lexical nodes (already-extracted `root.children`)
 *  - A single Lexical node
 */
function getRichTextBlocks(
  block: any,
  attrs: any = {},
  key: number
): React.ReactNode {
  if (!block) return null;

  // Full SerializedEditorState: { root: { children: [...] } }
  if (block.root?.children) {
    return block.root.children.map((child: any, idx: number) =>
      getRichTextBlocks(child, attrs, idx)
    );
  }

  return renderLexicalNode(block, key);
}

export { getRichTextBlocks };
