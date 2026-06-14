import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  let db: "connected" | "disconnected" = "disconnected";

  try {
    await prisma.$queryRaw`SELECT 1`;
    db = "connected";
  } catch (error) {
    console.error("Health check database query failed:", error);
  }

  return NextResponse.json(
    {
      status: "ok",
      db,
      timestamp: new Date().toISOString(),
    },
    {
      status: db === "connected" ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
