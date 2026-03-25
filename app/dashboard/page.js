"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getLinks, removeLink } from "@/lib/links";

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function useBaseUrl() {
  return useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.origin;
  }, []);
}

export default function DashboardPage() {
  const [links, setLinks] = useState([]);
  const [toast, setToast] = useState("");
  const baseUrl = useBaseUrl();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLinks(getLinks());
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  const onDelete = (code) => {
    setLinks(removeLink(code));
  };

  const onCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(`${baseUrl}/${code}`);
      setToast("Copied to clipboard");
    } catch {
      setToast("Copy failed");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900">
      <div className="mx-auto w-full max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold sm:text-3xl">Dashboard</h1>
          <Link href="/" className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100">
            New short URL
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-3 py-3 font-medium">Short URL</th>
                <th className="px-3 py-3 font-medium">Original URL</th>
                <th className="px-3 py-3 font-medium">Clicks</th>
                <th className="px-3 py-3 font-medium">Created</th>
                <th className="px-3 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr key={link.shortCode} className="border-b border-slate-100 align-top">
                  <td className="px-3 py-3">
                    <a className="text-sky-700 underline" href={`/${link.shortCode}`}>
                      {baseUrl ? `${baseUrl}/${link.shortCode}` : `/${link.shortCode}`}
                    </a>
                  </td>
                  <td className="max-w-xs px-3 py-3 break-all text-slate-600">{link.originalUrl}</td>
                  <td className="px-3 py-3">{link.clicks}</td>
                  <td className="px-3 py-3 text-slate-600">{formatDate(link.createdAt)}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onCopy(link.shortCode)}
                        className="rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-100"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => onDelete(link.shortCode)}
                        className="rounded-md border border-red-300 px-3 py-1.5 text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {links.length === 0 ? (
            <p className="px-3 py-8 text-center text-slate-500">No links yet. Create your first short URL.</p>
          ) : null}
        </div>
      </div>

      {toast ? (
        <div className="fixed bottom-4 right-4 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </main>
  );
}
