import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';
import GradientBlinds from '../components/ui/GradientBlinds';
import { IeeeLogo } from '../components/ui/hero-odyssey';

export default function Home() {
  const container = useRef(null);

  // Scroll hooks for liquid morph and layout parallax
  const { scrollY } = useScroll();
  
  // Custom SVG liquid displacement intensity based on scroll position
  const liquidDistortionScale = useTransform(scrollY, [0, 180, 500], [0, 48, 4]);
  
  // Parallax translation for the logo and layout elements
  const logoY = useTransform(scrollY, [0, 600], [0, -80]);
  const logoScale = useTransform(scrollY, [0, 600], [1, 0.75]);
  const textY = useTransform(scrollY, [0, 600], [0, 50]);

  return (
    <motion.div 
      ref={container}
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen relative bg-[#030914] text-white overflow-x-hidden"
    >
      {/* SVG Liquid Distortion Filter Definition */}
      <svg className="hidden">
        <defs>
          <filter id="liquid-filter-home">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale="0" 
              xChannelSelector="R" 
              yChannelSelector="G" 
              id="displacement-map-home"
            />
          </filter>
        </defs>
      </svg>

      {/* Script to map framer-motion transform values onto standard SVG filter attributes */}
      <LiquidFilterUpdater scale={liquidDistortionScale} />

      {/* 1. Immersive Circuit Board Background */}
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

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-between px-6 md:px-16 pt-24 pb-12 overflow-hidden z-20">
        
        {/* Left Side: Original Heading and Text */}
        <motion.div 
          style={{ y: textY }}
          className="relative z-10 max-w-2xl flex flex-col justify-center flex-1"
        >
          <div className="overflow-hidden mb-2">
             <motion.h1 
               initial={{ y: '100%' }}
               animate={{ y: 0 }}
               transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
               className="text-5xl md:text-[6.5rem] leading-[0.95] font-display font-medium tracking-tighter"
             >
               Engineering <br/> the <span className="text-ieee-cyan italic">Future.</span>
             </motion.h1>
          </div>
          
          <div className="overflow-hidden max-w-xl mt-6">
            <motion.p
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.76, 0, 0.24, 1] }}
              className="text-base md:text-lg text-gray-300 font-sans leading-relaxed"
            >
              The IEEE Student Branch empowers ambitious engineers to innovate, collaborate, and build technologies that shape the future of humanity.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap gap-4 mt-8"
          >
            <button 
              onClick={() => {
                window.scrollTo({
                  top: window.innerHeight - 80,
                  behavior: 'smooth'
                });
              }}
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

        {/* Right Side: Giant Liquified IEEE Logo */}
        <motion.div
          style={{ 
            y: logoY, 
            scale: logoScale,
            filter: 'url(#liquid-filter-home)',
            willChange: 'transform'
          }}
          whileHover={{ scale: 1.03 }}
          className="hidden md:flex flex-1 justify-center items-center select-none drop-shadow-[0_0_35px_rgba(0,194,255,0.25)] relative -translate-y-12 z-30"
        >
          {/* Subtle slow floating background glow */}
          <div className="absolute w-[350px] h-[350px] bg-gradient-to-r from-ieee-cyan/20 to-ieee-bright/10 rounded-full blur-[100px] animate-pulse"></div>
          
          <IeeeLogo className="w-[320px] h-[320px] md:w-[380px] md:h-[380px] relative z-10" />
        </motion.div>

      </section>

      {/* Mobile-only logo display between text and next section */}
      <div className="md:hidden flex justify-center py-8 w-full z-20 relative">
        <motion.div
          style={{ filter: 'url(#liquid-filter-home)' }}
          className="w-48 h-48 drop-shadow-[0_0_20px_rgba(0,194,255,0.2)]"
        >
          <IeeeLogo className="w-full h-full" />
        </motion.div>
      </div>

      {/* Next Section (Original Spacer section with immersive cards) */}
      <section className="min-h-screen flex flex-col items-center justify-center relative z-20 bg-ieee-light text-ieee-deep rounded-t-[3rem] px-6 md:px-16 py-20 mt-[-4rem] border-t border-white/5 shadow-[0_-20px_40px_rgba(0,194,255,0.12)]">
        <div className="max-w-4xl text-center flex flex-col items-center">
          <div className="w-16 h-1.5 bg-gradient-to-r from-ieee-bright to-ieee-cyan rounded-full mb-8"></div>
          
          <h2 className="text-3xl md:text-5xl font-display font-bold max-w-4xl leading-tight mb-8">
            Pushing the boundaries of what's possible, one breakthrough at a time.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mt-6">
            <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-left">
              <span className="text-2xl mb-3 block">⚡</span>
              <h3 className="font-display font-bold text-lg text-ieee-deep mb-2">Power Electronics</h3>
              <p className="text-xs text-gray-500 font-sans leading-relaxed">Designing converter topologies, smart grids, and clean energy storage solutions.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-left">
              <span className="text-2xl mb-3 block">📡</span>
              <h3 className="font-display font-bold text-lg text-ieee-deep mb-2">Wireless Systems</h3>
              <p className="text-xs text-gray-500 font-sans leading-relaxed">Developing RF transceivers, antenna arrays, and high-frequency communication protocols.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-left">
              <span className="text-2xl mb-3 block">💾</span>
              <h3 className="font-display font-bold text-lg text-ieee-deep mb-2">Silicon Design</h3>
              <p className="text-xs text-gray-500 font-sans leading-relaxed">Engineering VLSI micro-architectures, FPGA systems, and embedded firmware.</p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

// Side-effect component to write transforms to displacement scale
function LiquidFilterUpdater({ scale }) {
  useEffect(() => {
    const unsubscribe = scale.on('change', (value) => {
      const map = document.getElementById('displacement-map-home');
      if (map) {
        map.setAttribute('scale', value.toString());
      }
    });
    return () => unsubscribe();
  }, [scale]);

  return null;
}
