"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getLinks, isLinkExpired, removeLink } from "@/lib/links";

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
  const [searchTerm, setSearchTerm] = useState("");
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

  const onExportCsv = async () => {
    const csvRows = [
      ["shortCode", "shortUrl", "originalUrl", "clicks", "createdAt", "expiresAt", "expired"].join(","),
      ...links.map((link) =>
        [
          link.shortCode,
          `${baseUrl}/${link.shortCode}`,
          JSON.stringify(link.originalUrl),
          String(link.clicks),
          link.createdAt || "",
          link.expiresAt || "",
          String(isLinkExpired(link)),
        ].join(",")
      ),
    ];

    try {
      await navigator.clipboard.writeText(csvRows.join("\n"));
      setToast("CSV copied to clipboard");
    } catch {
      setToast("CSV export failed");
    }
  };

  const filteredLinks = useMemo(() => {
    if (!searchTerm.trim()) return links;
    const term = searchTerm.toLowerCase();
    return links.filter(
      (link) =>
        link.shortCode.toLowerCase().includes(term) ||
        link.originalUrl.toLowerCase().includes(term)
    );
  }, [links, searchTerm]);

  const chartData = useMemo(
    () =>
      filteredLinks.map((link) => ({
        code: link.shortCode,
        clicks: link.clicks,
      })),
    [filteredLinks]
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900">
      <div className="mx-auto w-full max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold sm:text-3xl">Dashboard</h1>
          <div className="flex gap-2">
            <button
              onClick={onExportCsv}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm transition-colors hover:bg-slate-100"
            >
              Copy all as CSV
            </button>
            <Link href="/" className="rounded-lg border border-slate-300 px-3 py-2 text-sm transition-colors hover:bg-slate-100">
              New short URL
            </Link>
          </div>
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by short code or URL"
          className="mb-4 w-full rounded-lg border border-slate-300 px-4 py-2 outline-none ring-sky-200 focus:ring"
        />

        {filteredLinks.length > 0 ? (
          <div className="mb-6 h-56 w-full rounded-xl border border-slate-100 bg-slate-50 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="code" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="clicks" fill="#0f172a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-3 py-3 font-medium">Short URL</th>
                <th className="px-3 py-3 font-medium">Original URL</th>
                <th className="px-3 py-3 font-medium">Clicks</th>
                <th className="px-3 py-3 font-medium">Created</th>
                <th className="px-3 py-3 font-medium">QR</th>
                <th className="px-3 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLinks.map((link) => (
                <tr key={link.shortCode} className="border-b border-slate-100 align-top">
                  <td className="px-3 py-3">
                    <a className="text-sky-700 underline transition-colors hover:text-sky-900" href={`/${link.shortCode}`}>
                      {baseUrl ? `${baseUrl}/${link.shortCode}` : `/${link.shortCode}`}
                    </a>
                    {isLinkExpired(link) ? (
                      <span className="ml-2 inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                        Expired
                      </span>
                    ) : null}
                  </td>
                  <td className="max-w-xs px-3 py-3 break-all text-slate-600">{link.originalUrl}</td>
                  <td className="px-3 py-3">{link.clicks}</td>
                  <td className="px-3 py-3 text-slate-600">{formatDate(link.createdAt)}</td>
                  <td className="px-3 py-3">
                    <QRCodeSVG value={baseUrl ? `${baseUrl}/${link.shortCode}` : `/${link.shortCode}`} size={64} />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onCopy(link.shortCode)}
                        className="rounded-md border border-slate-300 px-3 py-1.5 transition-colors hover:bg-slate-100"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => onDelete(link.shortCode)}
                        className="rounded-md border border-red-300 px-3 py-1.5 text-red-700 transition-colors hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLinks.length === 0 ? (
            <div className="px-3 py-10 text-center text-slate-500">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">🔗</div>
              <p>{links.length === 0 ? "No links yet. Create your first short URL." : "No links match your search."}</p>
            </div>
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
