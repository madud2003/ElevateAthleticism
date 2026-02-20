import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";

type UserDoc = {
  email: string;
  passwordHash: string;
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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const db = await getDb();
    const users = db.collection<UserDoc>("users");
    const user = await users.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, user: toClient(user) });
  } catch {
    return NextResponse.json({ error: "Failed to load user" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { email, name, phone, newEmail, currentPassword, newPassword } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const updates: Partial<UserDoc> = {};
    if (typeof name === "string") updates.name = name.trim();
    if (typeof phone === "string") updates.phone = phone.trim();

    const wantsEmailChange = typeof newEmail === "string" && newEmail.trim().length > 0 && newEmail !== email;
    const wantsPasswordChange = typeof newPassword === "string" && newPassword.trim().length > 0;

    if (wantsEmailChange || wantsPasswordChange) {
      if (!currentPassword || typeof currentPassword !== "string") {
        return NextResponse.json({ error: "Current password required" }, { status: 400 });
      }
    }

    const db = await getDb();
    const users = db.collection<UserDoc>("users");
    const user = await users.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (wantsEmailChange || wantsPasswordChange) {
      const ok = await bcrypt.compare(currentPassword, user.passwordHash || "");
      if (!ok) {
        return NextResponse.json({ error: "Invalid current password" }, { status: 401 });
      }
    }

    if (wantsEmailChange) {
      const emailExists = await users.findOne({ email: newEmail });
      if (emailExists) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 });
      }
      updates.email = newEmail.trim();
    }

    if (wantsPasswordChange) {
      updates.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No changes provided" }, { status: 400 });
    }

    await users.updateOne({ email }, { $set: updates });
    const updated = await users.findOne({ email: updates.email || email });
    if (!updated) {
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, user: toClient(updated) });
  } catch {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

