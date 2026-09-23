import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Send, 
  Printer, 
  Copy, 
  Check, 
  Bookmark, 
  BookmarkCheck, 
  History, 
  Key, 
  Settings2, 
  AlertCircle,
  HelpCircle,
  Cpu,
  Layers,
  FileCheck,
  RefreshCw,
  Clock,
  ListOrdered,
  Calculator,
  PenTool,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { R23_CURRICULUM, R26_CURRICULUM } from '../data/curriculumData';
import { generateTutorAnswer } from '../services/aiTutorService';

const SAMPLE_CHIPS = [
  { topic: "How AI is useful in problem solving with state space search and heuristics", subject: "Artificial Intelligence", reg: "R23" },
  { topic: "What is Cybersecurity and how does Defense-in-Depth protect networks?", subject: "Information Security", reg: "R23" },
  { topic: "Explain Minimax Algorithm in AI with game tree evaluation and optimal move decision", subject: "Artificial Intelligence", reg: "R23" },
  { topic: "Explain Round Robin CPU Scheduling with Gantt Chart and average waiting time calculation", subject: "Operating Systems", reg: "R26" },
  { topic: "Explain Banker's Algorithm for Deadlock Avoidance with step-by-step safety test", subject: "Operating Systems", reg: "R26" },
  { topic: "Explain Cloud Computing service models (IaaS, PaaS, SaaS) and Virtualization", subject: "Cloud Computing", reg: "R23" }
];

