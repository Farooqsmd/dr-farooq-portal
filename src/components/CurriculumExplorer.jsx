import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  ArrowRight,
  Filter,
  FolderDown
} from 'lucide-react';
import { R23_CURRICULUM, R26_CURRICULUM, R26_DETAILED_SYLLABI } from '../data/curriculumData';

export default function CurriculumExplorer({ onSelectSubjectForTutor, onNavigateToMaterials }) {
  const [selectedRegulation, setSelectedRegulation] = useState('R26'); // 'R26' or 'R23'
  const [selectedSemId, setSelectedSemId] = useState('1-1'); // Default to 1st sem
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSubjectCode, setExpandedSubjectCode] = useState(null);

  // Active curriculum data based on regulation
  const currentRegulationData = selectedRegulation === 'R26' ? R26_CURRICULUM : R23_CURRICULUM;

  // Available semesters for the chosen regulation
  const availableSemesters = useMemo(() => {
    return currentRegulationData.map(s => ({
      sem_id: s.sem_id,
      label: s.year_sem
    }));
  }, [currentRegulationData]);

  // Ensure valid sem_id when switching regulations
  const activeSemester = useMemo(() => {
    const found = currentRegulationData.find(s => s.sem_id === selectedSemId);
    if (found) return found;
    return currentRegulationData[0] || null;
  }, [currentRegulationData, selectedSemId]);

  // Filter subjects by search
  const filteredSubjects = useMemo(() => {
    if (!activeSemester) return [];
    if (!searchQuery.trim()) return activeSemester.subjects;

    const q = searchQuery.toLowerCase();
    return activeSemester.subjects.filter(sub => 
      sub.name.toLowerCase().includes(q) || 
      (sub.code && sub.code.toLowerCase().includes(q))
    );
  }, [activeSemester, searchQuery]);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
          <BookOpen className="w-4 h-4" />
          <span>Curriculum & Syllabi Architecture</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explore CSE Course Regulations
        </h2>
        <p className="text-slate-500 text-sm sm:text-base mt-2">
          Compare Autonomous <strong className="text-slate-700">R23 Regulation</strong> and the pioneering <strong className="text-indigo-600">R26 Regulation</strong> featuring deep AI integration across all academic courses.
        </p>
      </div>

      {/* Regulation Tabs Switcher */}
      <div className="flex justify-center">
        <div className="bg-slate-200/80 p-1.5 rounded-2xl inline-flex space-x-2 shadow-inner">
          <button
            onClick={() => {
              setSelectedRegulation('R26');
              setSelectedSemId('1-1');
              setExpandedSubjectCode(null);
            }}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              selectedRegulation === 'R26'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>R26 Regulation (AI-Integrated)</span>
            <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
              New
            </span>
          </button>

          <button
            onClick={() => {
              setSelectedRegulation('R23');
              setSelectedSemId('2-1');
              setExpandedSubjectCode(null);
            }}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              selectedRegulation === 'R23'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-slate-500" />
            <span>R23 Regulation (Autonomous)</span>
          </button>
        </div>
      </div>

      {/* Regulation Banner Info */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
        selectedRegulation === 'R26'
          ? 'bg-gradient-to-r from-indigo-50 via-sky-50 to-blue-50 border-indigo-200 text-indigo-900'
          : 'bg-slate-100/80 border-slate-200 text-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0 ${
              selectedRegulation === 'R26' ? 'bg-indigo-600' : 'bg-slate-700'
            }`}>
              {selectedRegulation}
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                {selectedRegulation === 'R26' 
                  ? 'R26 Regulation – Every Course Engineered with AI Integration' 
                  : 'R23 Regulation – Santhiram Engineering College Autonomous'}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {selectedRegulation === 'R26'
                  ? 'From Applied Chemistry to Operating Systems, each course embeds Python simulations, ML prediction, and open-source AI tools.'
                  : 'Structured semester-wise curriculum for core B.Tech Computer Science & Engineering students.'}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs shrink-0">
            {currentRegulationData.length} Semesters Available
          </span>
        </div>
      </div>

      {/* Quick link to Course Materials Vault */}
      {onNavigateToMaterials && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-indigo-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center space-x-2.5 text-indigo-950 font-medium">
            <FolderDown className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Looking for official lecture notes, unit slides, and model question papers?</span>
          </div>
          <button
            onClick={onNavigateToMaterials}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-2xs shrink-0 flex items-center space-x-1.5 cursor-pointer"
          >
            <span>Open Course Materials Vault</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Semester Selector Pills & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Semester Pills */}
        <div className="flex flex-wrap gap-2">
          {availableSemesters.map(sem => {
            const isSelected = (activeSemester?.sem_id === sem.sem_id);
            return (
              <button
                key={sem.sem_id}
                onClick={() => {
                  setSelectedSemId(sem.sem_id);
                  setExpandedSubjectCode(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {sem.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search subjects or codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
          />
        </div>

      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject, idx) => {
          const subKey = subject.code || `${subject.name}-${idx}`;
          const isExpanded = expandedSubjectCode === subKey;
          
          // Match detailed syllabus if in R26
          let detailedUnits = [];
          if (selectedRegulation === 'R26') {
            const matchedKey = Object.keys(R26_DETAILED_SYLLABI).find(k => 
              k.toLowerCase().includes(subject.name.toLowerCase().slice(0, 15)) ||
              subject.name.toLowerCase().includes(k.toLowerCase().slice(0, 15))
            );
            if (matchedKey) {
              detailedUnits = R26_DETAILED_SYLLABI[matchedKey].units || [];
            }
          }

          return (
            <div
              key={subKey}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                isExpanded ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500' : 'border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300'
              }`}
            >
              <div className="p-5">
                
                {/* Subject Header Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                      {subject.code || `Course ${idx + 1}`}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-50 text-blue-700 uppercase">
                      {subject.type || 'Core'}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    {subject.credits} Credits
                  </span>
                </div>

                {/* Subject Title */}
                <h4 className="font-extrabold text-slate-900 text-base leading-snug mb-2">
                  {subject.name}
                </h4>

                {/* AI Integration Highlight for R26 */}
                {selectedRegulation === 'R26' && (
                  <div className="mb-4 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>AI Simulation & Tools Integrated</span>
                  </div>
                )}

                {/* Expandable Syllabus preview */}
                {isExpanded && detailedUnits.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                    <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                      Unit Syllabus & AI Tools:
                    </p>
                    {detailedUnits.map((u, uIdx) => (
                      <div key={uIdx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                        <div className="font-bold text-slate-800">{u.unit}</div>
                        {u.ai_integration && (
                          <div className="text-[11px] text-indigo-700 font-medium bg-indigo-50/70 p-1.5 rounded-md">
                            <strong>AI Tools:</strong> {u.ai_integration}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                
                {detailedUnits.length > 0 && (
                  <button
                    onClick={() => setExpandedSubjectCode(isExpanded ? null : subKey)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>{isExpanded ? 'Hide Units' : `View ${detailedUnits.length} Units`}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                )}

                <button
                  onClick={() => onSelectSubjectForTutor({
                    regulation: selectedRegulation,
                    semester: activeSemester.year_sem,
                    subject: subject.name,
                    unit: detailedUnits[0]?.unit || 'Unit 1: Fundamentals'
                  })}
                  className="ml-auto flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Ask AI Doubt</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-sm">No subjects matched your query "{searchQuery}".</p>
        </div>
      )}

    </div>
  );
}
