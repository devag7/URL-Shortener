import { NextResponse } from "next/server";
import { getServerLink, incrementServerClick } from "@/lib/server-links";

export async function GET(_, { params }) {
  const resolvedParams = await params;
  const code = typeof resolvedParams?.code === "string" ? resolvedParams.code : "";
  if (!code) {
    return NextResponse.json({ error: "Short URL not found" }, { status: 404 });
  }

  const link = getServerLink(code);
  if (!link) {
    return NextResponse.json({ error: "Short URL not found" }, { status: 404 });
  }

  incrementServerClick(code);
  return NextResponse.json({ originalUrl: link.originalUrl });
}
