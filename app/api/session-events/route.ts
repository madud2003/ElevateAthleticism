import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, type, meta } = body || {};
    if (!email || !type) {
      return NextResponse.json({ error: "Missing email or type" }, { status: 400 });
    }

    const db = await getDb();
    const col = db.collection("session_events");
    const entry = {
      email,
      type,
      meta: meta || null,
      createdAt: new Date().toISOString(),
    };
    await col.insertOne(entry);
    return NextResponse.json({ ok: true, entry });
  } catch (e: any) {
    console.error("POST /api/session-events error:", e);
    const msg = process.env.NODE_ENV === "production" ? "Failed" : e?.message || "Failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const db = await getDb();
    const col = db.collection("session_events");
    const events = await col.find({ email }).sort({ createdAt: -1 }).limit(50).toArray();
    const lastLogin = events.find((e: any) => e.type === "login") || null;
    const lastLogout = events.find((e: any) => e.type === "logout") || null;
    return NextResponse.json({ ok: true, events, lastLogin, lastLogout });
  } catch (e: any) {
    console.error("GET /api/session-events error:", e);
    const msg = process.env.NODE_ENV === "production" ? "Failed" : e?.message || "Failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
