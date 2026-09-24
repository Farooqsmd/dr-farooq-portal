import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  FileText, 
  User, 
  Menu, 
  X, 
  Cpu, 
  Lightbulb, 
  GraduationCap,
  ExternalLink,
  ChevronDown,
  FolderDown
} from 'lucide-react';
import YoutubeIcon from './icons/YoutubeIcon';
import { PROFESSOR_PROFILE } from '../data/profileData';

export default function Navbar({ activeTab, setActiveTab, dynamicMetrics, onOpenCV }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const m = dynamicMetrics || PROFESSOR_PROFILE.metrics;
  const badgeLabel = `${m?.patentsDisplay || '12'} | ${m?.scopusDisplay || '39'}`;

  const navItems = [
    { id: 'about', label: 'About', icon: User },
    { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
    { id: 'materials', label: 'Course Vault', icon: FolderDown, badge: 'Drive' },
    { id: 'ai-tutor', label: 'AI Tutor', icon: Sparkles, pulse: true },
    { id: 'ats-checker', label: 'Placement', icon: FileText },
    { id: 'research', label: 'Research & Patents', icon: Lightbulb, badge: badgeLabel }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/90 shadow-2xs w-full">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-1.5 sm:gap-2 lg:gap-3">
          
          {/* Brand: Official Photo Avatar, Name & Compact Subtitle */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer group shrink-0 select-none mr-1 lg:mr-2" 
            onClick={() => setActiveTab('about')}
          >
            {/* Dr. Farooq's Photo Avatar */}
            <div className="relative shrink-0">
              <img 
                src="/dr-farooq.jpg" 
                alt="Dr. S. Md. Farooq" 
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover ring-2 ring-indigo-500/20 shadow-sm group-hover:ring-indigo-600 transition-all duration-200 group-hover:scale-105"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div 
                style={{ display: 'none' }}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 items-center justify-center text-white"
              >
                <Cpu className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" title="Active" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors whitespace-nowrap">
                  {PROFESSOR_PROFILE.name}
                </span>
                <span className="hidden sm:inline-flex items-center space-x-1 px-1.5 py-0.2 text-[9px] font-extrabold bg-blue-50 text-blue-800 rounded border border-blue-200/80 uppercase">
                  <span>Ph.D.</span>
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium tracking-tight whitespace-nowrap">
                HOD – CSE • SREC<span className="hidden xl:inline"> (Autonomous)</span>
              </p>
            </div>
          </div>

          {/* Desktop Navigation - Clean, Sleek, Compact Segmented Bar */}
          <nav className="hidden lg:flex items-center p-0.5 xl:p-1 rounded-xl bg-slate-100/90 border border-slate-200 shadow-inner space-x-0.5 xl:space-x-1 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.id === 'about') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                      const el = document.getElementById('main-content');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`flex items-center space-x-1 xl:space-x-1.5 px-2 xl:px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 whitespace-nowrap cursor-pointer select-none ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/80 ring-1 ring-indigo-500/10'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>
                    {item.id === 'research' ? (
                      <>
                        <span className="xl:hidden">Research</span>
                        <span className="hidden xl:inline">Research & Patents</span>
                      </>
                    ) : item.label}
                  </span>

                  {item.pulse && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}

                  {item.badge && (
                    <span className={`text-[9px] font-extrabold px-1 xl:px-1.5 py-0.2 rounded-md border whitespace-nowrap ${
                      isActive 
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                        : 'bg-purple-50 text-purple-700 border-purple-200'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Quick Profiles Dropdown & Ask AI CTA */}
          <div className="hidden md:flex items-center space-x-1.5 xl:space-x-2 shrink-0">
            
            {/* Quick Profiles Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-1 px-2 xl:px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer select-none"
              >
                <span>Profiles</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {profileDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <p className="text-[10px] font-extrabold uppercase text-slate-400 px-2 py-1 tracking-wider">
                    Verified Profiles
                  </p>
                  {PROFESSOR_PROFILE.researchProfiles.map((prof) => (
                    <a
                      key={prof.name}
                      href={prof.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                    >
                      <span className="font-bold">{prof.name}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* YouTube Channel Button */}
            <a
              href={PROFESSOR_PROFILE.youtube || "https://www.youtube.com/@farooktechtricks"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-2 xl:px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs"
              title="Visit Dr. Farooq's YouTube Channel: Farook Tech Tricks (@farooktechtricks)"
            >
              <YoutubeIcon className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span className="hidden xl:inline">YouTube</span>
            </a>

            {/* 1-Click Academic CV Button */}
            <button
              onClick={onOpenCV}
              className="flex items-center space-x-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs"
              title="Generate & Download 1-Click Academic CV (PDF)"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span><span className="hidden xl:inline">Academic </span>CV</span>
            </button>

            {/* Quick AI CTA */}
            <button
              onClick={() => setActiveTab('ai-tutor')}
              className="flex items-center space-x-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-sm transition-all transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
              <span>Ask AI</span>
            </button>
          </div>

          {/* Mobile menu toggle button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1.5 shadow-xl animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                  if (item.id === 'about') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    const el = document.getElementById('main-content');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Mobile YouTube Channel Button */}
          <a
            href={PROFESSOR_PROFILE.youtube || "https://www.youtube.com/@farooktechtricks"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center space-x-2 px-3.5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200 shadow-2xs hover:bg-red-100 transition-all cursor-pointer mb-2"
          >
            <YoutubeIcon className="w-4 h-4 text-red-600" />
            <span>YouTube: Farook Tech Tricks</span>
          </a>

          {/* Mobile 1-Click Academic CV Button */}
          <button
            onClick={() => {
              if (onOpenCV) onOpenCV();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center space-x-2 px-3.5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border border-indigo-200 shadow-2xs hover:bg-indigo-100 transition-all cursor-pointer mb-2"
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Download Official Academic CV</span>
          </button>

          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Research Profiles:</span>
            <div className="flex space-x-1.5">
              {PROFESSOR_PROFILE.researchProfiles.slice(0, 3).map((prof) => (
                <a
                  key={prof.name}
                  href={prof.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 text-xs font-bold text-slate-700 bg-slate-100 rounded hover:bg-indigo-50 hover:text-indigo-700"
                >
                  {prof.name.split(' ')[0]}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
