import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import BorderGlow from "./ui/BorderGlow";
import DotField from "./ui/DotField";

const pioneers = [
  { name: "Lord Kelvin",    initials: "LK", era: "1892", field: "Thermodynamics",      contribution: "Laid the absolute mathematical foundations of thermodynamics." },
  { name: "Nikola Tesla",   initials: "NT", era: "1917", field: "Electrical Power",    contribution: "Pioneered AC power systems that electrified the modern world." },
  { name: "Thomas Edison",  initials: "TE", era: "1928", field: "Electric Light",      contribution: "Invented practical electric lighting and power distribution." },
  { name: "G. Marconi",     initials: "GM", era: "1918", field: "Wireless Comms",      contribution: "Invented long-distance wireless communication and modern radio." },
  { name: "Vannevar Bush",  initials: "VB", era: "1949", field: "Computing & Defense", contribution: "Accelerated computing, defense research, and scientific innovation." },
  { name: "Claude Shannon", initials: "CS", era: "1966", field: "Information Theory",  contribution: "Father of Information Theory - the math behind all digital communications." },
  { name: "Gordon Moore",   initials: "GM", era: "1998", field: "Semiconductor Law",   contribution: "Co-founded Intel. His law governed 50 years of chip evolution." },
  { name: "Robert Noyce",   initials: "RN", era: "1978", field: "Microchip Pioneer",   contribution: "Co-invented the integrated circuit. Co-founded Intel." },
  { name: "Jack Kilby",     initials: "JK", era: "2000", field: "Nobel Laureate",      contribution: "Invented the monolithic integrated circuit. Nobel Prize winner." },
  { name: "John Bardeen",   initials: "JB", era: "1952", field: "Transistor",          contribution: "Only physicist with two Nobel Prizes. Co-invented the transistor." },
  { name: "Andrew Grove",   initials: "AG", era: "1999", field: "Semiconductors",      contribution: "Made Intel the world leading semiconductor company." },
  { name: "M. Dresselhaus", initials: "MD", era: "2012", field: "Nanotechnology",      contribution: "Queen of Carbon Science - revolutionized nanotechnology." },
];

const infinitePioneers = [...pioneers, ...pioneers, ...pioneers];

