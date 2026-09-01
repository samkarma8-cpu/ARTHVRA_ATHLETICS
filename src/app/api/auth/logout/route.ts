import { NextResponse } from "next/server";
import { destroySessionCookie } from "@/lib/auth";

export async function POST() {
  try {
    await destroySessionCookie();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("logout error", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
