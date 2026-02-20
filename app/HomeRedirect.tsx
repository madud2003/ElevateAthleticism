"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function HomeRedirect() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) return;
    const role = (user?.publicMetadata as { role?: string } | undefined)?.role;
    router.replace(role === "admin" ? "/admin" : "/dashboard");
  }, [isLoaded, isSignedIn, user, router]);

  return null;
}
