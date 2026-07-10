import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { track } from '../utils/track';
import { PortfolioContent } from '../types';
import { COLORS } from '../constants';

interface OverlayProps {
  content: PortfolioContent | null;
  onClose: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ content, onClose }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus trap + Escape key + focus restoration
  useEffect(() => {
    if (!content) return;

    track('focus_area_open', { area: content.id, surface: '3d' });
    previousFocusRef.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Focus the close button on open
    const closeBtn = dialogRef.current?.querySelector<HTMLElement>('button[aria-label="Close"]');
    closeBtn?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [content, onClose]);

  if (!content) return null;

  // Simple parser to make headers and bullets visually engaging
  const renderFormattedDescription = (text: string) => {
    const lines = text.split('\n');
    const headers = [
      "Why I'm Obsessed with Trust",
      "How I Approach the Chaos",
      "The Big Picture",
      "Why I'm Energized by AI Solutions",
      "How I Approach Incorporating AI",
      "Why I Love Empowering Others",
      "How I Approach \"Leadership\"",
      "Decoding the Resource Trap",
      "How I Approach Solving Complex Problems",
      "My Philosophy",
      "The Narrative"
    ];

    return lines.map((line, index) => {
      const trimmedLine = line.trim();

      if (!trimmedLine) return <div key={index} className="h-4" />;

      // Header detection
      if (headers.some(h => trimmedLine.includes(h))) {
        return (
          <div key={index} className="mt-10 mb-6 group">
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-3">
              <span className="w-1.5 h-6 bg-[#24A2A7] rounded-full inline-block"></span>
              {trimmedLine}
            </h3>
            <div className="h-px w-full bg-white/5 mt-2" />
          </div>
        );
      }

      // Bullet point detection (starts with • or -)
      if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
        const contentText = trimmedLine.replace(/^[•-]\s*/, '');
        // Split by colon to bold the key concept
        const parts = contentText.split(':');

        return (
          <div key={index} className="flex gap-4 mb-4 pl-2">
            <span className="text-[#24A2A7] font-black text-lg">•</span>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed flex-1">
              {parts.length > 1 ? (
                <>
                  <span className="text-white font-bold">{parts[0]}:</span>
                  {parts.slice(1).join(':')}
                </>
              ) : contentText}
            </p>
          </div>
        );
      }

      // Quote detection
      if (trimmedLine.startsWith('"') || trimmedLine.startsWith('\u201c')) {
        return (
          <div key={index} className="my-8 p-6 bg-white/5 border-l-4 border-[#24A2A7] rounded-r-2xl italic text-gray-300 text-lg">
            {trimmedLine}
          </div>
        );
      }

      // Standard paragraph
      return (
        <p key={index} className="text-gray-400 text-base md:text-lg leading-relaxed mb-4 opacity-90">
          {trimmedLine}
        </p>
      );
    });
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 animate-in fade-in duration-300 ease-out"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="overlay-title"
      ref={dialogRef}
    >
      <div
        className="relative bg-[#141414] border border-white/10 rounded-[2.5rem] p-8 md:p-12 lg:p-16 max-w-4xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] snappy-entrance overlay-content"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#24A2A7]/5 blur-[80px] pointer-events-none"></div>

        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-400 hover:text-white transition-[color,background-color,transform] p-3 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/5 rounded-full active:scale-90 z-20"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-8 flex items-center gap-4 relative z-10">
          <div className="h-px w-12 bg-gray-800"></div>
          <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-[#24A2A7]">{content.subtitle}</span>
        </div>

        <h2 id="overlay-title" className="text-3xl md:text-5xl lg:text-6xl font-black mb-10 tracking-tighter text-white leading-tight relative z-10">
          {content.title}
        </h2>

        <div className={`relative z-10 mb-16 ${content.image ? 'grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-start' : ''}`}>
          <div className="order-2 lg:order-1">
            {content.approach ? (
              <>
                {/* Hook */}
                <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-10">
                  {content.hook ?? content.description}
                </p>

                {/* Proof points */}
                {content.receipts && content.receipts.length > 0 && (
                  <ul className="space-y-3 mb-10">
                    {content.receipts.map((r) => (
                      <li key={r} className="flex items-start gap-3">
                        <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-[#24A2A7] shrink-0" aria-hidden="true" />
                        <span className="text-gray-300 text-base md:text-lg leading-relaxed">{r}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Approach — editorial list, no nested cards */}
                <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#24A2A7] mb-4">How I Work</h3>
                <div className="mb-10 border-t border-white/5 divide-y divide-white/5">
                  {content.approach.map((a) => (
                    <div key={a.title} className="py-4">
                      <h4 className="text-white font-bold text-base mb-1">{a.title}</h4>
                      <p className="text-gray-400 text-sm leading-[1.7] max-w-2xl">{a.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Quote */}
                {content.quote && (
                  <figure className="my-8 p-6 bg-white/5 border-l-4 border-[#24A2A7] rounded-r-2xl">
                    <blockquote className="italic text-gray-300 text-lg leading-relaxed">&ldquo;{content.quote.text}&rdquo;</blockquote>
                    <figcaption className="mt-3 text-[12px] uppercase tracking-widest font-bold text-gray-500">— {content.quote.attribution}</figcaption>
                  </figure>
                )}

                {/* Related work */}
                {content.related && content.related.length > 0 && (
                  <div className="mt-10">
                    <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#24A2A7] mb-4">See It In Practice</h3>
                    <div className="flex flex-col gap-2">
                      {content.related.map((link) => (
                        <Link
                          key={link.href}
                          to={link.href}
                          className="group flex items-center justify-between gap-4 bg-white/[0.03] border border-white/[0.06] hover:border-[#24A2A7]/40 rounded-xl px-5 py-4 transition-colors"
                        >
                          <span className="text-white font-bold text-sm group-hover:text-[#24A2A7] transition-colors">{link.label}</span>
                          <svg className="w-4 h-4 text-gray-500 group-hover:text-[#24A2A7] group-hover:translate-x-1 transition-[color,transform] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              renderFormattedDescription(content.description)
            )}
          </div>

          {content.image && (
            <div className="order-1 lg:order-2 group">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#1a1a1a] relative shadow-2xl">
                <img
                  src={content.image}
                  alt={content.title}
                  width={640}
                  height={480}
                  loading="lazy"
                  className="w-full h-full object-cover md:[@media(hover:hover)]:grayscale transition-[filter,transform] duration-700 group-hover:grayscale-0 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-40"></div>
                {/* Decorative corner accent */}
                <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-[#24A2A7] rounded-tl-lg opacity-40"></div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[12px] transition-[filter,transform] hover:brightness-110 active:scale-95 shadow-xl flex items-center justify-center gap-4 group relative z-10"
          style={{ backgroundColor: COLORS.teal, color: COLORS.charcoal }}
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Return
        </button>
      </div>
    </div>
  );
};

export default Overlay;
