"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  email: string;
  name?: string;
};

type Program = {
  clientEmail?: string;
};

const IconUsers = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
);

export default function AdminClientsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [programCounts, setProgramCounts] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setError(null);
        const [uRes, pRes] = await Promise.all([
          fetch("/api/users", { credentials: "include" }),
          fetch("/api/programs", { credentials: "include" }),
        ]);

        if (!uRes.headers.get("content-type")?.includes("application/json")) throw new Error("Auth required");
        if (!pRes.headers.get("content-type")?.includes("application/json")) throw new Error("Auth required");

        const uJson = await uRes.json() as { users?: User[]; error?: string };
        const pJson = await pRes.json() as { programs?: Program[]; error?: string };
        if (!uRes.ok) throw new Error(uJson.error || "Failed to load users");
        if (!pRes.ok) throw new Error(pJson.error || "Failed to load programs");

        const counts: Record<string, number> = {};
        for (const p of pJson.programs || []) {
          const email = p.clientEmail || "";
          counts[email] = (counts[email] || 0) + 1;
        }

        if (!ignore) {
          setUsers(uJson.users || []);
          setProgramCounts(counts);
          setLoading(false);
        }
      } catch (e: unknown) {
        if (!ignore) setError(e instanceof Error ? e.message : "Failed to load");
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 rounded-full text-slate-500 hover:bg-slate-100">
              &larr;
            </button>
            <h1 className="text-2xl font-bold">Registered Clients</h1>
          </div>
          <IconUsers className="text-teal-700" />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading clients...</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No registered clients found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((u) => (
              <div key={u.email} className="bg-white border border-slate-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-lg">
                    {u.email?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900 truncate">{u.email}</div>
                    <div className="text-xs text-slate-500">{u.name || "-"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-700">{programCounts[u.email] || 0}</div>
                    <div className="text-xs text-slate-400">Programs</div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link href={`/admin/programs?clientEmail=${encodeURIComponent(u.email)}`} className="flex-1 text-center px-3 py-2 bg-teal-600 text-white rounded-lg text-sm">View Programs</Link>
                  <Link href={`/admin/clients/${encodeURIComponent(u.email)}`} className="flex-1 text-center px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm">Open</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
