"use client";

import { useRouter } from "next/navigation";
import { UserProfile } from "@clerk/nextjs";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-gray-300 hover:text-yellow-400 transition-colors font-semibold"
          >
            Back
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6">
          <UserProfile
            appearance={{
              elements: {
                card: "bg-transparent shadow-none",
                navbar: "bg-transparent",
                pageScrollBox: "bg-transparent",
                headerTitle: "text-white",
                headerSubtitle: "text-gray-300",
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}
