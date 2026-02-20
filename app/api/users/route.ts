import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getDb } from "@/lib/mongodb";

type UserDoc = {
  email: string;
  role?: string;
  name?: string;
  phone?: string;
  createdAt?: Date;
};

function toClient(user: UserDoc) {
  return {
    email: user.email,
    role: user.role || "user",
    name: user.name || "",
    phone: user.phone || "",
    createdAt: user.createdAt || null,
  };
}

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const role = (user.publicMetadata as { role?: string } | undefined)?.role;
    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = await getDb();
    const users = db.collection<UserDoc>("users");
    const list = await users.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ ok: true, users: list.map(toClient) });
  } catch (e) {
    console.error("GET /api/users error:", e);
    const msg = process.env.NODE_ENV === "production" ? "Failed to load users" : (e as any)?.message || "Failed to load users";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
