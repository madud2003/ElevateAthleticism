"use client";

import React from 'react';

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

const IconShield = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);

const IconUser = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

export default function Football() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      
      {/* Top Navigation / Back Button */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 font-medium transition-colors text-sm group"
          >
            <IconArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Sports
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500 via-slate-900 to-slate-900"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            Gridiron Performance
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Football <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Conditioning</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Build explosive power, elite speed, and collision durability tailored for the demands of the modern game.
          </p>
        </div>
      </section>

      {/* Core Training Pillars */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Training Pillars</h2>
            <p className="mt-4 text-lg text-slate-500">Our program targets the specific energy systems and mechanics required on the field.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg hover:border-indigo-200 transition-all duration-300">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                <IconZap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Explosive Power</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Developing lower body force production for tackles, blocks, and bursting through the line of scrimmage.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>Box Squats</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>Power Cleans</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>Trap Bar Jumps</li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg hover:border-indigo-200 transition-all duration-300">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                <IconActivity className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Linear Speed</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Optimizing acceleration mechanics and max velocity for wide receivers, running backs, and defensive backs.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>Sled Drags</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>Fly 10s</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>Resisted Sprints</li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg hover:border-indigo-200 transition-all duration-300">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                <IconShield className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Collision Durability</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Strengthening the neck, shoulders, and core to absorb impact and reduce the risk of injury during contact.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>Neck Harness Work</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>Anti-Rotation Core</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>Shoulder Stability</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Position Specifics */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-10">Position Specifics</h2>
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Skill Positions Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <IconUser className="w-5 h-5 text-indigo-600" />
                Skill Positions
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                WRs, RBs, and QBs focusing on route precision, change of direction, and throwing mechanics.
              </p>
              <div className="text-xs font-semibold text-indigo-600 bg-indigo-50 w-fit px-2 py-1 rounded">Agility & Precision</div>
            </div>

            {/* Linemen Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <IconUser className="w-5 h-5 text-indigo-600" />
                Linemen
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                OL and DL focusing on leverage, raw strength, hand fighting, and explosive first steps.
              </p>
              <div className="text-xs font-semibold text-indigo-600 bg-indigo-50 w-fit px-2 py-1 rounded">Strength & Leverage</div>
            </div>

            {/* Hybrids Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <IconUser className="w-5 h-5 text-indigo-600" />
                Hybrids / LBs
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                TEs, LBs, and Safeties requiring a blend of size, speed, and high work capacity.
              </p>
              <div className="text-xs font-semibold text-indigo-600 bg-indigo-50 w-fit px-2 py-1 rounded">Power & Speed</div>
            </div>

          </div>
        </div>
      </section>

      {/* Program Structure */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Seasonal Structure</h2>
          
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 hidden md:block"></div>

            <div className="space-y-12">
              {/* Phase 1 */}
              <div className="relative md:pl-20">
                <div className="absolute left-0 top-1 w-16 h-16 bg-white border-4 border-slate-200 rounded-full flex items-center justify-center hidden md:flex z-10">
                  <span className="font-bold text-slate-500">01</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Off-Season: Size & Strength</h3>
                  <p className="text-slate-500 text-sm">
                    Focus on hypertrophy and maximal strength to build the physical base needed for the grueling season.
                  </p>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="relative md:pl-20">
                <div className="absolute left-0 top-1 w-16 h-16 bg-white border-4 border-indigo-200 rounded-full flex items-center justify-center hidden md:flex z-10 text-indigo-600">
                  <span className="font-bold">02</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Pre-Season: Power & Speed</h3>
                  <p className="text-slate-500 text-sm">
                    Converting strength into power. High intensity conditioning and sport-specific drills to prepare for camp.
                  </p>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="relative md:pl-20">
                <div className="absolute left-0 top-1 w-16 h-16 bg-white border-4 border-indigo-200 rounded-full flex items-center justify-center hidden md:flex z-10 text-indigo-600">
                  <span className="font-bold">03</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">In-Season: Maintenance</h3>
                  <p className="text-slate-500 text-sm">
                    Maintaining peak power while managing fatigue. Focus on recovery, mobility, and joint health.
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready for Game Day?</h2>
          <p className="text-slate-400 mb-10 text-lg">
            Train with the intensity required to dominate the line of scrimmage. Join our football program today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/contact" className="inline-flex justify-center items-center px-8 py-4 text-base font-bold text-white bg-indigo-600 rounded-lg shadow-lg shadow-indigo-900/50 hover:bg-indigo-500 transition-all">
              Start Training
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}