import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { usePageMeta } from '../utils/usePageMeta';
import { ROUTE_META } from '../data/routeMeta';

const PrivacyPolicyPage: React.FC = () => {
  usePageMeta(ROUTE_META['/privacy-policy']);
  const navigate = useNavigate();

  const handleBack = () => {
    const mode = sessionStorage.getItem('experienceMode');
    if (mode === '2d') {
      navigate('/', { state: { force2D: true } });
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] pt-24 pb-40 px-6 md:px-12 flex flex-col items-center">
      <button
        onClick={handleBack}
        className="fixed top-8 left-8 md:left-12 z-[60] flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-[color,border-color,transform] bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/5 hover:border-[#24A2A7]/40 shadow-xl active:scale-95"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Site
      </button>

      <div className="w-full max-w-2xl mt-12">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-12">
          Privacy Policy
        </h1>

        <div className="space-y-8 text-gray-400 text-sm md:text-base leading-relaxed">
          <p className="text-gray-500 text-xs uppercase tracking-widest">
            Last updated: March 2026
          </p>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">Overview</h2>
            <p>
              This is a personal portfolio website for Sam Bloch. Your privacy matters, and this site is designed to collect as little data as possible.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">Analytics</h2>
            <p>
              This site uses Vercel Analytics and Vercel Speed Insights to understand general traffic patterns and page performance. These tools are cookieless and privacy-focused. They collect anonymized, aggregate data such as page views, country of origin, and browser type. No personally identifiable information is collected or stored.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">Cookies</h2>
            <p>
              This site does not use cookies.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">Data Collection</h2>
            <p>
              This site does not include forms, login systems, or any mechanism to collect personal information. The "Let's Connect" button opens your default email client and does not transmit data through this site.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">Third-Party Services</h2>
            <p>
              This site loads fonts from Google Fonts and may load a 3D scene from Spline (prod.spline.design). These third-party services have their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">Contact</h2>
            <p>
              If you have questions about this policy, reach out at{' '}
              <a
                href="mailto:sam@sam-bloch.com"
                className="text-[#24A2A7] hover:underline"
              >
                sam@sam-bloch.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
