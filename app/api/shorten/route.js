import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

const ALPHANUMERIC = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateCode(length = 6) {
  const bytes = randomBytes(length);
  let output = "";

  for (let i = 0; i < length; i += 1) {
    output += ALPHANUMERIC[bytes[i] % ALPHANUMERIC.length];
  }

  return output;
}

function normalizeUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    return new URL(trimmed).toString();
  } catch {
    try {
      return new URL(`https://${trimmed}`).toString();
    } catch {
      return null;
    }
  }
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const existingCodes = Array.isArray(body.existingCodes) ? body.existingCodes : [];
  const originalUrl = typeof body.originalUrl === "string" ? normalizeUrl(body.originalUrl) : null;

  if (!originalUrl) {
    return NextResponse.json({ error: "Please provide a valid URL" }, { status: 400 });
  }

  const used = new Set(existingCodes);
  let shortCode = generateCode();

  while (used.has(shortCode)) {
    shortCode = generateCode();
  }

  return NextResponse.json({ shortCode, originalUrl });
}
