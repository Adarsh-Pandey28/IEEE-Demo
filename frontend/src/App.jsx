import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X } from 'lucide-react';

import CircuitBackground from './components/ui/CircuitBackground';
import { IeeeLogo } from './components/ui/hero-odyssey';
import heroLogo from './assets/image.png';
import IeeeLegacy from './components/IeeeLegacy';
import WarpTransition from './components/WarpTransition';
import Preloader from './components/Preloader';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────
// Navbar (scroll-to-section version)
// ─────────────────────────────────────────────
function Navbar() {
  const [active, setActive] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home',         id: 'home' },
    { name: 'Legacy',       id: 'legacy' },
    { name: 'Chapters',     id: 'chapters' },
    { name: 'Events',       id: 'events' },
    { name: 'Board',        id: 'board' },
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
          <IeeeLogo className="w-8 h-8 drop-shadow-[0_0_8px_rgba(0,194,255,0.4)]" />
          <span className="font-display font-bold text-lg tracking-wider text-white">
            IEEE <span className="text-ieee-cyan italic">SRM</span>
          </span>
        </button>

        {/* Desktop pill nav */}
        <div className="hidden lg:flex items-center bg-white/5 border border-white/5 rounded-full px-2 py-1 text-xs font-display font-semibold tracking-wider uppercase">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`relative px-4 py-2 rounded-full transition-all duration-300 ${
                active === link.id
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
            className="px-5 py-2 bg-white text-black font-display font-bold text-xs uppercase tracking-wider rounded-full hover:bg-ieee-cyan hover:text-black transition-all flex items-center gap-2 group shadow-[0_0_12px_rgba(255,255,255,0.1)]"
          >
            <span className="w-2 h-2 bg-black rounded-full group-hover:animate-ping"></span>
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
                  className={`py-3 rounded-full text-lg font-display font-medium border transition-colors ${
                    active === link.id
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

      <CircuitBackground />

      <div className="relative min-h-screen flex items-center justify-between px-6 md:px-16 pt-24 pb-12 overflow-hidden z-20">
        {/* Left: Heading */}
        <motion.div style={{ y: textY }} className="relative z-10 max-w-2xl flex flex-col justify-center flex-1">
          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
              className="text-5xl md:text-[6.5rem] leading-[0.95] font-display font-medium tracking-tighter"
            >
              Engineered <br /> For <span className="text-ieee-cyan italic">Impact.</span>
            </motion.h1>
          </div>
          <div className="overflow-hidden max-w-xl mt-6">
            <motion.p
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.76, 0, 0.24, 1] }}
              className="text-base md:text-lg text-gray-300 font-sans leading-relaxed"
            >
              We are the IEEE Student Branch. Advancing technology for humanity through bold innovation, rigorous engineering, and visionary leadership.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap gap-4 mt-8"
          >
            <button
              onClick={() => document.getElementById('chapters')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-2.5 bg-white text-black font-display font-bold text-xs uppercase tracking-wider rounded-full hover:bg-ieee-cyan hover:text-black transition-all shadow-[0_0_15px_rgba(0,194,255,0.15)]"
            >
              Explore Chapter
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

        {/* Right: Logo */}
        <motion.div
          style={{ y: logoY, scale: logoScale, filter: 'url(#liquid-filter-home)', willChange: 'transform' }}
          whileHover={{ scale: 1.03 }}
          className="hidden md:flex flex-1 justify-center items-center select-none drop-shadow-[0_0_35px_rgba(0,194,255,0.25)] relative"
        >
          <div className="absolute w-[350px] h-[350px] bg-gradient-to-r from-ieee-cyan/20 to-ieee-bright/10 rounded-full blur-[100px] animate-pulse"></div>
          <div style={{
            width: '600px', height: '600px',
            WebkitMaskImage: 'radial-gradient(ellipse 55% 55% at center, black 30%, transparent 65%)',
            maskImage: 'radial-gradient(ellipse 55% 55% at center, black 30%, transparent 65%)',
          }}>
            <img src={heroLogo} alt="IEEE SRM Logo" className="w-full h-full object-contain" style={{ mixBlendMode: 'screen', filter: 'brightness(1.3) contrast(1.1) saturate(1.2)' }} />
          </div>
        </motion.div>
      </div>

      {/* Mobile logo */}
      <div className="md:hidden flex justify-center py-8 w-full z-20 relative">
        <div style={{
          width: '300px', height: '300px',
          WebkitMaskImage: 'radial-gradient(ellipse 55% 55% at center, black 30%, transparent 65%)',
          maskImage: 'radial-gradient(ellipse 55% 55% at center, black 30%, transparent 65%)',
        }}>
          <img src={heroLogo} alt="IEEE SRM Logo" className="w-full h-full object-contain" style={{ mixBlendMode: 'screen', filter: 'brightness(1.3) contrast(1.1) saturate(1.2)' }} />
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
    const panels = gsap.utils.toArray('.chapter-panel');
    panels.forEach((panel) => {
      ScrollTrigger.create({ trigger: panel, start: 'top top', pin: true, pinSpacing: false, end: () => `+=${window.innerHeight}` });
    });
  }, { scope: container });

  const chapters = [
    { id: 'cs',  title: 'Computer Society',       desc: 'Focusing on artificial intelligence, software engineering, and the future of computing.',  bg: 'bg-ieee-deep text-ieee-light' },
    { id: 'ras', title: 'Robotics & Automation',  desc: 'Bridging the gap between software and physical machines.',                                  bg: 'bg-ieee-bright text-white' },
    { id: 'pes', title: 'Power & Energy',          desc: 'Innovating sustainable energy solutions and smart grids.',                                  bg: 'bg-ieee-light text-ieee-deep' },
  ];

  return (
    <div id="chapters" ref={container}>
      <section className="chapter-panel h-screen w-full flex items-center justify-center bg-ieee-deep text-ieee-light relative z-[1]">
        <div className="text-center">
          <h2 className="text-6xl md:text-8xl font-display font-medium tracking-tighter mb-4">Our Chapters.</h2>
          <p className="text-xl font-sans opacity-70">Scroll to explore</p>
        </div>
      </section>
      {chapters.map((chapter, index) => (
        <section
          key={chapter.id}
          className={`chapter-panel h-screen w-full flex items-center justify-center relative z-[${index + 2}] ${chapter.bg} shadow-[-10px_-10px_30px_rgba(0,0,0,0.1)] rounded-t-[3rem] mt-[-3rem] border-t border-white/10`}
        >
          <div className="max-w-4xl px-8 text-center">
            <h3 className="text-5xl md:text-7xl font-display font-bold mb-8">{chapter.title}</h3>
            <p className="text-xl md:text-3xl font-sans opacity-80 leading-relaxed">{chapter.desc}</p>
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
    const panels = gsap.utils.toArray('.event-panel');
    panels.forEach((panel) => {
      ScrollTrigger.create({ trigger: panel, start: 'top top', pin: true, pinSpacing: false, end: () => `+=${window.innerHeight}` });
    });
  }, { scope: container });

  const events = [
    { bg: 'bg-ieee-light text-ieee-deep', date: 'Oct 24', title: 'The Future of Quantum Computing',  speaker: 'Dr. Alistair Webb',  role: 'Lead Researcher, IBM Quantum', tags: ['Computer Society', 'Keynote'] },
    { bg: 'bg-ieee-bright text-white',    date: 'Nov 12', title: 'Autonomous Systems Workshop',       speaker: "Sarah O'Connor",     role: 'Robotics Engineer, Tesla',     tags: ['Robotics & Automation', 'Workshop'] },
    { bg: 'bg-ieee-deep text-ieee-cyan',  date: 'Dec 05', title: 'Smart Grids for 2030',              speaker: 'Prof. Li Wei',       role: 'Dept. of Energy Strategy',    tags: ['Power & Energy', 'Seminar'] },
  ];

  return (
    <div id="events" ref={container} className="bg-black">
      <section className="event-panel h-screen w-full flex flex-col items-center justify-center bg-ieee-deep text-ieee-light relative z-[1]">
        <div className="text-center px-8">
          <h2 className="text-6xl md:text-8xl font-display font-medium tracking-tighter mb-8">
            Knowledge <span className="text-ieee-cyan italic">In Motion.</span>
          </h2>
          <p className="text-xl font-sans opacity-70">Scroll through upcoming events.</p>
        </div>
      </section>
      {events.map((event, index) => (
        <section
          key={index}
          className={`event-panel h-screen w-full flex items-center justify-center relative z-[${index + 2}] ${event.bg} rounded-t-[3rem] mt-[-3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.2)]`}
        >
          <div className="max-w-5xl px-8 w-full">
            <div className="mb-8">
              <span className="text-4xl md:text-6xl font-display font-bold border-b-2 border-current pb-4 inline-block">{event.date}</span>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start gap-12">
              <div>
                <div className="flex gap-3 mb-6 flex-wrap">
                  {event.tags.map(tag => (
                    <span key={tag} className="text-sm font-sans uppercase tracking-widest bg-black/10 px-4 py-2 rounded-full">{tag}</span>
                  ))}
                </div>
                <h3 className="text-5xl md:text-7xl font-display font-bold max-w-3xl leading-tight">{event.title}</h3>
              </div>
              <div className="flex-shrink-0 text-left md:text-right mt-4 md:mt-0">
                <div className="text-2xl font-bold font-sans">{event.speaker}</div>
                <div className="text-lg opacity-70 uppercase tracking-wide">{event.role}</div>
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
    const panels = gsap.utils.toArray('.exec-panel');
    panels.forEach((panel) => {
      ScrollTrigger.create({ trigger: panel, start: 'top top', pin: true, pinSpacing: false, end: () => `+=${window.innerHeight}` });
    });
  }, { scope: container });

  const group1 = [
    { name: 'Satoshi Tanaka', role: 'Chairperson',  year: 'Senior',    bg: 'bg-ieee-deep text-ieee-light' },
    { name: 'Elena Rostova',  role: 'Vice Chair',    year: 'Senior',    bg: 'bg-ieee-light text-ieee-deep' },
    { name: 'Aisha Patel',    role: 'Secretary',     year: 'Junior',    bg: 'bg-ieee-cyan text-ieee-deep' },
  ];
  const group2 = [
    { name: 'David Kim',      role: 'Treasurer',         year: 'Senior',    bg: 'bg-ieee-bright text-white' },
    { name: 'Priya Singh',    role: 'Webmaster',         year: 'Sophomore', bg: 'bg-ieee-deep text-ieee-light' },
    { name: 'James Carter',   role: 'Event Coordinator', year: 'Junior',    bg: 'bg-ieee-light text-ieee-deep' },
  ];

  return (
    <div id="board" ref={container} className="bg-black text-ieee-deep">
      <section className="exec-panel h-screen w-full flex items-center justify-center bg-ieee-light relative z-[1]">
        <div className="text-center px-8">
          <h2 className="text-6xl md:text-[8rem] font-display font-medium tracking-tighter mb-8 leading-none text-ieee-deep">
            Executive <br /> Board.
          </h2>
          <p className="text-xl md:text-2xl font-sans opacity-70">Meet the leadership driving the vision.</p>
        </div>
      </section>
      <section className="exec-panel min-h-screen md:h-screen w-full flex items-center justify-center bg-ieee-deep relative z-[2] rounded-t-[3rem] mt-[-3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] py-16 md:py-0">
        <div className="w-full max-w-7xl px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {group1.map((exec, i) => (
            <div key={i} className={`p-6 md:p-12 rounded-2xl md:rounded-3xl h-auto md:h-[28rem] flex flex-col justify-between ${exec.bg}`}>
              <div className="flex justify-between items-start opacity-70 mb-8 md:mb-0">
                <span className="text-xs md:text-sm font-sans uppercase tracking-widest">{exec.year}</span>
              </div>
              <div>
                <h3 className="text-3xl md:text-5xl font-display font-bold leading-tight mb-2">{exec.name}</h3>
                <p className="text-lg md:text-xl font-sans opacity-90">{exec.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="exec-panel min-h-screen md:h-screen w-full flex items-center justify-center bg-ieee-cyan relative z-[3] rounded-t-[3rem] mt-[-3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] py-16 md:py-0">
        <div className="w-full max-w-7xl px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {group2.map((exec, i) => (
            <div key={i} className={`p-6 md:p-12 rounded-2xl md:rounded-3xl h-auto md:h-[28rem] flex flex-col justify-between ${exec.bg}`}>
              <div className="flex justify-between items-start opacity-70 mb-8 md:mb-0">
                <span className="text-xs md:text-sm font-sans uppercase tracking-widest">{exec.year}</span>
              </div>
              <div>
                <h3 className="text-3xl md:text-5xl font-display font-bold leading-tight mb-2">{exec.name}</h3>
                <p className="text-lg md:text-xl font-sans opacity-90">{exec.role}</p>
              </div>
            </div>
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
    const panels = gsap.utils.toArray('.achievement-panel');
    panels.forEach((panel) => {
      ScrollTrigger.create({ trigger: panel, start: 'top top', pin: true, pinSpacing: false, end: () => `+=${window.innerHeight}` });
    });
  }, { scope: container });

  const timeline = [
    { year: '2025', title: 'Best Student Branch',    detail: 'Awarded by IEEE Region 10 for outstanding technical contributions and member engagement.', bg: 'bg-ieee-deep text-white' },
    { year: '2024', title: 'Global Hackathon Winners',detail: 'Our team placed 1st globally in the IEEE Xtreme Competition.',                             bg: 'bg-ieee-bright text-white' },
    { year: '2023', title: 'Exemplary Chapter',       detail: 'The Computer Society Chapter was recognized for continuous excellence.',                   bg: 'bg-ieee-cyan text-ieee-deep' },
    { year: '2022', title: '10,000+ Members',         detail: 'A milestone marking our growth as the premier technical society.',                         bg: 'bg-ieee-light text-ieee-deep' },
  ];

  return (
    <div id="achievements" ref={container} className="bg-black">
      <section className="achievement-panel h-screen w-full flex items-center justify-center bg-ieee-deep text-ieee-light relative z-[1]">
        <h2 className="text-6xl md:text-8xl font-display font-medium text-center tracking-tighter">Our Milestones.</h2>
      </section>
      {timeline.map((item, index) => (
        <section
          key={index}
          className={`achievement-panel h-screen w-full flex flex-col items-center justify-center relative z-[${index + 2}] ${item.bg} rounded-t-[3rem] mt-[-3rem] shadow-[-10px_-10px_30px_rgba(0,0,0,0.15)]`}
        >
          <div className="text-center px-8 max-w-4xl">
            <div className="text-2xl font-sans font-bold uppercase tracking-widest opacity-70 mb-4">{item.year}</div>
            <h3 className="text-5xl md:text-7xl font-display font-bold mb-8">{item.title}</h3>
            <p className="text-xl md:text-3xl font-sans opacity-90">{item.detail}</p>
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
  );
}

export default App;
