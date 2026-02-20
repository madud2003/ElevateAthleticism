"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs";


export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const lastY = useRef(0);
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [accountOpen, setAccountOpen] = useState(false);
  const prevSignedIn = useRef<boolean | null>(null);
  const prevPathname = useRef<string | null>(null);

  const email =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "";

  useEffect(() => {
    // Track previous pathname in sessionStorage so pages can navigate back reliably
    try {
      if (prevPathname.current && pathname && prevPathname.current !== pathname) {
        sessionStorage.setItem('lastPath', prevPathname.current);
      }
      prevPathname.current = pathname || null;
    } catch {
      // ignore sessionStorage failures
    }

    const HIDE_THRESHOLD = 90; // pixels scrolled before hiding header
    const SHRINK_THRESHOLD = 40; // pixels scrolled before shrink
    let ticking = false;

    const onScroll = () => {
      const y = window.scrollY;
      // throttle with rAF
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(y > SHRINK_THRESHOLD);

          // apply hide-on-scroll globally (tuned threshold)
          if (y > lastY.current && y > HIDE_THRESHOLD) {
            setHidden(true);
          } else if (y < lastY.current) {
            setHidden(false);
          }

          // parallax: apply small translate to hero-media if present
          const hero = document.querySelector('.hero-media') as HTMLElement | null;
          if (hero) {
            const offset = Math.min(Math.max(window.scrollY / 3, -80), 200);
            hero.style.transform = `translateY(${offset * 0.08}px)`;
          }

          ticking = false;
        });
        ticking = true;
      }

      lastY.current = y;
    };

    // Reveal-on-scroll: intersection observer for elements with .reveal-on-scroll
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.12 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          el.classList.add('in-view');
          observer.unobserve(el);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    // detect sign-in transition to record login event
    if (prevSignedIn.current === false && isSignedIn) {
      (async () => {
        try {
          await fetch('/api/session-events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, type: 'login' }),
          });
        } catch {
          // ignore
        }
      })();
    }
    prevSignedIn.current = !!isSignedIn;
  }, [isSignedIn, email]);

  return (
    <>
      {/* Modern Sticky Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'scrolled shrink bg-background-secondary/95 shadow-md' : 'bg-background-secondary'} ${hidden ? 'hide' : ''}`}>
        <div className="site-inner flex items-center justify-between px-4 md:px-6 py-4">
          <a href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Logo" width={32} height={32} className="h-8 w-8" />
            <span className="text-xl font-extrabold text-primary tracking-tight">ELEVATEATHLETISM</span>
          </a>
          <nav className="hidden md:flex gap-8 items-center">
            <a href="/" className="text-text-secondary hover:text-primary font-medium transition">Home</a>
            <a href="/our-story" className="text-text-secondary hover:text-primary font-medium transition">About</a>
            <a href="/sports" className="text-text-secondary hover:text-primary font-medium transition">Programs</a>
            <a href="/contact" className="text-text-secondary hover:text-primary font-medium transition">Contact</a>
          </nav>
          <div className="flex gap-4 items-center">
            <SignedIn>
              <div className="relative">
                <button onClick={() => setAccountOpen((s) => !s)} className="flex items-center gap-2 px-4 py-2 border rounded-md bg-background">
                  <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">{(user?.firstName || email || "U").charAt(0)}</span>
                  <span className="hidden md:inline-block">{user?.firstName || email}</span>
                </button>
                {accountOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md p-2 z-50">
                    <a href="/dashboard" className="block px-3 py-2 hover:bg-gray-50 rounded">Dashboard</a>
                    <a href="/settings" className="block px-3 py-2 hover:bg-gray-50 rounded">Profile</a>
                    <button
                        onClick={async () => {
                          try {
                            await fetch('/api/session-events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, type: 'logout' }) });
                          } catch {
                            // ignore
                          }
                          await signOut();
                          router.push("/sign-out/success");
                        }}
                        className="w-full text-left px-3 py-2 mt-1 text-red-600 hover:bg-gray-50 rounded"
                      >
                        Logout
                      </button>
                  </div>
                )}
              </div>
            </SignedIn>
            <SignedOut>
              <a href="/register">
                <button className="btn-primary px-6 py-2 text-base">Get Started</button>
              </a>
              <a href="/sign-in" className="hidden md:inline-block">
                <button className="btn-secondary px-6 py-2 text-base">Sign In</button>
              </a>
            </SignedOut>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <div className="w-full flex flex-col min-h-screen bg-background">
        <main className="flex-1 py-0 w-full">
          <div className="site-inner w-full">{children}</div>
        </main>
        {/* Professional Footer (hidden on admin routes) */}
        {!isAdminRoute && (
          <footer className="bg-background-secondary border-t border-border-color py-12 px-6 mt-auto">
            <div className="site-inner grid md:grid-cols-4 gap-12">
            {/* Brand */}
            <div>
              <a href="/" className="flex items-center gap-2 mb-4">
                <Image src="/logo.svg" alt="Logo" width={32} height={32} className="h-8 w-8" />
                <span className="text-xl font-extrabold text-primary tracking-tight">ELEVATEATHLETISM</span>
              </a>
              <p className="text-text-secondary mb-4">Empowering you to achieve your best self with expert coaching, nutrition, and a supportive community.</p>
            </div>
            {/* Navigation */}
            <div>
              <h4 className="text-foreground font-bold mb-6 text-lg">Navigation</h4>
              <ul className="space-y-3">
                <li><a href="/" className="text-text-secondary hover:text-primary transition-colors">Home</a></li>
                <li><a href="/our-story" className="text-text-secondary hover:text-primary transition-colors">About</a></li>
                <li><a href="/sports" className="text-text-secondary hover:text-primary transition-colors">Programs</a></li>
                <li><a href="/contact" className="text-text-secondary hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            {/* Contact Info */}
            <div>
              <h4 className="text-foreground font-bold mb-6 text-lg">Contact</h4>
              <ul className="space-y-3">
                <li className="flex gap-2 items-start">
                  <span>📧</span>
                  <a href="mailto:info@elevateathletism.com" className="text-text-secondary hover:text-primary transition-colors">info@elevateathletism.com</a>
                </li>
                <li className="flex gap-2 items-start">
                  <span>📞</span>
                  <a href="tel:+1234567890" className="text-text-secondary hover:text-primary transition-colors">+1 (234) 567-890</a>
                </li>
                <li className="flex gap-2 items-start">
                  <span>📍</span>
                  <span className="text-text-secondary">456 Power St, Muscle City, MC 67890</span>
                </li>
              </ul>
            </div>
            {/* Social Links */}
            <div>
              <h4 className="text-foreground font-bold mb-6 text-lg">Connect</h4>
              <div className="flex gap-6">
                <a href="#" className="text-2xl text-text-secondary hover:text-primary transition-colors">f</a>
                <a href="#" className="text-2xl text-text-secondary hover:text-primary transition-colors">𝕏</a>
                <a href="#" className="text-2xl text-text-secondary hover:text-primary transition-colors">📷</a>
                <a href="#" className="text-2xl text-text-secondary hover:text-primary transition-colors">▶️</a>
              </div>
            </div>
            </div>
            <div className="border-t border-border-color pt-8 text-center mt-12">
              <p className="text-sm text-text-light">© 2026 ELEVATEATHLETISM. All rights reserved.</p>
            </div>
          </footer>
        )}
      </div>
    </>
  );
}

