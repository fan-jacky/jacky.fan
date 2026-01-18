import { ActiveLink } from "@/components/basic";

function normalizeChildren(content: any): any[] {
  if (!content) return [];
  if (Array.isArray(content)) return content;
  if (content.root?.children) return content.root.children;
  return [];
}

function getTextStyles(text: any, attrs: any = {}) {
  if (!text) return null;

  const value = text.text ?? text.children ?? "";

  if (text.bold === true || text.format?.toString()?.includes("bold")) {
    return <strong {...attrs} key={attrs.key ?? ""}>{value}</strong>;
  }
  if (text.italic === true) {
    return <i {...attrs} key={attrs.key ?? ""}>{value}</i>;
  }
  if (text.underline === true) {
    return <u {...attrs} key={attrs.key ?? ""}>{value}</u>;
  }
  if (text.strikethrough === true) {
    return <s {...attrs} key={attrs.key ?? ""}>{value}</s>;
  }
  if (text.code === true) {
    return <code {...attrs} key={attrs.key ?? ""}>{value}</code>;
  }
  if (text.url && text.children) {
    return <ActiveLink {...attrs} key={attrs.key ?? ""} href={text.url}>{text.children.map((c:any) => getTextStyles(c))}</ActiveLink>;
  }
  return value ?? null;
}

function getList(list: any, key: number) {
  if (list.type === "list") {
    const { format, children } = list;

    const listChildren = [...children];
    listChildren.forEach((c: any, index: number) => {
      if (c.type === "list") {
        if (index > 0 && listChildren[index - 1].type === "list-item") {
          listChildren[index - 1].children.push(c);
          listChildren.splice(index, 1);
        } else if (index === 0) {
          listChildren[index] = {
            type: "list-item",
            children: [c],
          };
        }
      }
    });

    const elements = listChildren.map((c: any, i: number) => {
      if (c.type?.includes("list")) {
        return getList(c, i);
      }
      return getTextStyles(c, { key: i });
    });

    if (format === "unordered") {
      return <ul key={key}>{elements}</ul>;
    }
    return <ol key={key}>{elements}</ol>;
  }

  if (list.type === "list-item") {
    const { children } = list;

    const elements = children.map((c: any, i: number) => {
      if (c.type?.includes("list")) {
        return getList(c, i);
      }
      return getTextStyles(c, { key: i });
    });

    return <li key={key}>{elements}</li>;
  }

  return null;
}

function getRichTextBlocks(block: any, attrs: any = {}, key: number) {
  if (!block) return null;

  // Support Payload richText root wrappers
  if (block.root?.children) {
    return normalizeChildren(block).map((child, idx) => getRichTextBlocks(child, attrs, idx));
  }

  if (!block.type) return null;

  if (block.type === "root") {
    return normalizeChildren(block).map((child, idx) => getRichTextBlocks(child, attrs, idx));
  }

  if (block.type === "heading") {
    const { level, children } = block;
    const elements = normalizeChildren(children ?? []).map((c: any, i: number) => getTextStyles(c, { key: i }));

    if (level === 1) return <h1 key={key}>{elements}</h1>;
    if (level === 2) return <h2 key={key}>{elements}</h2>;
    if (level === 3) return <h3 key={key}>{elements}</h3>;
    if (level === 4) return <h4 key={key}>{elements}</h4>;
    if (level === 5) return <h5 key={key}>{elements}</h5>;
    if (level === 6) return <h6 key={key}>{elements}</h6>;
  }

  if (block.type === "paragraph") {
    const elements = normalizeChildren(block.children ?? []).map((c: any, i: number) => getTextStyles(c, { key: i }));
    return <p {...attrs} key={key}>{elements}</p>;
  }

  if (block.type === "code") {
    const elements = normalizeChildren(block.children ?? []).map((c: any, i: number) => getTextStyles(c, { key: i }));
    return <code key={key}>{elements}</code>;
  }
  
  if (block.type === "quote") {
    const elements = normalizeChildren(block.children ?? []).map((c: any, i: number) => getTextStyles(c, { key: i }));
    return <blockquote key={key}>{elements}</blockquote>;
  }

  if (block.type === "list") {
    return getList(block, key);
  }

  if (block.type === "text") {
    return getTextStyles(block, { key });
  }

  return null;
}

export { getRichTextBlocks };
