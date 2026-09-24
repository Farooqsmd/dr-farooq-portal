import React, { useState, useMemo, useEffect } from 'react';
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  ShieldCheck, 
  Target, 
  Lightbulb, 
  Briefcase, 
  CheckCircle2, 
  ExternalLink, 
  ChevronRight, 
  BrainCircuit, 
  MapPin, 
  Calendar,
  Copy,
  Check,
  Globe,
  FileText,
  Search,
  Users,
  Filter,
  Sparkles,
  Layers,
  ArrowRight,
  ArrowDown,
  X,
  Compass
} from 'lucide-react';
import { 
  PROFESSOR_PROFILE, 
  SUPERVISOR_DATA, 
  FUNDED_PROJECTS_DATA,
  BOS_COMMITTEES_DATA, 
  RESOURCE_PERSON_DATA, 
  FDP_TRAINING_DATA 
} from '../data/profileData';

export default function AboutSection({ setActiveTab, onOpenCV }) {
  const [copiedMemberId, setCopiedMemberId] = useState(null);
  const [membershipFilter, setMembershipFilter] = useState('all'); // all, life, international, national
  
  // FDP Section interactive filters
  const [fdpYearFilter, setFdpYearFilter] = useState('all'); // all, 2025, 2024, 2023, 2022, 2021, 2020, 2013
  const [fdpCategoryFilter, setFdpCategoryFilter] = useState('all');
  const [fdpSearchQuery, setFdpSearchQuery] = useState('');

  const handleCopyId = (idStr, key) => {
    navigator.clipboard.writeText(idStr);
    setCopiedMemberId(key);
    setTimeout(() => setCopiedMemberId(null), 2500);
  };

  const filteredMemberships = (PROFESSOR_PROFILE.memberships || []).filter(m => {
    if (membershipFilter === 'life') return m.isLifeMember;
    if (membershipFilter === 'international') return m.tier === 'International';
    if (membershipFilter === 'national') return m.tier === 'National';
    return true;
  });

  // Filtered FDPs - Sorted reverse chronological order (recent on top)
  const filteredFdps = useMemo(() => {
    return FDP_TRAINING_DATA.filter(item => {
      if (fdpYearFilter !== 'all' && item.year !== fdpYearFilter) return false;
      if (fdpCategoryFilter !== 'all' && item.category !== fdpCategoryFilter) return false;
      if (fdpSearchQuery.trim()) {
        const query = fdpSearchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        const matchesYear = item.year.includes(query);
        if (!matchesTitle && !matchesCat && !matchesYear) return false;
      }
      return true;
    });
  }, [fdpYearFilter, fdpCategoryFilter, fdpSearchQuery]);

  // Unique FDP categories
  const fdpCategories = useMemo(() => {
    const cats = new Set(FDP_TRAINING_DATA.map(f => f.category));
    return Array.from(cats);
  }, []);

  // Profile Search & In-Page Navigation State
  const [profileSearchQuery, setProfileSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('about-bio');

  // Track active section for the sticky quick-jump bar
  useEffect(() => {
    const sectionIds = [
      'about-bio',
      'phd-supervision',
      'bos-governance',
      'funded-grants',
      'education-domains',
      'expert-lectures',
      'honors-awards',
      'faculty-development',
      'professional-memberships'
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 220;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll with temporary accent highlight
  const scrollToSection = (id) => {
    setProfileSearchQuery('');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.add('ring-4', 'ring-indigo-500/50', 'transition-all');
      setTimeout(() => {
        el.classList.remove('ring-4', 'ring-indigo-500/50');
      }, 2500);
    }
  };

  // Pre-compiled comprehensive searchable catalog of Dr. Farooq's credentials
  const allSearchableItems = useMemo(() => {
    const items = [];

    // 1. Leadership & Bio
    items.push({
      category: 'Academic Leadership',
      title: 'Professor & Head of Department (CSE)',
      subtitle: 'Santhiram Engineering College (Autonomous), Nandyal',
      snippet: '16+ years academic stewardship, autonomous curriculum formulation (R23 & R26), NBA & NAAC accreditation leadership.',
      targetId: 'about-bio',
      badge: 'Leadership'
    });

    // 2. Doctoral Supervision
    SUPERVISOR_DATA.forEach(s => {
      items.push({
        category: 'Ph.D. Research Supervision',
        title: `${s.role} — ${s.university}`,
        subtitle: `Recognized in ${s.year} • ${s.type}`,
        snippet: s.description,
        targetId: 'phd-supervision',
        badge: 'Ph.D. Guide'
      });
    });

    // 3. BOS Governance
    BOS_COMMITTEES_DATA.forEach(b => {
      items.push({
        category: 'Board of Studies (BOS)',
        title: `${b.role} — ${b.department}`,
        subtitle: `${b.institution} (${b.programs}) • Tenure: ${b.tenure}`,
        snippet: b.highlights,
        targetId: 'bos-governance',
        badge: 'BOS Governance'
      });
    });

    // 4. Extramural Grants
    FUNDED_PROJECTS_DATA.forEach(p => {
      items.push({
        category: 'Sponsored Grants & Projects',
        title: p.title,
        subtitle: `Funding Agency: ${p.agency} • Sanction: ${p.amount}`,
        snippet: p.impact,
        targetId: 'funded-grants',
        badge: p.amount
      });
    });

    // 5. Academic Degrees
    PROFESSOR_PROFILE.education.forEach(e => {
      items.push({
        category: 'Academic Credentials',
        title: `${e.degree} — ${e.institution} (${e.year})`,
        subtitle: e.focus || 'Distinguished academic performance',
        snippet: `Earned ${e.degree} from premier institution ${e.institution}`,
        targetId: 'education-domains',
        badge: e.year
      });
    });

    // 6. Research Domains
    PROFESSOR_PROFILE.researchDomains.forEach(d => {
      items.push({
        category: 'Research Specialization',
        title: d.title,
        subtitle: 'Core Academic & Research Competency',
        snippet: d.desc,
        targetId: 'education-domains',
        badge: 'Specialization'
      });
    });

    // 7. Keynote Lectures
    RESOURCE_PERSON_DATA.forEach(r => {
      items.push({
        category: 'Keynote & Expert Lectures',
        title: r.title,
        subtitle: `${r.role} • ${r.event} (${r.year})`,
        snippet: `Organized by ${r.organization} • Focus: ${r.topic}`,
        targetId: 'expert-lectures',
        badge: r.year
      });
    });

    // 8. Awards & Honors
    PROFESSOR_PROFILE.awards.forEach(a => {
      items.push({
        category: 'State Honors & Awards',
        title: a.title,
        subtitle: `${a.organization} (${a.year})`,
        snippet: `${a.highlight} (${a.level})`,
        targetId: 'honors-awards',
        badge: a.year
      });
    });

    // 9. Professional Memberships
    PROFESSOR_PROFILE.memberships.forEach(m => {
      items.push({
        category: 'Professional Society Memberships',
        title: `${m.short} — ${m.name}`,
        subtitle: `${m.role} • Member ID: ${m.membershipId} [${m.tier}]`,
        snippet: `${m.description}${m.validTill ? ' • Valid till ' + m.validTill : ''}`,
        targetId: 'professional-memberships',
        badge: m.isLifeMember ? 'Life Member' : m.tier
      });
    });

    // 10. FDPs / STTPs
    FDP_TRAINING_DATA.forEach(f => {
      items.push({
        category: 'Faculty Development (FDP)',
        title: f.title,
        subtitle: `${f.category} • Year: ${f.year} (${f.mode})`,
        snippet: f.isFlagship ? '★ Premier Flagship Program (AICTE / ATAL / NIPAM)' : 'Pedagogical & Technical Upskilling',
        targetId: 'faculty-development',
        badge: f.year
      });
    });

    return items;
  }, []);

  // Filtered search results based on query
  const searchResults = useMemo(() => {
    if (!profileSearchQuery.trim() || profileSearchQuery.trim().length < 2) return [];
    const q = profileSearchQuery.toLowerCase().trim();
    return allSearchableItems.filter(item => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.snippet.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q)
      );
    }).slice(0, 10);
  }, [profileSearchQuery, allSearchableItems]);

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 sm:space-y-14">
      
      {/* 1. Sticky Quick-Jump Navigation Bar */}
      <div className="sticky top-16 sm:top-18 z-40 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xs rounded-2xl px-3 py-2 flex items-center justify-between gap-3 overflow-x-auto print-hide">
        <div className="flex items-center space-x-1.5 shrink-0 pl-1">
          <Compass className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1 hidden sm:inline">Jump To:</span>
        </div>
        <div className="flex items-center space-x-1.5 shrink-0 overflow-x-auto">
          {[
            { id: 'about-bio', label: 'Biography', icon: '👤' },
            { id: 'executive-directory', label: 'Directory', icon: '⚡' },
            { id: 'phd-supervision', label: 'Ph.D. Guide', icon: '🎓' },
            { id: 'bos-governance', label: 'BOS Leadership', icon: '🏛️' },
            { id: 'funded-grants', label: 'Funded Grants', icon: '💰' },
            { id: 'education-domains', label: 'Education', icon: '📜' },
            { id: 'expert-lectures', label: 'Keynotes (4)', icon: '🎤' },
            { id: 'honors-awards', label: 'Awards (6)', icon: '🏆' },
            { id: 'faculty-development', label: 'FDPs (54)', icon: '📚' },
            { id: 'professional-memberships', label: 'Memberships (12)', icon: '🛡️' }
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeSection === sec.id
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{sec.icon}</span>
              <span>{sec.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Interactive Quick Credential Search Center */}
      <div className="relative z-30 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-7 text-white border border-indigo-500/25 shadow-xl print-hide overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-bold uppercase tracking-wider mb-2 border border-cyan-400/30">
                <Search className="w-3.5 h-3.5" />
                <span>Quick Profile & Credential Search</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Instant Qualification & Credential Finder
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Check whether specific information is available in 1 click. Type any keyword (e.g. <strong>JNTUA, Ph.D. Guide, DST Grant, VIT Vellore, ATAL, BOS, Life Member, Award</strong>).
              </p>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                ✓ Ph.D. Guide (JNTUA & AU)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
                ✓ BOS Chairperson
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
                ✓ ₹1 Lakh Grants
              </span>
            </div>
          </div>

          {/* Search Box Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={profileSearchQuery}
              onChange={(e) => setProfileSearchQuery(e.target.value)}
              placeholder="Search anything: e.g. JNTUA, Ph.D. Supervisor, DST Grant, VIT, ATAL, SREC, BOS, Life Member, Award..."
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-900 placeholder:text-slate-400 text-sm border border-white/20 focus:border-indigo-500 focus:outline-hidden focus:ring-4 focus:ring-indigo-500/20 transition-all font-medium shadow-inner"
            />
            {profileSearchQuery && (
              <button
                onClick={() => setProfileSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-full text-xs font-bold cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Live Search Results Dropdown */}
          {profileSearchQuery.trim().length >= 2 && (
            <div className="bg-white text-slate-900 rounded-2xl p-3 border border-slate-200 shadow-2xl space-y-2 max-h-96 overflow-y-auto animate-fadeIn">
              <div className="flex items-center justify-between px-2 pb-1.5 border-b border-slate-100 text-xs text-slate-500 font-semibold">
                <span>Matching Records ({searchResults.length})</span>
                <span>Click any record to jump directly</span>
              </div>
              {searchResults.map((res, idx) => (
                <div
                  key={idx}
                  onClick={() => scrollToSection(res.targetId)}
                  className="p-3 rounded-xl hover:bg-indigo-50/80 border border-transparent hover:border-indigo-200 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-900">
                        {res.category}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                        {res.badge}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {res.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {res.snippet}
                    </p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-indigo-600 group-hover:bg-indigo-700 text-white text-xs font-bold shrink-0 flex items-center space-x-1 shadow-2xs self-start sm:self-auto cursor-pointer">
                    <span>Jump</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {searchResults.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-500">
                  No records matched &quot;{profileSearchQuery}&quot;. Try searching for &quot;JNTUA&quot;, &quot;Ph.D.&quot;, &quot;DST&quot;, &quot;VIT&quot;, &quot;BOS&quot;, &quot;Grant&quot;, or &quot;FDP&quot;.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. Bio & Department Leadership */}
      <section id="about-bio" className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm relative overflow-hidden scroll-mt-28 sm:scroll-mt-32">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-50 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Academic Leadership</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-6">
            About Dr. S. Md. Farooq
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-6">
            {/* Dr. Farooq Official Photo Card */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="relative rounded-2xl overflow-hidden ring-4 ring-indigo-50 border border-slate-200 shadow-md w-full max-w-[280px]">
                <img 
                  src="/dr-farooq.jpg" 
                  alt="Dr. S. Md. Farooq" 
                  className="w-full h-80 object-cover object-top"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                  <div className="font-bold text-slate-900 text-sm">Dr. S. Md. Farooq</div>
                  <div className="text-xs text-indigo-600 font-semibold mt-0.5">Ph.D. (VIT) • HOD, CSE</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Chairperson, Board of Studies (BOS)</div>
                  <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">Ph.D. Supervisor: JNTUA & Annamacharya</div>
                  {onOpenCV && (
                    <button
                      onClick={onOpenCV}
                      className="w-full mt-3 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm transition-all cursor-pointer"
                      title="Generate 1-Click Official Academic CV & Resume (Save as PDF)"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Generate Academic CV</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Bio Paragraphs */}
            <div className="lg:col-span-8 prose prose-slate max-w-none space-y-4 text-slate-600 text-base leading-relaxed">
              {PROFESSOR_PROFILE.bio.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}

              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100">
                  <div className="text-xs font-bold text-indigo-900 flex items-center space-x-1.5">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    <span>Recognized Ph.D. Research Supervisor</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    Empaneled doctoral guide at <strong>JNTUA (2023)</strong> and <strong>Annamacharya University (2025)</strong> supervising scholars in AI, Machine Learning, and Cybersecurity.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                  <div className="text-xs font-bold text-blue-900 flex items-center space-x-1.5">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>Chairperson, Board of Studies (BOS)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    Heads the BOS for CSE B.Tech & M.Tech programs at Santhiram Engineering College (Autonomous), steering the autonomous curriculum (R23 & AI-integrated R26).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Pillars of Leadership */}
          <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROFESSOR_PROFILE.keyInitiatives.map((init, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm mb-3">
                  0{i + 1}
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{init.title}</h4>
                <p className="text-xs text-slate-500 leading-normal">{init.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Executive Credential Directory (8 Cards At-A-Glance) */}
      <section id="executive-directory" className="space-y-4 scroll-mt-28 sm:scroll-mt-32">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Executive Dossier Directory</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Academic & Leadership Portfolio At a Glance
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant 1-click verification of Dr. Farooq&apos;s recognized guideships, curriculum governance, grants, and apex credentials.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              id: 'phd-supervision',
              title: 'Doctoral Supervision',
              subtitle: 'Ph.D. Research Guide',
              badge: 'JNTUA & AU',
              color: 'emerald',
              icon: GraduationCap,
              desc: 'Formally recognized & empaneled Ph.D. guide at JNTUA (2023) and Annamacharya University (2025).'
            },
            {
              id: 'bos-governance',
              title: 'Curriculum Governance',
              subtitle: 'BOS Chairperson',
              badge: 'Autonomous R23 & R26',
              color: 'indigo',
              icon: Layers,
              desc: 'Heads Board of Studies for B.Tech & M.Tech CSE (SREC); Academic Advisory member for Stanley (Hyderabad).'
            },
            {
              id: 'funded-grants',
              title: 'Extramural Research',
              subtitle: 'Sponsored Projects',
              badge: '₹1,00,000 Sanctioned',
              color: 'amber',
              icon: Award,
              desc: 'Completed sponsored research and technical entrepreneurship grants funded by DST Govt. of India & JNTUA.'
            },
            {
              id: 'education-domains',
              title: 'Academic Credentials',
              subtitle: 'Ph.D. (VIT Vellore)',
              badge: 'Ph.D., M.Tech, B.Tech',
              color: 'blue',
              icon: BookOpen,
              desc: 'Doctoral degree from premier VIT Vellore (2022); M.Tech with First Class Distinction.'
            },
            {
              id: 'expert-lectures',
              title: 'Expert Talks & Keynotes',
              subtitle: 'Invited Resource Person',
              badge: '4 National Sessions',
              color: 'purple',
              icon: Sparkles,
              desc: 'Keynote resource person for AI, IoT, faculty orientation and student career counseling.'
            },
            {
              id: 'honors-awards',
              title: 'Honors & Recognitions',
              subtitle: 'State Academic Awards',
              badge: '6 State Awards',
              color: 'rose',
              icon: Award,
              desc: 'Honored by state and national apex bodies for pedagogical excellence, student mentoring, and research.'
            },
            {
              id: 'faculty-development',
              title: 'Professional Upskilling',
              subtitle: 'FDPs & STTP Programs',
              badge: '54 Programs (Recent First)',
              color: 'cyan',
              icon: BrainCircuit,
              desc: 'AICTE ATAL Academies (IIT Patna, RGMCET), NIPAM, AWS Cloud, Python, and Generative AI.'
            },
            {
              id: 'professional-memberships',
              title: 'Learned Societies',
              subtitle: 'Apex Fellowships',
              badge: '12 Memberships • 2 Life',
              color: 'slate',
              icon: ShieldCheck,
              desc: 'Life Member ISTE (LM96672), Life Member ISRD (M4150902960), IEEE, ACM & International Bodies.'
            }
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => scrollToSection(card.id)}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all duration-200 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200 group-hover:border-indigo-200">
                      {card.badge}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                    {card.title}
                  </h4>
                  <div className="text-xs font-semibold text-indigo-600 mt-0.5">
                    {card.subtitle}
                  </div>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                  <span>View Details</span>
                  <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Doctoral Supervision & Board of Studies (BOS) Leadership */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Ph.D. Research Supervision Card (6 cols) */}
        <div id="phd-supervision" className="lg:col-span-6 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white border border-emerald-500/30 shadow-md relative overflow-hidden scroll-mt-28 sm:scroll-mt-32">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>Doctoral Research Supervision</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
              Recognized Ph.D. Supervisor
            </h3>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Formally recognized and empaneled by state and autonomous universities to supervise doctoral (Ph.D.) research scholars in Computer Science & Engineering.
            </p>

            <div className="space-y-4">
              {SUPERVISOR_DATA.map((sup) => (
                <div key={sup.id} className="p-4 rounded-2xl bg-slate-800/80 border border-emerald-500/30 backdrop-blur-xs">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      Recognized in {sup.year}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">{sup.type}</span>
                  </div>
                  <h4 className="font-extrabold text-white text-sm">
                    {sup.university}
                  </h4>
                  <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                    {sup.role}
                  </p>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {sup.description}
                  </p>
                  <div className="mt-3 pt-2 border-t border-emerald-500/20 flex flex-wrap items-center justify-between gap-1.5 text-[11px]">
                    <span className="text-slate-400 font-medium">Status:</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 text-[10px] font-semibold">
                      Guideship Active • Scholar Allotment in Progress
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Board of Studies & Academic Advisory Card (6 cols) */}
        <div id="bos-governance" className="lg:col-span-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white border border-indigo-500/30 shadow-md relative overflow-hidden scroll-mt-28 sm:scroll-mt-32">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Curriculum Governance</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
              Board of Studies (BOS) Leadership
            </h3>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Steering autonomous curriculum formulation, scheme of evaluation, and university-level academic advisory committees.
            </p>

            <div className="space-y-4">
              {BOS_COMMITTEES_DATA.map((bos) => (
                <div key={bos.id} className="p-4 rounded-2xl bg-slate-800/80 border border-indigo-500/30 backdrop-blur-xs">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                      {bos.tenure}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">{bos.category}</span>
                  </div>
                  <h4 className="font-extrabold text-white text-sm">
                    {bos.role} — {bos.department}
                  </h4>
                  <p className="text-xs text-cyan-300 font-semibold mt-0.5">
                    {bos.institution} ({bos.programs})
                  </p>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {bos.highlights}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* 2.5 Sponsored Research Projects & Extramural Grants (DST & JNTUA) */}
      <section id="funded-grants" className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm relative overflow-hidden scroll-mt-28 sm:scroll-mt-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Extramural & University Grants (₹1,00,000 Total Sanction)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sponsored Research Projects & Funded Grants
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Government and university funded technical programs, research initiatives, and entrepreneurship camps (DST Govt. of India & JNTUA).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-100/70 border border-emerald-300 text-emerald-950 text-xs font-black">
              ₹1,00,000 Sanction
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold">
              2 Completed Grants
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {FUNDED_PROJECTS_DATA.map((proj) => (
            <div 
              key={proj.id}
              className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-950 border border-emerald-300">
                    Sanction: {proj.amount}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 uppercase">
                    {proj.duration}
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-950 text-base mb-2 leading-snug">
                  {proj.title}
                </h3>

                <div className="text-xs font-bold text-indigo-950 mb-1">
                  Funding Agency: {proj.agency}
                </div>
                <div className="text-xs font-semibold text-slate-600 mb-2">
                  Scheme: {proj.scheme}
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 mb-3 leading-relaxed">
                  {proj.impact}
                </div>
              </div>

              <div className="mt-2 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <div className="text-slate-600">
                  <span className="font-bold text-slate-900">PI:</span> {proj.pi}
                  {proj.coPi && <span> • <span className="font-bold text-slate-900">Co-PI:</span> {proj.coPi}</span>}
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-200">
                  ✓ {proj.status} ({proj.period})
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Education Timeline & Research Domains */}
      <div id="education-domains" className="grid grid-cols-1 lg:grid-cols-12 gap-8 scroll-mt-28 sm:scroll-mt-32">
        
        {/* Education Timeline (5 cols) */}
        <section className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4">
            <GraduationCap className="w-4 h-4" />
            <span>Academic Credentials</span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-6">Education Timeline</h3>

          <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
            {PROFESSOR_PROFILE.education.map((edu, idx) => (
              <div key={idx} className="relative flex items-start space-x-4">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center ring-4 ring-white shadow-xs z-10 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 w-full">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">
                    {edu.year}
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-sm mt-0.5">{edu.degree}</h4>
                  <p className="text-xs text-slate-600 font-medium mt-1">{edu.institution}</p>
                  {edu.focus && (
                    <p className="text-[11px] text-slate-400 mt-1 italic">{edu.focus}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Professional Memberships Teaser */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Society Associations ({PROFESSOR_PROFILE.memberships.length})
              </h4>
              <a
                href="#professional-memberships"
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center space-x-0.5 cursor-pointer"
              >
                <span>View All {PROFESSOR_PROFILE.memberships.length}</span>
                <ChevronRight className="w-3 h-3" />
              </a>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PROFESSOR_PROFILE.memberships.slice(0, 6).map((m) => (
                <span
                  key={m.id}
                  className={`text-[10px] font-bold px-2 py-1 rounded-md border ${
                    m.isLifeMember 
                      ? 'bg-amber-50 text-amber-900 border-amber-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {m.short}
                </span>
              ))}
              <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                +{PROFESSOR_PROFILE.memberships.length - 6} more
              </span>
            </div>
          </div>
        </section>

        {/* Research Domains (7 cols) */}
        <section className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider mb-4">
              <BrainCircuit className="w-4 h-4" />
              <span>Core Specializations</span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-6">Research Domains & Expertise</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PROFESSOR_PROFILE.researchDomains.map((domain, idx) => (
                <div 
                  key={idx} 
                  className={`p-5 rounded-2xl border transition-all duration-200 ${
                    idx === 0 
                      ? 'sm:col-span-2 bg-gradient-to-r from-indigo-50/70 to-blue-50/70 border-indigo-200 shadow-2xs' 
                      : 'bg-slate-50/60 border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    <h4 className="font-bold text-slate-900 text-sm">{domain.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {domain.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick CTA to AI Portal */}
          <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm">Have an Academic or Syllabus Doubt?</h4>
              <p className="text-xs text-indigo-200 mt-0.5">Explore R23 & R26 curriculum topics with the AI Tutor.</p>
            </div>
            <button
              onClick={() => setActiveTab('ai-tutor')}
              className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold shrink-0 transition-colors cursor-pointer"
            >
              Open AI Tutor
            </button>
          </div>
        </section>

      </div>

      {/* 4. Invited Keynote Talks & Resource Person Engagements (Sorted Year-wise) */}
      <section id="expert-lectures" className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm scroll-mt-28 sm:scroll-mt-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Keynotes & Invited Talks ({RESOURCE_PERSON_DATA.length} Sessions)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Resource Person & Expert Lectures
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Invited sessions, faculty training keynotes, and academic career counseling (sorted academic year-wise).
            </p>
          </div>

          {onOpenCV && (
            <button
              onClick={onOpenCV}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs shadow-2xs transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export Talks in CV</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {RESOURCE_PERSON_DATA.map((rp) => (
            <div 
              key={rp.id}
              className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-purple-100 text-purple-900 border border-purple-200">
                    Academic Year {rp.year}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                    {rp.level}
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base mb-2 leading-snug">
                  "{rp.title}"
                </h3>

                <p className="text-xs font-bold text-indigo-700 mb-1">
                  {rp.role} • {rp.event}
                </p>

                <p className="text-xs text-slate-600 font-medium mb-3">
                  Organized by: <span className="font-semibold text-slate-800">{rp.organization}</span>
                </p>

                <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 text-xs text-slate-700">
                  <span className="font-bold text-purple-900">Key Focus:</span> {rp.topic}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Audience: {rp.audience}</span>
                <span className="text-emerald-600 font-bold">✓ Completed</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Honors & Awards Section (Sorted Year-wise) */}
      <section id="honors-awards" className="bg-gradient-to-b from-slate-50 to-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm scroll-mt-28 sm:scroll-mt-32">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Award className="w-4 h-4" />
            <span>Honors & Recognitions ({PROFESSOR_PROFILE.awards.length} State Awards)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Academic Awards & Distinctions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Recognized by prestigious state and national educational bodies for pedagogical excellence, student mentoring, and research contributions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROFESSOR_PROFILE.awards.map((award, i) => (
            <div 
              key={i} 
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-amber-400/60 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900">
                      {award.year}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                      {award.level}
                    </span>
                  </div>
                  <Award className="w-5 h-5 text-amber-500 shrink-0" />
                </div>

                <h3 className="font-extrabold text-slate-900 text-base mb-1 leading-snug">
                  {award.title}
                </h3>
                
                <p className="text-xs font-bold text-indigo-600 mb-2">
                  {award.organization}
                </p>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[11px] text-slate-400 mb-3 font-medium">
                  {award.location && (
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{award.location}</span>
                    </span>
                  )}
                  {award.date && award.date !== award.year && (
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{award.date}</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {award.highlight}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold text-slate-600">{award.category}</span>
                <span className="inline-flex items-center text-emerald-600 font-bold">
                  ✓ Verified Record
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Professional Development & Training (FDP / STTP / ATAL - 54 Programs) */}
      <section id="faculty-development" className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm scroll-mt-28 sm:scroll-mt-32">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-3">
              <BookOpen className="w-4 h-4 text-cyan-600" />
              <span>Professional Upskilling ({FDP_TRAINING_DATA.length} Programs)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Faculty Development Programs (FDP) & STTP
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
              Extensive pedagogical and technical training including AICTE ATAL Academies (IIT Patna, RGMCET), NIPAM, Generative AI, Cloud AWS, and Accreditation workshops. Organized <strong>academic year-wise (recent years on top)</strong>.
            </p>
          </div>

          {onOpenCV && (
            <button
              onClick={onOpenCV}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer shrink-0"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download Full FDP Record (PDF)</span>
            </button>
          )}
        </div>

        {/* Filter Controls: Year Tabs & Search */}
        <div className="space-y-3 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          
          {/* Year Filter Tabs (Descending: 2025 -> 2013) */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 mr-2 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Academic Year:</span>
            </span>
            <button
              onClick={() => setFdpYearFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                fdpYearFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              All Years ({FDP_TRAINING_DATA.length})
            </button>
            {['2025', '2024', '2023', '2022', '2021', '2020', '2013'].map(year => {
              const count = FDP_TRAINING_DATA.filter(f => f.year === year).length;
              if (count === 0) return null;
              return (
                <button
                  key={year}
                  onClick={() => setFdpYearFilter(year)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    fdpYearFilter === year
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {year} ({count})
                </button>
              );
            })}
          </div>

          {/* Search & Domain Filter Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2 border-t border-slate-200/70">
            <div className="sm:col-span-7 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search FDPs by keyword (e.g. AICTE, ATAL, AWS, NIPAM, Python, Generative AI)..."
                value={fdpSearchQuery}
                onChange={(e) => setFdpSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              {fdpSearchQuery && (
                <button
                  onClick={() => setFdpSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              )}
            </div>

            <div className="sm:col-span-5">
              <select
                value={fdpCategoryFilter}
                onChange={(e) => setFdpCategoryFilter(e.target.value)}
                className="w-full py-1.5 px-3 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
              >
                <option value="all">All Domains / Categories ({fdpCategories.length})</option>
                {fdpCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Results Count & Filter Status */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3 px-1">
          <span>Showing <strong>{filteredFdps.length}</strong> of {FDP_TRAINING_DATA.length} programs</span>
          {(fdpYearFilter !== 'all' || fdpCategoryFilter !== 'all' || fdpSearchQuery) && (
            <button
              onClick={() => { setFdpYearFilter('all'); setFdpCategoryFilter('all'); setFdpSearchQuery(''); }}
              className="text-indigo-600 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Scrollable / Card List of FDPs */}
        <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
          {filteredFdps.map((item, index) => (
            <div 
              key={item.id}
              className="p-3.5 rounded-xl bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-100 text-indigo-900">
                    {item.year}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200/70 text-slate-700">
                    {item.category}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white text-slate-500 border border-slate-200">
                    {item.mode}
                  </span>
                  {item.isFlagship && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                      ★ AICTE / ATAL / NIPAM
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-slate-800 leading-snug">
                  {item.title}
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400 shrink-0 sm:self-center">
                #{index + 1}
              </span>
            </div>
          ))}
          {filteredFdps.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              No professional development programs matched your search filters.
            </div>
          )}
        </div>

      </section>

      {/* 7. Professional Society Memberships & Learned Bodies (11) */}
      <section id="professional-memberships" className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm scroll-mt-28 sm:scroll-mt-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Professional Fellowships & Learned Societies ({PROFESSOR_PROFILE.memberships.length})</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Professional Society Memberships
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-2xl">
              Official lifetime and professional memberships across international engineering federations and premier national apex bodies for technical education.
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100/90 border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setMembershipFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                membershipFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({PROFESSOR_PROFILE.memberships.length})
            </button>
            <button
              onClick={() => setMembershipFilter('life')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                membershipFilter === 'life'
                  ? 'bg-white text-amber-900 shadow-2xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ★ Life Members (2)
            </button>
            <button
              onClick={() => setMembershipFilter('international')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                membershipFilter === 'international'
                  ? 'bg-white text-indigo-900 shadow-2xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              International ({PROFESSOR_PROFILE.memberships.filter(m => m.tier === 'International').length})
            </button>
            <button
              onClick={() => setMembershipFilter('national')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                membershipFilter === 'national'
                  ? 'bg-white text-blue-900 shadow-2xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              National ({PROFESSOR_PROFILE.memberships.filter(m => m.tier === 'National').length})
            </button>

            {onOpenCV && (
              <button
                onClick={onOpenCV}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                title={`Download Academic CV with all ${PROFESSOR_PROFILE.memberships.length} Memberships`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Export in CV (PDF)</span>
              </button>
            )}
          </div>
        </div>

        {/* Memberships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemberships.map((m) => (
            <div 
              key={m.id}
              className="bg-slate-50/70 hover:bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-indigo-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Top Badges Row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                      m.isLifeMember
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}>
                      {m.role}
                    </span>
                    {m.validTill && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Valid till {m.validTill}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-slate-500 border border-slate-200">
                    {m.tier}
                  </span>
                </div>

                {/* Organization Acronym & Title */}
                <div className="mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {m.short}
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-400">• {m.category}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5 leading-snug">
                    {m.name}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {m.description}
                </p>
              </div>

              {/* Bottom ID & Copy Strip */}
              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                <div className="flex items-center space-x-1.5 min-w-0">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Member ID:</span>
                  <span className="font-mono text-xs font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 truncate">
                    {m.membershipId}
                  </span>
                </div>

                {m.membershipId !== 'Active Member' && (
                  <button
                    onClick={() => handleCopyId(m.membershipId, m.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
                    title="Copy Membership ID"
                  >
                    {copiedMemberId === m.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
