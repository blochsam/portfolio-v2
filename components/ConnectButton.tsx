import React, { useEffect, useRef, useState } from 'react';
import { track } from '../utils/track';

/* Primary contact CTA. mailto: silently no-ops for visitors without a mail
   client configured (feedback study caught two of them), so copying the
   address is the primary action and the mail client is the bonus: the
   button always leaves the visitor holding the address. */
const ConnectButton: React.FC<{
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  source?: string;
}> = ({ className, style, label = "Let's Connect", source = 'case_study' }) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  const connect = () => {
    track('contact_click', { source });
    const address = ['sam', 'sam-bloch.com'].join('@');
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(address).catch(() => { /* mailto still fires */ });
    }
    setCopied(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 3500);
    window.location.href = `mailto:${address}`;
  };

  return (
    <button onClick={connect} className={className} style={style} aria-label="Email Sam (copies address to clipboard)">
      {copied ? (
        <span className="normal-case tracking-normal">sam@sam-bloch.com — copied!</span>
      ) : (
        <>
          {label}
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </>
      )}
    </button>
  );
};

export default ConnectButton;
