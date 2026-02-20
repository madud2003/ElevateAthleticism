"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 flex items-center justify-center px-6 py-20">
      <SignIn
        appearance={{
          elements: {
            card: "bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl",
            headerTitle: "text-white",
            headerSubtitle: "text-gray-300",
          },
        }}
        fallbackRedirectUrl="/dashboard"
        signUpFallbackRedirectUrl="/sign-up"
      />
    </main>
  );
}
