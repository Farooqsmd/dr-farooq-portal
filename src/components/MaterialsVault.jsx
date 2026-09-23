import React, { useState, useEffect, useMemo } from 'react';
import { 
  FolderDown, 
  Search, 
  ExternalLink, 
  Download, 
  Eye, 
  RefreshCw, 
  FileText, 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  Filter, 
  Grid, 
  List, 
  AlertCircle,
  HelpCircle,
  FileCode,
  SlidersHorizontal,
  FolderOpen
} from 'lucide-react';
import { 
  fetchDriveMaterials, 
  GOOGLE_DRIVE_FOLDER_URL, 
  APPS_SCRIPT_EXEC_URL 
} from '../services/driveMaterialsService';

export default function MaterialsVault({ onSelectSubjectForTutor }) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRegulation, setSelectedRegulation] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showConfigHelper, setShowConfigHelper] = useState(false);

  // Load materials from Drive or cache on component mount
  const loadMaterials = async (forceRefresh = false) => {
    setLoading(true);
    const result = await fetchDriveMaterials(forceRefresh);
    setMaterials(result.files);
    setSyncStatus(result);
    setLoading(false);
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  // Filtered materials
  const filteredMaterials = useMemo(() => {
    return materials.filter(item => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // Regulation filter
      if (selectedRegulation !== 'All' && item.regulation && item.regulation !== selectedRegulation) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesSubject = item.subject && item.subject.toLowerCase().includes(q);
        const matchesCategory = item.category && item.category.toLowerCase().includes(q);
        const matchesSem = item.sem && item.sem.toLowerCase().includes(q);
        if (!matchesName && !matchesSubject && !matchesCategory && !matchesSem) {
          return false;
        }
      }
      return true;
    });
  }, [materials, selectedCategory, selectedRegulation, searchQuery]);

  // Categories present in the dataset
  const availableCategories = useMemo(() => {
    const cats = new Set(['All']);
    materials.forEach(m => {
      if (m.category) cats.add(m.category);
    });
    return Array.from(cats);
  }, [materials]);

  // Get file icon based on mimeType or file name
  const getFileBadge = (name, mimeType) => {
    const ext = name.split('.').pop().toLowerCase();
    if (ext === 'pdf' || (mimeType && mimeType.includes('pdf'))) {
      return { label: 'PDF', bg: 'bg-red-50 text-red-700 border-red-200/80', icon: FileText };
    }
    if (ext === 'ppt' || ext === 'pptx') {
      return { label: 'PPT', bg: 'bg-amber-50 text-amber-700 border-amber-200/80', icon: FileText };
    }
    if (ext === 'doc' || ext === 'docx') {
      return { label: 'DOC', bg: 'bg-blue-50 text-blue-700 border-blue-200/80', icon: FileText };
    }
    if (ext === 'py' || ext === 'c' || ext === 'java' || ext === 'ipynb') {
      return { label: 'CODE', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80', icon: FileCode };
    }
    return { label: 'FILE', bg: 'bg-slate-50 text-slate-700 border-slate-200', icon: FileText };
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-10 shadow-xl border border-indigo-800/30">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              <FolderDown className="w-3.5 h-3.5 text-indigo-400" />
              <span>SREC CSE Department • Cloud Repository</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Course Materials & Resource Vault
            </h1>
            
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Official lecture notes, lab manuals, university question banks, and curriculum resources curated by{' '}
              <strong className="text-white font-semibold">Dr. S. Md. Farooq</strong>. Connected live with Google Drive for real-time document synchronization.
            </p>

            {/* Live Sync Indicator */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Google Drive Folder Active</span>
                <span className="text-emerald-400/60">({materials.length} Documents)</span>
              </div>

              <a
                href={GOOGLE_DRIVE_FOLDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-medium text-white transition-colors"
              >
                <FolderOpen className="w-3.5 h-3.5 text-amber-300" />
                <span>Open in Google Drive</span>
                <ExternalLink className="w-3 h-3 text-slate-300" />
              </a>

              <button
                onClick={() => loadMaterials(true)}
                disabled={loading}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/30 text-xs font-medium text-indigo-200 transition-colors disabled:opacity-50"
                title="Force refresh files from Google Drive"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Sync Now</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Badge on Desktop */}
          <div className="hidden lg:flex flex-col items-center justify-center p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shrink-0 w-52 text-center space-y-1">
            <span className="text-3xl font-black text-amber-400 tracking-tight">{materials.length}</span>
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Indexed Documents</span>
            <span className="text-[11px] text-slate-400">R23 & R26 Autonomous</span>
          </div>
        </div>
      </div>

      {/* Helpful Setup Assistant / Status Card for Dr. Farooq */}
      {syncStatus?.setupNotice && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-900 shadow-2xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-amber-900">
                  Google Drive Live Synchronization Setup Guide
                </h3>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Your Google Apps Script Web App is deployed! To enable automatic real-time sync with your Drive folder, update <strong>Line 3</strong> in your Apps Script:
                </p>
                <div className="mt-2 p-2.5 rounded-lg bg-white/90 border border-amber-300 font-mono text-xs text-slate-800 select-all overflow-x-auto">
                  const FOLDER_ID = &quot;179fppvZLI6fn0p7qmZJYO0wjjYLwnC2w&quot;;
                </div>
                <p className="text-[11px] text-amber-700 mt-1">
                  Then click <strong>Deploy &gt; Manage deployments &gt; Edit (pencil icon) &gt; Version: New Version &gt; Deploy</strong>. The portal will then sync automatically! In the meantime, full foundation course materials are loaded below.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowConfigHelper(!showConfigHelper)}
              className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline shrink-0"
            >
              {showConfigHelper ? 'Hide Details' : 'View Code'}
            </button>
          </div>

          {showConfigHelper && (
            <div className="mt-4 pt-4 border-t border-amber-200/80 text-xs space-y-2">
              <p className="font-semibold text-amber-950">Recommended Apps Script Code (supports auto URL/ID extraction):</p>
              <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl overflow-x-auto text-[11px] font-mono leading-relaxed">
{`function doGet() {
  var folderId = "179fppvZLI6fn0p7qmZJYO0wjjYLwnC2w";
  if (folderId.indexOf("/folders/") !== -1) {
    folderId = folderId.split("/folders/")[1].split("?")[0];
  }
  var folder = DriveApp.getFolderById(folderId);
  var filesList = [];
  
  var files = folder.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    filesList.push({
      id: file.getId(),
      name: file.getName(),
      size: (file.getSize() / (1024 * 1024)).toFixed(2) + " MB",
      mimeType: file.getMimeType(),
      updated: file.getLastUpdated().toISOString().split("T")[0],
      category: "Lecture Notes",
      viewUrl: file.getUrl(),
      downloadUrl: "https://drive.google.com/uc?export=download&id=" + file.getId()
    });
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({ status: "success", count: filesList.length, files: filesList }))
    .setMimeType(ContentService.MimeType.JSON);
}`}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Filter & Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by subject, topic, unit notes, question bank..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Regulation & View Controls */}
          <div className="flex items-center space-x-2 self-end md:self-auto shrink-0">
            {/* Regulation Toggle */}
            <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600">
              {['All', 'R26', 'R23'].map(reg => (
                <button
                  key={reg}
                  onClick={() => setSelectedRegulation(reg)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedRegulation === reg 
                      ? 'bg-white text-indigo-700 shadow-2xs font-bold' 
                      : 'hover:text-slate-900'
                  }`}
                >
                  {reg === 'All' ? 'All Reg' : reg}
                </button>
              ))}
            </div>

            {/* View Mode Switcher (Grid vs List) */}
            <div className="hidden sm:inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid Card View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Table List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-medium pl-1 flex items-center space-x-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </span>
          {availableCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all font-semibold ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Materials List / Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Connecting to Google Drive Repository...</p>
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No matching materials found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search keywords or switching category filters.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedRegulation('All'); }}
            className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMaterials.map((file) => {
            const badge = getFileBadge(file.name, file.mimeType);
            const BadgeIcon = badge.icon;

            return (
              <div
                key={file.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 p-5 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.8 rounded-md text-[11px] font-bold border ${badge.bg}`}>
                      <BadgeIcon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>

                    <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-500">
                      {file.regulation && (
                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">
                          {file.regulation}
                        </span>
                      )}
                      {file.sem && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {file.sem}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* File Title */}
                  <h3 
                    className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2"
                    title={file.name}
                  >
                    {file.name.replace(/\.[^/.]+$/, "")}
                  </h3>

                  {/* Subject & Category Meta */}
                  <div className="space-y-1 text-xs text-slate-500">
                    {file.subject && (
                      <p className="flex items-center space-x-1.5 text-slate-700 font-medium">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="truncate">{file.subject}</span>
                      </p>
                    )}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Category: <strong className="text-slate-600">{file.category || 'General'}</strong></span>
                      <span>{file.size || 'PDF'}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <a
                    href={file.viewUrl || GOOGLE_DRIVE_FOLDER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Notes</span>
                  </a>

                  <a
                    href={file.downloadUrl || GOOGLE_DRIVE_FOLDER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                    title="Download File"
                  >
                    <Download className="w-4 h-4" />
                  </a>

                  {onSelectSubjectForTutor && file.subject && (
                    <button
                      onClick={() => onSelectSubjectForTutor({
                        name: file.subject,
                        code: file.sem || 'CSE',
                        regulation: file.regulation || 'R26'
                      })}
                      className="inline-flex items-center justify-center p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold transition-colors"
                      title="Ask AI Doubt Solver about this subject"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table / List View */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Document Title</th>
                  <th className="py-3 px-3">Subject</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Reg</th>
                  <th className="py-3 px-3">Size</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMaterials.map((file) => (
                  <tr key={file.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs truncate">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span className="truncate" title={file.name}>{file.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{file.subject || '—'}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {file.category || 'General'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-indigo-700">{file.regulation || 'R23'}</td>
                    <td className="py-3 px-3 text-slate-400 font-mono">{file.size || '—'}</td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center space-x-1.5">
                        <a
                          href={file.viewUrl || GOOGLE_DRIVE_FOLDER_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold inline-flex items-center space-x-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </a>
                        <a
                          href={file.downloadUrl || GOOGLE_DRIVE_FOLDER_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
