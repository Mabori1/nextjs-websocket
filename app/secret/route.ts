import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json(
      { error: "Missing key parameter" },
      { status: 400 },
    );
  }

  const iframeUrl = new URL("/", request.url);
  iframeUrl.searchParams.set("key", key);

  return NextResponse.json({ url: iframeUrl.toString() });
}
