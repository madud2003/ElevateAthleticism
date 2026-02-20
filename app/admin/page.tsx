"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";

// --- Icon Components (Inline for zero-dependency) ---
const IconArrowLeft = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);
const IconUsers = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const IconDumbbell = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>
);
const IconFileText = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
);
const IconLogOut = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);
const IconClock = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const IconRefresh = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
);
const IconAlert = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
);

export default function AdminDashboard() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [programCounts, setProgramCounts] = useState<Record<string, number>>({});
  const [sessionMap, setSessionMap] = useState<Record<string, { lastLogin?: string | null; lastLogout?: string | null }>>({});
  const [userError, setUserError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    const role = (user?.publicMetadata as { role?: string } | undefined)?.role;
    if (role !== "admin") {
      router.push("/dashboard");
      return;
    }
    setLoading(false);
  }, [isLoaded, isSignedIn, user, router]);

  useEffect(() => {
    let ignore = false;

    async function loadUsers() {
      try {
        setUserError(null);
        const [usersRes, programsRes] = await Promise.all([
          fetch("/api/users", { credentials: "include" }),
          fetch("/api/programs", { credentials: "include" }),
        ]);

        const usersContentType = usersRes.headers.get("content-type") || "";
        const programsContentType = programsRes.headers.get("content-type") || "";
        if (!usersContentType.includes("application/json")) {
          throw new Error("Failed to load users (auth error)");
        }
        if (!programsContentType.includes("application/json")) {
          throw new Error("Failed to load programs (auth error)");
        }

        const usersData = await usersRes.json();
        const programsData = await programsRes.json();
        if (!usersRes.ok) throw new Error(usersData?.error || "Failed to load users");
        if (!programsRes.ok) throw new Error(programsData?.error || "Failed to load programs");

        const counts: Record<string, number> = {};
        for (const p of programsData.programs || []) {
          const email = p.clientEmail || "";
          counts[email] = (counts[email] || 0) + 1;
        }

        if (!ignore) {
          setUsers(usersData.users || []);
          setProgramCounts(counts);

          // fetch last login/logout for users (batch)
          try {
            const sessPromises = (usersData.users || []).map(async (u: any) => {
              try {
                const r = await fetch(`/api/session-events?email=${encodeURIComponent(u.email)}`);
                if (!r.ok) return { email: u.email, lastLogin: null, lastLogout: null };
                const d = await r.json();
                return { email: u.email, lastLogin: d.lastLogin?.createdAt || null, lastLogout: d.lastLogout?.createdAt || null };
              } catch {
                return { email: u.email, lastLogin: null, lastLogout: null };
              }
            });
            const sess = await Promise.all(sessPromises);
            const map: Record<string, { lastLogin?: string | null; lastLogout?: string | null }> = {};
            for (const s of sess) map[s.email] = { lastLogin: s.lastLogin, lastLogout: s.lastLogout };
            setSessionMap(map);
          } catch {
            // ignore
          }
        }
      } catch (e: any) {
        if (!ignore) setUserError(e?.message || "Failed to load users");
      }
    }

    if (!loading) {
      loadUsers();
      const interval = setInterval(loadUsers, 15000);
      return () => {
        ignore = true;
        clearInterval(interval);
      };
    }

    return () => {
      ignore = true;
    };
  }, [loading]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading Dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Go back"
            >
              <IconArrowLeft />
            </button>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">Coach Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-semibold text-slate-900">{user?.primaryEmailAddress?.emailAddress}</span>
              <span className="text-xs text-teal-600 font-medium uppercase tracking-wider">Admin</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white">
              {user?.primaryEmailAddress?.emailAddress?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome & Stats Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Welcome Card - Keeping Manual Gradient for Blue Theme */}
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-900 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors"></div>
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">Welcome back, Coach.</h2>
              <p className="text-slate-200 mb-6 max-w-lg">Here's an overview of your client activity and training programs. Manage your team effectively.</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-blue-100 backdrop-blur-sm">
                <IconRefresh className="animate-spin" />
                Live refresh every 15s
              </div>
            </div>
          </div>

          {/* Stats Card - Using New .card Class */}
          <div className="card flex flex-col justify-center items-center text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-50 text-teal-600 mb-4">
              <IconUsers className="w-6 h-6" />
            </div>
            <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Total Clients</h3>
            <p className="text-4xl font-extrabold text-slate-900">{users.length}</p>
          </div>
        </section>

        {/* Client List Section */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Registered Clients</h2>
              <p className="text-sm text-slate-500">Manage programs and track activity.</p>
            </div>
          </div>

          {userError && (
            <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
              <IconAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">{userError}</div>
            </div>
          )}

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {users.length === 0 && !userError ? (
              <div className="p-12 text-center text-slate-400">
                <IconUsers className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No users found yet.</p>
              </div>
            ) : (
              users.map((u) => {
                const count = programCounts[u.email] || 0;
                const initials = u.email ? u.email.substring(0, 2).toUpperCase() : "??";
                const session = sessionMap[u.email];
                
                return (
                  <div key={u.email} className="p-4 sm:p-6 hover:bg-slate-50/80 transition-colors group">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* User Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg flex-shrink-0 group-hover:border-teal-200 group-hover:bg-teal-50 transition-colors">
                          {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-semibold text-slate-900 truncate">{u.email}</h3>
                            {u.role && u.role !== "user" && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600 border border-slate-200">
                                {u.role}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                            {u.name && <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-slate-300"></span>{u.name}</span>}
                            {u.phone && <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-slate-300"></span>{u.phone}</span>}
                          </div>
                          
                          {/* Session Info */}
                          <div className="mt-3 flex flex-col sm:flex-row sm:gap-6 text-xs text-slate-400 bg-slate-50/50 p-2 rounded-lg border border-slate-100 w-fit">
                            <div className="flex items-center gap-1.5">
                              <IconClock className="w-3 h-3" />
                              <span>Last Login: {session?.lastLogin ? new Date(session.lastLogin).toLocaleDateString() : "—"}</span>
                            </div>
                            {session?.lastLogout && (
                              <div className="flex items-center gap-1.5 hidden sm:flex">
                                <IconClock className="w-3 h-3" />
                                <span>Last Logout: {new Date(session.lastLogout).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                        <div className="mr-4 flex-shrink-0">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                            {count} Program{count !== 1 ? "s" : ""}
                          </span>
                        </div>
                        
                        <a
                          href={`/admin/programs?clientEmail=${encodeURIComponent(u.email)}`}
                          className="btn-primary text-sm px-6 py-2"
                        >
                          Create Program
                        </a>
                        
                        {count > 0 && (
                          <a
                            href={`/admin/programs?clientEmail=${encodeURIComponent(u.email)}`}
                            className="flex-shrink-0 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-teal-700 hover:border-teal-200 transition-all"
                          >
                            View
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Quick Actions Grid - Using New CSS Classes */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4 px-1">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Exercise Library Card - Applied .card and .card-hover */}
            <a href="/admin/exercises" className="card group relative p-6 card-hover">
              <div className="absolute top-6 right-6 p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <IconDumbbell />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Exercise Library</h3>
              <p className="text-sm text-slate-500">Manage exercises and update your movement database.</p>
              <div className="mt-4 flex items-center text-sm font-medium text-teal-600 group-hover:underline">
                Access Library <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
              </div>
            </a>

            {/* Build Programs Card - Applied .card and .card-hover */}
            <a href="/admin/programs" className="card group relative p-6 card-hover">
              <div className="absolute top-6 right-6 p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <IconFileText />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Build Programs</h3>
              <p className="text-sm text-slate-500">Create comprehensive training plans for your clients.</p>
              <div className="mt-4 flex items-center text-sm font-medium text-teal-600 group-hover:underline">
                Manage Programs <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
              </div>
            </a>

            {/* Logout Card - Applied .card and .card-hover (with red overrides) */}
            <button
              onClick={async () => {
                await signOut();
                router.push("/sign-out/success");
              }}
              className="card group relative p-6 card-hover hover:border-red-200 hover:shadow-red-100 text-left transition-colors"
            >
              <div className="absolute top-6 right-6 p-3 bg-red-50 text-red-600 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors">
                <IconLogOut />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Sign Out</h3>
              <p className="text-sm text-slate-500">Securely log out of the admin dashboard.</p>
              <div className="mt-4 flex items-center text-sm font-medium text-red-600 group-hover:underline">
                Logout <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
              </div>
            </button>
          </div>
        </section>

        {/* Footer Info */}
        <footer className="mt-12 border-t border-slate-200 pt-8 text-center">
          <div className="inline-flex items-start gap-3 bg-amber-50 border border-amber-100 text-amber-800 px-4 py-3 rounded-lg text-sm text-left">
            <IconAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Security Notice</strong>
              This page is restricted to authenticated administrators only. All actions are logged.
            </div>
          </div>
        </footer>

      </div>
    </main>
  );
}