function PioneerCard({ pioneer }) {
  const cardRef = useRef(null);
  const hoveredRef = useRef(false);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    // Write directly to DOM — no React re-render
    cardRef.current.style.setProperty('--tilt-x', `${-dy * 6}deg`);
    cardRef.current.style.setProperty('--tilt-y', `${dx * 6}deg`);
    const glow = cardRef.current.querySelector('.pioneer-glow');
    if (glow) glow.style.background = `radial-gradient(circle 120px at ${x}px ${y}px, rgba(0, 194, 255, 0.14), transparent 80%)`;
  }, []);

  const handleMouseEnter = useCallback(() => {
    hoveredRef.current = true;
    if (cardRef.current) {
      cardRef.current.style.setProperty('--hover-y', '-10px');
      const glow = cardRef.current.querySelector('.pioneer-glow');
      if (glow) glow.style.opacity = '1';
      const badge = cardRef.current.querySelector('.pioneer-badge');
      if (badge) badge.style.transform = 'scale(1.08)';
      const line = cardRef.current.querySelector('.pioneer-line');
      if (line) line.style.width = '60%';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoveredRef.current = false;
    if (cardRef.current) {
      cardRef.current.style.setProperty('--tilt-x', '0deg');
      cardRef.current.style.setProperty('--tilt-y', '0deg');
      cardRef.current.style.setProperty('--hover-y', '0px');
      const glow = cardRef.current.querySelector('.pioneer-glow');
      if (glow) glow.style.opacity = '0';
      const badge = cardRef.current.querySelector('.pioneer-badge');
      if (badge) badge.style.transform = 'scale(1)';
      const line = cardRef.current.querySelector('.pioneer-line');
      if (line) line.style.width = '25%';
    }
  }, []);

  return (
    <div style={{ perspective: "900px" }} className="flex-shrink-0 w-[230px]">
      <div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        style={{
          transform: 'rotateX(var(--tilt-x,0deg)) rotateY(var(--tilt-y,0deg)) translateY(var(--hover-y,0px))',
          transition: 'transform 0.25s cubic-bezier(0.23,1,0.32,1)',
          willChange: 'transform',
        }}
        className="w-full select-none cursor-pointer"
      >
        <BorderGlow
          backgroundColor="transparent"
          borderColor="rgba(0, 194, 255, 0.08)"
          borderRadius={28}
          glowColor="196 100 45"
          colors={['#00C2FF', '#0A66C2', '#00C2FF']}
          glowRadius={45}
          glowIntensity={1.4}
          edgeSensitivity={30}
        >
          <div 
            style={{ 
              height: "360px", 
              display: "flex", 
              flexDirection: "column",
              background: "linear-gradient(135deg, rgba(8, 14, 30, 0.8) 0%, rgba(3, 5, 11, 0.95) 100%)",
              backdropFilter: "blur(12px)",
              border: "1px border-white/5"
            }} 
            className="w-full relative overflow-hidden rounded-[28px]"
          >
            {/* Top brand gradient bar */}
            <div className="h-[4px] w-full bg-gradient-to-r from-[#00C2FF] to-[#0A66C2] relative z-10" />

            {/* Interactive mouse-tracking radial glow - always mounted, toggled via JS */}
            <div
              className="pioneer-glow absolute inset-0 pointer-events-none z-0"
              style={{ opacity: 0, transition: 'opacity 0.3s' }}
            />

            {/* Faint technical circuit / grid watermark background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id={`card-grid-${pioneer.initials}`} width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="0.8" fill="rgba(0, 194, 255, 0.06)" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#card-grid-${pioneer.initials})`} />
                {/* Tech circles */}
                <circle cx="30" cy="90" r="30" fill="none" stroke="rgba(0, 194, 255, 0.03)" strokeWidth="0.8" />
                <circle cx="30" cy="90" r="45" fill="none" stroke="rgba(0, 194, 255, 0.02)" strokeWidth="0.8" strokeDasharray="3 3" />
                {/* Tech line */}
                <path d="M 140 330 L 175 295 L 210 295" fill="none" stroke="rgba(0, 194, 255, 0.04)" strokeWidth="1" />
                <circle cx="210" cy="295" r="2" fill="rgba(0, 194, 255, 0.06)" />
              </svg>
            </div>

            <div className="px-5 pt-5 pb-4 flex flex-col flex-1 relative z-10">
              {/* Era pill */}
              <div className="flex justify-end mb-4">
                <span
                  className="text-[10px] font-sans font-medium px-2.5 py-0.5 rounded-full bg-[#00C2FF]/10 text-[#00C2FF] border border-[#00C2FF]/20"
                >
                  {pioneer.era}
                </span>
              </div>

              {/* Monogram badge */}
              <div className="flex items-center justify-center mb-5 relative">
                <div
                  className="pioneer-badge relative w-[64px] h-[64px] rounded-full flex items-center justify-center z-10 bg-gradient-to-tr from-[#00C2FF] to-[#0A66C2]"
                  style={{ transition: 'transform 0.4s ease', willChange: 'transform' }}
                >
                  <span className="font-display text-white text-lg font-bold">
                    {pioneer.initials}
                  </span>
                </div>
              </div>

              {/* Name */}
              <h3 className="font-display text-lg text-white leading-tight mb-1">
                {pioneer.name}
              </h3>

              {/* Field */}
              <p className="text-[11px] font-sans font-semibold tracking-wider uppercase text-[#00C2FF] mb-3">
                {pioneer.field}
              </p>

              {/* Accent line */}
              <div
                className="pioneer-line h-[1px] bg-gradient-to-r from-[#00C2FF] to-transparent mb-4"
                style={{ width: '25%', transition: 'width 0.3s ease' }}
              />

              {/* Contribution */}
              <p className="text-xs font-sans text-stone-300 leading-relaxed mt-auto line-clamp-4">
                {pioneer.contribution}
              </p>
            </div>

            {/* Bottom bar */}
            <div
              className="px-5 py-3 flex items-center justify-between border-t border-white/5 bg-white/5 relative z-10"
            >
              <span className="text-[10px] font-sans font-medium text-stone-400 uppercase tracking-wider">
                IEEE Pioneer
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#00C2FF] shadow-[0_0_6px_#00C2FF]" />
            </div>
          </div>
        </BorderGlow>
      </div>
    </div>
  );
}

