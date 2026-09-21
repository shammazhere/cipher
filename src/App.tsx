import React, { useState, useEffect, Suspense, lazy } from 'react';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';
import { MatrixBoot } from './components/Preloader/MatrixBoot';
import { TopographyCanvas } from './components/Canvas/TopographyCanvas';
import { CustomCursor } from './components/UI/CustomCursor';
import { Navbar } from './components/UI/Navbar';
import { Footer } from './components/UI/Footer';
import { JoinModal } from './components/Modals/JoinModal';
import { ErrorBoundary } from './components/UI/ErrorBoundary';
import { BackToTop } from './components/UI/BackToTop';
import { CommandPalette } from './components/UI/CommandPalette';
import { ScrollProgressBar } from './components/UI/ScrollProgressBar';
import { CyberToastContainer } from './components/UI/CyberToastContainer';
import { SystemStatusHUD } from './components/UI/SystemStatusHUD';
import { KeyboardShortcutsModal } from './components/UI/KeyboardShortcutsModal';
import { ShareModal } from './components/UI/ShareModal';
import { BreadcrumbHeader } from './components/UI/BreadcrumbHeader';
import { soundEffects } from './utils/soundEffects';

import { usePageSEO } from './hooks/usePageSEO';
import { useAdminAuth } from './hooks/useAdminAuth';
import { useSmoothScroll } from './hooks/useSmoothScroll';

// 5 Core Pages (Instant Load) + 404 Cyber Fallback
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { EventsPage } from './pages/EventsPage';
import { TeamPage } from './pages/TeamPage';
import { JoinPage } from './pages/JoinPage';
import { NotFoundPage } from './pages/NotFoundPage';

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

const VALID_ROUTES = ['home', 'about', 'events', 'team', 'join', 'components', 'admin'];

/**
 * Resolves current route from either hash or pathname with 404 fallback
 */
const resolveCurrentRoute = (): string => {
  try {
    const hash = window.location.hash.replace('#', '').replace(/^\/+/, '').toLowerCase();
    if (hash) {
      return VALID_ROUTES.includes(hash) ? hash : '404';
    }
    const path = window.location.pathname.replace(/^\/+/, '').toLowerCase();
    if (path) {
      return VALID_ROUTES.includes(path) ? path : '404';
    }
    return 'home';
  } catch {
    return 'home';
  }
};

/**
 * Main Application Coordinator
 * 
 * Non-technical explanation:
 * Coordinates the 5 mandatory pages, handles route code-splitting for fast load times,
 * manages the preloader state, provides buttery-smooth inertial scrolling,
 * and hosts the global 404 handler and Command Palette (Ctrl+K).
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

  // Current active page with 404 fallback
  const [currentPage, setCurrentPage] = useState<string>(resolveCurrentRoute);

  const [isJoinModalOpen, setIsJoinModalOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [soundMuted, setSoundMuted] = useState<boolean>(() => soundEffects.isMuted());
  const { isAuthenticated, refreshAuth, logout: handleAdminLogout } = useAdminAuth();

  const toggleSound = () => {
    const newMuted = soundEffects.toggleMute();
    setSoundMuted(newMuted);
  };

  // Dynamically synchronize document title, OpenGraph tags, and meta descriptions per route
  usePageSEO(currentPage);

  // Buttery-smooth inertial scroll powered by Lenis
  useSmoothScroll({
    disabled: currentPage === 'admin',
    isModalOpen: isJoinModalOpen || isCommandPaletteOpen || isShortcutsOpen || isShareOpen || !bootSeen,
  });

  // Global Keyboard Shortcuts (Ctrl+K, ?, M, 1-6)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        soundEffects.playClick();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === '?') {
        e.preventDefault();
        soundEffects.playClick();
        setIsShortcutsOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 'm' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        toggleSound();
      } else if (['1', '2', '3', '4', '5', '6'].includes(e.key) && !e.ctrlKey && !e.metaKey) {
        const routeMap: Record<string, string> = {
          '1': 'home',
          '2': 'about',
          '3': 'events',
          '4': 'team',
          '5': 'join',
          '6': 'components',
        };
        const dest = routeMap[e.key];
        if (dest) {
          e.preventDefault();
          navigateTo(dest);
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [soundMuted]);

  // Sync hash in URL with page state for browser back/forward and shareable links
  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentPage(resolveCurrentRoute());
    };
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const navigateTo = (page: string) => {
    soundEffects.playTransition();
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : `#${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#050705] text-[#c8f7d0] selection:bg-[#00ff41]/20 selection:text-[#00ff41]">
      {/* High-Performance Top Scroll Reading Progress HUD */}
      <ScrollProgressBar />

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
              onAuthenticated={refreshAuth}
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
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            onOpenShare={() => setIsShareOpen(true)}
            onOpenShortcuts={() => setIsShortcutsOpen(true)}
            isSoundMuted={soundMuted}
            onToggleSound={toggleSound}
          />

          {/* Main View Router: 5 Mandatory Pages + Component Library + 404 */}
          <main id="main-content" className="relative z-10">
            {['about', 'events', 'team', 'join', 'components'].includes(currentPage) && (
              <BreadcrumbHeader
                pageId={currentPage}
                sectorCode={
                  currentPage === 'about'
                    ? '02'
                    : currentPage === 'events'
                    ? '03'
                    : currentPage === 'team'
                    ? '04'
                    : currentPage === 'join'
                    ? '05'
                    : '06'
                }
                pageTitle={
                  currentPage === 'about'
                    ? 'ORIGINS & PILLARS'
                    : currentPage === 'events'
                    ? 'EVENTS & WORKSHOPS'
                    : currentPage === 'team'
                    ? 'EXECUTIVE COUNCIL'
                    : currentPage === 'join'
                    ? 'MEMBERSHIP & APPLICATION'
                    : 'DESIGN SYSTEM LIBRARY'
                }
                onNavigate={navigateTo}
              />
            )}
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
            {currentPage === '404' && (
              <NotFoundPage onNavigate={navigateTo} />
            )}
          </main>

          {/* Site Footer with interactive clickable links */}
          <Footer currentPage={currentPage} onNavigate={navigateTo} />

          {/* Global Application Form Modal */}
          <JoinModal
            isOpen={isJoinModalOpen}
            onClose={() => setIsJoinModalOpen(false)}
          />

          {/* Floating Back to Top Button */}
          <BackToTop />

          {/* Global Command Palette (Ctrl+K / Cmd+K) */}
          <CommandPalette
            isOpen={isCommandPaletteOpen}
            onClose={() => setIsCommandPaletteOpen(false)}
            onNavigate={navigateTo}
            onOpenJoin={() => setIsJoinModalOpen(true)}
            onOpenShare={() => setIsShareOpen(true)}
            onOpenShortcuts={() => setIsShortcutsOpen(true)}
            onToggleSound={toggleSound}
            soundMuted={soundMuted}
          />

          {/* Live Network & Latency Telemetry HUD */}
          <SystemStatusHUD />

          {/* Tactical Keyboard Shortcuts Reference Modal */}
          <KeyboardShortcutsModal
            isOpen={isShortcutsOpen}
            onClose={() => setIsShortcutsOpen(false)}
            onToggleSound={toggleSound}
            soundMuted={soundMuted}
          />

          {/* Sector Share & Web Share Modal */}
          <ShareModal
            isOpen={isShareOpen}
            onClose={() => setIsShareOpen(false)}
          />

          {/* Global Cyber Toast Notification Stack */}
          <CyberToastContainer />
        </>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <DataProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </DataProvider>
    </ErrorBoundary>
  );
}



