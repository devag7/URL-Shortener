"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getLinks, incrementClickCount, isLinkExpired } from "@/lib/links";

export default function RedirectPage() {
  const params = useParams();
  const code = typeof params.code === "string" ? params.code : "";
  const [status, setStatus] = useState(() => (code ? "Redirecting..." : "Short URL not found"));

  useEffect(() => {
    if (!code) {
      return;
    }

    let isCancelled = false;

    const redirectFromLocalStorage = () => {
      const match = getLinks().find((link) => link.shortCode === code);

      if (!match || isLinkExpired(match)) {
        setStatus("Short URL not found");
        return;
      }

      incrementClickCount(code);
      setStatus("Redirecting...");
      window.location.replace(match.originalUrl);
    };

    const resolveShortUrl = async () => {
      try {
        const response = await fetch(`/api/resolve/${code}`);
        const data = await response.json();
        if (!response.ok || !data?.originalUrl) {
          if (!isCancelled) redirectFromLocalStorage();
          return;
        }

        if (isCancelled) return;
        setStatus("Redirecting...");
        window.location.replace(data.originalUrl);
      } catch {
        if (!isCancelled) redirectFromLocalStorage();
      }
    };

    resolveShortUrl();

    return () => {
      isCancelled = true;
    };
  }, [code]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <p className="text-slate-700">{status}</p>
        {status === "Short URL not found" ? (
          <Link href="/" className="mt-4 inline-block rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100">
            Go home
          </Link>
        ) : null}
      </div>
    </main>
  );
}
