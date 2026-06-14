import { NextRequest } from "next/server";
import { json, readJson } from "@/lib/api";
export async function POST(req: NextRequest){ return json({ ok:true, message:"Request accepted. Configure live email/Stripe credentials in production.", data: await readJson(req) }); }
