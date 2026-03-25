import React from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../constants';
import { usePageMeta } from '../utils/usePageMeta';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  usePageMeta({
    title: '404 — Page Not Found | Sam Bloch',
    description: 'This page doesn\'t exist. Head back to Sam Bloch\'s portfolio to explore projects, resume, and more.',
  });

  return (
    <div className="fixed inset-0 bg-[#121212] flex flex-col items-center justify-center p-8 text-center">
      <span className="text-[10px] font-mono uppercase tracking-[0.8em] text-white/30 mb-6 block">
        Signal Lost
      </span>
      <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-4">
        404
      </h1>
      <p className="text-gray-400 text-base md:text-lg mb-12 max-w-md">
        This page doesn't exist in the Samulation. Let's get you back on track.
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-[0.3em] transition-[filter,transform] hover:brightness-110 active:scale-95 shadow-xl"
        style={{ backgroundColor: COLORS.teal, color: COLORS.charcoal }}
      >
        Return Home
      </button>
    </div>
  );
};

export default NotFound;
