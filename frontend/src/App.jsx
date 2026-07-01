import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X } from 'lucide-react';

import GradientBlinds from './components/ui/GradientBlinds';
import { IeeeLogo } from './components/ui/hero-odyssey';
import heroLogo from './assets/image.png';
import IeeeLegacy from './components/IeeeLegacy';
import WarpTransition from './components/WarpTransition';
import Preloader from './components/Preloader';
import Footer from './components/Footer';
import ProfileCard from './components/ui/ProfileCard';
import Lanyard from './components/ui/Lanyard';
import ClickSpark from './components/ui/ClickSpark';
import DotField from './components/ui/DotField';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────
// Navbar (scroll-to-section version)
// ─────────────────────────────────────────────
function Navbar() {
  const [active, setActive] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Legacy', id: 'legacy' },
    { name: 'Chapters', id: 'chapters' },
    { name: 'Events', id: 'events' },
    { name: 'Board', id: 'board' },
    { name: 'Achievements', id: 'achievements' },
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setActive(id);
    setIsMobileMenuOpen(false);
  };

  // Highlight active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      for (const link of [...navLinks].reverse()) {
        const el = document.getElementById(link.id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(link.id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 py-4 bg-black/30 backdrop-blur-md border-b border-white/5 text-white"
      >
        {/* Logo */}
        <button onClick={() => scrollTo('home')} className="flex items-center gap-2">
          <IeeeLogo className="w-8 h-8" />
          <span className="font-sans font-extrabold text-xl tracking-wider text-white uppercase">
            IEEE <span className="text-[#00C2FF] italic font-semibold">SRM</span>
          </span>
        </button>

        {/* Desktop pill nav */}
        <div className="hidden lg:flex items-center bg-white/5 border border-white/5 rounded-full px-2 py-1 text-xs font-sans font-semibold tracking-wider uppercase">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`relative px-4 py-2 rounded-full transition-all duration-300 ${active === link.id
                ? 'bg-white/10 text-white border border-white/10 shadow-[0_0_12px_rgba(255,255,255,0.05)]'
                : 'text-white/70 hover:text-ieee-cyan hover:bg-white/5'
                }`}
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Join button */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href="https://www.ieee.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 bg-stone-900 text-white font-sans font-semibold text-xs uppercase tracking-wider rounded-full hover:bg-[#00c2ff] hover:text-stone-950 transition-all flex items-center gap-2 group hover:shadow-[0_0_15px_rgba(0,194,255,0.3)]"
          >
            <span className="w-1.5 h-1.5 bg-white group-hover:bg-stone-950 rounded-full"></span>
            JOIN IEEE
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden relative z-50 text-white p-2 hover:text-ieee-cyan transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-black/95 text-white flex flex-col items-center justify-center pt-20"
          >
            <div className="flex flex-col gap-6 text-center w-full max-w-xs px-6">
              {navLinks.map((link, i) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`py-3 rounded-full text-lg font-display font-medium border transition-colors ${active === link.id
                    ? 'text-ieee-cyan border-ieee-cyan/30 bg-ieee-cyan/5'
                    : 'text-white/80 border-transparent hover:text-ieee-cyan'
                    }`}
                >
                  <motion.span
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.05, duration: 0.4 }}
                  >
                    {link.name}
                  </motion.span>
                </button>
              ))}
              <a
                href="https://www.ieee.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 py-3 bg-white text-black font-display font-bold text-center text-sm uppercase tracking-wider rounded-full shadow-lg hover:bg-ieee-cyan hover:text-black transition-colors"
              >
                JOIN IEEE
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─────────────────────────────────────────────
// HOME SECTION
// ─────────────────────────────────────────────
function HomeSection() {
  const { scrollY } = useScroll();
  const liquidDistortionScale = useTransform(scrollY, [0, 180, 500], [0, 48, 4]);
  const logoY = useTransform(scrollY, [0, 600], [0, -80]);
  const logoScale = useTransform(scrollY, [0, 600], [1, 0.75]);
  const textY = useTransform(scrollY, [0, 600], [0, 50]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const unsub = liquidDistortionScale.on('change', (v) => {
      const map = document.getElementById('displacement-map-home');
      if (map) map.setAttribute('scale', v.toString());
    });
    return () => unsub();
  }, [liquidDistortionScale]);

  return (
    <section id="home" className="relative min-h-screen bg-[#030914] text-white overflow-x-hidden">
      <svg className="hidden">
        <defs>
          <filter id="liquid-filter-home">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" id="displacement-map-home" />
          </filter>
        </defs>
      </svg>

      {/* Background animated gradient blinds */}
      <div className="absolute inset-0 z-0" style={{ width: '100%', height: '100%' }}>
        <GradientBlinds
          gradientColors={['#030914', '#071833', '#0A3B75', '#008bb3', '#030914']}
          angle={45}
          noise={0.1}
          blindCount={14}
          blindMinWidth={50}
          spotlightRadius={0.6}
          spotlightSoftness={1.2}
          spotlightOpacity={0.4}
          mouseDampening={0.15}
          distortAmount={4}
          shineDirection="left"
          mixBlendMode="normal"
        />
      </div>

      <div className="relative min-h-screen flex flex-col md:flex-row items-center justify-center md:justify-between px-6 md:px-16 pt-20 pb-6 overflow-hidden z-20 gap-4">
        {/* Left: Heading */}
        <motion.div style={{ y: textY }} className="relative z-10 max-w-2xl flex flex-col justify-center flex-1 text-center md:text-left items-center md:items-start">
          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
              className="text-4xl sm:text-5xl md:text-[6.5rem] leading-[0.95] font-display tracking-tight"
            >
              Engineering <br /> the <span className="text-[#00C2FF] italic">Future.</span>
            </motion.h1>
          </div>

          <div className="overflow-hidden max-w-xl mt-3 md:mt-6">
            <motion.p
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.76, 0, 0.24, 1] }}
              className="text-sm md:text-lg text-gray-300 font-sans leading-relaxed"
            >
              The IEEE Student Branch empowers ambitious engineers to innovate, collaborate, and build technologies that shape the future of humanity.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap justify-center md:justify-start gap-4 mt-5 md:mt-8"
          >
            <button
              onClick={() => document.getElementById('chapters')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-2.5 bg-white text-stone-900 font-sans font-semibold text-xs uppercase tracking-wider rounded-full hover:bg-[#00C2FF] hover:text-stone-950 transition-all hover:shadow-[0_0_20px_rgba(0,194,255,0.4)]"
            >
              Explore Chapters
            </button>
            <a
              href="https://www.ieee.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-white/5 border border-white/10 text-white font-display font-bold text-xs uppercase tracking-wider rounded-full hover:bg-white/10 transition-all"
            >
              Official Website
            </a>
          </motion.div>
        </motion.div>

        {/* Interactive 3D Lanyard Badge (Optimized for both Desktop and Mobile) */}
        <div className="flex flex-1 justify-center items-center h-[340px] md:h-[550px] w-full relative z-30 select-none">
          <Lanyard
            position={[0, -1.2, 20]}
            gravity={[0, -40, 0]}
            frontImage={heroLogo}
            backImage={heroLogo}
            imageFit="cover"
            lanyardWidth={1.2}
          />
        </div>
      </div>

    </section>
  );
}

