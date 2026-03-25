const links = new Map();

function isExpired(expiresAt) {
  if (!expiresAt) return false;
  const expiry = new Date(expiresAt);
  if (Number.isNaN(expiry.getTime())) return false;
  return expiry.getTime() < Date.now();
}

export function saveServerLink({ shortCode, originalUrl, expiresAt = null }) {
  links.set(shortCode, {
    shortCode,
    originalUrl,
    expiresAt: typeof expiresAt === "string" ? expiresAt : null,
    clicks: 0,
  });
}

export function hasServerLink(shortCode) {
  return links.has(shortCode);
}

export function getServerLink(shortCode) {
  const link = links.get(shortCode);
  if (!link) return null;
  if (isExpired(link.expiresAt)) return null;
  return link;
}

export function incrementServerClick(shortCode) {
  const link = links.get(shortCode);
  if (!link) return null;
  link.clicks += 1;
  links.set(shortCode, link);
  return link;
}
