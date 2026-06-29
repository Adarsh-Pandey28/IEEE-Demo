const fs = require('fs');

/* ============================================================
   WarpTransition.jsx — matching site typography
   ============================================================ */
const warp = `import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function WarpTransition() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { amount: 0.3 });
  const isInViewRef = useRef(false);

  useEffect(() => { isInViewRef.current = isInView; }, [isInView]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 260 }, () => ({
      x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2,
      z: Math.random(), pz: 0,
    }));
    let speed = 0;

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      const cx = W / 2, cy = H / 2;
      const target = isInViewRef.current ? 1 : 0;
      speed += (target - speed) * 0.055;
      ctx.fillStyle = "rgba(2,8,20,0.22)";
      ctx.fillRect(0, 0, W, H);
      stars.forEach((s) => {
        s.pz = s.z;
        s.z -= speed * 0.013;
        if (s.z <= 0) { s.x = (Math.random() - 0.5) * 2; s.y = (Math.random() - 0.5) * 2; s.z = 1; s.pz = 1; }
        const sx = (s.x / s.z) * W * 0.5 + cx;
        const sy = (s.y / s.z) * H * 0.5 + cy;
        const px = (s.x / s.pz) * W * 0.5 + cx;
        const py = (s.y / s.pz) * H * 0.5 + cy;
        const size = Math.max(0, (1 - s.z) * 2.8);
        const t = 1 - s.z;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = \`rgba(\${Math.floor(10+t*0)},\${Math.floor(31+t*163)},\${Math.floor(68+t*187)},\${0.25+t*0.75})\`;
        ctx.lineWidth = size * 0.55;
        ctx.stroke();
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: "320px", background: "linear-gradient(180deg,#020814 0%,#030C1C 50%,#020814 100%)" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1.3, ease: [0.23, 1, 0.32, 1] }}
          className="w-52 h-px mb-5"
          style={{ background: "linear-gradient(90deg,transparent,#0A66C2,#00C2FF,#0A66C2,transparent)" }}
        />
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-sm font-sans font-medium uppercase tracking-widest mb-3"
          style={{ color: "#00C2FF", opacity: 0.8 }}
        >
          1884 &mdash; Present
        </motion.p>
        <motion.h3
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.45 }}
          className="text-4xl md:text-5xl font-display font-medium tracking-tighter text-white text-center leading-tight"
        >
          A Century of{" "}
          <span style={{ background: "linear-gradient(135deg,#0A66C2,#00C2FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Breakthroughs
          </span>
        </motion.h3>
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1.3, delay: 0.6 }}
          className="w-52 h-px mt-5"
          style={{ background: "linear-gradient(90deg,transparent,#00C2FF,#0A66C2,transparent)" }}
        />
      </div>

      {isInView && [0, 0.5, 1].map((delay, i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{ left: "50%", top: "50%", border: "1px solid rgba(10,102,194,0.18)", transform: "translate(-50%,-50%)" }}
          initial={{ width: 0, height: 0, opacity: 0.6 }}
          animate={{ width: 700, height: 700, opacity: 0 }}
          transition={{ duration: 3, delay, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
`;

/* ============================================================
   IeeeLegacy.jsx — matching site typography (font-display / font-sans, no font-mono)
   ============================================================ */
