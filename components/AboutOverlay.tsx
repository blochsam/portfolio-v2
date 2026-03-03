
import React from 'react';
import { Linkedin, Instagram, Mail, ExternalLink, X } from 'lucide-react';
import { COLORS } from '../constants';

interface AboutOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutOverlay: React.FC<AboutOverlayProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleSecureMail = (e: React.MouseEvent) => {
    e.preventDefault();
    const user = 'sam';
    const domain = 'sam-bloch.com';
    const at = '@';
    window.location.href = `mailto:${user}${at}${domain}`;
  };

  return (
    <div 
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 animate-in fade-in duration-300 ease-out" 
      onClick={onClose}
    >
      <style>{`
        @keyframes snappyEntrance {
          0% { 
            transform: scale(0.95) translateY(30px); 
            opacity: 0; 
          }
          100% { 
            transform: scale(1) translateY(0); 
            opacity: 1; 
          }
        }
        .snappy-entrance {
          animation: snappyEntrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
        .overlay-content::-webkit-scrollbar {
          width: 4px;
        }
        .overlay-content::-webkit-scrollbar-thumb {
          background: rgba(36, 162, 167, 0.3);
          border-radius: 10px;
        }
      `}</style>

      <div 
        className="relative bg-[#141414] border border-white/10 rounded-[2.5rem] max-w-5xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] snappy-entrance overlay-content"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-500 hover:text-white transition-all p-2 hover:bg-white/5 rounded-full active:scale-90 z-[120]"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8 md:p-16 lg:p-24 space-y-32">
          {/* Hero Section */}
          <section className="space-y-12">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter leading-none mb-4 text-white">Sam Bloch</h1>
              <h2 className="text-xl md:text-3xl font-bold text-gray-500 tracking-tight italic">From the Great Lakes to the Pacific</h2>
            </div>

            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center">
              <div className="space-y-8">
                <p className="text-lg md:text-2xl font-medium leading-tight text-gray-300">
                  My journey started in Walled Lake, Michigan, where my curiosity for "how things work" usually resulted in a disassembled radio or a messy art project.
                </p>
                <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                  I graduated from Michigan State in 2020 with a degree in Experience Architecture—entering a world that was suddenly, and violently, forced to rely on digital systems to stay connected. That experience cemented my mission: <span className="text-white font-bold">Technology is only as good as the human connection it facilitates.</span>
                </p>
              </div>
              <div className="aspect-[4/5] bg-[#1a1a1a] rounded-[2rem] overflow-hidden border border-white/5 relative group">
                <img 
                  src="/about-1.jpg" 
                  alt="Sam Origins" 
                  className="w-full h-full object-cover grayscale transition-opacity duration-500"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
            </div>
          </section>

          {/* Education Section */}
          <section className="space-y-16">
            <div className="space-y-8">
              <h3 className="text-3xl md:text-5xl font-black tracking-tight text-white">I Love to Learn</h3>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl">
                I’ve never been satisfied with just one lens. To me, a great program manager is <span className="text-white font-bold">part people and part systems.</span> That's why I've sought additional education opportunities:
              </p>
              <ul className="grid md:grid-cols-2 gap-8 text-gray-300">
                <li className="p-8 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                  <div className="w-10 h-10 bg-[#24A2A7]/20 rounded-xl flex items-center justify-center">
                    <span className="text-[#24A2A7] font-black">1</span>
                  </div>
                  <h4 className="text-xl font-bold">An M.S. in HCI</h4>
                  <p className="text-gray-400">Mastering the technical friction between humans and machines.</p>
                </li>
                <li className="p-8 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                  <div className="w-10 h-10 bg-[#24A2A7]/20 rounded-xl flex items-center justify-center">
                    <span className="text-[#24A2A7] font-black">2</span>
                  </div>
                  <h4 className="text-xl font-bold">An M.A. in Leadership</h4>
                  <p className="text-gray-400">Currently finishing my second graduate degree (Class of 2026), focusing on leading teams through the shift of the AI era.</p>
                </li>
              </ul>
            </div>

            <div className="pt-12 border-t border-white/5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                  { name: 'Michigan State University', degree: 'B.A. Experience Architecture, 2020', logo: '/msu.png' },
                  { name: 'Quinnipiac University', degree: 'M.S. Interactive Media, 2023', logo: '/quinni.png' },
                  { name: 'University of the Pacific', degree: 'M.A. Leadership, Innovation & Change, 2026', logo: '/uop.png' }
                ].map((school) => (
                  <div key={school.name} className="flex flex-col items-center text-center group">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5 transition-all group-hover:scale-110 group-hover:border-[#24A2A7]/40 relative">
                      {/* Tooltip popping up above the logo */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#24A2A7] text-black text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-20 shadow-xl">
                        {school.name}
                        {/* Little triangle arrow */}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#24A2A7] rotate-45"></div>
                      </div>
                      
                      <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                        <img 
                          src={school.logo} 
                          alt={school.name} 
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          decoding="async"
                        />
                      </div>
                    </div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight group-hover:text-[#24A2A7] transition-colors">{school.degree}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Teaching Section */}
          <section className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 aspect-[16/10] bg-[#1a1a1a] rounded-[2rem] overflow-hidden border border-white/5 group relative">
              <img 
                src="/about-2.jpg" 
                alt="Sam Teaching" 
                className="w-full h-full object-cover grayscale transition-opacity duration-500"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="space-y-8 order-1 lg:order-2">
              <h3 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">Why I Teach: <br /> "Level Up"</h3>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                Leadership isn't a title; it’s a service. Currently, I’m teaching a self-designed course, Level Up, at Quinnipiac University. 
              </p>
              <p className="text-gray-400 text-base leading-relaxed">
                I help students "Get on the Balcony"—teaching them to see the patterns in organizational culture and career strategy so they can enter the workforce not just as employees, but as architects of their own success.
              </p>
            </div>
          </section>

          {/* Sandbox Section */}
          <section className="space-y-16">
            <div className="max-w-2xl space-y-8">
              <h3 className="text-3xl md:text-5xl font-black tracking-tight text-white">A Sandbox Kid</h3>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                I believe that the problem-solving I use at Google for Trust & Safety is the same muscle I use to troubleshoot a 3D printer or find the right chord progression on my guitar. From an early age, I've been obsessed with building things—whether they were Minecraft Mods or Home Arcades—and given a free weekend, you'll likely find me pouring hours into a new, exciting passion project.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-10">
                {[
                  { title: 'IoT & Tinkering', text: 'Turning my home into a living, breathing lab; constantly setting up new home automation, 3D printing, and finding new technologies to explore.' },
                  { title: 'Music', text: 'Playing guitar, collecting vinyl, attending concerts, and engaging with the scene in any way I can.', link: 'https://www.concertarchives.org/sam-bloch', linkText: 'See Archive' },
                  { title: 'Surfing & Hiking', text: 'I was actually terrified of the ocean for a long time, but now I can’t get enough of it. When I\'m not in the water, I\'m spending my weekends hiking through Malibu.' },
                  { title: 'Film', text: 'I love the theater culture in Los Angeles and the community that surrounds it.', link: 'https://letterboxd.com/sam5927tde/', linkText: 'Follow Letterboxd' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-4">
                    <h4 className="text-lg font-bold text-white flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#24A2A7]"></div>
                      {item.title}
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed pl-4">
                      {item.text}
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#24A2A7] hover:underline ml-2">
                          {item.linkText} <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </p>
                  </div>
                ))}
              </div>
              <div className="aspect-[4/6] bg-[#1a1a1a] rounded-[2rem] overflow-hidden border border-white/5">
                <img 
                  src="/about-3.jpg" 
                  alt="Sam Passions" 
                  className="w-full h-full object-cover grayscale"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </section>

          {/* Connect Section */}
          <section className="pt-20 border-t border-white/5 text-center space-y-12">
            <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-white">Let’s Connect</h3>
            <div className="flex justify-center gap-6">
              <a 
                href="https://www.linkedin.com/in/blochsam/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#24A2A7] hover:text-black transition-all group active:scale-95"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a 
                href="https://www.instagram.com/sam5927tde" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#24A2A7] hover:text-black transition-all group active:scale-95"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <button 
                onClick={handleSecureMail}
                className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#24A2A7] hover:text-black transition-all group active:scale-95"
              >
                <Mail className="w-6 h-6" />
              </button>
            </div>
          </section>

          {/* Close Button at bottom */}
          <button 
            onClick={onClose}
            className="w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[12px] transition-all hover:brightness-110 active:scale-95 shadow-xl flex items-center justify-center gap-4 bg-[#24A2A7] text-[#121212]"
          >
            Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutOverlay;
