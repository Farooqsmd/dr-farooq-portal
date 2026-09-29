import React, { useState } from 'react';
import { 
  X, 
  Database, 
  ExternalLink, 
  Check, 
  Copy, 
  RefreshCw, 
  Sparkles, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Download
} from 'lucide-react';
import { 
  getPatentsCsv, 
  getAwardsCsv, 
  getResourcePersonCsv, 
  getMembershipsCsv, 
  getFdpsCsv,
  GOOGLE_SHEET_TABS_SPEC 
} from '../data/googleSheetTemplate.js';

export default function GoogleSheetSyncModal({ 
  isOpen, 
  onClose, 
  bioSync 
}) {
  const [activeTab, setActiveTab] = useState('connect'); // 'connect' or 'templates'
  const [selectedTemplateTab, setSelectedTemplateTab] = useState('Patents');
  const [sheetInput, setSheetInput] = useState(bioSync.sheetId || '');
  const [copiedTab, setCopiedTab] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  if (!isOpen) return null;

  const handleSaveAndSync = async () => {
    setIsSaving(true);
    setFeedback(null);
    try {
      bioSync.setSheetId(sheetInput);
      await bioSync.refreshBioData(sheetInput);
      setFeedback({ type: 'success', text: 'Google Sheet linked and synchronized successfully!' });
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to sync. Verify the sheet link and sharing permissions.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyCsv = (tabName) => {
    let csvContent = '';
    if (tabName === 'Patents') csvContent = getPatentsCsv();
    else if (tabName === 'Awards') csvContent = getAwardsCsv();
    else if (tabName === 'Resource_Person') csvContent = getResourcePersonCsv();
    else if (tabName === 'Memberships') csvContent = getMembershipsCsv();
    else if (tabName === 'FDPs_Programs') csvContent = getFdpsCsv();

    navigator.clipboard.writeText(csvContent);
    setCopiedTab(tabName);
    setTimeout(() => setCopiedTab(null), 2500);
  };

  const handleDownloadCsv = (tabName) => {
    let csvContent = '';
    if (tabName === 'Patents') csvContent = getPatentsCsv();
    else if (tabName === 'Awards') csvContent = getAwardsCsv();
    else if (tabName === 'Resource_Person') csvContent = getResourcePersonCsv();
    else if (tabName === 'Memberships') csvContent = getMembershipsCsv();
    else if (tabName === 'FDPs_Programs') csvContent = getFdpsCsv();

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${tabName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
              <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Google Drive / Sheets Live Sync</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Zero-Code Updating
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Update your patents, awards, invited talks, memberships, and FDPs by simply editing a Google Sheet.
              </p>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-slate-800/80">
            <button
              onClick={() => setActiveTab('connect')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'connect'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              1. Connect Your Sheet
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'templates'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              2. Pre-Populated Seed Templates
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-xs sm:text-sm">
          
          {activeTab === 'connect' && (
            <div className="space-y-6">
              
              {/* Status Banner */}
              <div className={`p-4 rounded-2xl border flex items-start space-x-3 ${
                bioSync.isLiveConnected 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                {bioSync.isLiveConnected ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="font-bold text-sm">
                    {bioSync.isLiveConnected 
                      ? 'Live Google Sheet Connected & Active'
                      : 'Using Verified Offline Baseline Catalog'}
                  </div>
                  <p className="text-xs mt-0.5 opacity-90 leading-relaxed">
                    {bioSync.isLiveConnected
                      ? `Your portal is live synchronized with Google Drive. Currently reflecting ${bioSync.patents.length} patents, ${bioSync.awards.length} awards, ${bioSync.resourcePerson.length} keynote sessions, ${bioSync.memberships.length} memberships, and ${bioSync.fdps.length} FDPs.`
                      : 'Connect your personal Google Sheet below to update your achievements anytime from your laptop or smartphone.'}
                  </p>
                  {bioSync.lastSyncTime && (
                    <div className="text-[11px] font-semibold mt-1.5 opacity-75">
                      Last synchronized: {bioSync.lastSyncTime}
                    </div>
                  )}
                </div>
              </div>

              {/* Input Form */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="block font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Your Google Sheet URL or ID:
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={sheetInput}
                    onChange={(e) => setSheetInput(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/your-sheet-id/edit?usp=sharing"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs sm:text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleSaveAndSync}
                    disabled={isSaving || bioSync.isSyncing || !sheetInput.trim()}
                    className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSaving || bioSync.isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSaving ? 'Connecting...' : 'Save & Sync'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Tip: In your Google Sheet, click <strong className="text-slate-700">Share</strong> &rarr; change to <strong className="text-slate-700">"Anyone with the link can view"</strong> &rarr; copy link and paste above.
                </p>
              </div>

              {/* Feedback Alert */}
              {feedback && (
                <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center space-x-2 ${
                  feedback.type === 'success' 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                    : 'bg-red-50 border-red-300 text-red-800'
                }`}>
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>{feedback.text}</span>
                </div>
              )}

              {/* 3 Simple Setup Steps */}
              <div className="space-y-3 pt-2">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  <span>How to set this up in 2 minutes:</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-xs">1</div>
                    <div className="font-bold text-slate-900 text-xs">Create Google Sheet</div>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Open your Google Drive, click New &rarr; Google Sheets, and name it <span className="font-mono text-slate-700">Dr_Farooq_Academic_Data</span>.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-xs">2</div>
                    <div className="font-bold text-slate-900 text-xs">Copy Pre-Filled Tabs</div>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Go to the <strong>"Pre-Populated Seed Templates"</strong> tab above and 1-click copy or download your 12 patents, 6 awards, 4 talks, etc.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-xs">3</div>
                    <div className="font-bold text-slate-900 text-xs">Share & Connect</div>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Click Share &rarr; "Anyone with link can view", paste the link in the box above, and click Save & Sync!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs leading-relaxed">
                <strong>Zero Manual Typing:</strong> All your current verified records are pre-formatted below. 
                You can download the CSV files or copy the data to clipboard and paste them directly into your Google Sheet tabs.
              </div>

              {/* Template Tab Selector */}
              <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
                {GOOGLE_SHEET_TABS_SPEC.map((spec) => (
                  <button
                    key={spec.name}
                    onClick={() => setSelectedTemplateTab(spec.name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedTemplateTab === spec.name
                        ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    {spec.name}
                  </button>
                ))}
              </div>

              {/* Active Tab Preview & Actions */}
              {(() => {
                const spec = GOOGLE_SHEET_TABS_SPEC.find(s => s.name === selectedTemplateTab);
                if (!spec) return null;

                let rowCount = 0;
                if (spec.name === 'Patents') rowCount = bioSync.patents.length;
                else if (spec.name === 'Awards') rowCount = bioSync.awards.length;
                else if (spec.name === 'Resource_Person') rowCount = bioSync.resourcePerson.length;
                else if (spec.name === 'Memberships') rowCount = bioSync.memberships.length;
                else if (spec.name === 'FDPs_Programs') rowCount = bioSync.fdps.length;

                return (
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">
                          Tab Name: <code className="text-indigo-600 font-mono bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">{spec.name}</code>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">{spec.description} ({rowCount} entries)</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleCopyCsv(spec.name)}
                          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold transition-all cursor-pointer"
                        >
                          {copiedTab === spec.name ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                          <span>{copiedTab === spec.name ? 'Copied CSV!' : 'Copy to Clipboard'}</span>
                        </button>

                        <button
                          onClick={() => handleDownloadCsv(spec.name)}
                          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download .CSV</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-slate-600 bg-white p-3 rounded-xl border border-slate-200 overflow-x-auto max-h-48 whitespace-pre leading-relaxed">
                      {spec.columns.join(' | ')}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            Protected by offline fallback: Your site remains 100% active at all times.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
