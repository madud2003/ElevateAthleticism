"use client";

import { useEffect, useState } from "react";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";

// --- Types ---
type Exercise = { id: string; name: string; description: string };
type Program = {
  id: string;
  clientEmail: string;
  title?: string;
  notes?: string;
  exercises: Array<{ id: string; name: string; sets: number; reps: number; notes?: string }>;
  schedule?: { day: string; exercises: Array<{ id: string; name: string; sets: number; reps: number; notes?: string }> }[] | null;
  createdAt: string;
  updatedAt?: string;
};

// --- Icons ---
const IconArrowLeft = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);

const IconLogOut = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);

const IconDumbbell = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>
);

const IconUser = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const IconCalendar = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);

export default function Dashboard(){
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [authChecked, setAuthChecked] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [, setExercises] = useState<Exercise[]>([]);
  
  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [programError, setProgramError] = useState<string | null>(null);
  const [weightsMap, setWeightsMap] = useState<Record<string, any[]>>({});
  const [sessionByDate] = useState<Record<string, { login?: string | null; logout?: string | null }>>({});
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [editingWeights, setEditingWeights] = useState<Record<string, { weight: string; setNumber: string }>>({});
  const [editingEntries, setEditingEntries] = useState<Record<string, { weight: string; reps?: string; setNumber?: string }>>({});
  const [, setEntryErrors] = useState<Record<string, string | null>>({});
  const [downloadingCsv, setDownloadingCsv] = useState(false);

  // --- Progress charts helpers ---
  function startOfWeek(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay(); // 0 Sunday
    const daysSinceMonday = (day + 6) % 7; // Monday -> 0
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - daysSinceMonday);
    return d;
  }

  function weekDates(date = new Date()) {
    const start = startOfWeek(date);
    return Array.from({ length: 7 }).map((_, i) => {
      const dd = new Date(start);
      dd.setDate(start.getDate() + i);
      return dd;
    });
  }

  function isoDate(d: Date) { return d.toISOString().slice(0, 10); }

  function computeWeeklyMetrics(progId: string) {
    const days = weekDates();
    const weights = weightsMap[progId] || [];
    const volume: number[] = [];
    const repsArr: number[] = [];
    const minutes: number[] = [];

    for (const d of days) {
      const key = isoDate(d);
      // volume = sum(weight * reps)
      const dayEntries = weights.filter((w: any) => (w.createdAt ? isoDate(new Date(w.createdAt)) : w.day) === key);
      let vol = 0;
      let reps = 0;
      for (const e of dayEntries) {
        const w = Number(e.weight) || 0;
        const r = Number(e.reps) || 1;
        vol += w * r;
        reps += r;
      }
      volume.push(Math.round(vol));
      repsArr.push(reps);

      // minutes from sessionByDate
      const sess = sessionByDate[key];
      if (sess && sess.login && sess.logout) {
        const inT = new Date(sess.login).getTime();
        const outT = new Date(sess.logout).getTime();
        const mins = Math.max(0, Math.round((outT - inT) / 60000));
        minutes.push(mins);
      } else {
        minutes.push(0);
      }
    }

    return { days: days.map(isoDate), volume, reps: repsArr, minutes };
  }

  function ChartSparkline({ values }: { values: number[] }) {
    const labels = values.map((_, i) => `d${i}`);
    const data = {
      labels,
      datasets: [
        {
          data: values,
          borderColor: '#06b6d4',
          backgroundColor: 'rgba(6,182,212,0.06)',
          tension: 0.3,
          pointRadius: 0,
        },
      ],
    };
    const options: any = {
      responsive: false,
      plugins: { legend: { display: false } },
      scales: { x: { display: false }, y: { display: false } },
    };
    return (
      <div>
        <Line data={data} options={options} width={120} height={40} />
      </div>
    );
  }

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    const role = (user?.publicMetadata as { role?: string } | undefined)?.role;
    if (role === "admin") {
      router.push("/admin");
      return;
    }
    const email = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || null;
    setUserEmail(email);
    setAuthChecked(true);
  }, [isLoaded, isSignedIn, user, router]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/exercises");
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load exercises");
        if (!ignore) setExercises(data.exercises || []);
      } catch (e: any) {
        if (!ignore) setError(e?.message || "Failed to load exercises");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    if (authChecked) load();
    return () => {
      ignore = true;
    };
  }, [authChecked]);

  useEffect(() => {
    let ignore = false;
    async function loadPrograms() {
      if (!userEmail) return;
      setLoadingPrograms(true);
      setProgramError(null);
      try {
        const res = await fetch(`/api/programs?clientEmail=${encodeURIComponent(userEmail)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load programs");
        if (!ignore) setPrograms(data.programs || []);
        if (!ignore) {
          try {
            const wres = await fetch(`/api/weights?clientEmail=${encodeURIComponent(userEmail)}`);
            const wdata = await wres.json();
            if (wres.ok && wdata?.weights) {
              const map: Record<string, any[]> = {};
              for (const w of wdata.weights) {
                map[w.programId] = map[w.programId] || [];
                map[w.programId].push(w);
              }
              setWeightsMap(map);
            }
          } catch {
            // non-fatal
          }
        }
      } catch (e: any) {
        if (!ignore) setProgramError(e?.message || "Failed to load programs");
      } finally {
        if (!ignore) setLoadingPrograms(false);
      }
    }

    if (authChecked) loadPrograms();
    return () => {
      ignore = true;
    };
  }, [authChecked, userEmail]);

  function mostRecentDateForWeekday(weekday: string | null) {
    if (!weekday) return null;
    const map: Record<string, number> = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
    const target = map[weekday as string];
    if (target == null) return null;
    const today = new Date();
    const todayNum = today.getDay();
    const delta = (todayNum - target + 7) % 7;
    const d = new Date();
    d.setDate(today.getDate() - delta);
    return d.toISOString().slice(0, 10);
  }

  if (!authChecked) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Checking access...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
              <IconDumbbell className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">My Training</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-semibold text-slate-900">{user?.firstName || 'Athlete'}</span>
              <span className="text-xs text-slate-500">{userEmail}</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white">
              {user?.firstName?.charAt(0).toUpperCase() || <IconUser className="w-4 h-4" />}
            </div>
            <button 
              onClick={async () => {
                await signOut();
                router.push("/sign-out/success");
              }}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              title="Sign out"
            >
              <IconLogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">My Programs</h2>
          <p className="text-slate-500 mt-1">Select a program to view your daily workouts and log progress.</p>
        </div>

        {loadingPrograms && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {programError && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm mb-6">
            {programError}
          </div>
        )}

        {!loadingPrograms && !programError && programs.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <IconDumbbell className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No programs assigned yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Your coach hasn't assigned a training program to your account yet. Check back later!</p>
          </div>
        )}

        {!loadingPrograms && !programError && programs.length > 0 && (
          <div>
            {!selectedProgramId ? (
              // Program List View
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programs.map((p) => (
                  <button 
                    key={p.id} 
                    onClick={() => { 
                      setSelectedProgramId(p.id); 
                      setSelectedDay(p.schedule && p.schedule.length ? p.schedule[0].day : null); 
                    }} 
                    className="group text-left bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-200 transition-all duration-200 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <IconDumbbell className="w-24 h-24 text-teal-600 transform rotate-12 translate-x-4 -translate-y-4" />
                    </div>
                    <div className="relative z-10">
                      <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 mb-4">
                        <IconCalendar className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-teal-700 transition-colors">{p.title || 'Untitled Program'}</h3>
                      <div className="text-sm text-slate-500 mb-4">{p.clientEmail}</div>
                      
                      <div className="flex items-center gap-2 text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded w-fit">
                        {p.schedule?.length || 0} Active Days
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              // Program Detail View
              (() => {
                const prog = programs.find(pr => pr.id === selectedProgramId)!;
                return (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                      <div>
                        <button 
                          onClick={() => { setSelectedProgramId(null); setSelectedDay(null); }} 
                          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-teal-600 mb-2 transition-colors"
                        >
                          <IconArrowLeft className="w-4 h-4" /> Back to Programs
                        </button>
                      </div>
                        <div>
                          <h2 className="text-3xl font-bold text-slate-900">{prog.title || 'Untitled Program'}</h2>
                          {prog.notes && <p className="text-slate-500 mt-1 max-w-2xl">{prog.notes}</p>}
                        
                        {/* Progress Charts */}
                        <div className="mt-4 grid grid-cols-3 gap-4">
                          {(() => {
                            const m = computeWeeklyMetrics(prog.id);
                            return (
                              <>
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                  <div className="text-xs text-slate-500">Volume (kg·reps)</div>
                                  <div className="flex items-center justify-between mt-2">
                                    <div className="text-sm font-bold text-slate-800">{m.volume.reduce((a,b)=>a+b,0)}</div>
                                    <ChartSparkline values={m.volume} />
                                  </div>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                  <div className="text-xs text-slate-500">Training (min)</div>
                                  <div className="flex items-center justify-between mt-2">
                                    <div className="text-sm font-bold text-slate-800">{m.minutes.reduce((a,b)=>a+b,0)}</div>
                                    <ChartSparkline values={m.minutes} />
                                  </div>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                  <div className="text-xs text-slate-500">Reps</div>
                                  <div className="flex items-center justify-between mt-2">
                                    <div className="text-sm font-bold text-slate-800">{m.reps.reduce((a,b)=>a+b,0)}</div>
                                    <ChartSparkline values={m.reps} />
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                          <button
                            onClick={async () => {
                              try {
                                setDownloadingCsv(true);
                                const url = `/api/weights/export?programId=${encodeURIComponent(prog.id)}&clientEmail=${encodeURIComponent(prog.clientEmail)}`;
                                const res = await fetch(url);
                                if (!res.ok) {
                                  const data = await res.json().catch(() => ({}));
                                  setProgramError(data?.error || 'Failed to export CSV');
                                  return;
                                }
                                const blob = await res.blob();
                                const disp = res.headers.get('Content-Disposition') || '';
                                let filename = `weights-${prog.clientEmail}.csv`;
                                const m = disp.match(/filename=(?:\"?)([^\";]+)/);
                                if (m && m[1]) filename = m[1].replace(/\"/g, '');
                                const link = document.createElement('a');
                                link.href = URL.createObjectURL(blob);
                                link.download = filename;
                                document.body.appendChild(link);
                                link.click();
                                link.remove();
                                URL.revokeObjectURL(link.href);
                              } catch (err: any) {
                                console.error(err);
                                setProgramError(err?.message || 'Export failed');
                              } finally {
                                setDownloadingCsv(false);
                              }
                            }}
                            disabled={downloadingCsv}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                          >
                            {downloadingCsv ? 'Preparing…' : 'Export CSV'}
                          </button>
                        </div>
                      </div>

                    <div className="grid lg:grid-cols-12 gap-8 items-start">
                      
                      {/* Sidebar: Days */}
                      <div className="lg:col-span-3 space-y-2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Schedule</h3>
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden sticky top-24">
                          {(prog.schedule || []).map((d) => (
                            <button 
                              key={d.day} 
                              onClick={() => setSelectedDay(d.day)} 
                              className={`w-full text-left px-4 py-3 flex items-center justify-between border-b border-slate-100 last:border-0 transition-colors ${
                                selectedDay === d.day 
                                  ? 'bg-teal-50 text-teal-800 font-semibold border-l-4 border-l-teal-500' 
                                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                              }`}
                            >
                              <span>{d.day}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                                {d.exercises.length}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Main Content: Exercises */}
                      <div className="lg:col-span-9">
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                          
                          {/* Day Header */}
                          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm">
                                <IconCalendar className="w-5 h-5 text-slate-500" />
                              </div>
                              <div>
                                <h3 className="font-bold text-slate-900 text-lg">{selectedDay || 'Select a day'}</h3>
                                {selectedDay && (() => {
                                  const dateKey = mostRecentDateForWeekday(selectedDay);
                                  const sess = dateKey ? sessionByDate[dateKey] : null;
                                  if (!sess) return <div className="text-xs text-slate-400">No session activity recorded</div>;
                                  const loginTime = sess.login ? new Date(sess.login) : null;
                                  const logoutTime = sess.logout ? new Date(sess.logout) : null;
                                  let latestType = 'none';
                                  let latestTime: Date | null = null;
                                  if (loginTime && logoutTime) {
                                    latestType = loginTime.getTime() > logoutTime.getTime() ? 'login' : 'logout';
                                    latestTime = latestType === 'login' ? loginTime : logoutTime;
                                  } else if (loginTime) {
                                    latestType = 'login'; latestTime = loginTime;
                                  } else if (logoutTime) {
                                    latestType = 'logout'; latestTime = logoutTime;
                                  }
                                  if (!latestTime) return <div className="text-xs text-slate-400">No session data</div>;
                                  return (
                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                      Last active: {latestTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>

                          <div className="p-6 min-h-[400px]">
                            {selectedDay ? (
                              <div className="space-y-6">
                                {((prog.schedule || []).find(s => s.day === selectedDay)?.exercises || []).map((ex, i) => {
                                  const entries = (weightsMap[prog.id] || []).filter((w: any) => w.exerciseId === ex.id && w.day === selectedDay);
                                  // detect if single-set exercise already has a logged entry this week/day
                                  const hasLoggedSingle = ex.sets === 1 && entries.some((w: any) => w.setNumber === 1 || w.setNumber == null);
                                  entries.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                                  const latest = entries[0] || null;
                                  const key = `${prog.id}_${selectedDay}_${ex.id}`;
                                  const editing = !!editingWeights[key];

                                  return (
                                    <div key={ex.id + i} className="group border border-slate-200 rounded-xl p-5 bg-white hover:shadow-md transition-shadow relative overflow-hidden">
                                      {/* Left Accent Border */}
                                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${editing ? 'bg-teal-500' : 'bg-slate-200 group-hover:bg-teal-400'} transition-colors`}></div>

                                      <div className="pl-3">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                          <div>
                                            <h4 className="font-bold text-lg text-slate-900">{ex.name}</h4>
                                            <div className="text-sm text-slate-500 font-medium mt-1">
                                              {ex.sets} Sets × {ex.reps} Reps
                                              {ex.notes && <span className="mx-2 text-slate-300">•</span>}
                                              {ex.notes && <span className="text-slate-400 italic">{ex.notes}</span>}
                                            </div>
                                          </div>
                                          
                                          {!editing && !hasLoggedSingle && (
                                            <button 
                                              onClick={() => {
                                                const latestEntry = entries[0] || null;
                                                setEditingWeights(prev => ({ 
                                                  ...prev, 
                                                  [key]: { 
                                                    weight: latestEntry ? String(latestEntry.weight) : '', 
                                                    setNumber: latestEntry && latestEntry.setNumber ? String(latestEntry.setNumber) : '1' 
                                                  } 
                                                }));
                                                setEntryErrors(prev => ({ ...prev, [key]: null }));
                                              }} 
                                              className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
                                            >
                                              <IconDumbbell className="w-4 h-4" /> Log Weight
                                            </button>
                                          )}
                                          {hasLoggedSingle && (
                                            <div className="shrink-0 inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-lg">
                                              Logged
                                            </div>
                                          )}
                                        </div>

                                        {/* Edit Mode Inputs */}
                                        {editing && (
                                          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-4 animate-in fade-in slide-in-from-top-2">
                                            <div className="flex flex-col sm:flex-row gap-3 items-end">
                                              <div className="flex-1 w-full">
                                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Weight (kg)</label>
                                                <input
                                                  type="number"
                                                  value={editingWeights[key].weight}
                                                  onChange={(e) => setEditingWeights(prev => ({ ...prev, [key]: { ...prev[key], weight: e.target.value } }))}
                                                  placeholder="0"
                                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm font-medium"
                                                />
                                              </div>
                                              <div className="w-full sm:w-32">
                                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Set #</label>
                                                {ex.sets === 1 ? (
                                                  <input type="hidden" value="1" />
                                                ) : (
                                                  <select
                                                    value={editingWeights[key].setNumber}
                                                    onChange={(e) => setEditingWeights(prev => ({ ...prev, [key]: { ...prev[key], setNumber: e.target.value } }))}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
                                                  >
                                                    {Array.from({ length: ex.sets }).map((_, idx) => (
                                                      <option key={idx} value={(idx + 1).toString()}>Set {idx + 1}</option>
                                                    ))}
                                                  </select>
                                                )}
                                              </div>
                                              <div className="flex gap-2 w-full sm:w-auto">
                                                <button 
                                                  onClick={async () => {
                                                    const raw = editingWeights[key];
                                                    const weightVal = Number(raw.weight);
                                                    const setNum = raw.setNumber ? Number(raw.setNumber) : null;
                                                    if (isNaN(weightVal)) {
                                                      setEntryErrors(prev => ({ ...prev, [key]: 'Invalid weight' }));
                                                      return;
                                                    }
                                                    try {
                                                      const res = await fetch('/api/weights', { 
                                                        method: 'POST', 
                                                        headers: { 'Content-Type': 'application/json' }, 
                                                        body: JSON.stringify({ 
                                                          programId: prog.id, 
                                                          clientEmail: prog.clientEmail, 
                                                          day: selectedDay, 
                                                          exerciseId: ex.id, 
                                                          exerciseName: ex.name, 
                                                          weight: weightVal, 
                                                          setNumber: setNum 
                                                        }) 
                                                      });
                                                      const data = await res.json();
                                                      if (!data?.entry) {
                                                        setEntryErrors(prev => ({ ...prev, [key]: data?.error || 'Failed to save weight' }));
                                                        return;
                                                      }
                                                      setWeightsMap(prev => ({ ...prev, [prog.id]: [data.entry, ...(prev[prog.id] || [])] }));
                                                      setEditingWeights(prev => { const copy = { ...prev }; delete copy[key]; return copy; });
                                                      setEntryErrors(prev => { const copy = { ...prev }; delete copy[key]; return copy; });
                                                    } catch (err: any) {
                                                      setEntryErrors(prev => ({ ...prev, [key]: err?.message || 'Failed to save weight' }));
                                                    }
                                                  }} 
                                                  className="flex-1 sm:flex-none px-4 py-2 bg-teal-600 text-white text-sm font-bold rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all shadow-sm"
                                                >
                                                  Save
                                                </button>
                                                <button 
                                                  onClick={() => setEditingWeights(prev => { const copy = { ...prev }; delete copy[key]; return copy; })} 
                                                  className="px-3 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                                                >
                                                  Cancel
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                        {/* History Section */}
                                        <div>
                                          <div className="flex items-center justify-between mb-2">
                                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">History</h5>
                                            {latest && (
                                              <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                                                Latest: {latest.weight}kg
                                              </span>
                                            )}
                                          </div>
                                          {entries.length > 0 ? (
                                            <div className="space-y-2">
                                              {entries.slice(0, 5).map((w: any, idx: number) => {
                                                const entryId = w.id || w._id || idx;
                                                const isEditingEntry = !!editingEntries[entryId];
                                                return (
                                                  <div key={entryId} className="flex items-center justify-between text-sm p-2 rounded bg-slate-50 border border-slate-100">
                                                    {isEditingEntry ? (
                                                      <div className="flex items-center justify-between w-full gap-3">
                                                        <div className="flex-1">
                                                          <input
                                                            type="number"
                                                            value={editingEntries[entryId].weight}
                                                            onChange={(e) => setEditingEntries(prev => ({ ...prev, [entryId]: { ...prev[entryId], weight: e.target.value } }))}
                                                            className="w-full px-2 py-1 border rounded text-sm"
                                                          />
                                                          <div className="text-xs text-slate-500 mt-1">{editingEntries[entryId].setNumber ? `Set ${editingEntries[entryId].setNumber}` : ''}</div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                          <button
                                                            onClick={async () => {
                                                              const raw = editingEntries[entryId];
                                                              const weightVal = Number(raw.weight);
                                                              const setNum = raw.setNumber ? Number(raw.setNumber) : null;
                                                              if (isNaN(weightVal)) {
                                                                setEntryErrors(prev => ({ ...prev, [entryId]: 'Invalid weight' }));
                                                                return;
                                                              }
                                                              try {
                                                                const res = await fetch('/api/weights', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: entryId, weight: weightVal, reps: raw.reps ? Number(raw.reps) : undefined, setNumber: setNum }) });
                                                                const data = await res.json();
                                                                if (!data?.entry) {
                                                                  setEntryErrors(prev => ({ ...prev, [entryId]: data?.error || 'Failed to update entry' }));
                                                                  return;
                                                                }
                                                                // update map
                                                                setWeightsMap(prev => {
                                                                  const arr = (prev[prog.id] || []).map((it: any) => it.id === entryId ? data.entry : it);
                                                                  return { ...prev, [prog.id]: arr };
                                                                });
                                                                setEditingEntries(prev => { const c = { ...prev }; delete c[entryId]; return c; });
                                                                setEntryErrors(prev => { const c = { ...prev }; delete c[entryId]; return c; });
                                                              } catch (err: any) {
                                                                setEntryErrors(prev => ({ ...prev, [entryId]: err?.message || 'Failed to update entry' }));
                                                              }
                                                            }}
                                                            className="px-3 py-1.5 bg-teal-600 text-white rounded text-sm"
                                                          >
                                                            Save
                                                          </button>
                                                          <button onClick={() => setEditingEntries(prev => { const c = { ...prev }; delete c[entryId]; return c; })} className="px-3 py-1.5 border rounded text-sm">Cancel</button>
                                                        </div>
                                                      </div>
                                                    ) : (
                                                      <>
                                                        <div className="font-medium text-slate-700">
                                                          <span className="font-bold">{w.weight}kg</span>
                                                          {w.reps && <span className="text-slate-500 ml-1">({w.reps} reps)</span>}
                                                          {w.setNumber && <span className="text-xs text-slate-400 ml-2">Set {w.setNumber}</span>}
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                          <div className="text-xs text-slate-400">{new Date(w.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                          <button onClick={() => setEditingEntries(prev => ({ ...prev, [entryId]: { weight: String(w.weight), reps: w.reps ? String(w.reps) : '', setNumber: w.setNumber ? String(w.setNumber) : '' } }))} className="text-xs text-slate-500">Edit</button>
                                                        </div>
                                                      </>
                                                    )}
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          ) : (
                                            <div className="text-sm text-slate-400 italic py-2">No logs yet for today.</div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="h-full flex flex-col items-center justify-center text-center py-12 opacity-60">
                                <IconCalendar className="w-16 h-16 text-slate-200 mb-4" />
                                <p className="text-slate-500">Select a day from the sidebar to view exercises.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        )}
      </div>
    </main>
  );
}
