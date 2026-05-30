const DEFAULT_DEV_PAYLOAD_CMS_URL = "http://localhost:3001";

type PayloadFetchInit = RequestInit & {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
};

type SearchParamValue = string | string[] | undefined;

function normalizeBaseUrl(value: string | undefined): string | null {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  return trimmed.replace(/\/+$/, "");
}

export function getPayloadCmsUrl(): string | null {
  const configuredUrl = normalizeBaseUrl(
    process.env.PAYLOAD_CMS_URL ?? process.env.NEXT_PUBLIC_PAYLOAD_CMS_URL,
  );

  if (configuredUrl) return configuredUrl;

  if (process.env.NODE_ENV !== "production") {
    return DEFAULT_DEV_PAYLOAD_CMS_URL;
  }

  return null;
}

export function getPayloadCmsPublicUrl(): string | null {
  const configuredUrl = normalizeBaseUrl(
    process.env.NEXT_PUBLIC_PAYLOAD_CMS_URL ?? process.env.PAYLOAD_CMS_URL,
  );

  if (configuredUrl) return configuredUrl;

  if (process.env.NODE_ENV !== "production") {
    return DEFAULT_DEV_PAYLOAD_CMS_URL;
  }

  return null;
}

export function getPayloadApiUrl(path: string): string | null {
  const baseUrl = getPayloadCmsUrl();

  if (!baseUrl) return null;

  return `${baseUrl}/api/${path.replace(/^\/+/, "")}`;
}

export function isLivePreviewEnabled(value: SearchParamValue): boolean {
  if (Array.isArray(value)) {
    return value.includes("true");
  }

  return value === "true";
}

export async function fetchPayloadJson<T>(
  path: string,
  init?: PayloadFetchInit,
): Promise<T | null> {
  const endpoint = getPayloadApiUrl(path);

  if (!endpoint) return null;

  const res = await fetch(endpoint, init);
  const contentType = res.headers.get("content-type") ?? "";

  if (!res.ok) {
    const body = await res.text();
    const preview = body.slice(0, 120).replace(/\s+/g, " ").trim();

    throw new Error(
      `Payload request failed (${res.status} ${res.statusText}) for ${endpoint}${preview ? `: ${preview}` : ""}`,
    );
  }

  if (!contentType.includes("application/json")) {
    const body = await res.text();
    const preview = body.slice(0, 120).replace(/\s+/g, " ").trim();

    throw new Error(
      `Payload returned non-JSON content for ${endpoint}${preview ? `: ${preview}` : ""}`,
    );
  }

  return res.json() as Promise<T>;
}