export default function AITutor({ initialSubjectContext }) {
  // Cascading Context
  const [regulation, setRegulation] = useState(initialSubjectContext?.regulation || 'R26');
  const [subject, setSubject] = useState(initialSubjectContext?.subject || 'Applied Chemistry For Computer Science');
  const [unit, setUnit] = useState(initialSubjectContext?.unit || '');
  const [topic, setTopic] = useState('');
  const [markTarget, setMarkTarget] = useState('5m'); // '2m', '5m', '10m', 'concept'

  // Results & UI State
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [activeViewTab, setActiveViewTab] = useState('complete'); // 'complete' or 'quick'
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Optional API Key
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('srec_gemini_key') || '');
  const [showKeyModal, setShowKeyModal] = useState(false);

  // Sync if parent passes selected subject (e.g. clicking 'Ask AI Doubt' in Explorer)
  useEffect(() => {
    if (initialSubjectContext) {
      const reg = initialSubjectContext.regulation || 'R26';
      setRegulation(reg);
      const targetCurr = reg === 'R26' ? R26_CURRICULUM : R23_CURRICULUM;
      if (initialSubjectContext.subject) {
        setSubject(initialSubjectContext.subject);
        const sem = targetCurr.find(s => s.subjects?.some(sub => sub.name === initialSubjectContext.subject));
        if (sem) setSelectedSemId(sem.sem_id);
      }
      if (initialSubjectContext.unit) setUnit(initialSubjectContext.unit);
    }
  }, [initialSubjectContext]);

  // Load local storage history & bookmarks
  useEffect(() => {
    try {
      const savedBm = localStorage.getItem('srec_bookmarks');
      if (savedBm) setBookmarks(JSON.parse(savedBm));
      const savedHist = localStorage.getItem('srec_history');
      if (savedHist) setHistory(JSON.parse(savedHist));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Active curriculum list based on regulation
  const currentCurriculum = regulation === 'R26' ? R26_CURRICULUM : R23_CURRICULUM;

  // Available semesters for the chosen regulation
  const availableSemesters = useMemo(() => {
    return (currentCurriculum || []).map(s => ({
      sem_id: s.sem_id,
      label: s.year_sem
    }));
  }, [currentCurriculum]);

  const [selectedSemId, setSelectedSemId] = useState('1-1');

  // Active semester object
  const activeSemester = useMemo(() => {
    const found = (currentCurriculum || []).find(s => s.sem_id === selectedSemId);
    if (found) return found;
    return (currentCurriculum || [])[0] || null;
  }, [currentCurriculum, selectedSemId]);

  // Available subjects for the active semester
  const availableSubjects = activeSemester?.subjects || [];

  const handleGenerate = async (queryTopic = null) => {
    const qTopic = queryTopic || topic;
    if (!qTopic.trim()) return;

    setLoading(true);
    try {
      const result = await generateTutorAnswer({
        regulation,
        semester: activeSemester?.year_sem || activeSemester?.sem_id || selectedSemId,
        subject: subject || (availableSubjects[0]?.name || ''),
        unit,
        topic: qTopic,
        markTarget,
        apiKey
      });

      setAnswer(result);

      // Save to recent doubts history
      const newEntry = {
        id: Date.now(),
        topic: qTopic,
        subject,
        regulation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const updatedHist = [newEntry, ...history.filter(h => h.topic !== qTopic)].slice(0, 15);
      setHistory(updatedHist);
      localStorage.setItem('srec_history', JSON.stringify(updatedHist));

      // Check if bookmarked
      setIsBookmarked(bookmarks.some(b => b.topic === qTopic));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookmark = () => {
    if (!answer) return;
    const currentTopic = topic || answer.title;
    let updated;
    if (isBookmarked) {
      updated = bookmarks.filter(b => b.topic !== currentTopic);
      setIsBookmarked(false);
    } else {
      updated = [{
        id: Date.now(),
        topic: currentTopic,
        subject,
        regulation,
        markTarget,
        date: new Date().toLocaleDateString()
      }, ...bookmarks];
      setIsBookmarked(true);
    }
    setBookmarks(updated);
    localStorage.setItem('srec_bookmarks', JSON.stringify(updated));
  };

  const handleCopy = () => {
    if (!answer) return;
    const text = `
${answer.title}
Subject: ${subject} (${regulation}) | Marks: ${markTarget.toUpperCase()}

OVERVIEW & DEFINITION:
${answer.overview}

${answer.sections?.map(s => `${s.title}:\n${s.content}${s.points ? '\n• ' + s.points.join('\n• ') : ''}`).join('\n\n')}

${answer.visualDiagram ? `DIAGRAM (${answer.diagramCaption}):\n${answer.visualDiagram}\n` : ''}
${answer.workedExample ? `WORKED EXAMPLE (${answer.workedExample.title}):\nProblem: ${answer.workedExample.problemStatement}\n${answer.workedExample.steps.join('\n')}\nResult: ${answer.workedExample.finalResult}\n` : ''}
KEY EXAM POINTS:
${answer.keyPoints?.map(k => '• ' + k).join('\n')}

EXAM TIPS:
${answer.examWritingTips}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 ai-tutor-container">
      
      {/* Header Banner (Hidden in Print) */}
      <div className="print-hide no-print bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-10 translate-y-10">
          <Sparkles className="w-80 h-80" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative shrink-0">
            <img 
              src="/dr-farooq.jpg" 
              alt="Dr. S. Md. Farooq" 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover object-top ring-4 ring-indigo-400/30 shadow-xl"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-900 rounded-full flex items-center justify-center text-[10px] font-bold" title="Tutor Active">⚡</span>
          </div>

          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                ⚡ Open Student Access • No Login Required
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI Academic Twin of Dr. S. Md. Farooq
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              Dr. Farooq's AI Student Academic Tutor
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Ask any question across the <strong>R23</strong> and <strong>R26</strong> CSE curricula. Delivers clean, cohesive, easy-to-understand explanations with intuitive overviews, step-by-step mechanisms, practical real-world examples, and exam presentation checklists.
            </p>
          </div>
        </div>

          {/* Engine Status & Config Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Curriculum Knowledge Engine Active</span>
            </div>

            <button
              onClick={() => setShowKeyModal(true)}
              className="flex items-center space-x-1.5 text-xs font-bold text-cyan-300 hover:text-white bg-slate-800/90 hover:bg-slate-700/90 px-3.5 py-1.5 rounded-xl border border-slate-700 cursor-pointer transition-colors"
            >
              <Key className="w-3.5 h-3.5 text-yellow-400" />
              <span>{apiKey ? 'Update Gemini API Key' : 'Connect Free Gemini Key (Optional)'}</span>
            </button>

            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center space-x-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700/90 px-3.5 py-1.5 rounded-xl border border-slate-700 cursor-pointer transition-colors"
            >
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span>Recent Doubts ({history.length})</span>
            </button>
          </div>
        </div>

      {/* Query Formulation Console (Hidden in Print) */}
      <div className="print-hide no-print bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        
        {/* 1. Cascading Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Regulation */}
          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1.5">
              Regulation
            </label>
            <select
              value={regulation}
              onChange={(e) => {
                const newReg = e.target.value;
                setRegulation(newReg);
                const targetCurr = newReg === 'R26' ? R26_CURRICULUM : R23_CURRICULUM;
                const firstSem = targetCurr[0];
                if (firstSem) {
                  setSelectedSemId(firstSem.sem_id);
                  const firstSub = firstSem.subjects?.[0]?.name || '';
                  if (firstSub) setSubject(firstSub);
                }
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
            >
              <option value="R26">R26 (AI-Integrated • 2026+)</option>
              <option value="R23">R23 (Autonomous • SREC)</option>
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1.5">
              Semester
            </label>
            <select
              value={activeSemester?.sem_id || ''}
              onChange={(e) => {
                const newSemId = e.target.value;
                setSelectedSemId(newSemId);
                const semObj = currentCurriculum.find(s => s.sem_id === newSemId);
                const firstSub = semObj?.subjects?.[0]?.name || '';
                if (firstSub) setSubject(firstSub);
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
            >
              {availableSemesters.map((sem) => (
                <option key={sem.sem_id} value={sem.sem_id}>
                  {sem.label} ({sem.sem_id})
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1.5">
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
            >
              {availableSubjects.map((sub, i) => (
                <option key={i} value={sub.name}>
                  {sub.name} {sub.code ? `(${sub.code})` : ''}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* 2. Target Marks Weightage */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Exam Target:
            </span>
            <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200">
              {[
                { id: '2m', label: '2 Marks (Short Answer)' },
                { id: '5m', label: '5 Marks (Step-by-Step)' },
                { id: '10m', label: '10 Marks (Comprehensive Essay)' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setMarkTarget(t.id)}
                  className={`px-3 py-1 text-xs font-extrabold rounded-lg cursor-pointer transition-all ${
                    markTarget === t.id
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Main Question Input Box */}
        <div className="relative">
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Type your question or doubt here (e.g. How AI is useful in problem solving, What is Cybersecurity, Minimax algorithm, Round Robin CPU scheduling, Deadlock safety test)..."
            rows={3}
            className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden leading-relaxed resize-y"
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-500 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Instant university exam notes with verified concepts, diagrams, and examples.</span>
            </span>

            <button
              onClick={() => handleGenerate()}
              disabled={loading || !topic.trim()}
              className="px-6 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Study Guide...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Get Clean Academic Guide</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4. Quick Sample Queries */}
        <div>
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
            Suggested High-Yield Exam Questions (Click to Solve):
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTopic(chip.topic);
                  setSubject(chip.subject);
                  setRegulation(chip.reg);
                  handleGenerate(chip.topic);
                }}
                className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer text-left"
              >
                {chip.topic}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* RESULT CONTAINER: CLEAN, UNIFIED MASTER STUDY GUIDE */}
      {answer && (
        <div id="printable-answer-sheet" className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden transition-all">
          
          {/* Institutional Print Header */}
          <div className="print-only hidden p-6 pb-4 border-b-2 border-slate-900 text-center">
            <div className="text-base font-extrabold uppercase tracking-wide text-slate-900">
              Santhiram Engineering College (Autonomous), Nandyal
            </div>
            <div className="text-xs font-bold text-slate-700">
              Department of Computer Science and Engineering
            </div>
            <div className="text-xs text-slate-600 italic mt-0.5">
              Dr. S. Md. Farooq, HOD – CSE • Student Examination Study Sheet
            </div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-900 mt-4 pt-2 border-t border-slate-400">
              <span>Subject: {subject} ({regulation})</span>
              <span>Weightage: {markTarget.toUpperCase()}</span>
              <span>Topic: {answer.title}</span>
            </div>
          </div>
          
          {/* Top Bar (Hidden in Print) */}
          <div className="print-hide bg-slate-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                  {regulation} • {subject}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-yellow-400/20 text-yellow-300">
                  Target: {markTarget.toUpperCase()}
                </span>
              </div>
              <h3 className="text-lg sm:text-2xl font-extrabold text-white">
                {answer.title}
              </h3>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 self-end sm:self-center">
              <button
                onClick={handleCopy}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer text-xs font-semibold flex items-center space-x-1"
                title="Copy Full Solution"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleToggleBookmark}
                className={`p-2 rounded-xl transition-colors cursor-pointer text-xs font-semibold flex items-center space-x-1 ${
                  isBookmarked 
                    ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
                title="Bookmark for Exam Revision"
              >
                {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4" />}
                <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer text-xs font-semibold flex items-center space-x-1"
                title="Print Revision Sheet"
              >
                <Printer className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline">Print / PDF</span>
              </button>
            </div>
          </div>

          {/* View Tab Switcher (Hidden in Print) */}
          <div className="print-hide border-b border-slate-200 bg-slate-50 px-6 pt-3 flex space-x-4">
            <button
              onClick={() => setActiveViewTab('complete')}
              className={`pb-3 text-xs font-extrabold border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeViewTab === 'complete'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>📖 Complete Study Guide (Continuous & Deep)</span>
            </button>

            <button
              onClick={() => setActiveViewTab('quick')}
              className={`pb-3 text-xs font-extrabold border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeViewTab === 'quick'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>⚡ Quick Revision Checklist (Cheat Sheet)</span>
            </button>
          </div>

          {/* CONTENT BODY: CLEAN, COHESIVE, EASY TO UNDERSTAND */}
          <div className="p-6 sm:p-10 space-y-8">
            
            {/* TAB 1: COMPLETE COHESIVE ACADEMIC STUDY GUIDE */}
            {activeViewTab === 'complete' && (
              <div className="space-y-8">
                
                {/* 1. Core Concept & Academic Overview (Fluid, readable paragraphs) */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-indigo-700 font-extrabold text-xs uppercase tracking-wider">
                    <Award className="w-4 h-4" />
                    <span>Executive Academic Overview & Foundation</span>
                  </div>
                  <div className="text-slate-800 text-sm sm:text-base leading-relaxed space-y-3 font-normal">
                    {answer.overview.split('\n\n').map((para, pI) => (
                      <p key={pI} className="leading-relaxed text-slate-800">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>

                {/* 2. Structured Natural Sections */}
                {answer.sections && answer.sections.length > 0 && (
                  <div className="space-y-6 pt-4 border-t border-slate-100">
                    {answer.sections.map((sec, sIdx) => (
                      <div key={sIdx} className="space-y-2.5">
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-2.5">
                          <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center font-extrabold text-xs shrink-0">
                            {sIdx + 1}
                          </span>
                          <span>{sec.title}</span>
                        </h4>
                        
                        {sec.content && (
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-8.5">
                            {sec.content}
                          </p>
                        )}

                        {sec.points && sec.points.length > 0 && (
                          <div className="pl-8.5 space-y-1.5 pt-1">
                            {sec.points.map((pt, ptI) => (
                              <div key={ptI} className="text-xs sm:text-sm text-slate-700 flex items-start space-x-2">
                                <span className="text-indigo-500 font-bold shrink-0 mt-0.5">•</span>
                                <span className="leading-relaxed">{pt}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. Visual Architectural Diagram (Dynamic Title) */}
                {answer.visualDiagram && (
                  <div className="space-y-2 pt-4 border-t border-slate-100 avoid-break">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold uppercase text-slate-600 tracking-wider flex items-center space-x-2">
                        <PenTool className="w-4 h-4 text-cyan-600" />
                        <span>{answer.diagramCaption || 'System Architecture / Conceptual Flow Diagram'}</span>
                      </h4>
                      <span className="text-[11px] font-semibold text-slate-400">
                        (Neat schematic to draw in exam sheet)
                      </span>
                    </div>

                    <pre className="p-5 rounded-2xl bg-slate-900 text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
                      {answer.visualDiagram}
                    </pre>
                  </div>
                )}

                {/* 4. Concrete Real-World Example / Worked Problem */}
                {answer.workedExample && (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 avoid-break">
                    <div className="flex items-center space-x-2">
                      <Calculator className="w-5 h-5 text-indigo-600" />
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                        {answer.workedExample.title}
                      </h4>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800">
                      <strong>Problem / Scenario:</strong> {answer.workedExample.problemStatement}
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-600 block">Step-by-Step Execution / Trace:</span>
                      {answer.workedExample.steps.map((st, i) => (
                        <div key={i} className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/80 font-mono">
                          {st}
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{answer.workedExample.finalResult}</span>
                    </div>
                  </div>
                )}

                {/* 5. Comparative Table (Rendered ONLY if relevant rows exist) */}
                {answer.comparisonTable && answer.comparisonTable.rows && answer.comparisonTable.rows.length > 0 && (
                  <div className="space-y-3 pt-2 avoid-break">
                    <h4 className="text-xs font-extrabold uppercase text-slate-600 tracking-wider">
                      Comparative Technical Differentiation
                    </h4>
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
                      <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[11px]">
                          <tr>
                            {answer.comparisonTable.headers.map((h, i) => (
                              <th key={i} className="p-3.5 border-b border-slate-200">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {answer.comparisonTable.rows.map((r, rI) => (
                            <tr key={rI} className="hover:bg-slate-50/80">
                              {r.map((c, cI) => (
                                <td key={cI} className="p-3.5 font-medium">{c}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 6. Summary, Key Terms & Exam Tips (Unified Callout) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 avoid-break">
                  
                  {answer.evaluatorChecklist && answer.evaluatorChecklist.length > 0 && (
                    <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                      <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider block">
                        🎯 Evaluator Checklist (Must-Have Keywords)
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {answer.evaluatorChecklist.map((term, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-md bg-white border border-amber-300 text-amber-950 font-bold text-[11px]">
                            ✓ {term}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {answer.examWritingTips && (
                    <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
                      <span className="text-xs font-extrabold text-indigo-900 uppercase tracking-wider block">
                        ✍️ Exam Presentation Advice from Dr. Farooq
                      </span>
                      <p className="text-xs text-indigo-950 font-medium leading-relaxed">
                        {answer.examWritingTips}
                      </p>
                    </div>
                  )}

                </div>

                {/* 7. Everyday Intuition & Analogy */}
                {answer.conceptAnalogy?.simpleExplanation && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed flex items-start space-x-3 avoid-break">
                    <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold text-slate-900 block mb-1">
                        💡 Intuitive Takeaway:
                      </strong>
                      <span>{answer.conceptAnalogy.simpleExplanation}</span>
                      {answer.conceptAnalogy.realWorldAnalogy && (
                        <p className="text-xs text-slate-600 mt-2 italic">
                          "{answer.conceptAnalogy.realWorldAnalogy}"
                        </p>
                      )}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 2: QUICK REVISION CHECKLIST (Cheat Sheet for Last-Minute Revision) */}
            {activeViewTab === 'quick' && (
              <div className="space-y-6">
                
                <div className="p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-2">
                  <span className="text-xs font-extrabold uppercase text-indigo-700 tracking-wider block">
                    Core Definition in One Minute
                  </span>
                  <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                    {answer.overview.split('\n\n')[0]}
                  </p>
                </div>

                {answer.keyPoints && answer.keyPoints.length > 0 && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <span className="text-xs font-extrabold uppercase text-slate-700 tracking-wider block">
                      High-Yield Exam Summary Points
                    </span>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                      {answer.keyPoints.map((kp, kIdx) => (
                        <li key={kIdx} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{kp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                    <span className="text-xs font-bold text-amber-900 block mb-2">
                      Key Exam Formulas / Terms:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {answer.evaluatorChecklist?.map((t, i) => (
                        <span key={i} className="text-xs font-semibold bg-white px-2 py-1 rounded border border-amber-300 text-amber-900">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
                    <span className="text-xs font-bold text-indigo-900 block mb-1">
                      Exam Strategy:
                    </span>
                    <p className="text-xs text-indigo-950">
                      {answer.examWritingTips}
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* Modern R26 AI Curriculum Note */}
            {answer.aiIntegrationNote && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 flex items-start space-x-3">
                <Cpu className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                <div className="text-xs text-cyan-950">
                  <strong className="font-bold text-cyan-900 block mb-0.5">
                    🤖 Modern Curriculum & AI Connection:
                  </strong>
                  <span>{answer.aiIntegrationNote}</span>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Gemini API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-indigo-600 font-extrabold text-sm sm:text-base">
                <Key className="w-5 h-5 text-yellow-500" />
                <span>Google Gemini API Key</span>
              </div>
              <button 
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Dr. Farooq's portal has verified academic content built-in for CSE subjects. To also enable live Gemini answers for any custom question, you can connect a free API key from Google AI Studio.
            </p>

            <div className="space-y-2">
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste Gemini API Key (starts with AIzaSy...)"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-mono"
              />
              <div className="flex justify-between items-center text-[11px] text-slate-500">
                <span>Stored securely in local browser storage.</span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:underline font-bold"
                >
                  Get Free Key ↗
                </a>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => {
                  localStorage.setItem('srec_gemini_key', apiKey.trim());
                  setShowKeyModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs cursor-pointer transition-colors shadow-sm"
              >
                Save & Connect
              </button>
              {apiKey && (
                <button
                  onClick={() => {
                    setApiKey('');
                    localStorage.removeItem('srec_gemini_key');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* History Drawer */}
      {showHistory && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-end z-50">
          <div className="bg-white w-full max-w-sm h-full shadow-2xl p-6 flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
                <History className="w-4 h-4 text-cyan-600" />
                <span>Recent Doubts ({history.length})</span>
              </h3>
              <button 
                onClick={() => setShowHistory(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {history.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400">
                  No previous questions recorded.
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setTopic(item.topic);
                      setSubject(item.subject);
                      setRegulation(item.regulation);
                      setShowHistory(false);
                      handleGenerate(item.topic);
                    }}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-colors cursor-pointer group text-left"
                  >
                    <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 line-clamp-2">
                      {item.topic}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span>{item.subject}</span>
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {history.length > 0 && (
              <button
                onClick={() => {
                  setHistory([]);
                  localStorage.removeItem('srec_history');
                }}
                className="w-full py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                Clear History
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
