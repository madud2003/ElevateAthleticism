"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

// --- Icons ---
const IconCheck = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

const IconLogOut = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);

export default function SignOutConfirmation() {
  const router = useRouter();
  const params = useParams() as { status?: string };
  const status = params?.status || "";

  useEffect(() => {
    // optional auto-redirect after a delay
    const t = setTimeout(() => {
      router.push("/");
    }, 5000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center relative overflow-hidden">
        
        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-teal-50 rounded-full blur-2xl opacity-50"></div>

        {/* Icon Container */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 mb-6 relative z-10">
          {status === "success" ? (
            <IconCheck className="h-8 w-8 text-teal-600" />
          ) : (
            <IconLogOut className="h-8 w-8 text-teal-600" />
          )}
        </div>

        {/* Content */}
        {status === "success" ? (
          <>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">You are signed out</h1>
            <p className="text-slate-500 leading-relaxed mb-8">You have been successfully logged out of your account.</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">Signed out</h1>
            <p className="text-slate-500 leading-relaxed mb-8">Your session has ended securely.</p>
          </>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 relative z-10">
          <button 
            onClick={() => router.push("/")} 
            className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors w-full sm:w-auto"
          >
            Back to Home
          </button>
          <button 
            onClick={() => router.push("/sign-in")} 
            className="inline-flex justify-center items-center px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors w-full sm:w-auto"
          >
            Sign In
          </button>
        </div>

        {/* Redirect Timer */}
        <p className="mt-6 text-xs text-slate-400 font-medium flex items-center justify-center gap-1">
          <svg className="animate-spin h-3 w-3 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Redirecting to home in 5s...
        </p>
      </div>
    </main>
  );
}