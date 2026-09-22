const MICROLINK_ENDPOINT = 'https://api.microlink.io/';

// Fetches an Open Graph preview image for a URL via Microlink's free public
// API (no key, no signup). Returns undefined — not an error — if the site
// has no og:image, the request fails, or the free tier is rate-limited;
// callers should fall back to the favicon-based preview in that case.
export async function fetchLinkPreviewImage(url: string): Promise<string | undefined> {
  try {
    const response = await fetch(`${MICROLINK_ENDPOINT}?url=${encodeURIComponent(url)}`);
    if (!response.ok) return undefined;
    const json = await response.json();
    const imageUrl = json?.data?.image?.url;
    return typeof imageUrl === 'string' ? imageUrl : undefined;
  } catch {
    return undefined;
  }
}

// A small favicon for the given URL's domain, via a public favicon service —
// free, no key, no usage limits worth worrying about. Used as the fallback
// when no richer og:image preview is available.
export function getFaviconUrl(url: string, size = 64): string | undefined {
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?sz=${size}&domain=${hostname}`;
  } catch {
    return undefined;
  }
}

export function formatLinkDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
