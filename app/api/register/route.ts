import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const db = await getDb();
    const users = db.collection("users");

    const existing = await users.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await users.insertOne({
      email,
      passwordHash,
      role: "user",
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true, user: { email, role: "user" } });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

