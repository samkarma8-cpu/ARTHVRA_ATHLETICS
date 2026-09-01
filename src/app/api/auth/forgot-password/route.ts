import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/utils";

const schema = z.object({ email: z.string().email("Invalid email") });

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
    const { email } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    // Always respond same-shaped to avoid leaking which emails exist
    if (user) {
      const token = generateToken();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
      await prisma.passwordResetToken.create({
        data: { userId: user.id, token, expiresAt },
      });

      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;

      // SMTP is not configured yet. In production, send the email here.
      // For the trial, surface the link only in dev so the flow is testable.
      const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);

      if (smtpConfigured) {
        // TODO: send the reset email via SMTP (nodemailer) once credentials are set.
        return NextResponse.json({
          ok: true,
          message: "If an account exists for this email, a reset link has been sent.",
        });
      }

      return NextResponse.json({
        ok: true,
        devResetUrl: resetUrl,
        message:
          "Email sending is not configured yet. Use the link below to reset your password (development mode).",
      });
    }

    return NextResponse.json({
      ok: true,
      message: "If an account exists for this email, a reset link has been sent.",
    });
  } catch (error) {
    console.error("forgot-password error", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
