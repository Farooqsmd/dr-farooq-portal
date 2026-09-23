import React from 'react';
import { Cpu, Mail, MapPin, ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { PROFESSOR_PROFILE } from '../data/profileData';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand & Profile */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base tracking-tight">
                  {PROFESSOR_PROFILE.name}
                </h3>
                <p className="text-slate-400 text-xs font-medium">
                  {PROFESSOR_PROFILE.designation}
                </p>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Committed to student-centric technical education, curriculum innovation with AI integration, and world-class outcome-based computer science engineering.
            </p>
            <div className="flex items-center space-x-2 text-indigo-400 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Advisor – IEEE Computer Society (CS)</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              Portal Navigation
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-white transition-colors cursor-pointer">
                  About & Leadership
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('curriculum')} className="hover:text-white transition-colors cursor-pointer">
                  R23 & R26 Curriculum
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('ai-tutor')} className="hover:text-white transition-colors cursor-pointer">
                  AI Student Exam Tutor
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('ats-checker')} className="hover:text-white transition-colors cursor-pointer">
                  ATS Resume & Placement
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Institutional Contact */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              Department & Campus
            </h4>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>{PROFESSOR_PROFILE.college}<br/>{PROFESSOR_PROFILE.collegeAddress}</span>
              </div>
              <div className="flex items-start space-x-2">
                <Mail className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div className="flex flex-col text-xs space-y-0.5">
                  <a href={`mailto:${PROFESSOR_PROFILE.email}`} className="text-indigo-400 hover:underline">
                    {PROFESSOR_PROFILE.email}
                  </a>
                  <a href={`mailto:${PROFESSOR_PROFILE.alternateEmail || 'farook.1201@gmail.com'}`} className="text-slate-400 hover:text-indigo-300">
                    {PROFESSOR_PROFILE.alternateEmail || 'farook.1201@gmail.com'}
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} {PROFESSOR_PROFILE.name} • Department of CSE, Santhiram Engineering College (Autonomous), Nandyal.
          </p>
          <div className="flex items-center space-x-4">
            {PROFESSOR_PROFILE.researchProfiles.map(p => (
              <a 
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-cyan-400 transition-colors"
                title={p.name}
              >
                {p.name}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
