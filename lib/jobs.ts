import { NextRequest } from "next/server";

export function isAuthorisedJob(req: NextRequest) {
  const configuredSecret = process.env.CRON_SECRET;
  if (!configuredSecret) return process.env.NODE_ENV === "development";
  const header = req.headers.get("authorization");
  return header === `Bearer ${configuredSecret}`;
}
