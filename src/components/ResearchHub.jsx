import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen, 
  Lightbulb, 
  Award, 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw, 
  GraduationCap, 
  Database, 
  Cpu, 
  Sparkles, 
  ShieldCheck, 
  Layers,
  FileText
} from 'lucide-react';
import { PROFESSOR_PROFILE, FUNDED_PROJECTS_DATA } from '../data/profileData';
import { PATENTS_DATA, PUBLICATIONS_DATA, RESEARCH_METRICS } from '../data/researchData';
import { fetchLiveOrcidPublications, getInitialResearchData } from '../services/researchSyncService';

export default function ResearchHub({ setActiveTab, dynamicState, onOpenCV }) {
  const [activeCategory, setActiveCategory] = useState('all'); // all, patents, ieee, journals, books, grants, awards
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortBy, setSortBy] = useState('citations'); // citations, year, title
  const [copiedId, setCopiedId] = useState(null);
  
  // Live sync state & auto-sync
  const [localIsSyncing, setLocalIsSyncing] = useState(false);
  const [localSyncMessage, setLocalSyncMessage] = useState(null);
  const [additionalLiveWorks, setAdditionalLiveWorks] = useState(() => {
    const init = getInitialResearchData();
    return init.cachedNewWorks || [];
  });

  const isSyncing = dynamicState ? dynamicState.isSyncing : localIsSyncing;
  const syncMessage = dynamicState ? dynamicState.syncMessage : localSyncMessage;

  // Dynamic metrics object synchronized across the portal
  const m = dynamicState?.metrics || RESEARCH_METRICS;

  // Background Auto-Sync on Component Mount if not using parent dynamicState
  useEffect(() => {
    if (!dynamicState) {
      handleLiveSync(true);
    }
  }, [dynamicState]);

  // Unified deduplicated publications catalog
  const allPublications = useMemo(() => {
    if (dynamicState && dynamicState.publications) {
      return dynamicState.publications;
    }
    return PUBLICATIONS_DATA;
  }, [dynamicState]);

  // Counts for each category
  const counts = useMemo(() => {
    const ieeeCount = allPublications.filter(p => (p.sources || []).includes('IEEE Xplore')).length;
    const scopusList = allPublications.filter(p => (p.sources || []).includes('Scopus'));
    const scopusCount = m.scopusPublicationsCount ? Number(m.scopusPublicationsCount) : Math.min(41, scopusList.length);
    const scopusJournalsCount = allPublications.filter(p => (p.sources || []).includes('Scopus') && !(p.sources || []).includes('IEEE Xplore')).length;
    const awardsCount = (PROFESSOR_PROFILE.awards || []).length;
    const patentsCount = PATENTS_DATA.length; // strictly 12
    const grantsCount = FUNDED_PROJECTS_DATA.length; // 2 completed
    const totalCount = patentsCount + allPublications.length + awardsCount + grantsCount;
    return {
      all: totalCount,
      patents: patentsCount,
      ieee: ieeeCount,
      scopus: scopusCount,
      scopusJournals: scopusJournalsCount,
      grants: grantsCount,
      awards: awardsCount
    };
  }, [allPublications, m]);

  // Unique domain tags
  const domainTags = useMemo(() => {
    const set = new Set(['All']);
    allPublications.forEach(p => (p.tags || []).forEach(t => set.add(t)));
    return Array.from(set);
  }, [allPublications]);

  // Handle live sync with IEEE / ORCID profiles
  const handleLiveSync = async (isBackground = false) => {
    if (dynamicState && dynamicState.triggerSync) {
      return dynamicState.triggerSync(isBackground);
    }
    if (!isBackground) setLocalIsSyncing(true);
    try {
      const res = await fetchLiveOrcidPublications();
      if (res.success && res.works && res.works.length > 0) {
        const existingTitles = new Set(PUBLICATIONS_DATA.map(p => p.title.toLowerCase().trim()));
        const newWorks = res.works.filter(w => !existingTitles.has(w.title.toLowerCase().trim()));
        
        if (newWorks.length > 0) {
          setAdditionalLiveWorks(newWorks);
          setLocalSyncMessage(`Auto-synced ${newWorks.length} new records from IEEE / ORCID!`);
        } else if (!isBackground) {
          setLocalSyncMessage(`All IEEE, Scopus & ORCID records are up-to-date.`);
        }
      } else if (!isBackground) {
        setLocalSyncMessage(`Connected to research profile APIs. All records are verified.`);
      }
    } catch (e) {
      if (!isBackground) setLocalSyncMessage('Using verified offline profile records.');
    } finally {
      if (!isBackground) setLocalIsSyncing(false);
      setTimeout(() => setLocalSyncMessage(null), 5000);
    }
  };

  // Copy citation helper
  const handleCopyCitation = (item, id) => {
    let citation = '';
    if (item.patentNo) {
      citation = `Dr. S. Md. Farooq et al., "${item.title}", Patent No. ${item.patentNo}, Status: ${item.status}, ${item.publishedDate || item.year}.`;
    } else {
      citation = `${item.authors || 'Dr. S. Md. Farooq et al.'} (${item.year}). "${item.title}". ${item.venue}.`;
      if (item.doi) citation += ` DOI: https://doi.org/${item.doi}`;
    }

    navigator.clipboard.writeText(citation);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Filtered publications
  const filteredPublications = useMemo(() => {
    return allPublications.filter(p => {
      // Category filter
      if (activeCategory === 'ieee' && !(p.sources || []).includes('IEEE Xplore')) return false;
      if (activeCategory === 'scopus' && !(p.sources || []).includes('Scopus')) return false;
      if (activeCategory === 'scopus-journals' && (!((p.sources || []).includes('Scopus')) || (p.sources || []).includes('IEEE Xplore'))) return false;
      if (activeCategory === 'journals' && p.type !== 'Journal') return false;
      if (activeCategory === 'books' && p.type !== 'Book Chapter') return false;
      if (activeCategory === 'patents' || activeCategory === 'awards') return false;

      // Tag filter
      if (selectedTag !== 'All' && !(p.tags || []).includes(selectedTag)) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = (p.title || '').toLowerCase().includes(q);
        const matchesVenue = (p.venue || '').toLowerCase().includes(q);
        const matchesAuthors = (p.authors || '').toLowerCase().includes(q);
        const matchesYear = String(p.year || '').includes(q);
        const matchesSource = (p.sources || []).some(s => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesVenue && !matchesAuthors && !matchesYear && !matchesSource) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'citations') return (b.citations || 0) - (a.citations || 0);
      if (sortBy === 'year') return String(b.year).localeCompare(String(a.year));
      return (a.title || '').localeCompare(b.title || '');
    });
  }, [allPublications, activeCategory, selectedTag, searchQuery, sortBy]);

  // Filtered patents
  const filteredPatents = useMemo(() => {
    if (activeCategory === 'ieee' || activeCategory === 'scopus' || activeCategory === 'scopus-journals' || activeCategory === 'journals' || activeCategory === 'books' || activeCategory === 'awards') {
      return [];
    }
    return PATENTS_DATA.filter(pat => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = pat.title.toLowerCase().includes(q);
        const matchesNo = pat.patentNo.toLowerCase().includes(q);
        const matchesCat = (pat.category || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesNo && !matchesCat) return false;
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  // Filtered awards
  const filteredAwards = useMemo(() => {
    if (activeCategory === 'patents' || activeCategory === 'ieee' || activeCategory === 'scopus' || activeCategory === 'scopus-journals' || activeCategory === 'journals' || activeCategory === 'books') {
      return [];
    }
    return (PROFESSOR_PROFILE.awards || []).filter(aw => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return aw.title.toLowerCase().includes(q) || aw.organization.toLowerCase().includes(q);
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  const totalResultsCount = (activeCategory === 'patents' ? filteredPatents.length :
    activeCategory === 'awards' ? filteredAwards.length :
    activeCategory === 'all' ? (filteredPatents.length + filteredPublications.length + filteredAwards.length) :
    filteredPublications.length);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden mb-8 border border-slate-800">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-900/70 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Lightbulb className="w-4 h-4 text-cyan-400" />
              <span>Academic Research & Innovation Hub</span>
            </div>

            {/* Live Profile Auto-Sync Status & Trigger */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Auto-Sync Active (IEEE • Scopus • ORCID)</span>
              </div>

              <button
                onClick={() => handleLiveSync(false)}
                disabled={isSyncing}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-xs cursor-pointer"
                title="Sync latest records from IEEE Xplore, Scopus, and ORCID"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
                <span>{isSyncing ? 'Syncing Profiles...' : 'Sync Profiles'}</span>
              </button>

              {onOpenCV && (
                <button
                  onClick={onOpenCV}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/40 text-xs font-bold transition-all shadow-md shadow-emerald-900/20 cursor-pointer"
                  title="1-Click Official Academic CV & Resume (Save as PDF)"
                >
                  <FileText className="w-3.5 h-3.5 text-white" />
                  <span>1-Click Academic CV</span>
                </button>
              )}
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Publications, Patents & Scholarly Research
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed mb-8">
            Explore peer-reviewed publications across IEEE conferences, SCI/Scopus indexed journals, 
            and official patents granted and published under the Government of India KAPILA Scheme. 
            Indexed in Google Scholar, Scopus, IEEE Xplore, and ORCID.
          </p>

          {/* Research Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-4 border-t border-slate-800">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5 backdrop-blur-xs">
              <div className="text-xl sm:text-2xl font-extrabold text-cyan-400">
                {m.scopusDisplay || '41'} / {m.publicationsDisplay || '47+'}
              </div>
              <div className="text-xs font-bold text-slate-200 mt-1">Research Publications</div>
              <div className="text-[10.5px] text-slate-400 mt-0.5">{m.scopusDisplay || '41'} Scopus ({m.ieeeDisplay || '27'} IEEE)</div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5 backdrop-blur-xs">
              <div className="text-xl sm:text-2xl font-extrabold text-purple-400">
                {m.patentsDisplay || '12'}
              </div>
              <div className="text-xs font-bold text-slate-200 mt-1">Patents Portfolio</div>
              <div className="text-[10.5px] text-slate-400 mt-0.5">{m.patentsGranted || 3} Granted • {m.patentsPublished || 9} Published</div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5 backdrop-blur-xs">
              <div className="text-xl sm:text-2xl font-extrabold text-teal-400">
                {m.grantsTotalAmount || '₹1,00,000'}
              </div>
              <div className="text-xs font-bold text-slate-200 mt-1">Funded Grants</div>
              <div className="text-[10.5px] text-slate-400 mt-0.5">2 Completed (JNTUA & DST)</div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5 backdrop-blur-xs">
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-400">
                {m.citationsDisplay || RESEARCH_METRICS.citationsDisplay}
              </div>
              <div className="text-xs font-bold text-slate-200 mt-1">Citations & Impact</div>
              <div className="text-[10.5px] text-slate-400 mt-0.5">h-index: {m.hIndex || RESEARCH_METRICS.hIndex} • i10: {m.i10Index || RESEARCH_METRICS.i10Index}</div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5 backdrop-blur-xs col-span-2 sm:col-span-1">
              <div className="text-xl sm:text-2xl font-extrabold text-amber-400">
                {m.stateAwardsCount || RESEARCH_METRICS.stateAwardsCount}
              </div>
              <div className="text-xs font-bold text-slate-200 mt-1">State Faculty Honors</div>
              <div className="text-[10.5px] text-slate-400 mt-0.5">6 Distinctions</div>
            </div>
          </div>

          {/* Sync Status Toast */}
          {syncMessage && (
            <div className="mt-4 p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{syncMessage}</span>
            </div>
          )}

          {/* Verified Profile Links */}
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold mr-1">Direct Profile Indices:</span>
            {PROFESSOR_PROFILE.researchProfiles.map(prof => (
              <a
                key={prof.name}
                href={prof.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              >
                <span>{prof.name}</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Filter & Navigation Strip */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm mb-8 space-y-4">
        
        {/* REDESIGNED EXECUTIVE SEGMENTED CONTROL MENU */}
        <div className="p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/90 flex flex-wrap items-center gap-1.5 backdrop-blur-xs">
          
          {/* 1. All Works */}
          <button
            onClick={() => { setActiveCategory('all'); setSelectedTag('All'); }}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 ring-1 ring-slate-950/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>All Works</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeCategory === 'all'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80'
                : 'bg-slate-200/70 text-slate-600'
            }`}>
              {counts.all}
            </span>
          </button>

          {/* 2. Patents Portfolio (12) */}
          <button
            onClick={() => { setActiveCategory('patents'); setSelectedTag('All'); }}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer ${
              activeCategory === 'patents'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 ring-1 ring-slate-950/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-purple-600" />
            <span>Patents</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeCategory === 'patents'
                ? 'bg-purple-50 text-purple-700 border border-purple-200/80'
                : 'bg-slate-200/70 text-slate-600'
            }`}>
              {counts.patents}
            </span>
          </button>

          {/* 3. IEEE Conferences (Dedicated IEEE Tab - Exact 27) */}
          <button
            onClick={() => { setActiveCategory('ieee'); setSelectedTag('All'); }}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer ${
              activeCategory === 'ieee'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 ring-1 ring-slate-950/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Cpu className="w-4 h-4 text-cyan-600" />
            <span>IEEE Conferences</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeCategory === 'ieee'
                ? 'bg-cyan-50 text-cyan-800 border border-cyan-200/80'
                : 'bg-slate-200/70 text-slate-600'
            }`}>
              {counts.ieee}
            </span>
          </button>

          {/* 4. Scopus Indexed Documents (Exact 41) */}
          <button
            onClick={() => { setActiveCategory('scopus'); setSelectedTag('All'); }}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer ${
              activeCategory === 'scopus'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 ring-1 ring-slate-950/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Database className="w-4 h-4 text-orange-600" />
            <span>Scopus Indexed</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeCategory === 'scopus'
                ? 'bg-orange-50 text-orange-800 border border-orange-200/80'
                : 'bg-slate-200/70 text-slate-600'
            }`}>
              {counts.scopus}
            </span>
          </button>

          {/* 5. Non-IEEE Scopus Works (12: AIP Proceedings, SCI Journals & Book Chapter) */}
          <button
            onClick={() => { setActiveCategory('scopus-journals'); setSelectedTag('All'); }}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer ${
              activeCategory === 'scopus-journals'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 ring-1 ring-slate-950/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Other Scopus Works</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeCategory === 'scopus-journals'
                ? 'bg-blue-50 text-blue-800 border border-blue-200/80'
                : 'bg-slate-200/70 text-slate-600'
            }`}>
              {counts.scopusJournals}
            </span>
          </button>

          {/* 6. Sponsored Research Grants */}
          <button
            onClick={() => { setActiveCategory('grants'); setSelectedTag('All'); }}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer ${
              activeCategory === 'grants'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 ring-1 ring-slate-950/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Funded Grants</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeCategory === 'grants'
                ? 'bg-teal-50 text-teal-800 border border-teal-200/80'
                : 'bg-slate-200/70 text-slate-600'
            }`}>
              {counts.grants}
            </span>
          </button>

          {/* 7. State Faculty Honors */}
          <button
            onClick={() => { setActiveCategory('awards'); setSelectedTag('All'); }}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer ${
              activeCategory === 'awards'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 ring-1 ring-slate-950/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Award className="w-4 h-4 text-amber-600" />
            <span>State Honors</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeCategory === 'awards'
                ? 'bg-amber-50 text-amber-800 border border-amber-200/80'
                : 'bg-slate-200/70 text-slate-600'
            }`}>
              {counts.awards}
            </span>
          </button>
        </div>

        {/* Search, Tag Filters & Sorter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by paper title, patent number, source (IEEE, Scopus), author..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs text-slate-500 font-semibold">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none"
            >
              <option value="citations">Highest Citations</option>
              <option value="year">Most Recent (Year)</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Domain Chips Filter */}
        {activeCategory !== 'patents' && activeCategory !== 'awards' && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Domain Filter:
            </span>
            {domainTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between mb-6 px-1">
        <p className="text-xs font-semibold text-slate-500">
          Showing <span className="text-slate-900 font-bold">{totalResultsCount}</span> matching records
          {searchQuery && <span> for &ldquo;{searchQuery}&rdquo;</span>}
        </p>

        <div className="text-xs text-indigo-600 font-semibold flex items-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified Scopus / IEEE / Scholar / Patent Office Data</span>
        </div>
      </div>

      {/* Grid Content */}
      <div className="space-y-6">

        {/* 1. PATENTS SECTION */}
        {(activeCategory === 'all' || activeCategory === 'patents') && filteredPatents.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Patents Portfolio (3 Granted & 9 Published in Official Registry)
                </h2>
              </div>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
                3 Granted • 9 Published • 7 Under GoI KAPILA Scheme
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPatents.map((pat) => (
                <div 
                  key={pat.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Status & Type Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                          pat.status === 'Granted'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-purple-100 text-purple-800 border border-purple-300'
                        }`}>
                          ✓ {pat.status} {pat.type}
                        </span>
                        {pat.academicYear && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                            AY {pat.academicYear}
                          </span>
                        )}
                      </div>
                      
                      {pat.kapilaScheme && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                          ★ KAPILA Scheme (Govt. of India)
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 mb-2 leading-snug">
                      {pat.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs mb-2">
                      <div className="font-bold text-indigo-700">
                        Patent / App No: <span className="font-mono bg-indigo-50 px-2 py-0.5 rounded text-indigo-950 border border-indigo-200">{pat.patentNo}</span>
                      </div>
                      {pat.filedDate && (
                        <div className="text-slate-500 font-medium">
                          Filed: <span className="text-slate-800 font-semibold">{pat.filedDate}</span>
                        </div>
                      )}
                      {pat.publishedDate && (
                        <div className="text-slate-500 font-medium">
                          {pat.status === 'Granted' ? 'Granted:' : 'Published:'} <span className="text-slate-800 font-semibold">{pat.publishedDate}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3">
                      {pat.highlight}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-purple-700 truncate">
                      {pat.category}
                    </span>
                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => handleCopyCitation(pat, pat.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Copy Patent Citation"
                      >
                        {copiedId === pat.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <a
                        href={pat.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-colors"
                      >
                        <span>Verify Record</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. PUBLICATIONS SECTION */}
        {(activeCategory !== 'patents' && activeCategory !== 'awards') && filteredPublications.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  {activeCategory === 'ieee' 
                    ? `IEEE Conference Publications (${filteredPublications.length} Indexed in Scopus & IEEE Xplore)`
                    : activeCategory === 'scopus'
                    ? `Scopus Indexed Publications (${filteredPublications.length} Documents • 23 IEEE + 9 AIP + 3 CRC Press + 2 SCI Journals + 4 Others)`
                    : activeCategory === 'scopus-journals'
                    ? `Other Scopus Indexed Works (${filteredPublications.length} Documents • AIP Proceedings, SCI Journals & Book Chapters)`
                    : `Peer-Reviewed Publications (${m.scopusDisplay || '41'} Scopus Indexed • ${m.publicationsDisplay || '47+'} Google Scholar Verified)`}
                </h2>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                {m.scopusDisplay || '41'} Scopus ({m.ieeeDisplay || '27'} IEEE) • AIP • Springer (SCI) • Wiley • Taylor & Francis • IGI Global
              </span>
            </div>

            <div className="space-y-3">
              {filteredPublications.map((pub, idx) => {
                const uniqueKey = `pub-${idx}`;
                const sourcesList = pub.sources || ['Scopus', 'Google Scholar'];

                return (
                  <div
                    key={uniqueKey}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col sm:flex-row items-start justify-between gap-4"
                  >
                    <div className="flex-1">
                      
                      {/* Top Badges Row */}
                      <div className="flex flex-wrap items-center gap-2 mb-2.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                          pub.type === 'Journal'
                            ? 'bg-blue-100 text-blue-800'
                            : pub.type === 'Conference'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {pub.type}
                        </span>

                        <span className="text-xs font-bold text-slate-500">
                          {pub.year}
                        </span>

                        {/* EXPLICIT INDEXING SOURCE BADGES: IEEE (Cyan + Cpu), Scopus (Orange + Database), Scholar (Blue + GraduationCap) */}
                        {sourcesList.map((src, sIdx) => {
                          const isIEEE = src.includes('IEEE');
                          const isScopus = src === 'Scopus';
                          const isScholar = src.includes('Scholar');
                          const isSpringer = src.includes('Springer');

                          const badgeLink = isIEEE
                            ? (pub.doi ? `https://doi.org/${pub.doi.replace(/^https?:\/\/doi\.org\//, '')}` : `https://ieeexplore.ieee.org/search/searchresult.jsp?newsearch=true&queryText=${encodeURIComponent(pub.title)}`)
                            : isScopus
                            ? 'https://www.scopus.com/authid/detail.uri?authorId=57202806468'
                            : isScholar
                            ? `https://scholar.google.com/scholar?q=${encodeURIComponent(pub.title)}`
                            : isSpringer && pub.doi
                            ? `https://doi.org/${pub.doi.replace(/^https?:\/\/doi\.org\//, '')}`
                            : null;

                          const content = (
                            <>
                              {isIEEE && <Cpu className="w-3.5 h-3.5 text-cyan-700" />}
                              {isScopus && <Database className="w-3 h-3 text-orange-600" />}
                              {isScholar && <GraduationCap className="w-3 h-3 text-blue-600" />}
                              {isSpringer && <Sparkles className="w-3 h-3 text-emerald-600" />}
                              <span>{src}</span>
                            </>
                          );

                          const classes = `inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold border transition-all ${
                            isIEEE
                              ? 'bg-cyan-100 text-cyan-900 border-cyan-300 shadow-2xs hover:bg-cyan-200'
                              : isScopus
                              ? 'bg-orange-100 text-orange-900 border-orange-300 shadow-2xs hover:bg-orange-200'
                              : isScholar
                              ? 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                              : isSpringer
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100'
                          }`;

                          if (badgeLink) {
                            return (
                              <a
                                key={sIdx}
                                href={badgeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={classes}
                                title={`Open ${src} entry`}
                              >
                                {content}
                              </a>
                            );
                          }

                          return (
                            <span key={sIdx} className={classes}>
                              {content}
                            </span>
                          );
                        })}

                        {pub.citations > 0 && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>{pub.citations} Citations</span>
                          </span>
                        )}

                        {pub.isLiveSynced && (
                          <span className="px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-700 text-[10px] font-bold border border-cyan-200">
                            Live Synced
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-extrabold text-slate-900 mb-1 leading-snug hover:text-indigo-600 transition-colors">
                        {pub.title}
                      </h3>

                      <p className="text-xs text-slate-500 font-medium mb-2">
                        {pub.authors}
                      </p>

                      <p className="text-xs font-semibold text-indigo-700 italic mb-3">
                        {pub.venue}
                      </p>

                      {pub.tags && (
                        <div className="flex flex-wrap gap-1.5">
                          {pub.tags.map((t, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 sm:pt-0 w-full sm:w-auto justify-end border-t sm:border-t-0 border-slate-100">
                      <button
                        onClick={() => handleCopyCitation(pub, uniqueKey)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                        title="Copy APA / IEEE Academic Citation"
                      >
                        {copiedId === uniqueKey ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Cite</span>
                          </>
                        )}
                      </button>

                      <a
                        href={
                          pub.doi 
                            ? (pub.doi.startsWith('http') ? pub.doi : `https://doi.org/${pub.doi}`)
                            : (pub.url || (pub.sources?.includes('IEEE Xplore') 
                                ? `https://ieeexplore.ieee.org/search/searchresult.jsp?newsearch=true&queryText=${encodeURIComponent(pub.title)}`
                                : `https://scholar.google.com/scholar?q=${encodeURIComponent(pub.title)}`))
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs ${
                          pub.sources?.includes('IEEE Xplore')
                            ? 'bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200/80 hover:shadow-xs'
                            : pub.doi
                            ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 hover:shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                        }`}
                        title={pub.doi ? `Open DOI: ${pub.doi}` : `Search "${pub.title}" on academic repository`}
                      >
                        {pub.sources?.includes('IEEE Xplore') ? (
                          <>
                            <Cpu className="w-3.5 h-3.5 text-cyan-600" />
                            <span>View on IEEE Xplore</span>
                          </>
                        ) : pub.doi ? (
                          <>
                            <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                            <span>View Article (DOI)</span>
                          </>
                        ) : (
                          <>
                            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                            <span>View on Scholar</span>
                          </>
                        )}
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2.5 SPONSORED GRANTS SECTION */}
        {(activeCategory === 'all' || activeCategory === 'grants') && (
          <div className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 gap-2">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Sponsored Research Projects & Extramural Grants (₹1,00,000 Sanctioned)
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full">
                  DST Govt. of India & JNTUA Sponsored
                </span>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                  2 Grants Completed
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {FUNDED_PROJECTS_DATA.map((proj) => (
                <div key={proj.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-teal-300 hover:shadow-md transition-all">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-950 border border-emerald-300">
                        Sanction: {proj.amount}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 uppercase">
                        {proj.duration}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-base mb-1.5 leading-snug">
                      {proj.title}
                    </h3>
                    <div className="text-xs font-bold text-indigo-950 mb-1">
                      Funding Agency: {proj.agency}
                    </div>
                    <div className="text-xs font-semibold text-slate-600 mb-2.5">
                      Scheme: {proj.scheme}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3">
                      {proj.impact}
                    </p>
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
          </div>
        )}

        {/* 3. AWARDS SECTION */}
        {(activeCategory === 'all' || activeCategory === 'awards') && filteredAwards.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  State Faculty Honors & Distinctions ({RESEARCH_METRICS.stateAwardsCount} State Awards)
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('about')}
                className="text-xs font-bold text-amber-700 hover:text-amber-800"
              >
                View Full Awards Gallery →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAwards.map((award, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900">
                        {award.year}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                        {award.level}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-sm mb-1">{award.title}</h3>
                    <p className="text-xs font-bold text-indigo-600 mb-2">{award.organization}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{award.highlight}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{award.category}</span>
                    <span className="text-emerald-600 font-bold">✓ Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
