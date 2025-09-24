export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await requireAuthUser(request);
    return NextResponse.json({ 
      success: true, 
      user: {
        id: (user as any).$id,
        email: (user as any).email,
        name: (user as any).name
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      cookies: request.headers.get('cookie') ? 'present' : 'missing'
    }, { status: 401 });
  }
}
