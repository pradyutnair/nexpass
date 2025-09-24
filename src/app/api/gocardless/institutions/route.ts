export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/auth";
import { listInstitutions, HttpError } from "@/lib/gocardless";

export async function GET(request: Request) {
  try {
    await requireAuthUser(request);
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country");
    const data = await listInstitutions(country as string);
    return NextResponse.json(data);
  } catch (err: any) {
    if (err instanceof HttpError) {
      return NextResponse.json({ ok: false, error: err.message, details: err.details }, { status: err.status });
    }
    const status = err?.status || 500;
    const message = err?.message || "Internal Server Error";
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
