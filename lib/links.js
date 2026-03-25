export const STORAGE_KEY = "url_shortener_links";
export const EXPIRY_OPTIONS = {
  "1d": 1,
  "7d": 7,
  never: null,
};

export function getLinks() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLinks(links) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}

export function incrementClickCount(code) {
  const links = getLinks();
  const updated = links.map((link) =>
    link.shortCode === code ? { ...link, clicks: link.clicks + 1 } : link
  );
  saveLinks(updated);
  return updated.find((link) => link.shortCode === code);
}

export function removeLink(code) {
  const links = getLinks().filter((link) => link.shortCode !== code);
  saveLinks(links);
  return links;
}

export function getExpiresAt(expiryKey) {
  const days = EXPIRY_OPTIONS[expiryKey];
  if (!days) return null;

  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export function isLinkExpired(link) {
  if (!link?.expiresAt) return false;
  const expiryDate = new Date(link.expiresAt);
  if (Number.isNaN(expiryDate.getTime())) return false;
  return expiryDate.getTime() < Date.now();
}
