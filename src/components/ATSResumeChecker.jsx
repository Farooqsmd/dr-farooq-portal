import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  Briefcase, 
  TrendingUp, 
  Zap, 
  RefreshCw, 
  Download,
  Copy,
  HelpCircle,
  Brain,
  Code2,
  BarChart3,
  Cloud,
  ShieldAlert
} from 'lucide-react';
import { TARGET_ROLES, STRONG_ACTION_VERBS, WEAK_WORDS, SAMPLE_RESUME } from '../data/atsData';

const roleIcons = {
  Code2,
  Brain,
  BarChart3,
  Cloud,
  ShieldAlert
};

export default function ATSResumeChecker() {
  const [selectedRole, setSelectedRole] = useState(TARGET_ROLES[0]);
  const [resumeText, setResumeText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleLoadSample = () => {
    setResumeText(SAMPLE_RESUME);
    handleAnalyze(SAMPLE_RESUME, selectedRole);
  };

  const handleAnalyze = (textToAnalyze = resumeText, role = selectedRole) => {
    const text = textToAnalyze.trim();
    if (!text) return;

    setAnalyzing(true);

    setTimeout(() => {
      const lower = text.toLowerCase();

      // 1. Keyword Matching
      const matchedRequired = role.requiredKeywords.filter(k => lower.includes(k.toLowerCase()));
      const missingRequired = role.requiredKeywords.filter(k => !lower.includes(k.toLowerCase()));
      const matchedBonus = role.bonusKeywords.filter(k => lower.includes(k.toLowerCase()));

      const keywordScore = Math.round((matchedRequired.length / role.requiredKeywords.length) * 50);

      // 2. Action Verbs
      const matchedVerbs = STRONG_ACTION_VERBS.filter(v => lower.includes(v.toLowerCase()));
      const foundWeakWords = WEAK_WORDS.filter(w => lower.includes(w.toLowerCase()));
      const verbScore = Math.min(20, matchedVerbs.length * 3);

      // 3. Quantified Impact (Metrics: %, numbers, time, users)
      const metricMatches = text.match(/\b(\d+%\b|\d+\+?\s*(users|processes|ms|seconds|minutes|hours|queries|problems|projects|team))/gi) || [];
      const metricsScore = Math.min(15, metricMatches.length * 4);

      // 4. Structural Sections
      const hasEducation = lower.includes('education') || lower.includes('b.tech') || lower.includes('college');
      const hasProjects = lower.includes('project') || lower.includes('projects');
      const hasSkills = lower.includes('skills') || lower.includes('technical skills');
      const hasContact = lower.includes('@') && (lower.includes('github') || lower.includes('linkedin'));

      let structureScore = 0;
      if (hasEducation) structureScore += 4;
      if (hasProjects) structureScore += 4;
      if (hasSkills) structureScore += 4;
      if (hasContact) structureScore += 3;

      // Total Score
      const totalScore = Math.min(100, keywordScore + verbScore + metricsScore + structureScore);

      setAnalysisResult({
        totalScore,
        matchedRequired,
        missingRequired,
        matchedBonus,
        matchedVerbs,
        foundWeakWords,
        metricMatchesCount: metricMatches.length,
        hasEducation,
        hasProjects,
        hasSkills,
        hasContact
      });

      setAnalyzing(false);
    }, 600);
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>SREC CSE Placement Launchpad</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Student ATS Resume Score & Placement Optimizer
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Over 75% of resumes are rejected by ATS screening software before human review. Scan your resume against industry hiring criteria, detect missing tech keywords, replace weak phrasing, and accelerate your placement success.
          </p>
        </div>
      </div>

      {/* Configuration Console */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        
        {/* Step 1: Select Target Role */}
        <div>
          <label className="block text-xs font-extrabold uppercase text-slate-700 tracking-wider mb-2">
            1. Select Your Target Placement Job Role
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {TARGET_ROLES.map((role) => {
              const Icon = roleIcons[role.icon] || Briefcase;
              const isSelected = selectedRole.id === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => {
                    setSelectedRole(role);
                    if (resumeText.trim()) handleAnalyze(resumeText, role);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-600/20 text-indigo-950'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <div>
                    <h3 className="font-extrabold text-xs">{role.title}</h3>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{role.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Resume Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-extrabold uppercase text-slate-700 tracking-wider">
              2. Paste Your Resume Content (Text / Markdown)
            </label>
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg transition-colors cursor-pointer"
            >
              📋 Load Sample Mentee Resume
            </button>
          </div>

          <textarea
            rows={10}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here (Education, Technical Skills, Projects, Experience, Certifications)..."
            className="w-full p-4 rounded-2xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50 text-slate-900"
          />

          <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
            <span>Word Count: {resumeText.trim() ? resumeText.trim().split(/\s+/).length : 0} words</span>
            <span>Recommended: 400 - 650 words for freshers</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={() => handleAnalyze()}
            disabled={analyzing || !resumeText.trim()}
            className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-sm shadow-md shadow-indigo-500/25 flex items-center space-x-2 transition-all cursor-pointer"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running ATS Screener...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-yellow-300" />
                <span>Analyze ATS Match Score</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-8">
          
          {/* Score Summary Banner */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 rounded-2xl bg-slate-50 border border-slate-200">
            
            {/* Score Circle (4 cols) */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
              <div className={`w-32 h-32 rounded-full flex flex-col items-center justify-center border-8 shadow-inner ${
                analysisResult.totalScore >= 80 
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900' 
                  : analysisResult.totalScore >= 60 
                  ? 'border-amber-500 bg-amber-50 text-amber-900' 
                  : 'border-rose-500 bg-rose-50 text-rose-900'
              }`}>
                <span className="text-4xl font-extrabold tracking-tight">
                  {analysisResult.totalScore}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  out of 100
                </span>
              </div>

              <span className={`mt-3 px-3 py-1 rounded-full text-xs font-extrabold ${
                analysisResult.totalScore >= 80 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : analysisResult.totalScore >= 60 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {analysisResult.totalScore >= 80 ? 'Placement Ready (Strong Match)' : analysisResult.totalScore >= 60 ? 'Moderate Match (Needs Polish)' : 'High Risk of ATS Rejection'}
              </span>
            </div>

            {/* Score Insights (8 cols) */}
            <div className="md:col-span-8 space-y-3">
              <h3 className="text-lg font-extrabold text-slate-900">
                Evaluation for: {selectedRole.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {analysisResult.totalScore >= 80
                  ? 'Your resume demonstrates strong technical depth, clear quantified metrics, and healthy ATS keyword frequency aligned with top hiring companies.'
                  : 'Your resume is missing some essential high-frequency technical keywords and quantified metrics that campus ATS screeners prioritize.'}
              </p>

              {/* Quick Metrics Checklist */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center">
                  <div className="text-xs text-slate-400 font-bold uppercase">Required Keywords</div>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">
                    {analysisResult.matchedRequired.length} / {selectedRole.requiredKeywords.length}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center">
                  <div className="text-xs text-slate-400 font-bold uppercase">Power Action Verbs</div>
                  <div className="text-base font-extrabold text-indigo-600 mt-0.5">
                    {analysisResult.matchedVerbs.length} Found
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center">
                  <div className="text-xs text-slate-400 font-bold uppercase">Quantified Impact</div>
                  <div className="text-base font-extrabold text-emerald-600 mt-0.5">
                    {analysisResult.metricMatchesCount} Metrics
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center">
                  <div className="text-xs text-slate-400 font-bold uppercase">Passive Words</div>
                  <div className={`text-base font-extrabold mt-0.5 ${analysisResult.foundWeakWords.length > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {analysisResult.foundWeakWords.length} Detected
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Detailed Breakdown Grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. Missing vs Matched Keywords */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
                <Brain className="w-4 h-4 text-indigo-600" />
                <span>Technical Keyword Matching</span>
              </h4>

              {/* Matched */}
              <div>
                <span className="text-xs font-bold text-emerald-700 block mb-2">
                  ✓ Matched Keywords ({analysisResult.matchedRequired.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.matchedRequired.map((k, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                      {k}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing */}
              {analysisResult.missingRequired.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-bold text-rose-700 block mb-2">
                    ✗ Missing Critical Keywords ({analysisResult.missingRequired.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.missingRequired.map((k, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold">
                        + Add {k}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    *Tip: Add missing keywords into your technical skills or project descriptions if you have knowledge of them.
                  </p>
                </div>
              )}
            </div>

            {/* 2. Action Verbs & Structural Health */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Structural & Phrasing Health</span>
              </h4>

              {/* Structural Sections */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50">
                  <span className="font-semibold text-slate-700">Contact & Profiles (Email, GitHub/LinkedIn)</span>
                  {analysisResult.hasContact ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
                </div>
                <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50">
                  <span className="font-semibold text-slate-700">Education Details (B.Tech / College)</span>
                  {analysisResult.hasEducation ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
                </div>
                <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50">
                  <span className="font-semibold text-slate-700">Technical Skills Section</span>
                  {analysisResult.hasSkills ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
                </div>
                <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50">
                  <span className="font-semibold text-slate-700">Projects Section</span>
                  {analysisResult.hasProjects ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
                </div>
              </div>

              {/* Weak words alert */}
              {analysisResult.foundWeakWords.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
                  <strong className="block mb-1">Replace Passive Verbs:</strong>
                  <span>Found: {analysisResult.foundWeakWords.map(w => `"${w}"`).join(', ')}. Replace them with active verbs like <em>"Architected", "Engineered", "Optimized", "Spearheaded"</em>.</span>
                </div>
              )}
            </div>

          </div>

          {/* Actionable Recommendations */}
          <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-3">
            <h4 className="font-extrabold text-indigo-950 text-sm flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Campus Placement Action Plan</span>
            </h4>
            <ul className="text-xs text-indigo-900 space-y-2 list-disc list-inside">
              <li>Always quantify achievements using the <strong>Google X-Y-Z formula</strong>: <em>"Accomplished [X] as measured by [Y], by doing [Z]"</em> (e.g. reduced latency by 20% by implementing caching).</li>
              <li>Avoid complex tables, multi-column templates, or images in your resume as they scramble ATS parsers.</li>
              <li>Include your active LeetCode / HackerRank solved count and GitHub links with live deployed URLs.</li>
            </ul>
          </div>

        </div>
      )}

    </div>
  );
}
