import React from 'react';

const IconArrowLeft = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);

const sports = [
  {
    name: "Football",
    description: "Build explosive power, speed, and endurance for elite performance",
    icon: "🏈"
  },
  {
    name: "Cricket",
    description: "Develop strength, flexibility, and stamina for match excellence",
    icon: "🏏"
  },
  {
    name: "Basketball",
    description: "Enhance vertical jump, agility, and muscular endurance",
    icon: "🏀"
  },
  {
    name: "Athletics",
    description: "Optimize performance in sprints, jumps, and throws",
    icon: "🏃"
  }
];

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

export default function Sports() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      
      {/* Navbar / Back Button */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 font-medium transition-colors text-sm"
          >
            <IconArrowLeft className="w-4 h-4" />
            Back to Home
          </a>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div> {/* Optional background pattern */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Sports We Specialize In<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400"></span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Expert coaching across multiple disciplines designed to unlock your athletic potential.
          </p>
        </div>
      </section>

      {/* Sports Grid Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sports.map((sport) => (
              <a 
                key={sport.name} 
                href={`/sports/${slugify(sport.name)}`} 
                className="group block h-full"
              >
                <div className="bg-white rounded-2xl p-8 h-full border border-slate-200 shadow-sm hover:shadow-xl hover:border-teal-200 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden">
                  
                  {/* Hover effect background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Icon Container */}
                  <div className="relative z-10 w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-5xl mb-6 group-hover:scale-110 group-hover:bg-teal-50 transition-all duration-300 shadow-inner border border-slate-100">
                    {sport.icon}
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-teal-700 transition-colors">
                      {sport.name}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">
                      {sport.description}
                    </p>
                    <div className="text-teal-600 font-semibold text-sm flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 group-hover:gap-2 transition-all">
                      Learn more <span aria-hidden="true">→</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 bg-teal-500/10 rounded-full mb-6">
            <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Elevate Your Game?</h2>
          <p className="text-slate-400 mb-10 text-lg">Join thousands of athletes who have transformed their performance with our specialized programs.</p>
          <a href="/register">
            <button className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-teal-600 rounded-lg shadow-lg shadow-teal-900/50 hover:bg-teal-500 hover:shadow-teal-900/80 hover:-translate-y-1 transition-all duration-200">
              Start Your Program
            </button>
          </a>
        </div>
      </section>

    </main>
  );
}