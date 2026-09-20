import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { DataProvider } from './context/DataContext';
import { MatrixBoot } from './components/Preloader/MatrixBoot';
import { TopographyCanvas } from './components/Canvas/TopographyCanvas';
import { CustomCursor } from './components/UI/CustomCursor';
import { Navbar } from './components/UI/Navbar';
import { HeroSection } from './components/Sections/HeroSection';
import { AboutSection } from './components/Sections/AboutSection';
import { LeadershipSection } from './components/Sections/LeadershipSection';
import { EventsSection } from './components/Sections/EventsSection';
import { ArchiveGrid } from './components/Sections/ArchiveGrid';
import { JoinSection } from './components/Sections/JoinSection';
import { Footer } from './components/UI/Footer';
import { JoinModal } from './components/Modals/JoinModal';
import { AdminDashboard } from './components/Admin/AdminDashboard';

/**
 * Main Application Component
 * 
 * Non-technical explanation:
 * The primary container of the CIPHER portal:
 * - Runs the Matrix boot intro screen on initial visit.
 * - Initializes smooth momentum scrolling (Lenis).
 * - Toggles between the public portal and the Admin CMS dashboard.
 * - Displays the global custom reticle cursor and background 60 FPS contour waves.
 */

export const AppContent: React.FC = () => {
  // Check if visitor has already completed or skipped the preloader in this session
  const [bootSeen, setBootSeen] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('cipher_boot_seen') === 'true';
    } catch {
      return false;
    }
  });

  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(() => {
    return window.location.hash === '#admin';
  });

  const [isJoinOpen, setIsJoinOpen] = useState<boolean>(false);

  // Initialize Lenis Smooth Scrolling for fluid momentum
  useEffect(() => {
    if (isAdminOpen) return; // Standard scrolling in admin CMS

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    // Sync hash changes for #admin
    const onHashChange = () => {
      setIsAdminOpen(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', onHashChange);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [isAdminOpen]);

  const toggleAdmin = () => {
    if (isAdminOpen) {
      window.location.hash = '';
      setIsAdminOpen(false);
    } else {
      window.location.hash = '#admin';
      setIsAdminOpen(true);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050705] text-[#c8f7d0] selection:bg-[#00ff41]/20 selection:text-[#00ff41]">
      {/* Custom Crosshair Cursor */}
      <CustomCursor />

      {/* Cyberpunk Preloader Boot Screen */}
      {!bootSeen && (
        <MatrixBoot onComplete={() => setBootSeen(true)} />
      )}

      {/* ADMIN CMS VIEW */}
      {isAdminOpen ? (
        <AdminDashboard onBackToSite={toggleAdmin} />
      ) : (
        /* PUBLIC PORTAL VIEW */
        <>
          {/* Global Topographical 60fps Contour Waves Background */}
          <TopographyCanvas strokeColor="rgba(0, 255, 65, 0.13)" />

          {/* Navigation Bar */}
          <Navbar
            onOpenJoin={() => setIsJoinOpen(true)}
            onNavigateAdmin={toggleAdmin}
            isAdminView={false}
          />

          {/* Core Landing Page Sections */}
          <main className="relative z-10">
            <HeroSection onOpenJoin={() => setIsJoinOpen(true)} />
            <AboutSection />
            <LeadershipSection />
            <EventsSection />
            <ArchiveGrid />
            <JoinSection onOpenJoin={() => setIsJoinOpen(true)} />
          </main>

          {/* Footer */}
          <Footer />

          {/* Application Form Modal */}
          <JoinModal
            isOpen={isJoinOpen}
            onClose={() => setIsJoinOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}
