import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import CurriculumExplorer from './components/CurriculumExplorer';
import AITutor from './components/AITutor';
import ATSResumeChecker from './components/ATSResumeChecker';
import ResearchHub from './components/ResearchHub';
import Footer from './components/Footer';
import AcademicCVModal from './components/AcademicCVModal';
import MaterialsVault from './components/MaterialsVault';
import ScrollToTop from './components/ScrollToTop';
import { useResearchSync } from './services/researchSyncService';
import { useBioSync } from './services/googleSheetsSyncService';

export default function App() {
  const [activeTab, setActiveTab] = useState('about');
  const [tutorContext, setTutorContext] = useState(null);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);

  // Global live research synchronization hook (IEEE, Scopus, ORCID)
  const researchSync = useResearchSync();

  // Global live bio synchronization hook (Google Sheets: Patents, Awards, Talks, Memberships, FDPs)
  const bioSync = useBioSync();

  // Combined metrics dynamically reflecting live research + live bio datasets
  const combinedMetrics = useMemo(() => {
    return {
      ...researchSync.metrics,
      patentsCount: bioSync.dynamicBioMetrics.patentsCount,
      patentsDisplay: bioSync.dynamicBioMetrics.patentsDisplay,
      patentsGranted: bioSync.dynamicBioMetrics.patentsGranted,
      patentsPublished: bioSync.dynamicBioMetrics.patentsPublished,
      kapilaSchemePatents: bioSync.dynamicBioMetrics.kapilaSchemePatents,
      stateAwardsCount: bioSync.dynamicBioMetrics.stateAwardsCount,
      resourcePersonCount: bioSync.dynamicBioMetrics.resourcePersonCount,
      membershipsCount: bioSync.dynamicBioMetrics.membershipsCount,
      fdpCount: bioSync.dynamicBioMetrics.fdpCount,
    };
  }, [researchSync.metrics, bioSync.dynamicBioMetrics]);

  // When a student clicks "Ask AI Doubt" from a subject card in Curriculum
  const handleSelectSubjectForTutor = (context) => {
    setTutorContext(context);
    setActiveTab('ai-tutor');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans overflow-x-hidden w-full">
      
      {/* Sticky Navigation Bar with Dynamic Metrics & 1-Click CV Trigger */}
      <div className="print-hide no-print">
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          dynamicMetrics={combinedMetrics} 
          onOpenCV={() => setIsCVModalOpen(true)} 
        />
      </div>

      {/* Main Hero Header with Dynamic Metrics & 1-Click CV Trigger */}
      <div className="print-hide no-print">
        <Hero 
          setActiveTab={setActiveTab} 
          dynamicMetrics={combinedMetrics} 
          onOpenCV={() => setIsCVModalOpen(true)} 
        />
      </div>

      {/* Dynamic Tab Content */}
      <main id="main-content" className={`flex-1 ${isCVModalOpen ? 'print-hide no-print' : ''}`}>
        {activeTab === 'about' && (
          <AboutSection 
            setActiveTab={setActiveTab} 
            onOpenCV={() => setIsCVModalOpen(true)}
            bioSync={bioSync}
          />
        )}

        {activeTab === 'curriculum' && (
          <CurriculumExplorer 
            onSelectSubjectForTutor={handleSelectSubjectForTutor} 
            onNavigateToMaterials={() => {
              setActiveTab('materials');
              window.scrollTo({ top: 380, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'materials' && (
          <MaterialsVault onSelectSubjectForTutor={handleSelectSubjectForTutor} />
        )}

        {activeTab === 'ai-tutor' && (
          <AITutor initialSubjectContext={tutorContext} />
        )}

        {activeTab === 'ats-checker' && (
          <ATSResumeChecker />
        )}

        {(activeTab === 'research' || activeTab === 'awards') && (
          <ResearchHub 
            setActiveTab={setActiveTab} 
            dynamicState={researchSync} 
            bioSync={bioSync}
            onOpenCV={() => setIsCVModalOpen(true)} 
          />
        )}
      </main>

      {/* Footer */}
      <div className="print-hide no-print">
        <Footer setActiveTab={setActiveTab} />
      </div>

      {/* 1-Click Official Academic CV & Resume Modal */}
      <AcademicCVModal
        isOpen={isCVModalOpen}
        onClose={() => setIsCVModalOpen(false)}
        dynamicMetrics={combinedMetrics}
        publications={researchSync.publications}
        patents={bioSync.patents}
        awards={bioSync.awards}
        resourcePerson={bioSync.resourcePerson}
        memberships={bioSync.memberships}
        fdps={bioSync.fdps}
      />

      {/* Floating Scroll to Top Button */}
      <ScrollToTop />

    </div>
  );
}