export default function IeeeLegacy() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [isPaused, setIsPaused] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const animFrameRef = useRef(null);
  const posRef = useRef(0);
  const CARD_WIDTH = 246;
  const SPEED = 0.4;

  const animate = useCallback(() => {
    if (!isPaused && trackRef.current) {
      posRef.current += SPEED;
      const loop = CARD_WIDTH * pioneers.length;
      if (posRef.current >= loop) posRef.current -= loop;
      trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
      setCurrentPage(Math.floor((posRef.current / CARD_WIDTH) % pioneers.length));
    }
    animFrameRef.current = requestAnimationFrame(animate);
  }, [isPaused]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [animate]);

  const nudge = (dir) => { posRef.current = Math.max(0, posRef.current + dir * CARD_WIDTH); };

  return (
    <section
      ref={sectionRef}
      id="legacy"
      className="relative overflow-hidden py-24 bg-[#050811]"
      style={{
        background: "radial-gradient(circle at 50% 30%, #0c1c36 0%, #060b14 60%, #030509 100%)"
      }}
    >
      {/* Dynamic blurred mesh gradient glow bubbles in the background */}
      <div className="absolute w-[700px] h-[700px] rounded-full bg-[#0A66C2]/18 blur-[130px] pointer-events-none top-[5%] left-[-15%] z-0 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute w-[800px] h-[800px] rounded-full bg-[#00C2FF]/14 blur-[150px] pointer-events-none bottom-[5%] right-[-15%] z-0 animate-pulse" style={{ animationDuration: '12s' }} />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#60496e]/12 blur-[120px] pointer-events-none top-[20%] left-[25%] z-0" />

      {/* Interactive DotField grid background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <DotField
          dotRadius={1.5}
          dotSpacing={16}
          bulgeStrength={60}
          glowRadius={180}
          sparkle={true}
          waveAmplitude={4}
          gradientFrom="rgba(0, 194, 255, 0.45)"
          gradientTo="rgba(10, 102, 194, 0.35)"
          glowColor="rgba(0, 194, 255, 0.25)"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: -10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
            className="text-xs font-sans font-semibold uppercase tracking-widest mb-4 text-[#00C2FF]"
          >
            IEEE Legacy &mdash; Since 1884
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 1 }}
            className="text-4xl md:text-8xl font-display tracking-tight text-white leading-[0.92] mb-5"
          >
            The Minds That <span className="italic bg-gradient-to-r from-[#0A66C2] to-[#00C2FF] bg-clip-text text-transparent">Changed the World.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.35 }}
            className="text-lg font-sans max-w-2xl mx-auto leading-relaxed text-stone-400"
          >
            For more than a century, IEEE has honoured the pioneers whose breakthroughs
            transformed science, engineering, and humanity itself.
          </motion.p>
        </div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.45 }}
          className="relative"
        >
          <button onClick={() => nudge(-1)}
            className="absolute left-0 -translate-x-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full items-center justify-center hidden md:flex transition-all hover:scale-110 bg-white/10 border border-white/10 hover:bg-white/20"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button onClick={() => nudge(1)}
            className="absolute right-0 translate-x-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full items-center justify-center hidden md:flex transition-all hover:scale-110 bg-white/10 border border-white/10 hover:bg-white/20"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-r from-[#060b14]/90 to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-l from-[#060b14]/90 to-transparent" />

          <div className="overflow-hidden py-6"
            onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)} onTouchEnd={() => setIsPaused(false)}
          >
            <div ref={trackRef} className="flex gap-4 will-change-transform"
              style={{ width: `${infinitePioneers.length * CARD_WIDTH}px` }}>
              {infinitePioneers.map((p, i) => <PioneerCard key={`${p.name}-${i}`} pioneer={p} />)}
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {pioneers.map((_, i) => (
              <button key={i} onClick={() => { posRef.current = i * CARD_WIDTH; }}
                className="rounded-full transition-all duration-300"
                style={{ width: currentPage === i ? "20px" : "6px", height: "6px", background: currentPage === i ? "#fff" : "rgba(255,255,255,0.15)" }} />
            ))}
          </div>
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6 }}
          className="mt-24 text-center max-w-3xl mx-auto"
        >
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#00C2FF] to-transparent mx-auto mb-10" />
          <blockquote className="text-xl md:text-2xl font-display font-light text-stone-400 leading-relaxed italic">
            "Advancing Technology for Humanity is not just a motto - it is a legacy built by the greatest innovators."
          </blockquote>
          <p className="mt-4 text-xs font-sans text-stone-500 uppercase tracking-widest">IEEE &mdash; Est. 1884</p>
        </motion.div>
      </div>
    </section>
  );
}
