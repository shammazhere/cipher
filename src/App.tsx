import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
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

const checkIsAdminRoute = (): boolean => {
  try {
    if (isAdminOnlyMode) return true;
    const hash = window.location.hash.replace('#', '').replace(/^\/+/, '').toLowerCase();
    if (hash === 'admin') return true;
    const path = window.location.pathname.replace(/^\/+/, '').toLowerCase();
    return path === 'admin';
  } catch {
    return false;
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

  const [isAdmin, setIsAdmin] = useState<boolean>(checkIsAdminRoute);
  const { isAuthenticated, refreshAuth, logout: handleAdminLogout } = useAdminAuth();

  // Listen for hash changes to support #admin
  useEffect(() => {
    const handleHashChange = () => {
      setIsAdmin(checkIsAdminRoute());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
  usePageSEO(isAdmin ? 'admin' : 'home');

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
                href={isAdminOnlyMode && import.meta.env.VITE_PUBLIC_SITE_URL ? import.meta.env.VITE_PUBLIC_SITE_URL : '#top'}
                onClick={(e) => {
                  if (isAdminOnlyMode && import.meta.env.VITE_PUBLIC_SITE_URL) {
                    return;
                  }
                  e.preventDefault();
                  window.history.pushState(null, '', '/');
                  setIsAdmin(false);
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
                      window.history.pushState(null, '', '/');
                      setIsAdmin(false);
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
                      window.history.pushState(null, '', '/');
                      setIsAdmin(false);
                    }
                  }}
                />
              )}
            </Suspense>
          </div>
        </div>
      ) : (
        /* Main Single-Page Experience (Exact Match with Reference Video) */
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

          {/* Main Continuous Single-Page Layout */}
          <motion.main
            id="main-content"
            className="relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: bootSeen ? 1 : 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Navbar />
            <HeroSection />
            <AboutSection />
            <LeadershipSection />
            <EventsSection />
            <JoinSection />
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
