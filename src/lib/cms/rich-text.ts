import { resolvePayloadMediaUrl } from './api';

// Lexical text format bitmask constants
const IS_BOLD = 1;
const IS_ITALIC = 2;
const IS_STRIKETHROUGH = 4;
const IS_UNDERLINE = 8;
const IS_CODE = 16;
const IS_SUBSCRIPT = 32;
const IS_SUPERSCRIPT = 64;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&' + 'amp;')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#39;');
}

function attr(value: string | undefined | null): string {
  return escapeHtml(value ?? '');
}

/** Recursively apply all active Lexical format flags to a text node's content. */
function applyTextFormats(format: number, text: string): string {
  let content = escapeHtml(text);
  // Apply innermost to outermost so nesting is correct
  if (format & IS_CODE) content = `<code>${content}</code>`;
  if (format & IS_STRIKETHROUGH) content = `<s>${content}</s>`;
  if (format & IS_UNDERLINE) content = `<u>${content}</u>`;
  if (format & IS_ITALIC) content = `<em>${content}</em>`;
  if (format & IS_BOLD) content = `<strong>${content}</strong>`;
  if (format & IS_SUBSCRIPT) content = `<sub>${content}</sub>`;
  if (format & IS_SUPERSCRIPT) content = `<sup>${content}</sup>`;
  return content;
}

/** Render a Lexical `text` node, applying its bitmask format. */
function renderTextNode(node: any): string {
  const text = node.text ?? '';
  const format: number = typeof node.format === 'number' ? node.format : 0;
  return `<span>${applyTextFormats(format, text)}</span>`;
}

/** Render the children of any Lexical node. */
function renderChildren(children: any[]): string {
  return (children ?? []).map((child: any) => renderLexicalNode(child)).join('');
}

/** Render a Lexical `link` node. */
function renderLinkNode(node: any): string {
  const fields = node.fields ?? {};
  const href: string = fields.url ?? fields.href ?? '#';
  const newTab: boolean = fields.newTab === true;
  const targetAttr = newTab ? ' target="_blank" rel="noopener noreferrer"' : '';
  return `<a href="${attr(href)}"${targetAttr}>${renderChildren(node.children)}</a>`;
}

/** Render a Lexical `list` node (unordered or ordered). */
function renderListNode(node: any): string {
  // Lexical sometimes serializes a nested list as a sibling of listitem nodes
  // rather than as a child of the preceding listitem. Merge it back so the HTML
  // is <li>text<ul>…</ul></li> rather than bare <ul> inside <ul>.
  const raw: any[] = node.children ?? [];
  const normalized: any[] = [];

  for (const child of raw) {
    if (child.type === 'list' && normalized.length > 0) {
      const prev = normalized[normalized.length - 1];
      normalized[normalized.length - 1] = {
        ...prev,
        children: [...(prev.children ?? []), child],
      };
    } else {
      normalized.push(child);
    }
  }

  const children = normalized
    .map((child: any) => {
      if (child.type === 'listitem') return renderListItemNode(child);
      // Fallback: a list node that has no preceding sibling — wrap in <li>
      if (child.type === 'list') return `<li>${renderListNode(child)}</li>`;
      return '';
    })
    .join('');

  if (node.listType === 'bullet') return `<ul>${children}</ul>`;
  return `<ol>${children}</ol>`;
}

/** Render a Lexical `listitem` node. */
function renderListItemNode(node: any): string {
  return `<li>${renderChildren(node.children)}</li>`;
}

/** Dispatch a single Lexical node to the appropriate renderer. */
function renderLexicalNode(node: any): string {
  if (!node || !node.type) return '';

  switch (node.type) {
    case 'text':
      return renderTextNode(node);

    case 'link':
    case 'autolink':
      return renderLinkNode(node);

    case 'paragraph': {
      const children = renderChildren(node.children);
      return `<p>${children}</p>`;
    }

    case 'heading': {
      // Lexical headings use `tag`: "h1" | "h2" | ... | "h6"
      const tag: string = /^(h[1-6])$/.test(node.tag ?? '') ? node.tag : 'h2';
      const children = renderChildren(node.children);
      return `<${tag}>${children}</${tag}>`;
    }

    case 'quote': {
      const children = renderChildren(node.children);
      return `<blockquote>${children}</blockquote>`;
    }

    case 'code': {
      // Lexical code blocks wrap content in text children
      const lang: string | undefined = node.language;
      const langAttr = lang ? ` data-language="${attr(lang)}"` : '';
      const children = renderChildren(node.children);
      return `<pre${langAttr}><code>${children}</code></pre>`;
    }

    case 'list':
      return renderListNode(node);

    case 'listitem':
      return renderListItemNode(node);

    case 'upload': {
      // Populated when depth >= 1; value may also be a bare string ID
      const media = node.value;
      if (!media || typeof media === 'string') return '';

      const src = resolvePayloadMediaUrl(media.url ?? '');
      // If we couldn't build an absolute URL, skip rendering the image
      if (!src || !src.startsWith('http')) return '';

      const alt: string = media.alt ?? '';
      const width: number | undefined = media.width ?? undefined;
      const height: number | undefined = media.height ?? undefined;

      if (width && height) {
        return `<img src="${attr(src)}" alt="${attr(alt)}" width="${width}" height="${height}" loading="lazy" class="max-w-full h-auto" />`;
      }

      // Fallback when dimensions are not available
      return `<img src="${attr(src)}" alt="${attr(alt)}" loading="lazy" class="max-w-full h-auto" />`;
    }

    case 'horizontalrule':
      return '<hr />';

    case 'linebreak':
      return '<br />';

    case 'root':
      return renderChildren(node.children);

    default:
      return '';
  }
}

/**
 * Convert a Payload CMS Lexical rich-text value into an HTML string.
 *
 * Accepts either:
 *  - A SerializedEditorState object (`{ root: { children: [...] } }`)
 *  - An array of Lexical nodes (already-extracted `root.children`)
 *  - A single Lexical node
 */
function getRichTextBlocks(block: any): string {
  if (!block) return '';

  // Full SerializedEditorState: { root: { children: [...] } }
  if (block.root?.children) {
    return block.root.children.map((child: any) => getRichTextBlocks(child)).join('');
  }

  return renderLexicalNode(block);
}

/** Normalize a rich-text value into an array of Lexical nodes. */
function richTextNodes(value: any): any[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (value.root?.children) return value.root.children;
  return [];
}

export { getRichTextBlocks, richTextNodes, escapeHtml, attr };