// ─────────────────────────────────────────────
// CHAPTERS SECTION
// ─────────────────────────────────────────────
function ChaptersSection() {
  const container = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      const panels = gsap.utils.toArray('.chapter-panel');
      panels.forEach((panel) => {
        ScrollTrigger.create({ trigger: panel, start: 'top top', pin: true, pinSpacing: false, end: () => `+=${window.innerHeight}` });
      });
    });
  }, { scope: container });

  const chapters = [
    { id: 'cs', title: 'Computer Society', desc: 'Focusing on artificial intelligence, software engineering, and the future of computing.', bg: 'bg-ieee-deep text-ieee-light' },
    { id: 'ras', title: 'Robotics & Automation', desc: 'Bridging the gap between software and physical machines.', bg: 'bg-ieee-bright text-white' },
    { id: 'pes', title: 'Power & Energy', desc: 'Innovating sustainable energy solutions and smart grids.', bg: 'bg-ieee-light text-ieee-deep' },
  ];

  return (
    <div id="chapters" ref={container}>
      <section className="chapter-panel h-screen w-full flex items-center justify-center bg-ieee-light text-ieee-deep relative z-[1]">
        <div className="text-center">
          <h2 className="text-4xl md:text-8xl font-display font-medium tracking-tighter mb-4">Our Chapters.</h2>
          <p className="text-xl font-sans opacity-70">Scroll to explore</p>
        </div>
      </section>
      {chapters.map((chapter, index) => (
        <section
          key={chapter.id}
          className={`chapter-panel h-screen w-full flex items-center justify-center relative z-[${index + 2}] ${chapter.bg} shadow-[-10px_-10px_30px_rgba(0,0,0,0.1)] rounded-t-[3rem] mt-[-3rem] border-t border-white/10`}
        >
          <div className="max-w-4xl px-8 text-center">
            <h3 className="text-3xl md:text-7xl font-display font-bold mb-8">{chapter.title}</h3>
            <p className="text-lg md:text-3xl font-sans opacity-80 leading-relaxed">{chapter.desc}</p>
          </div>
        </section>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// EVENTS SECTION
// ─────────────────────────────────────────────
function EventsSection() {
  const container = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      const panels = gsap.utils.toArray('.event-panel');
      panels.forEach((panel) => {
        ScrollTrigger.create({ trigger: panel, start: 'top top', pin: true, pinSpacing: false, end: () => `+=${window.innerHeight}` });
      });
    });
  }, { scope: container });

  const events = [
    { bg: 'bg-ieee-light text-ieee-deep', isDark: false, date: 'Oct 24', title: 'The Future of Quantum Computing', speaker: 'Dr. Alistair Webb', role: 'Lead Researcher, IBM Quantum', tags: ['Computer Society', 'Keynote'] },
    { bg: 'bg-ieee-bright text-white', isDark: true, date: 'Nov 12', title: 'Autonomous Systems Workshop', speaker: "Sarah O'Connor", role: 'Robotics Engineer, Tesla', tags: ['Robotics & Automation', 'Workshop'] },
  ];

  return (
    <div id="events" ref={container} className="bg-black">
      <section
        className="event-panel h-screen w-full flex flex-col items-center justify-center bg-[#050811] text-ieee-light relative overflow-hidden z-[1] rounded-t-[3rem] mt-[-3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] border-t border-white/10"
        style={{
          background: "radial-gradient(circle at 50% 30%, #0c1c36 0%, #060b14 60%, #030509 100%)"
        }}
      >
        {/* Dynamic blurred mesh gradient glow bubbles in the background */}
        <div className="absolute w-[700px] h-[700px] rounded-full bg-[#0A66C2]/18 blur-[130px] pointer-events-none top-[5%] left-[-15%] z-0 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute w-[800px] h-[800px] rounded-full bg-[#00C2FF]/14 blur-[150px] pointer-events-none bottom-[5%] right-[-15%] z-0 animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[#60496e]/12 blur-[120px] pointer-events-none top-[20%] left-[25%] z-0" />

        {/* Subtle geometric grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-80 mix-blend-overlay z-0"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.35) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.35) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)"
          }}
        />
        <div className="text-center px-8 relative z-10">
          <h2 className="text-4xl md:text-8xl font-display font-medium tracking-tighter mb-8">
            Knowledge <span className="text-ieee-cyan italic">In Motion.</span>
          </h2>
          <p className="text-xl font-sans opacity-70">Scroll through upcoming events.</p>
        </div>
      </section>
      {events.map((event, index) => (
        <section
          key={index}
          className={`event-panel h-screen w-full flex items-center justify-center relative overflow-hidden z-[${index + 2}] ${event.bg} rounded-t-[3rem] mt-[-3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] border-t ${event.isDark ? 'border-white/10' : 'border-black/5'}`}
          style={event.isDark ? {
            background: "radial-gradient(circle at 50% 30%, #0c1c36 0%, #060b14 60%, #030509 100%)"
          } : {}}
        >
          {event.isDark && (
            <>
              {/* Dynamic blurred mesh gradient glow bubbles in the background */}
              <div className="absolute w-[700px] h-[700px] rounded-full bg-[#0A66C2]/18 blur-[130px] pointer-events-none top-[5%] left-[-15%] z-0 animate-pulse" style={{ animationDuration: '8s' }} />
              <div className="absolute w-[800px] h-[800px] rounded-full bg-[#00C2FF]/14 blur-[150px] pointer-events-none bottom-[5%] right-[-15%] z-0 animate-pulse" style={{ animationDuration: '12s' }} />
              <div className="absolute w-[500px] h-[500px] rounded-full bg-[#60496e]/12 blur-[120px] pointer-events-none top-[20%] left-[25%] z-0" />
            </>
          )}

          {/* Subtle geometric grid overlay */}
          <div
            className={`absolute inset-0 pointer-events-none opacity-80 z-0 ${event.isDark ? 'mix-blend-overlay' : 'mix-blend-multiply'}`}
            style={{
              backgroundImage: event.isDark
                ? "linear-gradient(rgba(255,255,255,0.35) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.35) 1px,transparent 1px)"
                : "linear-gradient(rgba(0,0,0,0.25) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.25) 1px,transparent 1px)",
              backgroundSize: "40px 40px",
              maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)"
            }}
          />
          <div className="max-w-5xl px-8 w-full relative z-10">
            <div className="mb-8">
              <span className={`text-2xl md:text-6xl font-display font-bold border-b-2 border-current pb-4 inline-block ${event.isDark ? 'text-white' : 'text-[#0A66C2]'}`}>{event.date}</span>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-12">
              <div>
                <div className="flex gap-3 mb-6 flex-wrap">
                  {event.tags.map(tag => (
                    <span key={tag} className={`text-xs md:text-sm font-sans uppercase tracking-widest px-3 py-1.5 md:px-4 md:py-2 rounded-full ${event.isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-stone-850'}`}>{tag}</span>
                  ))}
                </div>
                <h3 className={`text-2xl sm:text-3xl md:text-7xl font-display font-bold max-w-3xl leading-tight ${event.isDark ? 'text-white' : 'text-stone-900'}`}>{event.title}</h3>
              </div>
              <div className="flex-shrink-0 text-left md:text-right mt-3 md:mt-0">
                <div className={`text-2xl font-bold font-sans ${event.isDark ? 'text-[#00C2FF]' : 'text-stone-900'}`}>{event.speaker}</div>
                <div className={`text-lg opacity-70 uppercase tracking-wide ${event.isDark ? 'text-stone-300' : 'text-stone-600'}`}>{event.role}</div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// EXECUTIVE BOARD SECTION
