import { NextResponse } from "next/server";
import crypto from "crypto";
import { getDb } from "../../../lib/mongodb";

async function verifySignature(req: Request, bodyText: string) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) return true; // no secret configured — skip verification

  const sigHeader = req.headers.get("Clerk-Signature") || req.headers.get("clerk-signature") || "";
  // Clerk sends a header like: t=..., v1=<hex>
  const m = sigHeader.match(/v1=([0-9a-fA-F]+)/);
  if (!m) return false;
  const received = m[1];

  const expected = crypto.createHmac("sha256", secret).update(bodyText).digest("hex");
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(received, "hex");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const bodyText = await req.text();
  if (!(await verifySignature(req, bodyText))) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  let ev: any;
  try {
    ev = JSON.parse(bodyText);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const type = ev?.type || ev?.event_type || "";

  if (type === "user.deleted" || type === "user.removed" || type === "user.deleted_from_organization") {
    // extract email from payload — Clerk user payload shapes vary
    const user = ev?.data || ev?.data?.user || ev?.data?.object || ev?.data?.user_attributes || ev?.object || ev?.user || {};
    const emails: string[] = [];
    if (user?.primary_email_address?.email_address) emails.push(user.primary_email_address.email_address);
    if (Array.isArray(user?.email_addresses)) {
      for (const e of user.email_addresses) {
        if (e?.email_address) emails.push(e.email_address);
      }
    }
    if (user?.email) emails.push(user.email);

    const dedup = Array.from(new Set(emails.filter(Boolean)));
    if (dedup.length === 0) {
      return NextResponse.json({ ok: true });
    }

    const db = await getDb();
    const ops = [] as Promise<any>[];
    for (const email of dedup) {
      ops.push(db.collection("users").deleteMany({ email }));
      ops.push(db.collection("programs").deleteMany({ clientEmail: email }));
      ops.push(db.collection("weights").deleteMany({ clientEmail: email }));
      ops.push(db.collection("session_events").deleteMany({ email }));
      ops.push(db.collection("program_versions").deleteMany({ clientEmail: email }));
    }
    try {
      await Promise.all(ops);
    } catch (error) {
      // log and continue
      console.error("clerk-webhook: failed to delete user data", error);
    }
  }

  return NextResponse.json({ ok: true });
}

export const runtime = "nodejs";

