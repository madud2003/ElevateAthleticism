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

const IconTarget = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);

const IconUser = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

export default function Basketball() {
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
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500 via-slate-900 to-slate-900"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-orange-400 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
            Court Dominance
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Basketball <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">Performance</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Elevate your game with specialized training in vertical jump, lateral agility, and explosive power generation.
          </p>
        </div>
      </section>

      {/* Core Training Pillars */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Training Pillars</h2>
            <p className="mt-4 text-lg text-slate-500">Our methodology targets the specific physical demands of the modern game.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg hover:border-orange-200 transition-all duration-300">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6">
                <IconZap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Vertical Explosion</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Maximizing your vertical leap through plyometrics, triple extension mechanics, and posterior chain strength.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>Depth Jumps</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>Trap Bar Deadlifts</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>Single Leg Power</li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg hover:border-orange-200 transition-all duration-300">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6">
                <IconActivity className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Lateral Agility</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Improving first-step quickness, change of direction, and defensive sliding mechanics to stay in front of opponents.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>Pro Agility Drills</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>Lateral Bounds</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>Deceleration Training</li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg hover:border-orange-200 transition-all duration-300">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6">
                <IconTarget className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Game Conditioning</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Building the aerobic and anaerobic capacity required to maintain high intensity through all four quarters.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>Interval Suicides</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>On-Court Movement</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>Active Recovery</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Position-Specific Focus */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-10">Position Specifics</h2>
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Guards Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <IconUser className="w-5 h-5 text-orange-500" />
                Guards
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Focus on linear speed, handle stamina, and change of direction to navigate tight spaces and break down defenses.
              </p>
              <div className="text-xs font-semibold text-orange-600 bg-orange-50 w-fit px-2 py-1 rounded">Speed & Agility</div>
            </div>

            {/* Wings Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <IconUser className="w-5 h-5 text-orange-500" />
                Wings
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Hybrid training focusing on vertical explosiveness for finishing at the rim and lateral stability for elite perimeter defense.
              </p>
              <div className="text-xs font-semibold text-orange-600 bg-orange-50 w-fit px-2 py-1 rounded">Versatility & Power</div>
            </div>

            {/* Bigs Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <IconUser className="w-5 h-5 text-orange-500" />
                Posts / Bigs
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Developing raw strength, core stability for boxing out, and lower body power for rebounding and finishing through contact.
              </p>
              <div className="text-xs font-semibold text-orange-600 bg-orange-50 w-fit px-2 py-1 rounded">Strength & Contact</div>
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
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Off-Season: Hypertrophy & Base</h3>
                  <p className="text-slate-500 text-sm">
                    Building lean muscle mass and correcting imbalances. Focus on movement quality and aerobic capacity.
                  </p>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="relative md:pl-20">
                <div className="absolute left-0 top-1 w-16 h-16 bg-white border-4 border-orange-200 rounded-full flex items-center justify-center hidden md:flex z-10 text-orange-600">
                  <span className="font-bold">02</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Pre-Season: Strength & Power</h3>
                  <p className="text-slate-500 text-sm">
                    Converting muscle into force. High intensity lifting and sport-specific conditioning to prepare for camp.
                  </p>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="relative md:pl-20">
                <div className="absolute left-0 top-1 w-16 h-16 bg-white border-4 border-orange-200 rounded-full flex items-center justify-center hidden md:flex z-10 text-orange-600">
                  <span className="font-bold">03</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">In-Season: Maintenance</h3>
                  <p className="text-slate-500 text-sm">
                    Maintaining power output while managing fatigue. Low volume, high intensity sessions to support game performance.
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Dominate the Court?</h2>
          <p className="text-slate-400 mb-10 text-lg">
            Train like a pro. Our basketball-specific programs are designed to take your game to the next level.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/contact" className="inline-flex justify-center items-center px-8 py-4 text-base font-bold text-white bg-orange-500 rounded-lg shadow-lg shadow-orange-900/50 hover:bg-orange-600 transition-all">
              Start Training
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}