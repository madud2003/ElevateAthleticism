import { NextResponse } from "next/server";
import { currentUser, clerkClient } from "@clerk/nextjs/server";

export async function POST() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clerkClient();
    await client.users.updateUserMetadata(user.id, {
      publicMetadata: {
        ...(user.publicMetadata || {}),
        role: "user",
      },
    });

    return NextResponse.json({ ok: true, message: "Admin role removed. Please sign out and sign back in." });
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to remove admin role", detail: e?.message || "Unknown" }, { status: 500 });
  }
}
