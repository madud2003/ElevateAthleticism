"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";

// --- Types ---
type Exercise = { id: string; name: string; description: string };
type ProgramExercise = { id: string; name: string; sets: number; reps: number; notes?: string };
type DaySchedule = { day: string; exercises: ProgramExercise[] };
type Program = {
  id: string;
  clientEmail: string;
  title?: string;
  notes?: string;
  exercises: ProgramExercise[];
  schedule?: DaySchedule[] | null;
  createdAt: string;
  updatedAt?: string;
};

// --- Icons ---
const IconArrowLeft = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);
const IconSearch = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);
const IconPlus = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);
const IconDumbbell = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>
);
const IconCopy = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);
const IconEdit = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
);
const IconDownload = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);
const IconAlert = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
);
const IconCalendar = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);

function AdminProgramsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(true);

  const [programs, setPrograms] = useState<Program[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("");
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [newForm, setNewForm] = useState({ clientEmail: "", title: "", notes: "" });
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const [selectedEditDay, setSelectedEditDay] = useState(days[0]);
  const [scheduleForm, setScheduleForm] = useState<DaySchedule[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [weightsMap, setWeightsMap] = useState<Record<string, any[]>>({});
  const [sessionEvents, setSessionEvents] = useState<Record<string, any[]>>({});
  const [downloadingCsv, setDownloadingCsv] = useState(false);

  const selected = useMemo(() => programs.find((p) => p.id === selectedId) || null, [programs, selectedId]);

  const [form, setForm] = useState({
    clientEmail: "",
    title: "",
    notes: "",
    exercises: [] as ProgramExercise[],
  });

  const filteredPrograms = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return programs;
    return programs.filter((p) => (p.title || "").toLowerCase().includes(q) || (p.clientEmail || "").toLowerCase().includes(q));
  }, [programs, filter]);

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
    async function load() {
      try {
        const clientEmail = searchParams?.get("clientEmail");
        const programUrl = clientEmail
          ? `/api/programs?clientEmail=${encodeURIComponent(clientEmail)}`
          : "/api/programs";
        const [programRes, exerciseRes] = await Promise.all([fetch(programUrl), fetch("/api/exercises")]);
        const programData = await programRes.json();
        const exerciseData = await exerciseRes.json();
        if (!programRes.ok) throw new Error(programData?.error || "Failed to load programs");
        if (!exerciseRes.ok) throw new Error(exerciseData?.error || "Failed to load exercises");
        if (!ignore) {
          setPrograms(programData.programs || []);
          setExercises(exerciseData.exercises || []);
          if (programData.programs?.length) setSelectedId(programData.programs[0].id);
        }
      } catch (e: any) {
        if (!ignore) setError(e?.message || "Failed to load data");
      }
    }
    if (!loading) load();
    return () => {
      ignore = true;
    };
  }, [loading, searchParams]);

  useEffect(() => {
    if (!selected) return;
    setIsEditing(false);
    setForm({
      clientEmail: selected.clientEmail,
      title: selected.title || "",
      notes: selected.notes || "",
      exercises: selected.exercises.map((ex) => ({ ...ex })),
    });
    setScheduleForm(selected.schedule ? selected.schedule.map(s => ({ day: s.day, exercises: s.exercises.map(e => ({ ...e })) })) : null);

    (async () => {
      try {
        const res = await fetch(`/api/weights?programId=${encodeURIComponent(selected.id)}`);
        const data = await res.json();
        if (res.ok && data?.weights) {
          setWeightsMap(prev => ({ ...prev, [selected.id]: data.weights }));
        }
      } catch {
        // ignore
      }
    })();

    (async () => {
      try {
        const res = await fetch(`/api/session-events?email=${encodeURIComponent(selected.clientEmail)}`);
        const data = await res.json();
        if (res.ok && data?.events) {
          setSessionEvents(prev => ({ ...prev, [selected.clientEmail]: data.events }));
        }
      } catch {
        // ignore
      }
    })();
  }, [selected]);

  function updateField<K extends keyof typeof form>(key: K, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function saveProgram() {
    if (!selected) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const bodyPayload: any = { clientEmail: form.clientEmail, title: form.title, notes: form.notes, exercises: form.exercises };
      if (scheduleForm) bodyPayload.schedule = scheduleForm;
      const res = await fetch(`/api/programs/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update program");
      setPrograms((prev) => prev.map((p) => (p.id === selected.id ? data.program : p)));
      setSuccess("Program updated. Version history saved.");
    } catch (e: any) {
      setError(e?.message || "Failed to update program");
    } finally {
      setSaving(false);
    }
  }

  function addExerciseToDay(day: string, exId: string) {
    if (!scheduleForm) {
      const newSchedule = days.map(d => ({ day: d, exercises: [] }));
      setScheduleForm(newSchedule);
    }
    setScheduleForm(prev => {
      const next = prev ? prev.map(s => ({ ...s, exercises: s.exercises.map(e => ({ ...e })) })) : days.map(d => ({ day: d, exercises: [] }));
      const slot = next.find(s => s.day === day)!;
      if (!slot.exercises.find(e => e.id === exId)) {
        const ex = exercises.find(x => x.id === exId)!;
        slot.exercises.push({ id: ex.id, name: ex.name, sets: 3, reps: 8 });
      }
      return next;
    });
  }

  function startOfWeek(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const daysSinceMonday = (day + 6) % 7;
    d.setHours(0,0,0,0);
    d.setDate(d.getDate() - daysSinceMonday);
    return d;
  }
  function weekDates(date = new Date()) {
    const start = startOfWeek(date);
    return Array.from({ length: 7 }).map((_, i) => { const dd = new Date(start); dd.setDate(start.getDate() + i); return dd; });
  }
  function isoDate(d: Date) { return d.toISOString().slice(0,10); }

  function computeWeeklyMetricsForProgram(progId: string, clientEmail?: string) {
    const daysArr = weekDates();
    const weights = weightsMap[progId] || [];
    const events = (clientEmail && sessionEvents[clientEmail]) ? sessionEvents[clientEmail] : [];
    const volume: number[] = [];
    const repsArr: number[] = [];
    const minutes: number[] = [];

    const evByDay: Record<string, any[]> = {};
    for (const ev of events) {
      const d = isoDate(new Date(ev.createdAt));
      evByDay[d] = evByDay[d] || [];
      evByDay[d].push(ev);
    }

    for (const d of daysArr) {
      const key = isoDate(d);
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

      let mins = 0;
      const dayEv = (evByDay[key] || []).slice().sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      let lastLogin: number | null = null;
      for (const ev of dayEv) {
        if (ev.type === 'login') lastLogin = new Date(ev.createdAt).getTime();
        if (ev.type === 'logout' && lastLogin) {
          const outT = new Date(ev.createdAt).getTime();
          mins += Math.max(0, Math.round((outT - lastLogin) / 60000));
          lastLogin = null;
        }
      }
      minutes.push(mins);
    }

    return { days: daysArr.map(isoDate), volume, reps: repsArr, minutes };
  }

  function Sparkline({ values }: { values: number[] }) {
    const w = 120, h = 36, pad = 4;
    const max = Math.max(...values, 1);
    const pts = values.map((v, i) => {
      const x = pad + (i * (w - pad*2)) / (values.length - 1 || 1);
      const y = h - pad - (v / max) * (h - pad*2);
      return `${x},${y}`;
    }).join(' ');
    return (
      <svg width={w} height={h} className="block">
        <polyline fill="none" stroke="#0d9488" strokeWidth={2} points={pts} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  function removeExerciseFromDay(day: string, exId: string) {
    if (!scheduleForm) return;
    setScheduleForm(prev => prev ? prev.map(s => s.day === day ? ({ ...s, exercises: s.exercises.filter(e => e.id !== exId) }) : s) : prev);
  }

  function updateScheduleExercise(day: string, exId: string, updates: Partial<ProgramExercise>) {
    if (!scheduleForm) return;
    setScheduleForm(prev => prev ? prev.map(s => s.day === day ? ({ ...s, exercises: s.exercises.map(e => e.id === exId ? { ...e, ...updates } : e) }) : s) : prev);
  }

  async function deleteProgram() {
    if (!selected) return;
    if (!confirm("Delete this program? This cannot be undone.")) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/programs/${selected.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to delete program");
      setPrograms((prev) => prev.filter((p) => p.id !== selected.id));
      setSelectedId(null);
      setSuccess("Program deleted. Version history saved.");
    } catch (e: any) {
      setError(e?.message || "Failed to delete program");
    } finally {
      setSaving(false);
    }
  }

  async function createProgram() {
    setSaving(true);
    setError(null);
    try {
      const payload = { clientEmail: newForm.clientEmail, title: newForm.title, notes: newForm.notes, schedule: days.map(d => ({ day: d, exercises: [] })) };
      const res = await fetch(`/api/programs`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create program");
      setPrograms((prev) => [data.program, ...prev]);
      setSelectedId(data.program.id);
      setNewModalOpen(false);
      setNewForm({ clientEmail: "", title: "", notes: "" });
      setSuccess("Program created.");
    } catch (e: any) {
      setError(e?.message || "Failed to create program");
    } finally {
      setSaving(false);
    }
  }

  async function duplicateProgram(p: Program) {
    setSaving(true);
    setError(null);
    try {
      const payload = { clientEmail: p.clientEmail, title: `${p.title || "Untitled"} (copy)`, notes: p.notes || "", schedule: p.schedule || days.map(d => ({ day: d, exercises: [] })) };
      const res = await fetch(`/api/programs`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to duplicate program");
      setPrograms((prev) => [data.program, ...prev]);
      setSuccess("Program duplicated.");
    } catch (e: any) {
      setError(e?.message || "Failed to duplicate program");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading Programs...</p>
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
              aria-label="Go back"
              className="flex items-center gap-2 p-2 -ml-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <IconArrowLeft />
              <span className="hidden sm:inline font-medium text-sm">Back</span>
            </button>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">Admin Programs</h1>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-4rem)]">
        <div className="grid md:grid-cols-12 gap-6 h-full">
          
          {/* Sidebar */}
          <div className="md:col-span-4 lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <div className="relative mb-3">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)} 
                  placeholder="Search programs..." 
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white" 
                />
              </div>
              <button 
                onClick={() => setNewModalOpen(true)} 
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
              >
                <IconPlus className="w-4 h-4" /> New Program
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {filteredPrograms.length === 0 && <div className="text-center py-8 text-sm text-slate-500">No programs found.</div>}
              {filteredPrograms.map((p) => (
                <div
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedId(p.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedId(p.id); } }}
                  className={`w-full text-left p-3 rounded-xl border transition-all group cursor-pointer ${
                    selectedId === p.id 
                      ? "bg-teal-50 border-teal-500 ring-1 ring-teal-500 shadow-sm" 
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className={`font-semibold text-sm truncate ${selectedId === p.id ? "text-teal-900" : "text-slate-900"}`}>
                        {p.title && p.title.trim().length > 0 ? p.title : "Untitled Program"}
                      </div>
                      <div className="text-xs text-slate-500 truncate mt-0.5">{p.clientEmail}</div>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={(e) => { e.stopPropagation(); duplicateProgram(p); }} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600" title="Duplicate">
                        <IconCopy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-slate-400">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {(p.schedule && Array.isArray(p.schedule) ? p.schedule.reduce((acc, s) => acc + (s.exercises?.length || 0), 0) : 0)} ex
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-slate-100 bg-slate-50 text-xs text-center text-slate-400">
              {programs.length} total programs
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-8 lg:col-span-9 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
            {!selected ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <IconDumbbell className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-medium">Select a program to edit</p>
              </div>
            ) : (
              <div className="flex flex-col h-full overflow-y-auto">
                
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{form.title || "Untitled Program"}</h2>
                    <p className="text-sm text-slate-500 mt-1">Updated: {new Date(selected.updatedAt || selected.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setIsEditing((v) => !v)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isEditing ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : "bg-teal-600 text-white hover:bg-teal-700 shadow-sm shadow-teal-200"}`}>
                      {isEditing ? "Cancel Edit" : "Edit Program"}
                    </button>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 space-y-8">
                  
                  {/* Stats / Export */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-1 bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Export Data</div>
                        <button 
                          onClick={async () => {
                            try {
                              setDownloadingCsv(true);
                              const url = `/api/weights/export?programId=${encodeURIComponent(selected.id)}&clientEmail=${encodeURIComponent(selected.clientEmail)}`;
                              const res = await fetch(url);
                              if (!res.ok) throw new Error('Export failed');
                              const blob = await res.blob();
                              const disp = res.headers.get('Content-Disposition') || '';
                              let filename = `weights-${selected.clientEmail}.csv`;
                              const m = disp.match(/filename=(?:\"?)([^\";]+)/);
                              if (m && m[1]) filename = m[1].replace(/\"/g, '');
                              const link = document.createElement('a');
                              link.href = URL.createObjectURL(blob);
                              link.download = filename;
                              document.body.appendChild(link);
                              link.click();
                              link.remove();
                              URL.revokeObjectURL(link.href);
                            } catch {
                              setError('Export failed');
                            } finally { setDownloadingCsv(false); }
                          }}
                          disabled={downloadingCsv}
                          className="text-sm font-medium text-teal-600 hover:text-teal-800 flex items-center gap-1"
                        >
                          <IconDownload className="w-4 h-4" /> {downloadingCsv ? 'Downloading...' : 'Download CSV'}
                        </button>
                      </div>
                    </div>

                    {(() => {
                      const m = computeWeeklyMetricsForProgram(selected.id, selected.clientEmail);
                      return (
                        <>
                          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-slate-500 font-medium">Total Volume</span>
                              <span className="text-xs font-bold text-slate-900">{m.volume.reduce((a,b)=>a+b,0)} kg</span>
                            </div>
                            <div className="h-8"><Sparkline values={m.volume} /></div>
                          </div>
                          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-slate-500 font-medium">Active Minutes</span>
                              <span className="text-xs font-bold text-slate-900">{m.minutes.reduce((a,b)=>a+b,0)} min</span>
                            </div>
                            <div className="h-8"><Sparkline values={m.minutes} /></div>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Alerts */}
                  {error && <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-sm text-red-800"><IconAlert className="w-5 h-5 shrink-0"/>{error}</div>}
                  {success && <div className="p-4 bg-green-50 border border-green-100 rounded-lg text-sm text-green-800 font-medium">{success}</div>}

                  {/* Basic Info Form */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Client Email</label>
                      <input 
                        type="email" 
                        value={form.clientEmail} 
                        onChange={(e) => updateField("clientEmail", e.target.value)} 
                        disabled={!isEditing} 
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 transition-all" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Program Title</label>
                      <input 
                        type="text" 
                        value={form.title} 
                        onChange={(e) => updateField("title", e.target.value)} 
                        disabled={!isEditing} 
                        placeholder="e.g., Offseason Strength" 
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 transition-all" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Notes</label>
                      <textarea 
                        value={form.notes} 
                        onChange={(e) => updateField("notes", e.target.value)} 
                        disabled={!isEditing} 
                        placeholder="Program notes or coaching cues" 
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 transition-all resize-none" 
                        rows={3} 
                      />
                    </div>
                  </div>

                  {/* Schedule Display / Edit */}
                  {isEditing ? (
                    // Editor Mode
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                      <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2"><IconEdit className="w-4 h-4 text-teal-600"/> Weekly Schedule Editor</h3>
                        <div className="text-xs font-medium text-slate-500">Editing Mode</div>
                      </div>
                      <div className="md:flex h-[500px]">
                        {/* Day Selector */}
                        <div className="w-full md:w-48 border-r border-slate-200 bg-slate-50/50 overflow-y-auto">
                          {days.map((d) => {
                            const count = scheduleForm?.find(s => s.day === d)?.exercises.length || 0;
                            return (
                              <button 
                                key={d} 
                                onClick={() => setSelectedEditDay(d)} 
                                className={`w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-white transition-colors ${selectedEditDay === d ? "bg-white border-l-4 border-l-teal-500 font-semibold text-teal-700" : "text-slate-600"}`}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{d}</span>
                                  <span className="text-xs bg-slate-200 text-slate-600 px-1.5 rounded-full">{count}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Exercise List for Day */}
                        <div className="flex-1 p-4 overflow-y-auto bg-white">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-slate-900">{selectedEditDay}</h4>
                            <div className="relative">
                              <select 
                                onChange={(e) => { if (e.target.value) { addExerciseToDay(selectedEditDay, e.target.value); e.currentTarget.value = ""; } }} 
                                className="appearance-none bg-slate-50 border border-slate-300 text-slate-700 py-1.5 pl-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                              >
                                <option value="">+ Add Exercise</option>
                                {exercises.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                <IconPlus className="w-3 h-3" />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {(scheduleForm?.find(s => s.day === selectedEditDay)?.exercises || []).length === 0 && (
                              <div className="text-center py-10 text-slate-400 text-sm italic">No exercises for this day yet.</div>
                            )}
                            {(scheduleForm?.find(s => s.day === selectedEditDay)?.exercises || []).map((ex) => (
                              <div key={ex.id} className="group bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col gap-3 hover:border-teal-200 transition-colors">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-slate-900">{ex.name}</span>
                                  <button onClick={() => removeExerciseFromDay(selectedEditDay, ex.id)} className="text-red-400 hover:text-red-600 text-xs font-medium">Remove</button>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Sets</label>
                                    <input type="number" value={ex.sets} min={1} onChange={(e) => updateScheduleExercise(selectedEditDay, ex.id, { sets: Number(e.target.value) || 1 })} className="w-full px-2 py-1 border border-slate-300 rounded focus:ring-1 focus:ring-teal-500 text-sm" />
                                  </div>
                                  <div>
                                    <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Reps</label>
                                    <input type="number" value={ex.reps} min={1} onChange={(e) => updateScheduleExercise(selectedEditDay, ex.id, { reps: Number(e.target.value) || 1 })} className="w-full px-2 py-1 border border-slate-300 rounded focus:ring-1 focus:ring-teal-500 text-sm" />
                                  </div>
                                </div>
                                <input 
                                  type="text" 
                                  value={ex.notes || ""} 
                                  placeholder="Notes (optional)" 
                                  onChange={(e) => updateScheduleExercise(selectedEditDay, ex.id, { notes: e.target.value })} 
                                  className="w-full px-2 py-1 border border-slate-300 rounded focus:ring-1 focus:ring-teal-500 text-sm" 
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Read-Only Mode
                    <div className="space-y-6">
                      {!selected.schedule || !Array.isArray(selected.schedule) || selected.schedule.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                          No weekly schedule found.
                        </div>
                      ) : (
                        selected.schedule.map((day) => (
                          <div key={day.day} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                              <IconCalendar className="w-4 h-4 text-slate-500" />
                              <h4 className="font-bold text-slate-800">{day.day}</h4>
                            </div>
                            <div className="p-4 space-y-4">
                              {day.exercises.map((ex, i) => (
                                <div key={`${selected.id}_${day.day}_${i}`} className="flex flex-col gap-2 pb-4 last:pb-0 last:border-0 border-b border-slate-100 last:border-0">
                                  <div className="flex items-start justify-between gap-4">
                                    <div>
                                      <div className="font-semibold text-slate-900">{ex.name}</div>
                                      <div className="text-sm text-slate-500 mt-1">
                                        <span className="font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded text-xs mr-2">{ex.sets} sets × {ex.reps} reps</span>
                                        {ex.notes && <span className="italic">{ex.notes}</span>}
                                      </div>
                                    </div>
                                    
                                    {/* Latest Weights Summary */}
                                    <div className="text-right text-xs max-w-[180px]">
                                      {(() => {
                                        const arr = (weightsMap[selected.id] || []).filter((w: any) => w.exerciseId === ex.id);
                                        if (!arr.length) return <span className="text-slate-300">No logs</span>;
                                        const bySet: Record<string, any[]> = {};
                                        for (const w of arr) {
                                          const key = w.setNumber != null ? String(w.setNumber) : '0';
                                          bySet[key] = bySet[key] || [];
                                          bySet[key].push(w);
                                        }
                                        const parts: string[] = [];
                                        for (let s = 1; s <= (ex.sets || 1); s++) {
                                          const group = bySet[String(s)] || [];
                                          if (group.length) {
                                            group.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                                            const top = group[0];
                                            parts.push(`S${s}: ${top.weight}kg`);
                                          } else {
                                            parts.push(`S${s}: —`);
                                          }
                                        }
                                        return <div className="font-mono text-slate-600 leading-tight">{parts.join(' / ')}</div>;
                                      })()}
                                    </div>
                                  </div>

                                  {/* Detailed History */}
                                  <div className="pl-2">
                                    <details className="group">
                                      <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600 font-medium select-none list-none flex items-center gap-1">
                                        <span className="transform group-open:rotate-90 transition-transform">▶</span> View history
                                      </summary>
                                      <div className="mt-2 space-y-1 pl-4 border-l-2 border-slate-100">
                                        {((weightsMap[selected.id] || []).filter((w: any) => w.exerciseId === ex.id) || []).slice(0, 10).map((w: any, idx: number) => (
                                          <div key={idx} className="flex items-center justify-between text-xs text-slate-500 py-1">
                                            <div>
                                              <span className="font-medium text-slate-700">Set {w.setNumber ?? '-'}</span> · {w.weight}kg{w.reps ? ` · ${w.reps} reps` : ""}
                                            </div>
                                            <div>{new Date(w.createdAt).toLocaleString()}</div>
                                          </div>
                                        ))}
                                      </div>
                                    </details>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-auto">
                    {isEditing && (
                      <button 
                        onClick={saveProgram} 
                        disabled={saving} 
                        className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-sm shadow-teal-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    )}
                    <button 
                      onClick={deleteProgram} 
                      disabled={saving} 
                      className="px-6 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Program Modal */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Create New Program</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Client Email</label>
                <input 
                  type="email" 
                  value={newForm.clientEmail} 
                  onChange={(e) => setNewForm({...newForm, clientEmail: e.target.value})} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Program Title</label>
                <input 
                  type="text" 
                  value={newForm.title} 
                  onChange={(e) => setNewForm({...newForm, title: e.target.value})} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea 
                  rows={3}
                  value={newForm.notes} 
                  onChange={(e) => setNewForm({...newForm, notes: e.target.value})} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none" 
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setNewModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
              <button onClick={createProgram} disabled={saving} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold disabled:opacity-50">
                {saving ? "Creating..." : "Create Program"}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}

export default function AdminProgramsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Loading Programs...</p>
          </div>
        </main>
      }
    >
      <AdminProgramsPageContent />
    </Suspense>
  );
}