const legacy = `import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const BRIGHT = "#0A66C2";
const CYAN   = "#00C2FF";
const ACCENTS = [BRIGHT, CYAN, "#1756A8", "#1E7FD8", "#0D52A0", "#2B8FE0"];

const pioneers = [
  { name: "Lord Kelvin",    initials: "LK", era: "1892", field: "Thermodynamics",      contribution: "Laid the absolute mathematical foundations of thermodynamics.",               ai: 0 },
  { name: "Nikola Tesla",   initials: "NT", era: "1917", field: "Electrical Power",    contribution: "Pioneered AC power systems that electrified the modern world.",               ai: 1 },
  { name: "Thomas Edison",  initials: "TE", era: "1928", field: "Electric Light",      contribution: "Invented practical electric lighting and power distribution.",                ai: 2 },
  { name: "G. Marconi",     initials: "GM", era: "1918", field: "Wireless Comms",      contribution: "Invented long-distance wireless communication and modern radio.",             ai: 3 },
  { name: "Vannevar Bush",  initials: "VB", era: "1949", field: "Computing & Defense", contribution: "Accelerated computing, defense research, and scientific innovation.",         ai: 4 },
  { name: "Claude Shannon", initials: "CS", era: "1966", field: "Information Theory",  contribution: "Father of Information Theory - the math behind all digital communications.", ai: 5 },
  { name: "Gordon Moore",   initials: "GM", era: "1998", field: "Semiconductor Law",   contribution: "Co-founded Intel. His law governed 50 years of chip evolution.",             ai: 0 },
  { name: "Robert Noyce",   initials: "RN", era: "1978", field: "Microchip Pioneer",   contribution: "Co-invented the integrated circuit. Co-founded Intel.",                      ai: 1 },
  { name: "Jack Kilby",     initials: "JK", era: "2000", field: "Nobel Laureate",      contribution: "Invented the monolithic integrated circuit. Nobel Prize winner.",            ai: 2 },
  { name: "John Bardeen",   initials: "JB", era: "1952", field: "Transistor",          contribution: "Only physicist with two Nobel Prizes. Co-invented the transistor.",          ai: 3 },
  { name: "Andrew Grove",   initials: "AG", era: "1999", field: "Semiconductors",      contribution: "Made Intel the world leading semiconductor company.",                        ai: 4 },
  { name: "M. Dresselhaus", initials: "MD", era: "2012", field: "Nanotechnology",      contribution: "Queen of Carbon Science - revolutionized nanotechnology.",                   ai: 5 },
];

const infinitePioneers = [...pioneers, ...pioneers, ...pioneers];

function Particle({ p }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: p.size, height: p.size, background: "radial-gradient(circle,rgba(10,102,194,0.1) 0%,transparent 70%)", left: p.left, top: p.top }}
      animate={{ y: [0, -50, 0], opacity: [0.1, 0.4, 0.1] }}
      transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
    />
  );
}

function PioneerCard({ pioneer }) {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  const ac = ACCENTS[pioneer.ai];

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    setTilt({ x: -dy * 9, y: dx * 9 });
  };
  const handleMouseLeave = () => { setHovered(false); setTilt({ x: 0, y: 0 }); };

  return (
    <div style={{ perspective: "900px" }} className="flex-shrink-0 w-[230px]">
      <motion.div
        ref={cardRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        animate={{
          rotateX: tilt.x, rotateY: tilt.y,
          y: hovered ? -14 : 0,
          boxShadow: hovered
            ? "0 32px 80px rgba(10,102,194,0.4), 0 0 0 1.5px rgba(0,194,255,0.65)"
            : "0 8px 36px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)",
        }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="relative rounded-[22px] overflow-hidden cursor-pointer select-none"
        style={{
          background: "linear-gradient(155deg,#071428 0%,#050E1C 100%)",
          border: hovered ? "1.5px solid rgba(0,194,255,0.5)" : "1px solid rgba(255,255,255,0.07)",
          transformStyle: "preserve-3d",
          height: "360px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top shimmer stripe */}
        <div className="h-[3px] w-full relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg,transparent,#0A66C2,#00C2FF,transparent)" }} />
          <motion.div
            animate={{ x: hovered ? ["160%", "-160%"] : "160%" }}
            transition={{ duration: 1.1, repeat: hovered ? Infinity : 0, ease: "linear" }}
            className="absolute inset-y-0 w-12"
            style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)" }}
          />
        </div>

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(10,102,194,0.2) 0%,transparent 68%)" }}
            />
          )}
        </AnimatePresence>

        <div className="px-5 pt-5 pb-4 flex flex-col flex-1">
          {/* Era pill */}
          <div className="flex justify-end mb-4">
            <span
              className="text-xs font-sans font-medium px-3 py-0.5 rounded-full"
              style={{ background: "rgba(10,102,194,0.18)", color: "#00C2FF", border: "1px solid rgba(0,194,255,0.25)" }}
            >
              {pioneer.era}
            </span>
          </div>

          {/* Monogram badge */}
          <div className="flex items-center justify-center mb-5 relative">
            <motion.div
              animate={{ opacity: hovered ? 1 : 0.18, scale: hovered ? 1.4 : 1 }}
              transition={{ duration: 0.5 }}
              className="absolute w-20 h-20 rounded-full blur-[44px]"
              style={{ background: "radial-gradient(circle,rgba(10,102,194,0.9) 0%,transparent 70%)" }}
            />
            <motion.div
              animate={{
                scale: hovered ? 1.08 : 1,
                boxShadow: hovered
                  ? "0 0 36px rgba(0,194,255,0.3), 0 16px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)"
                  : "0 4px 14px rgba(0,0,0,0.4)",
              }}
              transition={{ duration: 0.4 }}
              className="relative w-[70px] h-[70px] rounded-2xl flex items-center justify-center z-10"
              style={{
                background: hovered
                  ? "linear-gradient(145deg,rgba(10,102,194,0.45) 0%,rgba(0,194,255,0.15) 100%)"
                  : "linear-gradient(145deg,rgba(10,102,194,0.15) 0%,rgba(10,102,194,0.05) 100%)",
                border: hovered ? "1.5px solid rgba(0,194,255,0.55)" : "1.5px solid rgba(10,102,194,0.22)",
              }}
            >
              <motion.span
                animate={{ color: hovered ? "#00C2FF" : "rgba(0,194,255,0.45)" }}
                className="font-display font-bold text-xl tracking-tight"
              >
                {pioneer.initials}
              </motion.span>
            </motion.div>
          </div>

          {/* Name — font-display font-bold, matching chapters */}
          <h3 className="font-display font-bold text-base text-white leading-tight tracking-tight mb-1">
            {pioneer.name}
          </h3>

          {/* Field — font-sans, small, muted */}
          <p className="text-xs font-sans font-medium mb-3 uppercase tracking-wide" style={{ color: "rgba(0,194,255,0.6)" }}>
            {pioneer.field}
          </p>

          {/* Accent line */}
          <motion.div
            animate={{ width: hovered ? "80%" : "32%", opacity: hovered ? 1 : 0.25 }}
            transition={{ duration: 0.4 }}
            className="h-[2px] rounded-full mb-4"
            style={{ background: "linear-gradient(90deg,#0A66C2,#00C2FF,transparent)" }}
          />

          {/* Contribution */}
          <motion.p
            animate={{ opacity: hovered ? 0.9 : 0.42 }}
            className="text-sm font-sans text-gray-400 leading-relaxed mt-auto line-clamp-3"
          >
            {pioneer.contribution}
          </motion.p>
        </div>

        {/* Bottom bar */}
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(10,102,194,0.18)", background: "rgba(10,102,194,0.06)" }}
        >
          <span className="text-xs font-sans font-medium" style={{ color: "rgba(0,194,255,0.5)" }}>
            IEEE Pioneer
          </span>
          <motion.div
            animate={{ scale: hovered ? [1, 1.6, 1] : 1, opacity: hovered ? 1 : 0.28 }}
            transition={{ duration: 0.9, repeat: hovered ? Infinity : 0 }}
            className="w-2 h-2 rounded-full"
            style={{ background: "#00C2FF", boxShadow: hovered ? "0 0 8px rgba(0,194,255,0.9)" : "none" }}
          />
        </div>
      </motion.div>
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
  const SPEED = 0.5;

  const particles = useRef(
    Array.from({ length: 20 }, (_, i) => ({
      size: \`\${Math.random() * 160 + 60}px\`,
      left: \`\${(i / 20) * 110 - 5}%\`,
      top: \`\${Math.random() * 100}%\`,
      dur: Math.random() * 12 + 7,
      delay: Math.random() * 6,
    }))
  ).current;

  const animate = useCallback(() => {
    if (!isPaused && trackRef.current) {
      posRef.current += SPEED;
      const loop = CARD_WIDTH * pioneers.length;
      if (posRef.current >= loop) posRef.current -= loop;
      trackRef.current.style.transform = \`translateX(-\${posRef.current}px)\`;
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
      className="relative overflow-hidden py-24"
      style={{ background: "linear-gradient(180deg,#020814 0%,#030C18 60%,#020814 100%)" }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => <Particle key={i} p={p} />)}
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: "linear-gradient(rgba(10,102,194,1) 1px,transparent 1px),linear-gradient(90deg,rgba(10,102,194,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 1.4 }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-px"
        style={{ background: "linear-gradient(90deg,transparent,#0A66C2,#00C2FF,#0A66C2,transparent)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* ── Header — same font style as Chapters/Events ── */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: -10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
            className="text-sm font-sans font-semibold uppercase tracking-widest mb-4"
            style={{ color: "#00C2FF" }}
          >
            IEEE Legacy &mdash; Since 1884
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 1 }}
            className="text-6xl md:text-8xl font-display font-bold tracking-tighter text-white leading-[0.92] mb-5"
          >
            The Minds That{" "}
            <span style={{ background: "linear-gradient(135deg,#0A66C2 0%,#00C2FF 60%,#0A66C2 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Changed the World.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.35 }}
            className="text-xl font-sans max-w-2xl mx-auto leading-relaxed text-gray-300"
          >
            For more than a century, IEEE has honoured the pioneers whose breakthroughs
            transformed science, engineering, and humanity itself.
          </motion.p>
        </div>

        {/* ── Carousel ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.45 }}
          className="relative"
        >
          <button onClick={() => nudge(-1)}
            className="absolute left-0 -translate-x-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full items-center justify-center hidden md:flex transition-all hover:scale-110"
            style={{ background: "rgba(10,102,194,0.15)", border: "1px solid rgba(10,102,194,0.4)", backdropFilter: "blur(12px)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#00C2FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button onClick={() => nudge(1)}
            className="absolute right-0 translate-x-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full items-center justify-center hidden md:flex transition-all hover:scale-110"
            style={{ background: "rgba(10,102,194,0.15)", border: "1px solid rgba(10,102,194,0.4)", backdropFilter: "blur(12px)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#00C2FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(90deg,#020814 0%,transparent 100%)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(-90deg,#020814 0%,transparent 100%)" }} />

          <div className="overflow-hidden py-6"
            onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)} onTouchEnd={() => setIsPaused(false)}
          >
            <div ref={trackRef} className="flex gap-4 will-change-transform"
              style={{ width: \`\${infinitePioneers.length * CARD_WIDTH}px\` }}>
              {infinitePioneers.map((p, i) => <PioneerCard key={\`\${p.name}-\${i}\`} pioneer={p} />)}
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {pioneers.map((_, i) => (
              <button key={i} onClick={() => { posRef.current = i * CARD_WIDTH; }}
                className="rounded-full transition-all duration-300"
                style={{ width: currentPage === i ? "26px" : "6px", height: "6px", background: currentPage === i ? "linear-gradient(90deg,#0A66C2,#00C2FF)" : "rgba(255,255,255,0.14)" }} />
            ))}
          </div>
        </motion.div>

        {/* ── Quote ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6 }}
          className="mt-24 text-center max-w-3xl mx-auto"
        >
          <div className="w-32 h-px mx-auto mb-10" style={{ background: "linear-gradient(90deg,transparent,#0A66C2,#00C2FF,transparent)" }} />
          <blockquote className="text-xl md:text-2xl font-display font-light text-white/65 leading-relaxed italic">
            "Advancing Technology for Humanity is not just a motto - it is a legacy built by the greatest innovators."
          </blockquote>
          <p className="mt-4 text-sm font-sans opacity-40 text-white">IEEE &mdash; Est. 1884</p>
        </motion.div>
      </div>
    </section>
  );
}
`;

fs.writeFileSync('src/components/WarpTransition.jsx', warp, { encoding: 'utf8', flag: 'w' });
fs.writeFileSync('src/components/IeeeLegacy.jsx', legacy, { encoding: 'utf8', flag: 'w' });
console.log('Done. Warp: ' + warp.length + ' Legacy: ' + legacy.length);
