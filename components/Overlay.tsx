import React, { useEffect, useRef } from 'react';
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
             {renderFormattedDescription(content.description)}
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
                  className="w-full h-full object-cover grayscale transition-[filter,transform] duration-700 group-hover:grayscale-0 group-hover:scale-105"
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
