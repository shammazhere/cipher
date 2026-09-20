import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ShieldAlert, ArrowLeft, RefreshCw, Compass, ArrowUpRight } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (page: string) => void;
}

/**
 * 404 Cyber Sector Not Found Page
 * 
 * Non-technical explanation:
 * When a visitor navigates to an invalid URL or unknown route,
 * this cyberpunk recovery terminal displays a matrix rain background,
 * detailed system diagnostics, and quick access buttons to return safely
 * to any of the 5 mandatory sections.
 */
export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  const [diagnosing, setDiagnosing] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Matrix Rain Canvas Animation Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = '01CIPHER404CSE_SJEC_ACCESS_DENIED_NODE_MISSING';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 7, 5, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleSimulateScan = () => {
    setDiagnosing(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDiagnosing(false);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const navLinks = [
    { id: 'home', label: 'Primary Mainframe', code: '01' },
    { id: 'about', label: 'Origins & Department', code: '02' },
    { id: 'events', label: 'Events & Galas', code: '03' },
    { id: 'team', label: 'Executive Council', code: '04' },
    { id: 'join', label: 'Membership Portal', code: '05' },
    { id: 'components', label: 'Design System Library', code: '06' },
  ];

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center font-mono py-16 px-6 overflow-hidden">
      {/* Background Matrix Rain Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none opacity-20"
      />

      <div className="relative z-10 max-w-3xl w-full border border-[#123a17] bg-[#080d08]/95 p-8 md:p-12 rounded-lg shadow-[0_0_50px_rgba(0,255,65,0.08)] backdrop-blur-md">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between border-b border-[#123a17] pb-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56] animate-pulse" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#ff5f56] font-semibold flex items-center gap-2">
              <ShieldAlert size={14} />
              // PROTOCOL_ERR: 404_SECTOR_NOT_FOUND
            </span>
          </div>
          <span className="text-[11px] text-[#2c7a3a]">
            GATEWAY_ID: CIPHER-SJEC-ROUTER
          </span>
        </div>

        {/* Glitch Big 404 Header */}
        <div className="mb-6">
          <div className="flex items-baseline gap-4">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-[#00ff41] text-glow select-none">
              404
            </h1>
            <span className="text-xs md:text-sm text-[#ff5f56] font-semibold uppercase tracking-widest border border-[#ff5f56]/30 px-2 py-1 rounded bg-[#ff5f56]/10">
              UNRESOLVED_ROUTE
            </span>
          </div>
          <p className="mt-3 text-sm md:text-base text-[#6fae78] leading-relaxed">
            The coordinates requested could not be located within the active CIPHER node index. The requested sub-sector may have been de-provisioned or relocated.
          </p>
        </div>

        {/* Terminal Diagnostic Console */}
        <div className="mb-8 rounded border border-[#123a17] bg-[#050705] p-4 text-xs space-y-2 text-[#6fae78]">
          <div className="flex items-center gap-2 text-[#00ff41]">
            <Terminal size={14} />
            <span className="font-bold">// DIAGNOSTIC_TELEMETRY</span>
          </div>
          <div className="pl-4 space-y-1 text-[11px]">
            <div>&gt; REQUEST_URI: <span className="text-[#c8f7d0]">{window.location.pathname}{window.location.hash}</span></div>
            <div>&gt; ROUTING_STATUS: <span className="text-[#ff5f56]">NULL_REFERENCE_ERROR (ERR_404)</span></div>
            <div>&gt; PROTOCOL: HTTP/2.0 TLS 1.3 CLIENT_TERMINAL</div>
            {diagnosing && (
              <div className="text-[#00ff41] animate-pulse">
                &gt; DIAGNOSING SECTOR INTEGRITY... [{scanProgress}%]
              </div>
            )}
          </div>
        </div>

        {/* Quick Directory Re-Route Links */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3 text-xs uppercase tracking-widest text-[#00ff41]">
            <span className="flex items-center gap-2">
              <Compass size={14} />
              // RE-ROUTE TO VERIFIED SECTORS
            </span>
            <button
              type="button"
              onClick={handleSimulateScan}
              disabled={diagnosing}
              className="text-[11px] text-[#6fae78] hover:text-[#00ff41] flex items-center gap-1 transition-colors"
            >
              <RefreshCw size={12} className={diagnosing ? 'animate-spin' : ''} />
              <span>Verify Mesh</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {navLinks.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className="flex items-center justify-between p-3 rounded border border-[#123a17] bg-[#050705]/80 text-left text-xs transition-all duration-200 hover:border-[#00ff41] hover:bg-[#00ff41]/5 group"
                data-cursor="lens"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#2c7a3a] group-hover:text-[#00ff41]">
                    [{item.code}]
                  </span>
                  <span className="text-[#c8f7d0] group-hover:text-[#00ff41] font-semibold">
                    {item.label}
                  </span>
                </div>
                <ArrowUpRight
                  size={14}
                  className="text-[#2c7a3a] group-hover:text-[#00ff41] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#123a17]">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 px-6 py-3 rounded bg-[#00ff41] text-[#050705] font-bold text-xs uppercase tracking-wider hover:bg-[#00ff66] transition-all shadow-[0_0_20px_rgba(0,255,65,0.35)] hover:scale-[1.02] active:scale-[0.98]"
            data-cursor="lens"
          >
            <ArrowLeft size={16} />
            <span>Return To Mainframe</span>
          </button>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-5 py-3 rounded border border-[#123a17] text-[#6fae78] hover:text-[#00ff41] hover:border-[#00ff41] text-xs transition-colors"
            data-cursor="lens"
          >
            <span>Back To Previous Node</span>
          </button>
        </div>
      </div>
    </div>
  );
};
