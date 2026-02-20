"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

// --- Icons ---
const IconArrowLeft = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);
const IconPlus = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);
const IconEdit = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
);
const IconTrash = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);
const IconCheck = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 6 9 17l-5-5"/></svg>
);
const IconDumbbell = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>
);
const IconCalendar = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);
const IconAlert = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
);
const IconBook = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
);

type Exercise = { id: string; name: string; description: string };

const DEFAULT_EXERCISES: Exercise[] = [
  { id: "squat", name: "Back Squat", description: "Compound lower-body strength movement" },
  { id: "deadlift", name: "Deadlift", description: "Full-body posterior chain strength" },
  { id: "bench", name: "Bench Press", description: "Upper-body pressing strength" },
  { id: "row", name: "Barbell Row", description: "Upper-back pulling movement" },
  { id: "press", name: "Overhead Press", description: "Shoulder pressing strength" },
  { id: "pullup", name: "Pull-up/Chin-up", description: "Upper body pulling and scapular strength" },
];

export default function ExerciseBuilder() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selected, setSelected] = useState<Record<string, { sets: number; reps: number; notes?: string }>>({});
  const [newExercise, setNewExercise] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState({ name: "", description: "" });
  const [loadingExercises, setLoadingExercises] = useState(true);
  const [exerciseError, setExerciseError] = useState<string | null>(null);
  
  // Program Form State
  const [clientEmail, setClientEmail] = useState("");
  const [programTitle, setProgramTitle] = useState("");
  const [programNotes, setProgramNotes] = useState("");
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const [scheduleSelections, setScheduleSelections] = useState<Record<string, Record<string, { sets:number; reps:number; notes?:string }>>>({});
  const [weekly, setWeekly] = useState(true);
  const [showLibrary, setShowLibrary] = useState(false);
  const isAdmin = (user as any)?.publicMetadata?.role === "admin";

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    // Only enable the library UI for admin users
    setShowLibrary(!!isAdmin);
  }, [isLoaded, isSignedIn, isAdmin, router]);

  useEffect(() => {
    let ignore = false;
    async function loadExercises() {
      setLoadingExercises(true);
      setExerciseError(null);
      try {
        const res = await fetch("/api/exercises");
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load exercises");
        if (!ignore) setExercises(data.exercises || []);
      } catch (e: any) {
        if (!ignore) {
          setExerciseError(e?.message || "Failed to load exercises");
          setExercises(DEFAULT_EXERCISES);
        }
      } finally {
        if (!ignore) setLoadingExercises(false);
      }
    }
    loadExercises();
    return () => {
      ignore = true;
    };
  }, []);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const copy = { ...prev };
      if (copy[id]) delete copy[id];
      else copy[id] = { sets: 3, reps: 8 };
      return copy;
    });
  }

  function updateConfig(id: string, updates: Partial<{ sets: number; reps: number; notes?: string }>) {
    setSelected((prev) => ({ ...prev, [id]: { ...prev[id], ...updates } }));
  }

  async function addExercise() {
    if (!newExercise.name.trim()) return alert("Please enter an exercise name");
    try {
      const res = await fetch("/api/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newExercise.name,
          description: newExercise.description,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create exercise");
      setExercises((prev) => [data.exercise, ...prev]);
      setNewExercise({ name: "", description: "" });
    } catch (e: any) {
      alert(e?.message || "Failed to create exercise");
    }
  }

  async function updateExercise(id: string) {
    if (!editingValues.name.trim()) return alert("Please enter a name");
    try {
      const res = await fetch("/api/exercises", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editingValues }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update exercise");
      setExercises((prev) => prev.map((e) => (e.id === id ? data.exercise : e)));
      setEditingId(null);
      setEditingValues({ name: "", description: "" });
    } catch (e: any) {
      alert(e?.message || "Failed to update exercise");
    }
  }

  async function deleteExercise(id: string) {
    if (!confirm("Delete this exercise? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/exercises?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to delete exercise");
      setExercises((prev) => prev.filter((e) => e.id !== id));
    } catch (e: any) {
      alert(e?.message || "Failed to delete exercise");
    }
  }

  async function createProgram() {
    if (!clientEmail || !clientEmail.trim()) return alert("Please enter client email");
    const schedulePayload = days.map((d) => {
      const daySel = scheduleSelections[d] || {};
      const dayExercises = Object.entries(daySel).map(([id, cfg]) => {
        const ex = exercises.find((e) => e.id === id)!;
        return { id, name: ex.name, sets: cfg.sets, reps: cfg.reps, notes: cfg.notes };
      });
      return { day: d, exercises: dayExercises };
    });
    const any = schedulePayload.some((s) => (s.exercises || []).length > 0);
    if (!any) return alert("Please add at least one exercise to the weekly schedule");

    try {
      const res = await fetch("/api/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientEmail: clientEmail.trim(),
          title: programTitle.trim(),
          notes: programNotes.trim(),
          exercises: [],
          schedule: schedulePayload,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create program");
      setSelected({});
      setClientEmail("");
      setProgramTitle("");
      setProgramNotes("");
      setScheduleSelections({});
      alert("Program created for " + data.program.clientEmail);
    } catch (e: any) {
      alert(e?.message || "Failed to create program");
    }
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
            >
              <IconArrowLeft />
            </button>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">Program Builder</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-semibold text-slate-900">{user?.primaryEmailAddress?.emailAddress}</span>
              <span className="text-xs text-teal-600 font-medium uppercase tracking-wider">{isAdmin ? "Admin" : "Coach"}</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white">
              {user?.primaryEmailAddress?.emailAddress?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* SECTION 1: Exercise Library Management */}
        {showLibrary && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <IconBook className="w-6 h-6 text-teal-600" />
                  Exercise Library
                </h2>
                <p className="text-slate-500 mt-1">Manage your database of movements.</p>
              </div>
              <button
                onClick={() => setShowLibrary(false)}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1"
              >
                Hide Library ↓
              </button>
            </div>

            {/* Add Exercise Form */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Add New Exercise</h3>
              <div className="grid md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-5">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Exercise Name</label>
                  <input
                    type="text"
                    value={newExercise.name}
                    onChange={(e) => setNewExercise((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Front Squat"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="md:col-span-5">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                  <input
                    type="text"
                    value={newExercise.description}
                    onChange={(e) => setNewExercise((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Short cue or intent"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    onClick={addExercise}
                    className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm shadow-teal-200"
                  >
                    <IconPlus /> Add
                  </button>
                </div>
              </div>
              {exerciseError && <p className="text-sm text-red-600 mt-3 bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2"><IconAlert className="w-4 h-4" />{exerciseError}</p>}
            </div>

            {/* Exercise List Grid */}
            {loadingExercises ? (
              <div className="text-center py-12 text-slate-500 text-sm animate-pulse bg-white rounded-2xl border border-slate-200">Loading exercises...</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exercises.map((ex) => {
                  const cfg = selected[ex.id];
                  const isEditing = editingId === ex.id;
                  return (
                    <div
                      key={ex.id}
                      className={`group relative rounded-2xl border p-5 transition-all duration-200 ${
                        cfg
                          ? "border-teal-500 bg-teal-50/30 shadow-md ring-1 ring-teal-500/20"
                          : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                      }`}
                    >
                      {/* Header: Name & Actions */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex-1">
                          {!isEditing ? (
                            <>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-slate-900">{ex.name}</h4>
                                {cfg && <span className="w-2 h-2 rounded-full bg-teal-500"></span>}
                              </div>
                              <p className="text-xs text-slate-500 leading-relaxed">{ex.description}</p>
                            </>
                          ) : (
                            <div className="space-y-2 w-full">
                              <input
                                type="text"
                                value={editingValues.name}
                                onChange={(e) => setEditingValues((s) => ({ ...s, name: e.target.value }))}
                                className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                              />
                              <input
                                type="text"
                                value={editingValues.description}
                                onChange={(e) => setEditingValues((s) => ({ ...s, description: e.target.value }))}
                                className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                              />
                            </div>
                          )}
                        </div>
                        
                        {/* Admin Actions */}
                        <div className="flex flex-col items-end gap-2">
                           {!isEditing ? (
                             <div className="flex gap-1">
                               <button onClick={() => { setEditingId(ex.id); setEditingValues({ name: ex.name, description: ex.description }); }} className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors" title="Edit">
                                 <IconEdit />
                               </button>
                               <button onClick={() => deleteExercise(ex.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                 <IconTrash />
                               </button>
                             </div>
                           ) : (
                             <div className="flex gap-1">
                               <button onClick={() => updateExercise(ex.id)} className="text-xs font-bold text-teal-600 hover:text-teal-700 px-2 py-1 bg-teal-50 rounded">Save</button>
                               <button onClick={() => { setEditingId(null); setEditingValues({ name: "", description: "" }); }} className="text-xs font-medium text-slate-500 hover:text-slate-700 px-2 py-1 bg-slate-100 rounded">Cancel</button>
                             </div>
                           )}
                          
                          {/* Checkbox for selection */}
                          <div className="mt-1">
                            <input
                              type="checkbox"
                              checked={!!cfg}
                              onChange={() => toggleSelect(ex.id)}
                              className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Config Panel (Expanded when selected) */}
                      {cfg && (
                        <div className="pt-4 border-t border-slate-200/60 space-y-3 animate-in slide-in-from-top-2 fade-in duration-200">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Sets</label>
                              <input
                                type="number"
                                value={cfg.sets}
                                min={1}
                                onChange={(e) => updateConfig(ex.id, { sets: Number(e.target.value) })}
                                className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-md text-sm font-medium focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Reps</label>
                              <input
                                type="number"
                                value={cfg.reps}
                                min={1}
                                onChange={(e) => updateConfig(ex.id, { reps: Number(e.target.value) })}
                                className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-md text-sm font-medium focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Notes</label>
                            <input
                              type="text"
                              value={cfg.notes || ""}
                              onChange={(e) => updateConfig(ex.id, { notes: e.target.value })}
                              placeholder="e.g., Tempo 2-1-2"
                              className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-md text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {!showLibrary && (
          <div className="flex justify-center mb-10">
            <button 
              onClick={() => setShowLibrary(true)} 
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600 hover:text-teal-600 hover:border-teal-300 hover:bg-teal-50 transition-all shadow-sm"
            >
              <IconBook className="w-4 h-4" /> Show Exercise Library
            </button>
          </div>
        )}

        {/* SECTION 2: Program Builder */}
        <section className="bg-slate-900 rounded-[2rem] p-1 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-white rounded-[1.75rem] p-6 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-8 border-b border-slate-100 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
                  <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                    <IconCalendar className="w-6 h-6" />
                  </div>
                  Create Training Program
                </h2>
                <p className="text-slate-500 mt-2 text-sm">Assign exercises to your client's weekly schedule.</p>
              </div>
              <div className="text-right bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100">
                 <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Selected</div>
                 <div className="text-3xl font-extrabold text-teal-600">
                   {Object.values(scheduleSelections).reduce((acc, day) => acc + Object.keys(day).length, 0)}
                 </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Client Email</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@example.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Program Title</label>
                <input
                  type="text"
                  value={programTitle}
                  onChange={(e) => setProgramTitle(e.target.value)}
                  placeholder="e.g., Phase 1 Hypertrophy"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Notes</label>
                <input
                  type="text"
                  value={programNotes}
                  onChange={(e) => setProgramNotes(e.target.value)}
                  placeholder="Client instructions"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
             <input 
               type="checkbox" 
               checked={weekly} 
               onChange={(e) => setWeekly(e.target.checked)} 
               className="w-5 h-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500" 
             />
             <div>
                <span className="text-sm font-bold text-slate-900 block">Enable Weekly Schedule Builder</span>
                <span className="text-xs text-slate-500">Allows day-by-day exercise assignment</span>
             </div>
          </div>

          {weekly && (
            <div className="grid md:grid-cols-2 gap-6">
              {days.map((d) => (
                <div key={d} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="font-bold text-slate-800 flex items-center gap-2">
                       <IconCalendar className="w-4 h-4 text-slate-400" /> {d}
                    </div>
                    <span className="text-xs font-bold bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-500 shadow-sm">
                      {Object.keys(scheduleSelections[d] || {}).length} Selected
                    </span>
                  </div>
                  
                  {/* Exercise Selector List for the Day */}
                  <div className="p-4">
                     <div className="space-y-2 max-h-48 overflow-y-auto pr-1 mb-4 custom-scrollbar">
                        {exercises.map((ex) => {
                          const cfg = (scheduleSelections[d] || {})[ex.id];
                          return (
                            <div 
                              key={ex.id} 
                              onClick={() => {
                                setScheduleSelections(prev => {
                                  const copy = { ...prev };
                                  const dayMap = { ...(copy[d] || {}) };
                                  if (dayMap[ex.id]) delete dayMap[ex.id];
                                  else dayMap[ex.id] = { sets: 3, reps: 8 };
                                  copy[d] = dayMap;
                                  return copy;
                                });
                              }}
                              className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${cfg ? 'bg-teal-50 border-teal-200 shadow-sm' : 'bg-white border-slate-200 hover:border-teal-200'}`}
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${cfg ? 'bg-teal-500 border-teal-500 text-white' : 'border-slate-300'}`}>
                                  {cfg && <IconCheck className="w-3.5 h-3.5" />}
                                </div>
                                <span className={`text-sm font-medium truncate ${cfg ? 'text-teal-900' : 'text-slate-600'}`}>{ex.name}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    {/* Details for Selected Exercises in this Day */}
                    {scheduleSelections[d] && Object.keys(scheduleSelections[d]).length > 0 && (
                      <div className="space-y-3 pt-4 border-t border-slate-100">
                        {Object.entries(scheduleSelections[d]).map(([id, cfg]) => {
                          const ex = exercises.find(e => e.id === id)!;
                          return (
                            <div key={id} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                              <div className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
                                <IconDumbbell className="w-3.5 h-3.5 text-teal-600" /> {ex.name}
                              </div>
                              <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Sets</label>
                                  <input type="number" value={cfg.sets} min={1} onChange={(e) => {
                                    const v = Number(e.target.value)||1;
                                    setScheduleSelections(prev => ({ ...prev, [d]: { ...(prev[d]||{}), [id]: { ...(prev[d]?.[id]||{}), sets: v } } }));
                                  }} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500 outline-none font-mono" />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Reps</label>
                                  <input type="number" value={cfg.reps} min={1} onChange={(e) => {
                                    const v = Number(e.target.value)||1;
                                    setScheduleSelections(prev => ({ ...prev, [d]: { ...(prev[d]||{}), [id]: { ...(prev[d]?.[id]||{}), reps: v } } }));
                                  }} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500 outline-none font-mono" />
                                </div>
                              </div>
                              <input 
                                type="text" 
                                value={cfg.notes||""} 
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setScheduleSelections(prev => ({ ...prev, [d]: { ...(prev[d]||{}), [id]: { ...(prev[d]?.[id]||{}), notes: v } } }));
                                }} 
                                placeholder="Add note (e.g. tempo 2-0-2)..." 
                                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500 outline-none" 
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-end gap-4 pt-8 border-t border-slate-100">
             <button
              onClick={() => {
                setSelected({});
                setClientEmail("");
                setProgramTitle("");
                setProgramNotes("");
                setScheduleSelections({});
              }}
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Clear Form
            </button>
            <button
              onClick={createProgram}
              className="w-full sm:w-auto px-8 py-3 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-lg shadow-teal-200 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Create Program <IconPlus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
      </div>
    </main>
  );
}
