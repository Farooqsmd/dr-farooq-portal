import React, { useState, useMemo, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  Printer, 
  Download, 
  Copy, 
  Check, 
  X, 
  FileText, 
  ShieldCheck, 
  Award, 
  Lightbulb, 
  BookOpen, 
  ExternalLink,
  GraduationCap,
  Users,
  Briefcase,
  Layers,
  ChevronDown,
  Type,
  AlignJustify,
  QrCode as QrIcon
} from 'lucide-react';
import { 
  PROFESSOR_PROFILE, 
  SUPERVISOR_DATA, 
  FUNDED_PROJECTS_DATA,
  BOS_COMMITTEES_DATA, 
  RESOURCE_PERSON_DATA, 
  FDP_TRAINING_DATA 
} from '../data/profileData';
import { PATENTS_DATA, PUBLICATIONS_DATA, RESEARCH_METRICS } from '../data/researchData';

// Ordered list of academic years (Recent Years at the Top: 2025 to 2013)
const FDP_YEARS_ORDER = ['2025', '2024', '2023', '2022', '2021', '2020', '2013'];

// Group FDPs by Academic Year at module level
const FDP_BY_YEAR = (() => {
  const groups = {};
  FDP_YEARS_ORDER.forEach(y => { groups[y] = []; });
  FDP_TRAINING_DATA.forEach(item => {
    const y = item.year || '2020';
    if (!groups[y]) groups[y] = [];
    groups[y].push(item);
  });
  return groups;
})();

