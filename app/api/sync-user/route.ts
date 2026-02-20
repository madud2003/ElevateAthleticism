import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getDb } from "@/lib/mongodb";

export async function POST() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email =
      user.primaryEmailAddress?.emailAddress ||
      user.emailAddresses?.[0]?.emailAddress ||
      "";

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const role = (user.publicMetadata as { role?: string } | undefined)?.role || "user";
    const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
    const phone = user.primaryPhoneNumber?.phoneNumber || "";

    const db = await getDb();
    const users = db.collection("users");

    await users.updateOne(
      { email },
      {
        $set: {
          email,
          role,
          name,
          phone,
          clerkId: user.id,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
  }
}

