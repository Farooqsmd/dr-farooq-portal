import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down more than 320px
      if (window.scrollY > 320) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top of page"
      title="Scroll to Top"
      className="fixed bottom-6 right-6 z-50 p-3 sm:p-3.5 rounded-2xl bg-slate-900/90 hover:bg-indigo-600 text-white shadow-2xl backdrop-blur-md border border-slate-700/80 hover:border-indigo-400 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95 cursor-pointer group print-hide no-print flex items-center justify-center animate-fadeIn ring-2 ring-white/10"
    >
      <ArrowUp className="w-5 h-5 text-slate-300 group-hover:text-white group-hover:-translate-y-0.5 transition-all" />
      <span className="sr-only">Scroll to top</span>
    </button>
  );
}
