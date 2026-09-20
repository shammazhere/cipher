import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { DataProvider } from './context/DataContext';
import { MatrixBoot } from './components/Preloader/MatrixBoot';
import { TopographyCanvas } from './components/Canvas/TopographyCanvas';
import { CustomCursor } from './components/UI/CustomCursor';
import { Navbar } from './components/UI/Navbar';
import { Footer } from './components/UI/Footer';
import { JoinModal } from './components/Modals/JoinModal';

// 5 Mandatory Pages + Component Library + Admin CMS
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { EventsPage } from './pages/EventsPage';
import { TeamPage } from './pages/TeamPage';
import { JoinPage } from './pages/JoinPage';
import { ComponentLibraryPage } from './pages/ComponentLibraryPage';
import { AdminDashboard } from './components/Admin/AdminDashboard';

/**
 * Main Application Coordinator
 * 
 * Non-technical explanation:
 * Manages which of the 5 mandatory pages is currently active,
 * handles the cyberpunk preloader on initial visit,
 * and maintains smooth inertia scrolling across the site.
 */

export const AppContent: React.FC = () => {
  // Preloader seen state in sessionStorage
  const [bootSeen, setBootSeen] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('cipher_boot_seen') === 'true';
    } catch {
      return false;
    }
  });

  // Current active page: 'home' | 'about' | 'events' | 'team' | 'join' | 'components' | 'admin'
  const [currentPage, setCurrentPage] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '').replace('/', '').toLowerCase();
    if (['home', 'about', 'events', 'team', 'join', 'components', 'admin'].includes(hash)) {
      return hash;
    }
    return 'home';
  });

  const [isJoinModalOpen, setIsJoinModalOpen] = useState<boolean>(false);

  // Sync hash in URL with page state for browser back/forward and shareable links
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '').replace('/', '').toLowerCase();
      if (['home', 'about', 'events', 'team', 'join', 'components', 'admin'].includes(hash)) {
        setCurrentPage(hash);
      } else if (!hash) {
        setCurrentPage('home');
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : `#${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Lenis smooth momentum scrolling
  useEffect(() => {
    if (currentPage === 'admin') return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [currentPage]);

  return (
    <div className="relative min-h-screen bg-[#050705] text-[#c8f7d0] selection:bg-[#00ff41]/20 selection:text-[#00ff41]">
      {/* High-Performance Custom Tactical Reticle Cursor */}
      <CustomCursor />

      {/* Cyberpunk Preloader Boot Sequence */}
      {!bootSeen && (
        <MatrixBoot onComplete={() => setBootSeen(true)} />
      )}

      {/* ADMIN CMS VIEW */}
      {currentPage === 'admin' ? (
        <AdminDashboard onBackToSite={() => navigateTo('home')} />
      ) : (
        /* PUBLIC SITE VIEW */
        <>
          {/* Global Topographical 60 FPS Contour Wireframe Background */}
          <TopographyCanvas strokeColor="rgba(0, 255, 65, 0.12)" />

          {/* Navigation Bar */}
          <Navbar
            currentPage={currentPage}
            onNavigate={navigateTo}
            onOpenJoin={() => setIsJoinModalOpen(true)}
          />

          {/* Main View Router: 5 Mandatory Pages + Component Library */}
          <main className="relative z-10">
            {currentPage === 'home' && (
              <HomePage onOpenJoin={() => setIsJoinModalOpen(true)} />
            )}
            {currentPage === 'about' && <AboutPage />}
            {currentPage === 'events' && <EventsPage />}
            {currentPage === 'team' && <TeamPage />}
            {currentPage === 'join' && <JoinPage />}
            {currentPage === 'components' && <ComponentLibraryPage />}
          </main>

          {/* Site Footer with interactive clickable links */}
          <Footer currentPage={currentPage} onNavigate={navigateTo} />

          {/* Global Application Form Modal */}
          <JoinModal
            isOpen={isJoinModalOpen}
            onClose={() => setIsJoinModalOpen(false)}
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
