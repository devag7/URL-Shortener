"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getLinks, saveLinks } from "@/lib/links";

function buildShortUrl(code) {
  if (typeof window === "undefined") return `/${code}`;
  return `${window.location.origin}/${code}`;
}

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const shortUrl = useMemo(() => (shortCode ? buildShortUrl(shortCode) : ""), [shortCode]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setShortCode("");
    setIsLoading(true);

    const links = getLinks();

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalUrl,
          existingCodes: links.map((link) => link.shortCode),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      const updatedLinks = [
        {
          shortCode: data.shortCode,
          originalUrl: data.originalUrl,
          clicks: 0,
          createdAt: new Date().toISOString(),
        },
        ...links,
      ];

      saveLinks(updatedLinks);
      setShortCode(data.shortCode);
      setOriginalUrl("");
    } catch {
      setError("Unable to create short URL right now");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900">
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold sm:text-3xl">URL Shortener</h1>
          <Link href="/dashboard" className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100">
            Dashboard
          </Link>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label htmlFor="url-input" className="block text-sm font-medium">
            Paste a long URL
          </label>
          <input
            id="url-input"
            type="text"
            value={originalUrl}
            onChange={(event) => setOriginalUrl(event.target.value)}
            placeholder="https://example.com/some/long/path"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none ring-sky-200 focus:ring"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Generating..." : "Generate short URL"}
          </button>
        </form>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        {shortUrl ? (
          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-medium text-emerald-900">Short URL created</p>
            <a href={`/${shortCode}`} className="mt-1 block break-all text-emerald-700 underline">
              {shortUrl}
            </a>
          </div>
        ) : null}
      </div>
    </main>
  );
}
