export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const cookies = request.headers.get('cookie');
  
  return NextResponse.json({ 
    cookies: cookies,
    parsedCookies: cookies ? cookies.split(';').map(c => c.trim()) : [],
    allHeaders: Object.fromEntries(request.headers.entries())
  });
}
