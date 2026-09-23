import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';
import { MatrixBoot } from './components/Preloader/MatrixBoot';
import { TopographyCanvas } from './components/Canvas/TopographyCanvas';
import { CustomCursor } from './components/UI/CustomCursor';
import { KonamiRootAccess } from './components/UI/KonamiRootAccess';
import { Navbar } from './components/UI/Navbar';
import { HeroSection } from './components/Sections/HeroSection';
import { AboutSection } from './components/Sections/AboutSection';
import { LeadershipSection } from './components/Sections/LeadershipSection';
import { EventsSection } from './components/Sections/EventsSection';
import { JoinSection } from './components/Sections/JoinSection';
import { EventsPage } from './components/Pages/EventsPage';
import { ActivitiesPage } from './components/Pages/ActivitiesPage';
import { LeadershipPage } from './components/Pages/LeadershipPage';
import { Footer } from './components/UI/Footer';
import { ErrorBoundary } from './components/UI/ErrorBoundary';
import { CyberToastContainer } from './components/UI/CyberToastContainer';
import { usePageSEO } from './hooks/usePageSEO';
import { useAdminAuth } from './hooks/useAdminAuth';
import { useSmoothScroll } from './hooks/useSmoothScroll';

// Lazy loaded Admin modules
const AdminDashboard = lazy(() =>
  import('./components/Admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const AdminAuthGate = lazy(() =>
  import('./components/Admin/AdminAuthGate').then((m) => ({ default: m.AdminAuthGate }))
);

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

const isAdminOnlyMode = Boolean(
  import.meta.env.VITE_ADMIN_ONLY === 'true' ||
  import.meta.env.VITE_IS_ADMIN === 'true' ||
  (typeof window !== 'undefined' && window.location.hostname.startsWith('admin.'))
);

const parseCurrentRoute = (): string => {
  if (isAdminOnlyMode) return 'admin';
  try {
    const path = window.location.pathname.replace(/^\/+/, '').toLowerCase();
    const hash = window.location.hash.replace('#', '').replace(/^\/+/, '').toLowerCase();

    if (path === 'admin' || hash === 'admin') return 'admin';
    if (path === 'events' || hash === 'events-page' || hash === 'events') return 'events';
    if (path === 'activities' || hash === 'activities-page' || hash === 'activities') return 'activities';
    if (path === 'leadership' || path === 'team' || hash === 'leadership-page' || hash === 'leadership') return 'leadership';

    return 'home';
  } catch {
    return 'home';
  }
};

export const AppContent: React.FC = () => {
  const [bootSeen, setBootSeen] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('cipher_boot_seen') === 'true';
    } catch {
      return false;
    }
  });

  const [currentPage, setCurrentPage] = useState<string>(parseCurrentRoute);
  const { isAuthenticated, refreshAuth, logout: handleAdminLogout } = useAdminAuth();
  const isAdmin = currentPage === 'admin';

  // Listen for browser back/forward and hash changes
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPage(parseCurrentRoute());
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleNavigate = (page: string) => {
    if (page === 'admin') {
      window.history.pushState(null, '', '/admin');
      setCurrentPage('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (page === 'events') {
      window.history.pushState(null, '', '/events');
      setCurrentPage('events');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (page === 'activities') {
      window.history.pushState(null, '', '/activities');
      setCurrentPage('activities');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (page === 'leadership') {
      window.history.pushState(null, '', '/leadership');
      setCurrentPage('leadership');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (page === 'about') {
      if (currentPage !== 'home') {
        window.history.pushState(null, '', '/#about');
        setCurrentPage('home');
        setTimeout(() => {
          const el = document.getElementById('about');
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById('about');
        el?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (page === 'join') {
      if (currentPage !== 'home') {
        window.history.pushState(null, '', '/#join');
        setCurrentPage('home');
        setTimeout(() => {
          const el = document.getElementById('join');
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById('join');
        el?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    // Default 'home'
    window.history.pushState(null, '', '/');
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Lock scroll during preloader only on public view
  useEffect(() => {
    if (isAdmin) {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      return;
    }
    document.body.style.overflow = bootSeen ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [bootSeen, isAdmin]);

  // Dynamic SEO metadata
  usePageSEO(currentPage);

  // Inertial smooth scroll (disabled completely in admin)
  useSmoothScroll({
    disabled: isAdmin,
    isModalOpen: !bootSeen && !isAdmin,
  });

  return (
    <div className="relative min-h-screen bg-[#050705] text-[#c8f7d0] selection:bg-[#00ff41] selection:text-[#050705]">
      {/* Toast Notifications System */}
      <CyberToastContainer />

      {/* Admin Interface View */}
      {isAdmin ? (
        <div className="min-h-screen bg-[#050705] p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-center justify-between border-b border-[#123a17] pb-4">
              <a
                href={isAdminOnlyMode && import.meta.env.VITE_PUBLIC_SITE_URL ? import.meta.env.VITE_PUBLIC_SITE_URL : '/'}
                onClick={(e) => {
                  if (isAdminOnlyMode && import.meta.env.VITE_PUBLIC_SITE_URL) {
                    return;
                  }
                  e.preventDefault();
                  handleNavigate('home');
                }}
                className="font-mono text-xs uppercase tracking-wider text-[#00ff41] hover:underline"
              >
                &larr; Return to CIPHER Portal
              </a>
              <span className="font-mono text-xs text-muted-foreground">// ADMIN_MODE</span>
            </div>
            <Suspense fallback={<CyberModuleLoader label="ADMIN_INTERFACE" />}>
              {isAuthenticated ? (
                <AdminDashboard
                  onLogout={handleAdminLogout}
                  onBackToSite={() => {
                    if (isAdminOnlyMode && import.meta.env.VITE_PUBLIC_SITE_URL) {
                      window.location.href = import.meta.env.VITE_PUBLIC_SITE_URL;
                    } else {
                      handleNavigate('home');
                    }
                  }}
                />
              ) : (
                <AdminAuthGate
                  onAuthenticated={refreshAuth}
                  onCancel={() => {
                    if (isAdminOnlyMode && import.meta.env.VITE_PUBLIC_SITE_URL) {
                      window.location.href = import.meta.env.VITE_PUBLIC_SITE_URL;
                    } else {
                      handleNavigate('home');
                    }
                  }}
                />
              )}
            </Suspense>
          </div>
        </div>
      ) : (
        /* Public Portal View */
        <>
          {/* Custom Interactive Cursor */}
          <CustomCursor />

          {/* Konami Code Easter Egg & ROOT ACCESS Modal */}
          <KonamiRootAccess />

          {/* Intro Preloader Sequence */}
          {!bootSeen && <MatrixBoot onComplete={() => setBootSeen(true)} />}

          {/* Fixed 2D Perlin Noise Vector Contour Lines Canvas */}
          <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none">
            <TopographyCanvas style={{ position: 'fixed' }} />
          </div>

          {/* Main Layout */}
          <motion.main
            id="main-content"
            className="relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: bootSeen ? 1 : 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

            {/* Dedicated Page Views or Home Multi-Section Flow */}
            {currentPage === 'events' ? (
              <EventsPage onNavigate={handleNavigate} />
            ) : currentPage === 'activities' ? (
              <ActivitiesPage onNavigate={handleNavigate} />
            ) : currentPage === 'leadership' ? (
              <LeadershipPage onNavigate={handleNavigate} />
            ) : (
              /* Home Page */
              <>
                <HeroSection />
                <AboutSection />
                <LeadershipSection onNavigate={handleNavigate} />
                <EventsSection onNavigate={handleNavigate} />
                <JoinSection />
              </>
            )}

            <Footer />
          </motion.main>
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
