import React from 'react';
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      
        {/* Hero Section - Split Screen */}
        <section className="relative bg-white border-b border-slate-200 overflow-hidden reveal-on-scroll">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              
              {/* Left Content */}
              <div className="space-y-8 max-w-2xl">
                <div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-100 mb-4">
                    Transform Your Fitness
                  </span>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                    Achieve Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500">Best Self</span>
                    <br /> With Expert Coaching
                  </h1>
                </div>
                
                <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
                  Personalized fitness, nutrition, and lifestyle programs designed by certified professionals. Join a thriving community and unlock your true potential.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <a href="/register" className="inline-flex justify-center items-center px-8 py-4 text-base font-semibold text-white bg-teal-600 rounded-lg shadow-sm shadow-teal-200 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all">
                    Get Started
                  </a>
                  <a href="/sports" className="inline-flex justify-center items-center px-8 py-4 text-base font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-teal-700 transition-all">
                    View Programs
                  </a>
                </div>
              </div>

              {/* Right Media */}
              <div className="relative lg:h-[600px] flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-50 to-cyan-50 rounded-3xl transform -rotate-3 scale-95 opacity-50"></div>
                <div className="relative w-full h-full bg-slate-100 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex items-center justify-center hero-media">
                  <Image src="/CoachB.jpg" alt="CoachB" fill className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" aria-hidden="true" />
                    <div className="relative text-center px-4">
                      <h2 className="text-white text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-wide drop-shadow-lg">CoachB</h2>
                      <p className="mt-2 text-white/80 text-sm sm:text-base uppercase tracking-wider drop-shadow">Head Coach</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 reveal-on-scroll">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Why Choose ELEVATEATHLETISM?</h2>
            <p className="mt-4 text-lg text-slate-500">We combine science with sweat to deliver results that last.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow feature-card text-center">
              <div className="w-16 h-16 mx-auto bg-teal-50 rounded-2xl flex items-center justify-center mb-6 text-teal-600">
                 <Image src="/coach.svg" alt="Expert Coaches" width={32} height={32} className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Certified Expert Coaches</h3>
              <p className="text-slate-500 leading-relaxed">Work with top-tier professionals who guide you every step of the way.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow feature-card text-center">
              <div className="w-16 h-16 mx-auto bg-teal-50 rounded-2xl flex items-center justify-center mb-6 text-teal-600">
                <Image src="/nutrition.svg" alt="Personalized Nutrition" width={32} height={32} className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Personalized Nutrition</h3>
              <p className="text-slate-500 leading-relaxed">Get meal plans tailored to your goals, preferences, and lifestyle.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow feature-card text-center">
              <div className="w-16 h-16 mx-auto bg-teal-50 rounded-2xl flex items-center justify-center mb-6 text-teal-600">
                <Image src="/community.svg" alt="Supportive Community" width={32} height={32} className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Supportive Community</h3>
              <p className="text-slate-500 leading-relaxed">Join a vibrant community for motivation, accountability, and support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ELEVATEATHLETISM / Program Sections */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200 reveal-on-scroll">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-teal-600 font-bold tracking-wider uppercase text-sm">The System</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-6">THE GLOBAL FAST BOWLING PERFORMANCE SYSTEM</h2>
              <p className="text-lg text-slate-500 mb-8">A comprehensive, science-backed pathway that develops pace, skill and resilience for bowlers at every level.</p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M8 12l2.5 2L16 9" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Assessment</h4>
                    <p className="text-slate-500 text-sm mt-1">Comprehensive baseline testing to understand physical capabilities.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h18" strokeLinecap="round" /><rect x="6" y="10" width="12" height="8" rx="2" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Individual Plan</h4>
                    <p className="text-slate-500 text-sm mt-1">Custom training blocks designed specifically for your biomechanics.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" strokeLinecap="round" /><path d="M18 7l-5 5-3-3-4 4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Progress Tracking</h4>
                    <p className="text-slate-500 text-sm mt-1">Data-driven adjustments to ensure continuous improvement.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-100 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 relative z-10">PRESCRIPTION FIRST</h3>
              <p className="text-slate-500 mb-6 relative z-10">Personalised assessments and training prescriptions to prioritise high-impact interventions.</p>
              <ul className="space-y-4 relative z-10">
                {['Screening & baseline testing', 'Individualised load management', 'Targeted technical cues'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 reveal-on-scroll">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-slate-900 mb-4">CHOOSE YOUR ROUTE</h3>
          <p className="text-slate-500 max-w-2xl mx-auto mb-12">Flexible pathways: player programmes, coach education, or partner integrations to fit your goals.</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="3" /><path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" /></svg>
              </div>
              <h4 className="font-bold text-lg text-slate-900 mb-2">Player Route</h4>
              <p className="text-sm text-slate-500">Direct access to elite training methodologies and coaching support.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="7" r="4" /></svg>
              </div>
              <h4 className="font-bold text-lg text-slate-900 mb-2">Coach Route</h4>
              <p className="text-sm text-slate-500">Education tracks designed to certify and mentor the next generation of coaches.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 12h8" strokeLinecap="round" /></svg>
              </div>
              <h4 className="font-bold text-lg text-slate-900 mb-2">Partner Route</h4>
              <p className="text-sm text-slate-500">Integrate our performance systems into your club or institution.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200 reveal-on-scroll">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">LEARN THE METHOD</h3>
            <p className="text-slate-500 max-w-2xl mx-auto">Access our method library — drills, metrics and video breakdowns used by elite coaches.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Drill Packs', desc: 'Curated libraries of movement drills.', icon: 'M3 3v18h18' },
              { title: 'Metrics', desc: 'Key performance indicators and benchmarks.', icon: 'M3 3v18h18 M18 7l-5 5-3-3-4 4' },
              { title: 'Video Library', desc: 'Technical breakdowns and analysis.', icon: 'M3 3v18h18' }
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-6 border border-slate-100 hover:border-teal-200 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-teal-600 shadow-sm">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={item.icon} strokeLinecap="round" /></svg>
                  </div>
                  <h5 className="font-bold text-slate-900">{item.title}</h5>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 reveal-on-scroll">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold text-slate-900 mb-6">PLAYER PROGRAMMES</h3>
              <p className="text-slate-500 mb-8">Structured, periodised player programmes targeting speed, skill and recovery.</p>
              <div className="space-y-4">
                {[
                  { name: 'Foundation', level: 'Beginner', color: 'bg-blue-100 text-blue-700' },
                  { name: 'Development', level: 'Intermediate', color: 'bg-indigo-100 text-indigo-700' },
                  { name: 'Elite', level: 'Advanced', color: 'bg-teal-100 text-teal-700' }
                ].map((prog, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between hover:border-teal-300 transition-colors cursor-pointer">
                    <div>
                      <h4 className="font-bold text-slate-900">{prog.name}</h4>
                      <p className="text-xs text-slate-500">{prog.level} friendly programme outline.</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${prog.color}`}>
                      {prog.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">COACH EDUCATION</h3>
              <p className="text-slate-500 mb-8">Practical courses and certifications to upskill coaches with evidence-based practice.</p>
              <ul className="space-y-4">
                {['Short workshops', 'Accredited courses', 'Mentorship programmes'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                    {item}
                  </li>
                ))}
              </ul>
              <button className="mt-8 w-full py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors">
                View Curriculum
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200 reveal-on-scroll">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-slate-900 mb-4">PARTNER WITH ELEVATEATHLETISM</h3>
          <p className="text-slate-500 max-w-2xl mx-auto mb-12">Collaborate with our performance team for research, delivery and product integrations.</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {[1, 2, 3].map((item) => (
              <div key={item} className="w-32 h-16 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                <span className="text-slate-400 font-bold text-sm">LOGO {item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 reveal-on-scroll">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-slate-900 mb-6 text-center">RESULTS AND PROOF</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex gap-6 items-start">
              <div className="p-3 bg-teal-50 rounded-full text-teal-600">
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3v18h18" strokeLinecap="round" /><path d="M7 13l3-3 5 5 4-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div>
                <h4 className="font-bold text-lg text-slate-900">Case Study 1</h4>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">Summary of results showing 15% velocity increase over 12 weeks using our assessment protocols.</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex gap-6 items-start">
              <div className="p-3 bg-teal-50 rounded-full text-teal-600">
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="4" /></svg>
              </div>
              <div>
                <h4 className="font-bold text-lg text-slate-900">Case Study 2</h4>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">Injury reduction data from our partner academy showing a 40% decrease in soft tissue injuries.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white reveal-on-scroll">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">THE ELEVATEATHLETISM METHOD</h3>
              <p className="text-slate-400 mb-8 text-lg">Our step-by-step framework combining data, coaching and targeted interventions.</p>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center font-bold text-sm">1</span>
                    <span className="font-medium">Assess</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm">2</span>
                    <span className="font-medium text-slate-300">Prescribe</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm">3</span>
                    <span className="font-medium text-slate-300">Deliver</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm">4</span>
                    <span className="font-medium text-slate-300">Measure</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
              <h4 className="text-xl font-bold mb-4 text-teal-400">GLOBAL DELIVERY</h4>
              <p className="text-slate-300 mb-6">Delivery partners and accredited locations worldwide — get started locally or remotely.</p>
              <div className="flex flex-wrap gap-2">
                {['London', 'Melbourne', 'Mumbai', 'Cape Town', 'Remote'].map((loc) => (
                  <span key={loc} className="px-3 py-1 rounded-full bg-slate-700 text-sm text-slate-200 border border-slate-600">
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 reveal-on-scroll">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-slate-900 mb-6">LATEST UPDATES</h3>
          <p className="text-slate-500 max-w-2xl mx-auto mb-12">News, product updates and research — stay informed with our latest developments.</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {['Update 1 — New biomechanics module released.', 'Update 2 — Summer training camp dates announced.', 'Update 3 — Integration with latest wearables.'].map((update, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 text-left hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                  <span className="text-xs font-bold text-slate-400 uppercase">News</span>
                </div>
                <p className="text-slate-700 font-medium text-sm leading-relaxed">{update}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white reveal-on-scroll">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">START HERE</h2>
          <p className="text-xl text-slate-500 mb-10">Choose your route and begin a personalised performance journey backed by ELEVATEATHLETISM.</p>
          <div className="flex justify-center">
            <a href="/register" className="inline-flex justify-center items-center px-10 py-4 text-lg font-bold text-white bg-teal-600 rounded-xl shadow-lg shadow-teal-200 hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-300 transform hover:-translate-y-0.5 transition-all">
              Get Started
            </a>
          </div>
        </div>
      </section>

      {/* Success Metrics Section */}
      <section className="bg-slate-900 py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800 reveal-on-scroll">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {[
            { val: '10,000+', label: 'Transformations' },
            { val: '200+', label: 'Certified Coaches' },
            { val: '98%', label: 'Client Satisfaction' },
            { val: '24/7', label: 'Support' }
          ].map((stat, i) => (
            <div key={i} className="pt-8 md:pt-0">
              <div className="text-4xl font-extrabold text-teal-400 mb-2 tracking-tight">{stat.val}</div>
              <p className="text-slate-400 font-medium uppercase tracking-wider text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 reveal-on-scroll">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-slate-900">Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Anjali Kapoor', role: 'Entrepreneur', text: 'My coach helped me lose 20kg and build confidence. The support is unmatched!', init: 'AK' },
              { name: 'Ravi Sharma', role: 'Athlete', text: 'The personalized plan and consistent coaching helped me reach peak performance for my sport.', init: 'RS' },
              { name: 'Maya Khan', role: 'Student', text: 'Supportive coaches and a great community — I stayed consistent and finally saw results.', init: 'MK' }
            ].map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="flex gap-1 mb-6 text-teal-500 text-lg">★★★★★</div>
                <p className="text-slate-600 mb-8 italic flex-grow leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                  <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center font-bold text-teal-700 text-sm border border-teal-100">
                    {t.init}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{t.name}</p>
                    <p className="text-sm text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
