import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProfileCard from '../components/ui/ProfileCard';

gsap.registerPlugin(ScrollTrigger);

export default function ExecutiveBoard() {
  const container = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      const panels = gsap.utils.toArray('.exec-panel');
      panels.forEach((panel) => {
        ScrollTrigger.create({
          trigger: panel,
          start: 'top top',
          pin: true,
          pinSpacing: false,
          end: () => `+=${window.innerHeight}`,
        });
      });
    });
  }, { scope: container });

  const group1 = [
    {
      name: 'Satoshi Tanaka',
      role: 'Chairperson',
      year: 'Senior',
      innerGradient: 'linear-gradient(145deg, #0A1F44 0%, #030914 100%)',
      behindGlowColor: 'rgba(0, 194, 255, 0.4)',
      textColorTop: '#ffffff',
      textColorBottom: '#00C2FF',
    },
    {
      name: 'Elena Rostova',
      role: 'Vice Chair',
      year: 'Senior',
      innerGradient: 'linear-gradient(145deg, #fafaf9 0%, #e6effa 100%)',
      behindGlowColor: 'rgba(10, 102, 194, 0.2)',
      textColorTop: '#0A1F44',
      textColorBottom: '#0A66C2',
    },
    {
      name: 'Aisha Patel',
      role: 'Secretary',
      year: 'Junior',
      innerGradient: 'linear-gradient(145deg, #00C2FF 0%, #0099C2 100%)',
      behindGlowColor: 'rgba(255, 255, 255, 0.5)',
      textColorTop: '#0A1F44',
      textColorBottom: '#071833',
    },
  ];

  const group2 = [
    {
      name: 'David Kim',
      role: 'Treasurer',
      year: 'Senior',
      innerGradient: 'linear-gradient(145deg, #0A66C2 0%, #0D52A0 100%)',
      behindGlowColor: 'rgba(0, 194, 255, 0.5)',
      textColorTop: '#ffffff',
      textColorBottom: '#00C2FF',
    },
    {
      name: 'Priya Singh',
      role: 'Webmaster',
      year: 'Sophomore',
      innerGradient: 'linear-gradient(145deg, #0A1F44 0%, #030914 100%)',
      behindGlowColor: 'rgba(0, 194, 255, 0.4)',
      textColorTop: '#ffffff',
      textColorBottom: '#00C2FF',
    },
    {
      name: 'James Carter',
      role: 'Event Coordinator',
      year: 'Junior',
      innerGradient: 'linear-gradient(145deg, #fafaf9 0%, #e6effa 100%)',
      behindGlowColor: 'rgba(10, 102, 194, 0.2)',
      textColorTop: '#0A1F44',
      textColorBottom: '#0A66C2',
    },
  ];

  return (
    <div ref={container} className="bg-black text-ieee-deep">
      {/* Header Panel */}
      <section className="exec-panel h-screen w-full flex items-center justify-center bg-ieee-light relative z-[1]">
        <div className="text-center px-8">
          <h1 className="text-4xl md:text-[8rem] font-display font-medium tracking-tighter mb-8 leading-none text-ieee-deep">
            Executive <br /> Board.
          </h1>
          <p className="text-xl md:text-2xl font-sans opacity-70">Meet the leadership driving the vision.</p>
        </div>
      </section>

      {/* Group 1 — Chairperson, Vice Chair, Secretary */}
      <section className="exec-panel min-h-screen md:h-screen w-full flex items-center justify-center bg-ieee-deep relative z-[2] rounded-t-[3rem] mt-[-3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] py-16 md:py-0">
        <div className="w-full max-w-7xl px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 justify-items-center">
          {group1.map((exec, i) => (
            <ProfileCard
              key={i}
              name={exec.name}
              title={exec.role}
              handle={exec.name.toLowerCase().replace(/\s+/g, '')}
              status={exec.year}
              contactText="Email"
              onContactClick={() => window.location.href = `mailto:${exec.name.toLowerCase().replace(/\s+/g, '')}@srmap.edu.in`}
              innerGradient={exec.innerGradient}
              behindGlowColor={exec.behindGlowColor}
              textColorTop={exec.textColorTop}
              textColorBottom={exec.textColorBottom}
              behindGlowEnabled={true}
              showUserInfo={true}
              enableTilt={true}
              enableMobileTilt={true}
            />
          ))}
        </div>
      </section>

      {/* Group 2 — Treasurer, Webmaster, Event Coordinator */}
      <section className="exec-panel min-h-screen md:h-screen w-full flex items-center justify-center bg-ieee-cyan relative z-[3] rounded-t-[3rem] mt-[-3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] py-16 md:py-0">
        <div className="w-full max-w-7xl px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 justify-items-center">
          {group2.map((exec, i) => (
            <ProfileCard
              key={i}
              name={exec.name}
              title={exec.role}
              handle={exec.name.toLowerCase().replace(/\s+/g, '')}
              status={exec.year}
              contactText="Email"
              onContactClick={() => window.location.href = `mailto:${exec.name.toLowerCase().replace(/\s+/g, '')}@srmap.edu.in`}
              innerGradient={exec.innerGradient}
              behindGlowColor={exec.behindGlowColor}
              textColorTop={exec.textColorTop}
              textColorBottom={exec.textColorBottom}
              behindGlowEnabled={true}
              showUserInfo={true}
              enableTilt={true}
              enableMobileTilt={true}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
