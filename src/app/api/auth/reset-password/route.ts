import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signSession, setSessionCookie } from "@/lib/auth";

const schema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    const { token, password } = parsed.data;

    const record = await prisma.passwordResetToken.findUnique({ where: { token } });
    if (!record || record.used || record.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "This reset link is invalid or has expired." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.$transaction([
      prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
      prisma.passwordResetToken.update({ where: { id: record.id }, data: { used: true } }),
    ]);

    const user = await prisma.user.findUnique({ where: { id: record.userId } });
    if (user) {
      const jwt = await signSession({
        userId: user.id,
        role: user.role,
        email: user.email,
        name: user.name,
      });
      await setSessionCookie(jwt);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("reset-password error", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
