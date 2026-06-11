import React from 'react';
import { useNavigate } from 'react-router-dom';
import { track } from '../utils/track';
import { COLORS } from '../constants';
import { Download, ArrowLeft } from 'lucide-react';
import { usePageMeta } from '../utils/usePageMeta';
import { ROUTE_META } from '../data/routeMeta';
import { goBack } from '../utils/goBack';

const ResumePage: React.FC = () => {
  usePageMeta(ROUTE_META['/resume']);
  const navigate = useNavigate();

  const handleBack = () => goBack(navigate, '/');

  return (
    <div className="min-h-screen bg-[#121212] pt-24 pb-24 px-4 md:px-12 flex flex-col items-center">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="fixed top-8 left-8 md:left-12 z-[60] flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-[color,border-color,transform] bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/5 hover:border-[#24A2A7]/40 shadow-xl active:scale-95"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Floating Download Button (Teal themed, linking to PDF) */}
      <a
        href="/SBloch_Resume.pdf"
        download="SBloch_Resume.pdf"
        onClick={() => track('resume_pdf_download', { source: 'fab' })}
        className="fixed bottom-20 right-8 md:right-28 z-[60] h-14 px-5 rounded-full flex items-center justify-center gap-2 shadow-2xl transition-transform hover:scale-105 active:scale-95 group"
        style={{ backgroundColor: COLORS.teal, color: COLORS.charcoal }}
        aria-label="Download resume PDF"
      >
        <Download className="w-6 h-6 group-hover:translate-y-0.5 transition-transform" />
        <span className="text-xs font-black uppercase tracking-widest">PDF</span>
      </a>

      {/* Resume Document */}
      <div className="max-w-[850px] w-full bg-white text-black p-8 md:p-16 shadow-2xl rounded-sm font-sans animate-in fade-in slide-in-from-bottom-8 duration-700 overflow-x-hidden">
        {/* Header */}
        <div className="text-center border-b-2 border-[#24A2A7] pb-6 mb-8">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[#121212] mb-2 uppercase leading-none">SAM BLOCH</h1>
          <p className="text-[10px] md:text-xs text-gray-500 font-medium tracking-wide">
            Culver City, CA | www.sam-bloch.com
          </p>
          <p className="text-[9px] text-gray-400 mt-3 italic">
            Full contact details available in the{' '}
            <a href="/SBloch_Resume.pdf" download="SBloch_Resume.pdf" className="text-[#24A2A7] hover:underline font-medium">
              downloadable PDF
            </a>
          </p>
        </div>

        {/* Summary */}
        <section className="mb-10">
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#24A2A7] border-b border-gray-100 mb-4 pb-1">Summary</h2>
          <p className="text-sm leading-relaxed text-gray-800">
            Program Manager at YouTube/Google who ships production software. I run global Trust & Safety operations across 10 sites and 800+ moderators, and I use AI to build the tools I wish existed. Full-stack apps, custom platforms, automation systems. If there's a problem and no product to solve it, I make one.
          </p>
        </section>

        {/* Skills */}
        <section className="mb-10">
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#24A2A7] border-b border-gray-100 mb-4 pb-1">Skills</h2>
          <div className="space-y-3 text-sm text-gray-800">
            <div>
              <span className="font-semibold text-gray-900">Domains: </span>
              Trust & Safety Operations · AI Safety & Innovation · Content Moderation at Scale · Vendor Program Management · UX Research · Curriculum Design
            </div>
            <div>
              <span className="font-semibold text-gray-900">I Ship With: </span>
              React · Next.js · TypeScript · Supabase · Prisma · Tailwind CSS · Node.js · SQL · Python · Vercel · Google Cloud
            </div>
            <div>
              <span className="font-semibold text-gray-900">AI Toolkit: </span>
              Claude · Gemini API · AI pair programming · Prompt engineering · AI safety protocols
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="mb-10">
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#24A2A7] border-b border-gray-100 mb-6 pb-1">Experience</h2>
          
          <div className="space-y-8">
            {/* Role 1 */}
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline mb-1">
                <h3 className="font-bold text-sm text-black">Quality & Continuous Improvement Program Manager</h3>
                <span className="text-[10px] font-bold text-gray-600">11/2024 to Current</span>
              </div>
              <div className="flex justify-between items-baseline mb-3 italic text-xs text-gray-500">
                <span className="font-bold">YouTube</span>
                <span>Playa Vista, CA</span>
              </div>
              <ul className="list-disc list-outside ml-4 text-xs space-y-2 text-gray-700 leading-relaxed">
                <li>Executed comprehensive global experiments to assess and strengthen quality standards for child safety content moderation, generating essential insights for policy and process refinement.</li>
                <li>Directed quality programs across international vendor partners and 10 global sites (including Poland, Portugal, Malaysia, and India), overseeing 800+ content moderators to ensure uniform application of child safety policies.</li>
                <li>Developed custom SQL dashboards to reduce vendor pain points, allow for better digestion of salient performance data, and enhance reporting by 20%.</li>
              </ul>
            </div>

            {/* Role 2 */}
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline mb-1">
                <h3 className="font-bold text-sm text-black">Legal Ops Program Manager</h3>
                <span className="text-[10px] font-bold text-gray-600">05/2022 to 11/2024</span>
              </div>
              <div className="flex justify-between items-baseline mb-3 italic text-xs text-gray-500">
                <span className="font-bold">Google</span>
                <span>Playa Vista, CA</span>
              </div>
              <ul className="list-disc list-outside ml-4 text-xs space-y-2 text-gray-700 leading-relaxed">
                <li>Directed cross-functional initiatives across 5 vendor operations (200+ headcount) to elevate compliance and enhance operational efficiency, employing user research to detect pain points and develop solutions.</li>
                <li>Developed and drove the implementation of innovative tool solutions for error management, in the form of a new quality control workflow, that reduced internal errors by 45%.</li>
                <li>Shipped 4 end-to-end operational projects, improving risk identification and mitigation through new data channels.</li>
              </ul>
            </div>

            {/* Role 3 */}
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline mb-1">
                <h3 className="font-bold text-sm text-black">Quality Analyst, Trust & Safety</h3>
                <span className="text-[10px] font-bold text-gray-600">09/2020 to 05/2022</span>
              </div>
              <div className="flex justify-between items-baseline mb-3 italic text-xs text-gray-500">
                <span className="font-bold">YouTube</span>
                <span>Farmington Hills, MI</span>
              </div>
              <ul className="list-disc list-outside ml-4 text-xs space-y-2 text-gray-700 leading-relaxed">
                <li>Evolved Quality Assurance system to identify, measure, and improve process opportunities in processes, tools, and training.</li>
                <li>Developed and deployed a content enhancement tool, reducing handle time for lengthy or intricate videos by 10%.</li>
              </ul>
            </div>

            {/* Role 4 */}
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline mb-1">
                <h3 className="font-bold text-sm text-black">Desktop Support Technician</h3>
                <span className="text-[10px] font-bold text-gray-600">06/2018 to 09/2020</span>
              </div>
              <div className="flex justify-between items-baseline mb-3 italic text-xs text-gray-500">
                <span className="font-bold">Rocket Mortgage</span>
                <span>Detroit, MI</span>
              </div>
              <ul className="list-disc list-outside ml-4 text-xs space-y-2 text-gray-700 leading-relaxed">
                <li>Collaborated with engineers to resolve workflow issues and implement computer policy changes, resulting in the elimination of over 100+ annual incident tickets.</li>
                <li>Achieved top #3 ranking in customer satisfaction by resolving customer problems related to hardware and software issues.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Education */}
        <section className="mb-10">
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#24A2A7] border-b border-gray-100 mb-6 pb-1">Education</h2>
          <div className="space-y-5 text-sm">
            <div className="flex justify-between items-start md:items-baseline">
              <div className="leading-tight">
                <span className="font-bold text-black">Master of Arts: Leadership, Organizational Innovation & Change</span><br/>
                <span className="text-xs text-gray-500 font-medium">University of the Pacific — Stockton, CA</span>
              </div>
              <span className="text-[10px] font-bold text-gray-600 whitespace-nowrap ml-4">Expected in 2026</span>
            </div>
            <div className="flex justify-between items-start md:items-baseline">
              <div className="leading-tight">
                <span className="font-bold text-black">Master of Science: Human-Computer Interaction</span><br/>
                <span className="text-xs text-gray-500 font-medium">Quinnipiac University — Hamden, CT</span>
              </div>
              <span className="text-[10px] font-bold text-gray-600 whitespace-nowrap ml-4">05/2023</span>
            </div>
            <div className="flex justify-between items-start md:items-baseline">
              <div className="leading-tight">
                <span className="font-bold text-black">Bachelor of Arts: User Experience</span><br/>
                <span className="text-xs text-gray-500 font-medium">Michigan State University — East Lansing, MI</span>
              </div>
              <span className="text-[10px] font-bold text-gray-600 whitespace-nowrap ml-4">08/2020</span>
            </div>
          </div>
        </section>

        {/* Activities */}
        <section>
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#24A2A7] border-b border-gray-100 mb-4 pb-1">Activities</h2>
          <ul className="list-disc list-outside ml-4 text-xs space-y-3 text-gray-700 leading-relaxed">
            <li><span className="font-bold text-black uppercase tracking-wider">Michigan Speech Coaches Inc.</span>: Individually founded and hosted Michigan's largest competitive speech tournament.</li>
            <li><span className="font-bold text-black uppercase tracking-wider">Certified California Climate Steward</span>: Lead monthly hikes, climate change discussions, and social engagement.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ResumePage;