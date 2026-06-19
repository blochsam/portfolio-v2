import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import AboutContent from './AboutContent';

interface AboutOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal wrapper around the shared <AboutContent>. Used by the 3D scene (guitar
 * + "ABOUT" HUD item) so the bio floats over the desk without leaving the
 * scene. The 2D site instead links to the standalone /about page; both render
 * the same AboutContent.
 */
const AboutOverlay: React.FC<AboutOverlayProps> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus trap + Escape + focus restoration
  useEffect(() => {
    if (!isOpen) return;
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
    const closeBtn = dialogRef.current?.querySelector<HTMLElement>('button[aria-label="Close"]');
    closeBtn?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 animate-in fade-in duration-300 ease-out"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-title"
      ref={dialogRef}
    >
      <div
        className="relative bg-[#141414] border border-white/10 rounded-[2.5rem] max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] snappy-entrance"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 md:top-8 md:right-8 text-gray-400 hover:text-white transition-[color,background-color,transform] min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/5 rounded-full active:scale-90 z-[120]"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="overflow-y-auto overflow-x-hidden max-h-[90vh] overlay-content overlay-scroll-inset">
          <AboutContent variant="modal" onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default AboutOverlay;
