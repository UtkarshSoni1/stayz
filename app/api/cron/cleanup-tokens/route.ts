import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // Basic authorization to ensure only your cron scheduler (e.g. Vercel Cron) can trigger this.
    // In production, configure a CRON_SECRET environment variable.
    const authHeader = req.headers.get("authorization");
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Delete all tokens where expires is in the past
    const result = await prisma.verificationToken.deleteMany({
      where: {
        expires: {
          lt: new Date(),
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${result.count} expired tokens.`,
    });
  } catch (error) {
    console.error("[CRON cleanup-tokens]", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
