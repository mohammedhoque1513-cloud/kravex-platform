import { NextResponse } from "next/server";

export function allowLocalFallback() {
  if (process.env.DISABLE_LOCAL_FALLBACK === "true") return false;
  return process.env.NODE_ENV !== "production" || process.env.ENABLE_LIVE_FALLBACK === "true";
}

export function productionDbError() {
  return NextResponse.json({ error: "Database is not available. PostgreSQL must be connected before this action can run." }, { status: 503 });
}

export function requiresConfigured(_name: string, value: string | undefined) {
  return Boolean(value && value.trim() && !value.includes("...") && !value.includes("placeholder"));
}
