import React, { useState, useEffect, Suspense, lazy } from 'react';
import { DataProvider } from './context/DataContext';
import { MatrixBoot } from './components/Preloader/MatrixBoot';
import { TopographyCanvas } from './components/Canvas/TopographyCanvas';
import { CustomCursor } from './components/UI/CustomCursor';
import { Navbar } from './components/UI/Navbar';
import { Footer } from './components/UI/Footer';
import { JoinModal } from './components/Modals/JoinModal';

import { usePageSEO } from './hooks/usePageSEO';
import { useAdminAuth } from './hooks/useAdminAuth';
import { useSmoothScroll } from './hooks/useSmoothScroll';

// 5 Core Pages (Instant Load)
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { EventsPage } from './pages/EventsPage';
import { TeamPage } from './pages/TeamPage';
import { JoinPage } from './pages/JoinPage';

// Lazy Loaded Heavy Modules (Code-split for blazing-fast initial bundle)
const ComponentLibraryPage = lazy(() =>
  import('./pages/ComponentLibraryPage').then((m) => ({ default: m.ComponentLibraryPage }))
);
const AdminDashboard = lazy(() =>
  import('./components/Admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const AdminAuthGate = lazy(() =>
  import('./components/Admin/AdminAuthGate').then((m) => ({ default: m.AdminAuthGate }))
);

/**
 * Cyber Module Loading Fallback
 */
const CyberModuleLoader: React.FC<{ label: string }> = ({ label }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center font-mono p-8 space-y-4">
    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#00ff41]">
      <span className="h-2 w-2 rounded-full bg-[#00ff41] animate-ping" />
      <span>// DECRYPTING_MODULE // {label}</span>
    </div>
    <div className="h-1 w-48 rounded bg-[#123a17] overflow-hidden">
      <div className="h-full bg-[#00ff41] animate-[pulse_1s_infinite] w-3/4" />
    </div>
  </div>
);

/**
 * Main Application Coordinator
 * 
 * Non-technical explanation:
 * Coordinates the 5 mandatory pages, handles route code-splitting for fast load times,
 * manages the preloader state, and provides buttery-smooth inertial scrolling.
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
  const { isAuthenticated, logout: handleAdminLogout } = useAdminAuth();

  // Dynamically synchronize document title, OpenGraph tags, and meta descriptions per route
  usePageSEO(currentPage);

  // Buttery-smooth inertial scroll powered by Lenis
  useSmoothScroll({
    disabled: currentPage === 'admin',
    isModalOpen: isJoinModalOpen || !bootSeen,
  });

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

  return (
    <div className="relative min-h-screen bg-[#050705] text-[#c8f7d0] selection:bg-[#00ff41]/20 selection:text-[#00ff41]">
      {/* Accessibility: Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:border focus:border-[#00ff41] focus:bg-[#050705] focus:px-4 focus:py-2 focus:text-xs focus:font-mono focus:text-[#00ff41]"
      >
        Skip to main content
      </a>

      {/* High-Performance Custom Tactical Reticle Cursor */}
      <CustomCursor />

      {/* Cyberpunk Preloader Boot Sequence */}
      {!bootSeen && (
        <MatrixBoot onComplete={() => setBootSeen(true)} />
      )}

      {/* ADMIN CMS VIEW WITH AUTHENTICATION GATE (LAZY LOADED) */}
      {currentPage === 'admin' ? (
        <Suspense fallback={<CyberModuleLoader label="ADMIN_CMS_SUBSYSTEM" />}>
          {!isAuthenticated ? (
            <AdminAuthGate
              onAuthenticated={() => {}}
              onCancel={() => navigateTo('home')}
            />
          ) : (
            <AdminDashboard
              onBackToSite={() => navigateTo('home')}
              onLogout={handleAdminLogout}
            />
          )}
        </Suspense>
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
          <main id="main-content" className="relative z-10">
            {currentPage === 'home' && (
              <HomePage onOpenJoin={() => setIsJoinModalOpen(true)} />
            )}
            {currentPage === 'about' && <AboutPage />}
            {currentPage === 'events' && <EventsPage />}
            {currentPage === 'team' && <TeamPage />}
            {currentPage === 'join' && <JoinPage />}
            {currentPage === 'components' && (
              <Suspense fallback={<CyberModuleLoader label="DESIGN_SYSTEM_LIBRARY" />}>
                <ComponentLibraryPage />
              </Suspense>
            )}
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