export default function AcademicCVModal({ isOpen, onClose, dynamicMetrics, publications }) {
  const [cvFormat, setCvFormat] = useState('full'); // 'full' (Comprehensive CV) or 'executive' (2-Page Resume)
  const [fontFamily, setFontFamily] = useState('serif'); // 'serif' (Classic Academic) or 'sans' (Modern Executive)
  const [pubScope, setPubScope] = useState('scopus'); // 'scopus' (39 Scopus Papers) or 'all' (All 74 Publications)
  const [copiedText, setCopiedText] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const m = dynamicMetrics || PROFESSOR_PROFILE.metrics || RESEARCH_METRICS;
  const allPubs = publications || PUBLICATIONS_DATA;
  const scopusPubs = useMemo(() => allPubs.filter(p => (p.sources || []).includes('Scopus')), [allPubs]);

  // Strictly deduplicated complete publication catalog (guaranteeing zero duplicates)
  const deduplicatedAllPubs = useMemo(() => {
    const seen = new Set();
    const result = [];
    allPubs.forEach(p => {
      const cleanTitle = (p.title || '')
        .replace(/^\d+\s+/, '')
        .replace(/&amp;/g, '&')
        .replace(/[^a-zA-Z0-9]/g, '')
        .toLowerCase();
      if (cleanTitle && !seen.has(cleanTitle)) {
        seen.add(cleanTitle);
        result.push(p);
      }
    });
    // Sort descending by academic year (recent on top)
    return result.sort((a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0));
  }, [allPubs]);

  // Generate high-resolution scannable QR Code pointing to Dr. Farooq's official ORCID profile
  useEffect(() => {
    QRCode.toDataURL('https://orcid.org/0000-0003-0936-1980', {
      width: 260,
      margin: 1,
      color: {
        dark: '#020617', // high-contrast deep slate
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error('Failed to generate verification QR code:', err));
  }, []);

  if (!isOpen) return null;

  const activePubs = pubScope === 'all' ? deduplicatedAllPubs : scopusPubs;
  const displayedPubs = cvFormat === 'executive' ? activePubs.slice(0, 10) : activePubs;

  const displayedFdps = cvFormat === 'executive' 
    ? FDP_TRAINING_DATA.filter(f => ['2025', '2024', '2023', '2022'].includes(f.year) || f.isFlagship).slice(0, 12)
    : FDP_TRAINING_DATA;

  const handlePrint = () => {
    const originalTitle = document.title;
    // Set official clean title for PDF file naming and clean print header
    document.title = 'Curriculum_Vitae_Dr_S_Md_Farooq';
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1500);
  };

  const currentDateFormatted = new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const generatePlainTextCV = () => {
    let text = `========================================================================\n`;
    text += `OFFICIAL ACADEMIC CURRICULUM VITAE\n`;
    text += `Dr. S. Md. Farooq, B.Tech., M.Tech., Ph.D. (VIT Vellore)\n`;
    text += `Professor & Head of the Department\n`;
    text += `Department of Computer Science & Engineering\n`;
    text += `Recognized Ph.D. Research Supervisor (JNTUA & Annamacharya University)\n`;
    text += `Santhiram Engineering College (Autonomous), Nandyal, Andhra Pradesh, India\n`;
    text += `Official Email: ${PROFESSOR_PROFILE.email} | Alternate Email: ${PROFESSOR_PROFILE.alternateEmail || 'farook.1201@gmail.com'}\n`;
    text += `Scopus Author ID: 57202806468 | IEEE Author ID: 990518851303926\n`;
    text += `ORCID ID: 0000-0003-0936-1980 | Google Scholar: wmHlQRMAAAAJ\n`;
    text += `========================================================================\n\n`;

    text += `I. EXECUTIVE PROFILE & LEADERSHIP STATEMENT\n`;
    text += `------------------------------------------------------------------------\n`;
    text += `Dr. S. Md. Farooq serves as Professor & Head of the Department of Computer Science and Engineering (CSE) and Chairperson of the Board of Studies (BOS) for B.Tech & M.Tech programs at Santhiram Engineering College (Autonomous), Nandyal. With 16+ years of exemplary academic, research, and administrative stewardship, he is a recognized Ph.D. Research Supervisor at Jawaharlal Nehru Technological University Anantapur (JNTUA, 2023) and Annamacharya University (2025). He serves on the Academic Advisory Committee for Stanley College of Engineering and Technology for Women (Hyderabad), acts as Faculty Advisor for the IEEE Computer Society Student Branch Chapter, and has spearheaded autonomous curriculum innovation (R23 & AI-infused R26) aligned with Outcome-Based Education (OBE), NBA, and NAAC accreditation frameworks.\n\n`;

    text += `II. ACADEMIC & RESEARCH METRICS SUMMARY\n`;
    text += `------------------------------------------------------------------------\n`;
    text += `- Scopus Indexed Publications: 39 Documents\n`;
    text += `- Total Scholarly Works: 74 Publications (Scopus, IEEE & Google Scholar)\n`;
    text += `- Total Research Citations: 393+ (h-index: 12, i10-index: 13)\n`;
    text += `- Intellectual Property: 12 Patents (3 Granted, 9 Published under KAPILA Scheme)\n`;
    text += `- Sponsored Research Projects & Grants: 2 Completed Grants (₹1,00,000 Sanctioned by JNTUA & DST)\n`;
    text += `- Ph.D. Doctoral Supervision: 2 Universities (JNTUA Empaneled 2023, AU Recognized 2025)\n`;
    text += `- Curricular Governance: BoS Chairperson (CSE, SREC) & Advisory Member (AIML, Stanley)\n`;
    text += `- Professional Society Memberships: 12 (2 Life Memberships - ISTE LM96672, ISRD M4150902960; WRU Valid 2026)\n`;
    text += `- State Honors & Faculty Distinctions: 6 State Awards (2025 - 2018)\n`;
    text += `- Invited Keynotes & Resource Person Sessions: 4 Sessions\n`;
    text += `- Faculty Development & ATAL Training Programs: 54 Programs\n\n`;

    text += `III. HIGHER EDUCATION & ACADEMIC CREDENTIALS\n`;
    text += `------------------------------------------------------------------------\n`;
    PROFESSOR_PROFILE.education.forEach(e => {
      text += `* ${e.degree} - ${e.institution} (${e.year})\n  Specialization: ${e.focus}\n`;
    });
    text += `\n`;

    text += `IV. DOCTORAL RESEARCH SUPERVISION (RECOGNIZED PH.D. GUIDE)\n`;
    text += `------------------------------------------------------------------------\n`;
    SUPERVISOR_DATA.forEach((s, i) => {
      text += `${i + 1}. [Recognized ${s.year}] ${s.role} at ${s.university} (${s.type})\n   ${s.description}\n`;
    });
    text += `\n`;

    text += `V. SPONSORED RESEARCH PROJECTS & FUNDED GRANTS (₹1,00,000 TOTAL SANCTION)\n`;
    text += `------------------------------------------------------------------------\n`;
    FUNDED_PROJECTS_DATA.forEach((p, i) => {
      text += `${i + 1}. "${p.title}"\n   PI: ${p.pi}${p.coPi ? ' | Co-PI: ' + p.coPi : ''}\n   Funding Agency: ${p.agency} [${p.scheme}]\n   Amount: ${p.amount} | Duration: ${p.duration} (${p.period}) | Status: ${p.status}\n`;
    });
    text += `\n`;

    text += `VI. BOARD OF STUDIES (BOS) & CURRICULAR GOVERNANCE\n`;
    text += `------------------------------------------------------------------------\n`;
    BOS_COMMITTEES_DATA.forEach((b, i) => {
      text += `${i + 1}. ${b.role} - ${b.department} (${b.programs})\n   Institution: ${b.institution} [${b.tenure}]\n   Scope: ${b.highlights}\n`;
    });
    text += `\n`;

    text += `VII. INTELLECTUAL PROPERTY & PATENTS PORTFOLIO (12 PATENTS)\n`;
    text += `------------------------------------------------------------------------\n`;
    PATENTS_DATA.forEach((p, i) => {
      text += `${i + 1}. [${p.status.toUpperCase()}] "${p.title}"\n   Patent No: ${p.patentNo} | Status: ${p.status} | Date: ${p.status === 'Granted' ? p.publishedDate : p.filedDate || p.year} ${p.kapilaScheme ? '[KAPILA Scheme]' : ''}\n`;
    });
    text += `\n`;

    text += `VIII. ${pubScope === 'scopus' ? 'SCOPUS INDEXED RESEARCH PUBLICATIONS (39 DOCUMENTS)' : 'COMPLETE RESEARCH PUBLICATIONS PORTFOLIO (' + displayedPubs.length + ' DOCUMENTS)'}\n`;
    text += `------------------------------------------------------------------------\n`;
    displayedPubs.forEach((p, i) => {
      text += `${i + 1}. [${p.year || '2022'}] [${p.type || 'Research Article'}] ${p.authors || 'Dr. S. Md. Farooq et al.'} "${p.title}", ${p.venue}. ${p.doi ? 'DOI: https://doi.org/' + p.doi : ''}\n`;
    });
    text += `\n`;

    text += `IX. STATE FACULTY HONORS & DISTINCTIONS (6 STATE AWARDS)\n`;
    text += `------------------------------------------------------------------------\n`;
    PROFESSOR_PROFILE.awards.forEach((a, i) => {
      text += `${i + 1}. [Year: ${a.year}] ${a.title} by ${a.organization} (${a.level})\n   Citation: ${a.highlight}\n`;
    });
    text += `\n`;

    text += `X. KEYNOTE ADDRESSES & RESOURCE PERSON ENGAGEMENTS (4 SESSIONS)\n`;
    text += `------------------------------------------------------------------------\n`;
    RESOURCE_PERSON_DATA.forEach((r, i) => {
      text += `${i + 1}. [${r.year}] "${r.title}"\n   Event: ${r.event} organized by ${r.organization}\n   Role: ${r.role} | Focus Topic: ${r.topic}\n`;
    });
    text += `\n`;

    text += `XI. PROFESSIONAL SOCIETY MEMBERSHIPS & LEARNED BODIES (12 SOCIETIES)\n`;
    text += `------------------------------------------------------------------------\n`;
    PROFESSOR_PROFILE.memberships.forEach((mem, i) => {
      text += `${i + 1}. ${mem.short} (${mem.name}) - ${mem.role} | Member ID: ${mem.membershipId} [${mem.tier}]${mem.validTill ? ' (Valid till: ' + mem.validTill + ')' : ''}\n`;
    });
    text += `\n`;

    text += `XII. FACULTY DEVELOPMENT PROGRAMS (FDP) & PROFESSIONAL TRAINING (54)\n`;
    text += `------------------------------------------------------------------------\n`;
    FDP_TRAINING_DATA.forEach((f, i) => {
      text += `${i + 1}. [${f.year}] [${f.category}] ${f.title}\n`;
    });
    text += `\n`;

    text += `XIII. OFFICIAL DECLARATION & INSTITUTIONAL ATTESTATION\n`;
    text += `------------------------------------------------------------------------\n`;
    text += `I hereby solemnly declare that all the information, qualifications, research supervision credentials, publications, patents, and professional achievements documented in this Curriculum Vitae are authentic, complete, and verifiable against original institutional records, university gazettes, and international indexing databases (Elsevier Scopus, IEEE Xplore, ORCID).\n\n`;
    text += `Place: Nandyal, Andhra Pradesh, India\n`;
    text += `Date: ${currentDateFormatted}\n\n`;
    text += `Dr. S. Md. Farooq, B.Tech, M.Tech, Ph.D. (VIT Vellore)\n`;
    text += `Professor & Head of Department (CSE)\n`;
    text += `Chairperson, Board of Studies (BOS)\n`;
    text += `Santhiram Engineering College (Autonomous), Nandyal - 518501\n`;
    text += `Online Verification: https://orcid.org/0000-0003-0936-1980\n`;

    return text;
  };

  const handleCopyText = () => {
    const text = generatePlainTextCV();
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto modal-backdrop-print">
      
      {/* Modal Dialog Container */}
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh] animate-fadeIn modal-dialog-print">
        
        {/* Top Control Toolbar - Completely hidden during window.print() */}
        <div className="print-hide no-print p-4 sm:p-5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                Official Academic Curriculum Vitae & Executive Dossier
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              1-Click official dossier • 39 Scopus indexed papers, 12 patents, Ph.D. Supervision, BoS & 54 FDPs
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Justified Indicator */}
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 text-xs font-semibold">
              <AlignJustify className="w-3.5 h-3.5" />
              <span>Justified Typeset</span>
            </div>

            {/* Publication Scope Selector: 39 Scopus vs All 74 Publications */}
            <div className="flex items-center p-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold">
              <button
                onClick={() => setPubScope('scopus')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  pubScope === 'scopus' ? 'bg-cyan-500 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
                title="Print only the 39 Scopus Indexed publications"
              >
                Scopus Only (39)
              </button>
              <button
                onClick={() => setPubScope('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  pubScope === 'all' ? 'bg-cyan-500 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
                title="Print all 74 publications (Scopus, IEEE & Google Scholar)"
              >
                All Articles ({deduplicatedAllPubs.length})
              </button>
            </div>

            {/* Format Selector */}
            <div className="flex items-center p-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold">
              <button
                onClick={() => setCvFormat('full')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  cvFormat === 'full' ? 'bg-cyan-500 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
                title="Complete Academic Curriculum Vitae with all publications, patents, and full FDP record"
              >
                Full Academic CV
              </button>
              <button
                onClick={() => setCvFormat('executive')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  cvFormat === 'executive' ? 'bg-cyan-500 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
                title="Condensed 2-Page Executive Resume for quick administrative / board reviews"
              >
                Executive Resume (2-Page)
              </button>
            </div>

            {/* Typography Font Style Switcher */}
            <div className="hidden sm:flex items-center p-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold">
              <button
                onClick={() => setFontFamily('serif')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center space-x-1 ${
                  fontFamily === 'serif' ? 'bg-slate-700 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Classic Academic Serif Font (Cambria / Georgia / Times style)"
              >
                <Type className="w-3.5 h-3.5" />
                <span>Classic Serif</span>
              </button>
              <button
                onClick={() => setFontFamily('sans')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center space-x-1 ${
                  fontFamily === 'sans' ? 'bg-slate-700 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Modern Executive Sans-Serif Font"
              >
                <span className="font-sans font-bold text-xs">Aa</span>
                <span>Executive Sans</span>
              </button>
            </div>

            {/* Print / Save as PDF Button */}
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              title="Print or Save as high-resolution PDF (A4 Layout)"
            >
              <Printer className="w-4 h-4" />
              <span>Save as PDF / Print</span>
            </button>

            {/* Copy Plain Text */}
            <button
              onClick={handleCopyText}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title="Copy formatted plain text CV to clipboard for portal applications"
            >
              {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 transition-colors cursor-pointer"
              title="Close CV modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Browser Print Settings Tip Banner (Visible on screen only) */}
        <div className="print-hide no-print bg-slate-800/95 border-b border-slate-700/80 px-4 sm:px-6 py-2 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-cyan-400/20 text-cyan-300 font-bold text-[10px]">ℹ</span>
            <span>
              <strong>Clean Print / PDF Tip:</strong> In your browser print window, click <strong>More settings</strong> and <strong>uncheck &quot;Headers and footers&quot;</strong> to remove the browser date, page URL, and website title.
            </span>
          </div>
        </div>

        {/* Scrollable Printable Document Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-10 bg-slate-100/70 modal-scroll-print">
          
          {/* THE PRINTABLE ACADEMIC CV CONTAINER (#printable-academic-cv) */}
          <div 
            id="printable-academic-cv" 
            className={`max-w-4xl mx-auto bg-white px-8 sm:px-14 lg:px-16 py-8 sm:py-12 shadow-2xl border border-slate-300 text-slate-900 rounded-none ${
              fontFamily === 'serif' ? 'cv-serif' : 'cv-sans'
            }`}
            style={{ lineHeight: '1.65' }}
          >
            {/* 1. ACADEMIC LETTERHEAD / INSTITUTIONAL HEADER */}
            <header className="border-b-2 border-slate-900 pb-5 mb-6 text-center sm:text-left flex flex-col sm:flex-row items-start justify-between gap-4 avoid-break cv-header-row">
              <div className="flex-1 min-w-0 cv-header-left">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
                  Dr. S. Md. Farooq
                </h1>
                <p className="text-sm font-bold text-slate-900 mt-1">
                  B.Tech., M.Tech., Ph.D. (VIT Vellore)
                </p>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  Professor & Head of the Department
                </p>
                <p className="text-sm font-bold text-slate-900">
                  Department of Computer Science & Engineering
                </p>
                <p className="text-[11px] sm:text-[11.5px] font-semibold text-slate-800 mt-1 whitespace-nowrap tracking-tight cv-single-line">
                  Recognized Ph.D. Research Supervisor (JNTUA 2023 & Annamacharya University 2025)
                </p>
                <p className="text-[11px] sm:text-[11.5px] text-slate-700 mt-0.5 whitespace-nowrap tracking-tight cv-single-line">
                  Santhiram Engineering College (Autonomous), Nandyal, Andhra Pradesh - 518501, India
                </p>

                {/* Polished, Stacked Contact Emails (No wrapping bullet, no cut-off line) */}
                <div className="mt-2.5 space-y-0.5 text-xs text-slate-800 cv-emails">
                  <div>
                    <span className="font-bold text-slate-950">Official Email:</span>{' '}
                    <a href={`mailto:${PROFESSOR_PROFILE.email}`} className="text-slate-800 hover:text-indigo-600">
                      {PROFESSOR_PROFILE.email}
                    </a>
                  </div>
                  <div>
                    <span className="font-bold text-slate-950">Alternate Email:</span>{' '}
                    <a href="mailto:farook.1201@gmail.com" className="text-slate-800 hover:text-indigo-600">
                      farook.1201@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Verified Scholarly Identifiers Box - Right Side (Ph.D. guide removed, IEEE clean) */}
              <div className="border border-slate-300 bg-slate-50/80 p-2.5 sm:p-3 rounded-lg text-[10.5px] sm:text-xs text-slate-800 sm:text-right space-y-1 shrink-0 shadow-xs w-auto cv-header-right">
                <div className="text-slate-950 font-bold border-b border-slate-200 pb-1 mb-1 text-[10.5px] sm:text-[11px] uppercase tracking-wider">
                  Verified Scholarly Identifiers
                </div>
                <div><span className="font-bold text-slate-950">Scopus ID:</span> 57202806468 (39 Docs)</div>
                <div><span className="font-bold text-slate-950">IEEE Author ID:</span> 990518851303926</div>
                <div><span className="font-bold text-slate-950">ORCID ID:</span> 0000-0003-0936-1980</div>
                <div><span className="font-bold text-slate-950">Google Scholar:</span> wmHlQRMAAAAJ (393+ Cits)</div>
              </div>
            </header>

            {/* I. EXECUTIVE PROFILE & LEADERSHIP */}
            <section className="mb-6 avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b-2 border-slate-900 pb-1 mb-2.5 cv-heading">
                I. Executive Profile & Academic Leadership
              </h2>
              <p className="text-xs text-slate-800 leading-relaxed cv-justified mb-2">
                Dr. S. Md. Farooq serves as Professor & Head of the Department of Computer Science and Engineering (CSE) and Chairperson of the Board of Studies (BOS) for B.Tech & M.Tech programs at Santhiram Engineering College (Autonomous), Nandyal. With 16+ years of exemplary academic, research, and administrative experience, he is a recognized Ph.D. Research Supervisor at Jawaharlal Nehru Technological University Anantapur (JNTUA, 2023) and Annamacharya University (2025). He serves on the Academic Advisory Committee for Stanley College of Engineering and Technology for Women (Hyderabad), acts as Faculty Advisor for the IEEE Computer Society Student Branch Chapter, and has successfully steered autonomous curriculum innovation (R23 & AI-integrated R26) along with NBA and NAAC accreditation initiatives.
              </p>
            </section>

            {/* II. ACADEMIC & RESEARCH METRICS SUMMARY */}
            <section className="mb-6 avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b-2 border-slate-900 pb-1 mb-2.5 cv-heading">
                II. Academic & Research Metrics At a Glance
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                <div className="border border-slate-300 p-2.5 rounded bg-slate-50/70 shadow-xs">
                  <div className="font-black text-slate-950 text-sm sm:text-base">39 Scopus</div>
                  <div className="text-[10px] text-slate-700 font-semibold uppercase tracking-wider mt-0.5">Indexed Publications</div>
                </div>
                <div className="border border-slate-300 p-2.5 rounded bg-slate-50/70 shadow-xs">
                  <div className="font-black text-slate-950 text-sm sm:text-base">12 Patents</div>
                  <div className="text-[10px] text-slate-700 font-semibold uppercase tracking-wider mt-0.5">3 Granted • 9 Published</div>
                </div>
                <div className="border border-slate-300 p-2.5 rounded bg-slate-50/70 shadow-xs">
                  <div className="font-black text-slate-950 text-sm sm:text-base">2 Universities</div>
                  <div className="text-[10px] text-slate-700 font-semibold uppercase tracking-wider mt-0.5">Recognized Ph.D. Guide</div>
                </div>
                <div className="border border-slate-300 p-2.5 rounded bg-slate-50/70 shadow-xs">
                  <div className="font-black text-slate-950 text-sm sm:text-base">₹1,00,000</div>
                  <div className="text-[10px] text-slate-700 font-semibold uppercase tracking-wider mt-0.5">Funded Grants (JNTUA • DST)</div>
                </div>
                <div className="border border-slate-300 p-2.5 rounded bg-slate-50/70 shadow-xs">
                  <div className="font-black text-slate-950 text-sm sm:text-base">12 Memberships</div>
                  <div className="text-[10px] text-slate-700 font-semibold uppercase tracking-wider mt-0.5">2 Life Members • WRU 2026</div>
                </div>
              </div>
            </section>

            {/* III. EDUCATIONAL QUALIFICATIONS */}
            <section className="mb-6 avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b-2 border-slate-900 pb-1 mb-2.5 cv-heading">
                III. Higher Education & Academic Credentials
              </h2>
              <div className="space-y-2.5 text-xs">
                {PROFESSOR_PROFILE.education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-start border-b border-slate-200 pb-2">
                    <div className="pr-4 cv-justified">
                      <span className="font-bold text-slate-950 text-xs">{edu.degree}</span>
                      <div className="text-[11px] font-semibold text-indigo-950">{edu.institution}</div>
                      {edu.focus && <div className="text-[11px] text-slate-600 italic mt-0.5">{edu.focus}</div>}
                    </div>
                    <span className="font-bold text-slate-800 shrink-0 text-right bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {edu.year}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* IV. DOCTORAL RESEARCH SUPERVISION */}
            <section className="mb-6">
              <div className="avoid-break mb-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b-2 border-slate-900 pb-1 flex items-center justify-between cv-heading">
                  <span>IV. Doctoral Research Supervision (Recognized Ph.D. Guide)</span>
                  <span className="text-[10px] text-indigo-950 font-extrabold uppercase">2 Premier Universities</span>
                </h2>
              </div>
              <div className="space-y-2.5 text-xs">
                {SUPERVISOR_DATA.map((sup) => (
                  <div key={sup.id} className="border border-slate-200 p-3 rounded-lg bg-slate-50/50 shadow-xs avoid-break">
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-slate-950 text-xs">
                        {sup.university}
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 text-[10px] font-bold border border-emerald-300">
                        Recognized in {sup.year}
                      </span>
                    </div>
                    <div className="text-[11px] text-indigo-950 font-bold mt-0.5">
                      {sup.role} ({sup.type})
                    </div>
                    <p className="text-[11px] text-slate-700 mt-1 leading-relaxed cv-justified">
                      {sup.description}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10.5px]">
                      <span className="font-bold text-slate-900">Current Status:</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-semibold border border-slate-300">
                        Recognized Guideship Active • Scholar Allotment in Progress
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* V. SPONSORED RESEARCH PROJECTS & FUNDED GRANTS */}
            <section className="mb-6">
              <div className="avoid-break mb-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b-2 border-slate-900 pb-1 flex items-center justify-between cv-heading">
                  <span>V. Sponsored Research Projects & Extramural Grants</span>
                  <span className="text-[10px] text-indigo-950 font-extrabold uppercase">
                    Total Sanction: ₹1,00,000 (2 Completed Projects)
                  </span>
                </h2>
              </div>

              {/* Formatted Projects Table */}
              <div className="overflow-x-auto border border-slate-300 rounded-lg avoid-break">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 text-slate-900 font-bold text-[10.5px]">
                      <th className="py-2 px-2.5 w-10 text-center border-r border-slate-300">S.No.</th>
                      <th className="py-2 px-3 border-r border-slate-300">Title of the Project / Program & Investigators</th>
                      <th className="py-2 px-3 border-r border-slate-300">Funding Agency & Scheme</th>
                      <th className="py-2 px-2.5 text-right border-r border-slate-300">Amount (₹)</th>
                      <th className="py-2 px-2.5 text-center border-r border-slate-300">Period</th>
                      <th className="py-2 px-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {FUNDED_PROJECTS_DATA.map((proj) => (
                      <tr key={proj.id} className="text-slate-800 text-[11px] hover:bg-slate-50/80">
                        <td className="py-2.5 px-2.5 font-bold text-center border-r border-slate-200">{proj.slNo}</td>
                        <td className="py-2.5 px-3 border-r border-slate-200 cv-justified">
                          <div className="font-bold text-slate-950">{proj.title}</div>
                          <div className="text-[10px] text-slate-600 mt-0.5">
                            <span className="font-semibold text-slate-900">PI:</span> {proj.pi}
                            {proj.coPi && (
                              <span> • <span className="font-semibold text-slate-900">Co-PI:</span> {proj.coPi}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-200">
                          <div className="font-bold text-indigo-950">{proj.agency}</div>
                          <div className="text-[10px] text-slate-600 mt-0.5">{proj.scheme}</div>
                        </td>
                        <td className="py-2.5 px-2.5 font-bold text-slate-950 text-right border-r border-slate-200 whitespace-nowrap">
                          {proj.amount}
                        </td>
                        <td className="py-2.5 px-2.5 text-center border-r border-slate-200 text-[10px] whitespace-nowrap font-medium">
                          {proj.period}
                          <div className="text-slate-500 font-normal">({proj.duration})</div>
                        </td>
                        <td className="py-2.5 px-2.5 text-center whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-300">
                            {proj.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50 font-bold text-[11px] border-t-2 border-slate-300 text-slate-950">
                      <td colSpan={3} className="py-2 px-3 text-right border-r border-slate-300 uppercase tracking-wide text-[10px]">
                        Total Extramural & University Grants Sanctioned:
                      </td>
                      <td className="py-2 px-2.5 text-right font-black text-indigo-950 border-r border-slate-300">
                        ₹1,00,000
                      </td>
                      <td colSpan={2} className="py-2 px-2 text-center text-[10px] text-emerald-800 font-semibold">
                        2 Completed Grants
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>

            {/* VI. BOARD OF STUDIES (BOS) & ACADEMIC GOVERNANCE */}
            <section className="mb-6">
              <div className="avoid-break mb-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b-2 border-slate-900 pb-1 cv-heading">
                  VI. Board of Studies (BOS) & Academic Governance Roles
                </h2>
              </div>
              <div className="space-y-2.5 text-xs">
                {BOS_COMMITTEES_DATA.map((bos) => (
                  <div key={bos.id} className="border border-slate-200 p-3 rounded-lg bg-slate-50/40 shadow-xs avoid-break">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-slate-950">{bos.role}</span> — <span className="font-semibold text-slate-800">{bos.department}</span>
                        <div className="text-[11px] text-indigo-950 font-bold">{bos.institution} ({bos.programs})</div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-950 text-[10px] font-bold shrink-0 border border-blue-200">
                        {bos.tenure}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 mt-1.5 leading-relaxed cv-justified">
                      {bos.highlights}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* VII. PATENTS PORTFOLIO (12 - YEAR-WISE) */}
            <section className="mb-6">
              <div className="avoid-break mb-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b-2 border-slate-900 pb-1 flex items-center justify-between cv-heading">
                  <span>VII. Intellectual Property & Patents Portfolio (12 Patents)</span>
                  <span className="text-[10px] text-slate-700 font-semibold">3 Granted & 9 Published (GoI KAPILA Scheme)</span>
                </h2>
              </div>
              <div className="space-y-2 text-xs">
                {PATENTS_DATA.map((pat, i) => (
                  <div key={pat.id} className="border-b border-slate-200 pb-2 flex justify-between items-start gap-4 avoid-break">
                    <div className="pr-2 flex-1 cv-justified">
                      <div className="font-bold text-slate-950 leading-snug">
                        {i + 1}. {pat.title}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        Category: {pat.category} {pat.kapilaScheme && '• Government of India KAPILA Scheme'}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        pat.status === 'Granted' ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' : 'bg-slate-100 text-slate-800 border border-slate-300'
                      }`}>
                        {pat.status}
                      </span>
                      <div className="font-mono text-[10px] text-slate-700 mt-0.5">{pat.patentNo}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* VIII. RESEARCH PUBLICATIONS */}
            <section className="mb-6">
              <div className="avoid-break mb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b-2 border-slate-900 pb-1 flex items-center justify-between cv-heading">
                  <span>
                    VIII. {pubScope === 'scopus' 
                      ? `Scopus Indexed Research Publications (${displayedPubs.length} Documents)` 
                      : `Complete Research Publications Portfolio (${displayedPubs.length} Documents)`}
                  </span>
                  <span className="text-[10px] text-slate-700 font-semibold uppercase">
                    {pubScope === 'scopus' 
                      ? 'Elsevier Scopus / IEEE Indexed' 
                      : 'Scopus, IEEE & Google Scholar'}
                  </span>
                </h2>
              </div>
              
              <div className="space-y-3.5 text-xs">
                {displayedPubs.map((pub, i) => (
                  <div key={pub.id || i} className="border-b border-slate-200 pb-3 avoid-break">
                    {/* JUSTIFIED CITATION TEXT */}
                    <div className="text-slate-950 leading-relaxed cv-justified">
                      <span className="font-bold text-slate-950">{i + 1}. </span>
                      {pub.authors || 'Dr. S. Md. Farooq et al.'} {pub.year ? `(${pub.year}). ` : ''}
                      <span className="font-bold text-slate-950">"{(pub.title || '').replace(/&amp;/g, '&')}"</span>. 
                      <span className="italic text-slate-800"> {pub.venue}</span>.
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-600 mt-1.5">
                      {pub.type && (
                        <span className="font-bold text-indigo-950 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                          {pub.type}
                        </span>
                      )}
                      {(pub.sources || []).map((s, si) => (
                        <span key={si} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium border border-slate-200">
                          {s}
                        </span>
                      ))}
                      {pub.doi && (
                        <span className="font-mono text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                          DOI: {pub.doi}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* IX. STATE HONORS & AWARDS (6 - YEAR-WISE) */}
            <section className="mb-6">
              <div className="avoid-break mb-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b-2 border-slate-900 pb-1 flex items-center justify-between cv-heading">
                  <span>IX. State Faculty Honors & Distinctions (6 State Awards)</span>
                  <span className="text-[10px] text-slate-600">Chronological Record (2025 - 2018)</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {PROFESSOR_PROFILE.awards.map((a, i) => (
                  <div key={i} className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 shadow-xs avoid-break">
                    <div className="flex justify-between font-bold text-slate-950">
                      <span>{a.title}</span>
                      <span className="text-indigo-950 font-black">{a.year}</span>
                    </div>
                    <div className="text-[11px] text-slate-700 font-semibold mt-0.5">{a.organization} ({a.level})</div>
                    <div className="text-[10px] text-slate-600 italic mt-1 leading-normal cv-justified">{a.highlight}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* X. KEYNOTE SPEAKER & RESOURCE PERSON ENGAGEMENTS (YEAR-WISE) */}
            <section className="mb-6">
              <div className="avoid-break mb-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b-2 border-slate-900 pb-1 flex items-center justify-between cv-heading">
                  <span>X. Keynote Addresses & Resource Person Engagements</span>
                  <span className="text-[10px] text-slate-600">Recent Years on Top</span>
                </h2>
              </div>
              <div className="space-y-2.5 text-xs">
                {RESOURCE_PERSON_DATA.map((rp, i) => (
                  <div key={rp.id} className="border-b border-slate-200 pb-2.5 avoid-break">
                    <div className="flex justify-between items-start gap-3">
                      <div className="font-bold text-slate-950 leading-snug cv-justified flex-1">
                        {i + 1}. "{rp.title}"
                      </div>
                      <span className="text-[10px] font-bold text-indigo-950 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded shrink-0">
                        {rp.year}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-700 mt-1">
                      <span className="font-bold text-slate-900">{rp.role}</span> • {rp.event}, {rp.organization} ({rp.level})
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5 cv-justified">
                      <span className="font-semibold text-slate-800">Focus Topic:</span> {rp.topic}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* XI. PROFESSIONAL MEMBERSHIPS & LEARNED BODIES (12) */}
            <section className="mb-6">
              <div className="avoid-break mb-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b-2 border-slate-900 pb-1 flex items-center justify-between cv-heading">
                  <span>XI. Professional Society Memberships & Learned Bodies ({PROFESSOR_PROFILE.memberships.length})</span>
                  <span className="text-[10px] text-slate-600">2 Life Memberships • 10 International & National</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
                {PROFESSOR_PROFILE.memberships.map((mem) => (
                  <div key={mem.id} className="flex items-start justify-between py-1.5 border-b border-slate-100 avoid-break">
                    <div className="pr-2 cv-justified">
                      <span className="font-bold text-slate-950">{mem.short}</span>: <span className="text-slate-800 font-medium">{mem.name}</span>
                      <div className="text-[10px] text-indigo-950 font-semibold mt-0.5">
                        {mem.role} • {mem.tier} {mem.validTill && `• Valid till ${mem.validTill}`}
                      </div>
                    </div>
                    <span className="font-mono text-[10px] font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                      {mem.membershipId}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* XII. FACULTY DEVELOPMENT & PROFESSIONAL TRAINING (ACADEMIC YEAR-WISE, AFTER PUBLICATIONS) */}
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b-2 border-slate-900 pb-1 mb-2.5 flex items-center justify-between cv-heading">
                <span>XII. Faculty Development Programs (FDP) & Professional Training ({displayedFdps.length} Programs)</span>
                <span className="text-[10px] text-indigo-950 font-bold uppercase">
                  {cvFormat === 'executive' ? 'Executive Highlights (2025 - 2022)' : 'Academic Year-Wise (2025 - 2013)'}
                </span>
              </h2>

              {cvFormat === 'executive' ? (
                <div className="space-y-2 text-xs">
                  {displayedFdps.map((f, i) => (
                    <div key={f.id} className="border-b border-slate-100 pb-1.5 flex justify-between items-start avoid-break">
                      <div className="pr-2 leading-snug cv-justified">
                        <span className="font-bold text-slate-950">[{f.year}]</span> {f.title}
                        <div className="text-[10px] text-indigo-800 font-semibold mt-0.5">{f.category} • {f.mode}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  {FDP_YEARS_ORDER.map(year => {
                    const items = FDP_BY_YEAR[year];
                    if (!items || items.length === 0) return null;
                    return (
                      <div key={year} className="space-y-1.5">
                        <div className="font-bold text-[11px] text-slate-900 bg-slate-100 px-2.5 py-1 rounded border border-slate-300 mb-1.5 flex justify-between items-center avoid-break">
                          <span>Academic Year {year}</span>
                          <span className="text-[10px] text-slate-600 font-normal">{items.length} Programs</span>
                        </div>
                        <div className="space-y-2 pl-1">
                          {items.map((item, idx) => (
                            <div key={item.id} className="border-b border-slate-100 pb-1.5 text-slate-800 leading-snug avoid-break cv-justified">
                              <span className="font-bold text-slate-950">{idx + 1}. </span>
                              <span>{item.title}</span>
                              <div className="text-[10px] text-slate-600 font-medium mt-0.5">
                                Category: {item.category} • Mode: {item.mode} {item.isFlagship && '• Flagship/National'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* XIII. SIGNATURE & OFFICIAL VERIFICATION */}
            <footer className="pt-5 border-t-2 border-slate-900 avoid-break">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 mb-2 cv-heading">
                XIII. Official Declaration & Institutional Attestation
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed cv-justified mb-4">
                I hereby solemnly declare that all the information, qualifications, research supervision credentials, publications, patents, and professional achievements documented in this Curriculum Vitae are authentic, complete, and verifiable against original institutional records, university gazettes, and international indexing databases (Elsevier Scopus, IEEE Xplore, ORCID).
              </p>

              {/* Attestation Grid: Left (Place/Date + Verifiable QR Code) | Right (Signature Block) */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end text-xs mt-4 pt-1 gap-6">
                <div className="pb-1 flex items-center gap-3.5">
                  {qrCodeUrl && (
                    <div className="flex flex-col items-center justify-center p-1.5 bg-white border border-slate-400 rounded shadow-2xs shrink-0 cv-qr-badge">
                      <img 
                        src={qrCodeUrl} 
                        alt="Scan to Verify Official Scholarly Profile on ORCID & Scopus" 
                        className="w-16 h-16 sm:w-18 sm:h-18 object-contain" 
                      />
                      <span className="text-[7.5px] font-black text-slate-950 uppercase tracking-wider mt-1 flex items-center gap-0.5">
                        <QrIcon className="w-2.5 h-2.5 text-slate-900 inline print:hidden" />
                        <span>Scan to Verify</span>
                      </span>
                      <span className="text-[7px] font-semibold text-slate-600 font-mono">
                        ORCID • SCOPUS
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="text-[11px] text-slate-900 font-bold">Place: Nandyal, Andhra Pradesh, India</div>
                    <div className="text-[11px] text-slate-800 font-medium mt-0.5">Date: {currentDateFormatted}</div>
                    <div className="text-[9.5px] text-slate-600 mt-1.5 leading-tight max-w-[240px]">
                      Instant mobile verification: Scan QR code with any smartphone to inspect live authenticated scholarly records on ORCID (0000-0003-0936-1980) & Scopus (57202806468).
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0 ml-auto">
                  {/* Two more enter spaces for signature clearance */}
                  <div className="h-14 sm:h-16" />
                  <div className="w-56 border-b-2 border-slate-800 mb-2 ml-auto" />
                  <div className="font-black text-slate-950 text-sm">Dr. S. Md. Farooq</div>
                  <div className="text-[11px] text-slate-800 font-bold">Professor & Head of Department – CSE</div>
                  <div className="text-[11px] text-slate-700">Chairperson, Board of Studies (BOS)</div>
                  <div className="text-[10px] text-slate-600">Santhiram Engineering College (Autonomous), Nandyal</div>
                </div>
              </div>
            </footer>

          </div>
        </div>

      </div>

    </div>
  );
}