// ─────────────────────────────────────────────
function BoardSection() {
  const container = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      const panels = gsap.utils.toArray('.exec-panel');
      panels.forEach((panel) => {
        ScrollTrigger.create({ trigger: panel, start: 'top top', pin: true, pinSpacing: false, end: () => `+=${window.innerHeight}` });
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
    <div id="board" ref={container} className="bg-black text-ieee-deep">
      <section className="exec-panel h-screen w-full flex items-center justify-center bg-ieee-light relative z-[1]">
        <div className="text-center px-8">
          <h2 className="text-4xl md:text-[8rem] font-display font-medium tracking-tighter mb-8 leading-none text-ieee-deep">
            Executive <br /> Board.
          </h2>
          <p className="text-xl md:text-2xl font-sans opacity-70">Meet the leadership driving the vision.</p>
        </div>
      </section>
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
            />
          ))}
        </div>
      </section>
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
            />
          ))}
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────
// ACHIEVEMENTS SECTION
// ─────────────────────────────────────────────
function AchievementsSection() {
  const container = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      const panels = gsap.utils.toArray('.achievement-panel');
      panels.forEach((panel) => {
        ScrollTrigger.create({ trigger: panel, start: 'top top', pin: true, pinSpacing: false, end: () => `+=${window.innerHeight}` });
      });
    });
  }, { scope: container });

  const timeline = [
    { year: '2025', title: 'Best Student Branch', detail: 'Awarded by IEEE Region 10 for outstanding technical contributions and member engagement.', bg: 'bg-ieee-deep text-white' },
    { year: '2024', title: 'Global Hackathon Winners', detail: 'Our team placed 1st globally in the IEEE Xtreme Competition.', bg: 'bg-ieee-bright text-white' },
    { year: '2023', title: 'Exemplary Chapter', detail: 'The Computer Society Chapter was recognized for continuous excellence.', bg: 'bg-ieee-cyan text-ieee-deep' },
    { year: '2022', title: '10,000+ Members', detail: 'A milestone marking our growth as the premier technical society.', bg: 'bg-ieee-light text-ieee-deep' },
  ];

  return (
    <div id="achievements" ref={container} className="bg-black">
      <section className="achievement-panel h-screen w-full flex items-center justify-center bg-ieee-deep text-ieee-light relative z-[1]">
        <h2 className="text-4xl md:text-8xl font-display font-medium text-center tracking-tighter">Our Milestones.</h2>
      </section>
      {timeline.map((item, index) => (
        <section
          key={index}
          className={`achievement-panel h-screen w-full flex flex-col items-center justify-center relative z-[${index + 2}] ${item.bg} rounded-t-[3rem] mt-[-3rem] shadow-[-10px_-10px_30px_rgba(0,0,0,0.15)]`}
        >
          <div className="text-center px-8 max-w-4xl">
            <div className="text-xl font-sans font-bold uppercase tracking-widest opacity-70 mb-4">{item.year}</div>
            <h3 className="text-3xl md:text-7xl font-display font-bold mb-8">{item.title}</h3>
            <p className="text-lg md:text-3xl font-sans opacity-90">{item.detail}</p>
          </div>
        </section>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// ROOT APP — single scrolling page
// ─────────────────────────────────────────────
function App() {
  return (
    <ClickSpark sparkColor="#00C2FF" sparkSize={12} sparkRadius={25} sparkCount={10} duration={500}>
      <div className="flex flex-col min-h-screen">
        <Preloader />
        <Navbar />
        <main>
          <HomeSection />
          <WarpTransition />
          <IeeeLegacy />
          <ChaptersSection />
          <EventsSection />
          <BoardSection />
          <AchievementsSection />
        </main>
        <Footer />
      </div>
    </ClickSpark>
  );
}

export default App;
