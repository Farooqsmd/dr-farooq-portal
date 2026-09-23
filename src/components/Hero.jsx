import React from 'react';
import { 
  GraduationCap, 
  Cpu, 
  Database, 
  IdCard, 
  Share2, 
  Sparkles, 
  FileText, 
  Award, 
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Lightbulb,
  FolderDown
} from 'lucide-react';
import { PROFESSOR_PROFILE } from '../data/profileData';

const iconMap = {
  GraduationCap,
  Cpu,
  Database,
  IdCard,
  Share2
};

export default function Hero({ setActiveTab, dynamicMetrics, onOpenCV }) {
  const m = dynamicMetrics || PROFESSOR_PROFILE.metrics || {
    publicationsDisplay: "47+",
    scopusDisplay: "39",
    ieeeDisplay: "27",
    patentsDisplay: "12",
    totalCitations: 393,
    stateAwardsCount: 6,
    experienceYears: "16+"
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Announcement / Badge */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>Ph.D. Supervisor (JNTUA & Annamacharya Univ)</span>
          </div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Chairperson – Board of Studies (BOS)</span>
          </div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-900/60 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Advisor – IEEE Computer Society</span>
          </div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-950/60 border border-purple-400/30 text-purple-300 text-xs font-semibold backdrop-blur-md">
            <Lightbulb className="w-4 h-4 text-purple-400" />
            <span>{m.patentsDisplay || '12'} Patents (3 Granted & 9 Published)</span>
          </div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-950/60 border border-teal-400/30 text-teal-300 text-xs font-semibold backdrop-blur-md">
            <Award className="w-4 h-4 text-teal-400" />
            <span>₹1,00,000 Funded Grants (JNTUA & DST)</span>
          </div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-400/30 text-cyan-300 text-xs font-semibold backdrop-blur-md">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>{m.scopusDisplay || '39'} Scopus ({m.ieeeDisplay || '27'} IEEE) & {m.publicationsDisplay || '47+'} Scholar</span>
          </div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-950/60 border border-teal-400/30 text-teal-300 text-xs font-semibold backdrop-blur-md">
            <BookOpen className="w-4 h-4 text-teal-400" />
            <span>54 FDP / ATAL Programs</span>
          </div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-950/60 border border-amber-400/30 text-amber-300 text-xs font-semibold backdrop-blur-md">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{m.stateAwardsCount || 6} State Faculty Honors</span>
          </div>
          <div 
            onClick={() => setActiveTab('about')}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md cursor-pointer hover:bg-emerald-900/60 transition-colors"
            title={`View all ${PROFESSOR_PROFILE.memberships.length} Professional Society Memberships in About section`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>12 Professional Memberships (IEEE • ISTE Life • CSI • WRU • IAENG)</span>
          </div>
        </div>

        {/* Hero Main Header with Dr. Farooq Portrait & Credentials */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center py-6">
          
          {/* Left Column: Academic Credentials, Titles, and CTAs (7 cols) */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Academic Leader & AI Researcher</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-3 leading-tight">
              {PROFESSOR_PROFILE.name}
            </h1>

            <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent mb-2">
              {PROFESSOR_PROFILE.designation}
            </p>

            <p className="text-sm sm:text-base text-slate-300 font-medium mb-5">
              {PROFESSOR_PROFILE.college}
            </p>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Committed to building a student-centric, outcome-based engineering education ecosystem. Championing autonomous curriculum innovation (R23 & AI-integrated R26), high-impact research across {m.patentsDisplay || '12'} patents & {m.scopusDisplay || '39'} Scopus publications ({m.ieeeDisplay || '27'} IEEE conferences), and interactive AI learning for students.
            </p>

            {/* Primary Quick CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 mb-6">
              <button
                onClick={() => {
                  setActiveTab('ai-tutor');
                  const el = document.getElementById('main-content');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center space-x-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Ask AI Exam Tutor</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenCV}
                className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                title="1-Click Academic CV & Executive Resume (Save as PDF)"
              >
                <FileText className="w-4 h-4 text-emerald-100" />
                <span>Download Academic CV</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('materials');
                  const el = document.getElementById('main-content');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm transition-all transform hover:-translate-y-0.5 cursor-pointer shadow-lg shadow-indigo-600/20"
              >
                <FolderDown className="w-4 h-4 text-amber-300" />
                <span>Drive Course Vault</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('curriculum');
                  const el = document.getElementById('main-content');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/70 text-slate-300 hover:text-white font-medium text-sm transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>R23 / R26 Curriculum</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('ats-checker');
                  const el = document.getElementById('main-content');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 hover:text-white font-bold text-sm transition-all transform hover:-translate-y-0.5 cursor-pointer shadow-sm"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>ATS Resume Checker</span>
              </button>
            </div>
          </div>

          {/* Right Column: Dr. Farooq Portrait Showcase with Executive Badges (5 cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative group max-w-xs sm:max-w-sm">
              
              {/* Subtle Ambient Backlight */}
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" />

              {/* Portrait Card Container */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-slate-700/80 shadow-2xl">
                <img 
                  src="/dr-farooq.jpg" 
                  alt="Dr. S. Md. Farooq - Head of Department, CSE" 
                  className="w-full h-96 sm:h-[420px] object-cover object-top filter contrast-[1.02] group-hover:scale-102 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />

                {/* Bottom Overlay Info Strip */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent p-4 text-center">
                  <h3 className="font-extrabold text-white text-base">
                    Dr. S. Md. Farooq
                  </h3>
                  <p className="text-xs text-indigo-300 font-semibold mt-0.5">
                    Ph.D. (VIT Vellore) • B.Tech (JNTUA) • M.Tech (JNTUH)
                  </p>
                  <div className="flex items-center justify-center space-x-1.5 mt-2 flex-wrap gap-y-1">
                    <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-200 border border-teal-400/30 text-[10px] font-bold">
                      Ph.D. Supervisor (JNTUA & AU)
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-200 border border-blue-400/30 text-[10px] font-bold">
                      BoS Chairperson (CSE)
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[10px] font-bold">
                      12 Society Memberships
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-200 border border-purple-400/30 text-[10px] font-bold">
                      12 Patents
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-200 border border-teal-400/30 text-[10px] font-bold">
                      ₹1.00 Lakh Grants
                    </span>
                  </div>
                </div>

                {/* Floating Top-Left Micro Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 text-cyan-300 text-[11px] font-extrabold flex items-center space-x-1.5 shadow-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Verified Faculty Leader</span>
                </div>

                {/* Floating Top-Right Micro Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-amber-500/30 text-amber-300 text-[11px] font-extrabold flex items-center space-x-1 shadow-lg">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>6 Honors</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Verified Research Profile Cards Grid */}
        <div className="pt-6 border-t border-slate-800/80">
          <p className="text-center text-xs uppercase tracking-wider font-semibold text-slate-400 mb-5">
            Verified Research & Academic Profiles
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
            {PROFESSOR_PROFILE.researchProfiles.map((prof) => {
              const Icon = iconMap[prof.icon] || Cpu;
              return (
                <a
                  key={prof.name}
                  href={prof.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col items-center justify-center p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 transition-all duration-200 transform hover:-translate-y-1 shadow-md hover:shadow-indigo-500/10 text-center"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-tr ${prof.color} flex items-center justify-center text-white mb-2 shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {prof.name}
                  </h2>
                  <span className="text-[11px] text-slate-400 font-medium mt-0.5 truncate max-w-full">
                    {prof.tag}
                  </span>
                  <span className="mt-2 text-[10px] text-indigo-400 font-semibold flex items-center space-x-1 opacity-80 group-hover:opacity-100">
                    <span>View Profile</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Quick Highlights Strip */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto text-center">
          <div 
            onClick={() => setActiveTab('research')}
            className="p-4 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 backdrop-blur-xs cursor-pointer transition-all duration-200 group"
          >
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 group-hover:scale-105 transition-transform">
              {m.scopusDisplay || '39'} / {m.publicationsDisplay || '47+'}
            </div>
            <div className="text-xs text-slate-200 font-bold mt-1 group-hover:text-cyan-300 transition-colors">
              Publications
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">
              {m.scopusDisplay || '39'} Scopus ({m.ieeeDisplay || '27'} IEEE) • {m.publicationsDisplay || '47+'} Scholar
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('research')}
            className="p-4 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/40 backdrop-blur-xs cursor-pointer transition-all duration-200 group"
          >
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 group-hover:scale-105 transition-transform">
              {m.patentsDisplay || '12'}
            </div>
            <div className="text-xs text-slate-200 font-bold mt-1 group-hover:text-purple-300 transition-colors">
              Patents Portfolio
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">
              {m.patentsGranted || 3} Granted • {m.patentsPublished || 9} Published (KAPILA)
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('about')}
            className="p-4 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 backdrop-blur-xs cursor-pointer transition-all duration-200 group"
          >
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 group-hover:scale-105 transition-transform">
              {m.stateAwardsCount} State Awards
            </div>
            <div className="text-xs text-slate-200 font-bold mt-1 group-hover:text-amber-300 transition-colors">
              State & Academic Honors
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">
              Distinguished Faculty Awards
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 backdrop-blur-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              {m.experienceYears}
            </div>
            <div className="text-xs text-slate-200 font-bold mt-1">
              Years Leadership
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">
              HOD CSE • Ph.D. (VIT Vellore)
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
