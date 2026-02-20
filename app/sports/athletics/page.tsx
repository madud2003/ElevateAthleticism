"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

// --- Icons ---
const IconArrowLeft = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);

const IconZap = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);

const IconActivity = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
);

const IconTarget = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);

export default function Athletics() {
  const router = useRouter();

  const handleBack = () => {
    try {
      const last = sessionStorage.getItem('lastPath');
      if (last && last !== window.location.pathname) {
        router.push(last);
        return;
      }
    } catch {
      // ignore
    }

    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/sports');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      
      {/* Top Navigation / Back Button */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 font-medium transition-colors text-sm group"
          >
            <IconArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Sports
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-20 lg:py-28 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-400 via-slate-900 to-slate-900"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-teal-400 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
            Elite Performance
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Athletics <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">Conditioning</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Optimize sprinting, jumping, and throwing performance through biomechanical analysis and periodized strength training.
          </p>
        </div>
      </section>

      {/* Core Training Pillars */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Training Pillars</h2>
            <p className="mt-4 text-lg text-slate-500">Our methodology focuses on three fundamental aspects of track and field success.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg hover:border-teal-200 transition-all duration-300">
              <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 mb-6">
                <IconZap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Speed Mechanics</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Refining acceleration, maximum velocity, and speed endurance. We focus on ground contact times and force application.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>Acceleration Drills</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>Max Velocity Mechanics</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>Fly Sprints</li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg hover:border-teal-200 transition-all duration-300">
              <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 mb-6">
                <IconActivity className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Explosive Power</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Developing the rate of force development (RFD) crucial for jumping and throwing events through plyometrics and Olympic lifting.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>Plyometric Progressions</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>Olympic Lifting (Clean/Snatch)</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>Complex Training</li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg hover:border-teal-200 transition-all duration-300">
              <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 mb-6">
                <IconTarget className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Event Specificity</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Tailored conditioning plans that mimic the metabolic demands of specific disciplines, from 100m sprints to the Decathlon.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>Lactate Threshold Training</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>Rotational Power</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>Technical Drill Integration</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Disciplines Breakdown */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-10">Discipline Focus</h2>
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Sprints Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">⚡️</span> Sprints & Hurdles
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Focus on block starts, hurdle clearance technique, and maintaining top-end speed through the finish line.
              </p>
              <div className="text-xs font-semibold text-teal-600 bg-teal-50 w-fit px-2 py-1 rounded">Anaerobic Power</div>
            </div>

            {/* Jumps Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">🦘</span> Horizontal & Vertical Jumps
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Improving approach run consistency, take-off angles, and landing mechanics for Long Jump, Triple Jump, and High Jump.
              </p>
              <div className="text-xs font-semibold text-teal-600 bg-teal-50 w-fit px-2 py-1 rounded">Elasticity & Coordination</div>
            </div>

            {/* Throws Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">💪</span> Throws
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Building rotational strength and kinetic chaining for Shot Put, Discus, Javelin, and Hammer throw.
              </p>
              <div className="text-xs font-semibold text-teal-600 bg-teal-50 w-fit px-2 py-1 rounded">Core Stability & Force</div>
            </div>

          </div>
        </div>
      </section>

      {/* Program Structure */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Program Structure</h2>
          
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 hidden md:block"></div>

            <div className="space-y-12">
              {/* Phase 1 */}
              <div className="relative md:pl-20">
                <div className="absolute left-0 top-1 w-16 h-16 bg-white border-4 border-slate-200 rounded-full flex items-center justify-center hidden md:flex z-10">
                  <span className="font-bold text-slate-500">01</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Foundation & Assessment</h3>
                  <p className="text-slate-500 text-sm">
                    Establish baseline mobility, force production capabilities, and movement patterns. Corrective exercises to fix imbalances.
                  </p>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="relative md:pl-20">
                <div className="absolute left-0 top-1 w-16 h-16 bg-white border-4 border-teal-200 rounded-full flex items-center justify-center hidden md:flex z-10 text-teal-600">
                  <span className="font-bold">02</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Strength Accumulation</h3>
                  <p className="text-slate-500 text-sm">
                    Focus on maximal strength and hypertrophy to build the "engine" required for explosive power output.
                  </p>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="relative md:pl-20">
                <div className="absolute left-0 top-1 w-16 h-16 bg-white border-4 border-teal-200 rounded-full flex items-center justify-center hidden md:flex z-10 text-teal-600">
                  <span className="font-bold">03</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Power & Peaking</h3>
                  <p className="text-slate-500 text-sm">
                    Convert strength into speed. High-intensity plyometrics, sport-specific drills, and tapering for competition.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Break Your Personal Best?</h2>
          <p className="text-slate-400 mb-10 text-lg">
            Join our athletics program and train with the same methodologies used by Olympic-level coaches.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/contact" className="inline-flex justify-center items-center px-8 py-4 text-base font-bold text-white bg-teal-600 rounded-lg shadow-lg shadow-teal-900/50 hover:bg-teal-500 transition-all">
              Start Training
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
