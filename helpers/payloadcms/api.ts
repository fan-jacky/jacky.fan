const DEFAULT_DEV_PAYLOAD_CMS_URL = "http://localhost:3001";
let hasWarnedAboutDevCmsConnection = false;

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

export function resolvePayloadMediaUrl(url: string, options?: { publicOrigin?: boolean }): string {
  if (!url) return "";

  const serverBaseUrl = getPayloadCmsUrl();
  const publicBaseUrl = getPayloadCmsPublicUrl();
  const preferredBaseUrl = options?.publicOrigin ? publicBaseUrl : publicBaseUrl ?? serverBaseUrl;

  if (!preferredBaseUrl) return url;

  try {
    const preferredOrigin = new URL(preferredBaseUrl).origin;

    if (url.startsWith("http://") || url.startsWith("https://")) {
      const mediaUrl = new URL(url);

      // If a public base URL is configured, always rewrite the origin to it
      if (publicBaseUrl) {
        const publicOrigin = new URL(publicBaseUrl).origin;
        if (mediaUrl.origin !== publicOrigin) {
          return `${publicOrigin}${mediaUrl.pathname}${mediaUrl.search}${mediaUrl.hash}`;
        }
      }

      // If the server base URL differs from preferred, rewrite
      if (serverBaseUrl) {
        const serverOrigin = new URL(serverBaseUrl).origin;
        if (mediaUrl.origin === serverOrigin && mediaUrl.origin !== preferredOrigin) {
          return `${preferredOrigin}${mediaUrl.pathname}${mediaUrl.search}${mediaUrl.hash}`;
        }
      }

      return mediaUrl.toString();
    }

    return new URL(url, preferredBaseUrl).toString();
  } catch {
    return url;
  }
}

export function getPayloadApiUrl(path: string): string | null {
  const baseUrl = getPayloadCmsUrl();

  if (!baseUrl) return null;

  return `${baseUrl}/api/${path.replace(/^\/+/, "")}`;
}

function isDefaultDevCmsEndpoint(endpoint: string): boolean {
  return process.env.NODE_ENV !== "production" && endpoint.startsWith(`${DEFAULT_DEV_PAYLOAD_CMS_URL}/`);
}

function warnAboutDevCmsConnection(endpoint: string, error: unknown) {
  if (hasWarnedAboutDevCmsConnection) return;

  hasWarnedAboutDevCmsConnection = true;
  console.warn(`Payload CMS is unreachable at ${endpoint}. Falling back to empty content until the CMS is available again.`, error);
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

  let res: Response;

  try {
    res = await fetch(endpoint, init);
  } catch (error) {
    if (isDefaultDevCmsEndpoint(endpoint)) {
      warnAboutDevCmsConnection(endpoint, error);
      return null;
    }

    throw error;
  }

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