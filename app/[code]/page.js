"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getLinks, incrementClickCount } from "@/lib/links";

export default function RedirectPage() {
  const params = useParams();
  const router = useRouter();
  const code = typeof params.code === "string" ? params.code : "";
  const [status, setStatus] = useState(() => (code ? "Redirecting..." : "Short URL not found"));

  useEffect(() => {
    if (!code) {
      return;
    }

    const match = getLinks().find((link) => link.shortCode === code);

    if (!match) {
      const timer = setTimeout(() => setStatus("Short URL not found"), 0);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      incrementClickCount(code);
      setStatus("Redirecting...");
      router.replace(match.originalUrl);
    }, 0);

    return () => clearTimeout(timer);
  }, [code, router]);

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
