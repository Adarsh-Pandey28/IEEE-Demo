import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import CircuitBackground from './CircuitBackground';
import ieeeLogo from '../../assets/ieee_logo.jpeg';

// IEEE Logo — uses the actual logo image
export const IeeeLogo: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = '', style }) => {
  return (
    <img
      src={ieeeLogo}
      alt="IEEE SRM Logo"
      className={className}
      style={{ objectFit: 'contain', ...style }}
    />
  );
};

interface ElasticHueSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}

const ElasticHueSlider: React.FC<ElasticHueSliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 360,
  step = 1,
  label = 'Adjust Hue',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const progress = ((value - min) / (max - min));
  const thumbPosition = progress * 100; // Percentage

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="scale-75 relative w-full max-w-xs flex flex-col items-center mt-6" ref={sliderRef}>
      {label && <label htmlFor="hue-slider-native" className="text-gray-400 text-xs tracking-wider uppercase mb-2 font-display">{label}</label>}
      <div className="relative w-full h-5 flex items-center">
        <input
          id="hue-slider-native"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          className="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer z-20"
          style={{ WebkitAppearance: 'none' }}
        />
        
        {/* Custom Track */}
        <div className="absolute left-0 w-full h-1 bg-gray-800 rounded-full z-0 border border-white/5"></div>

        {/* Custom Fill */}
        <div
            className="absolute left-0 h-1 bg-gradient-to-r from-ieee-bright to-ieee-cyan rounded-full z-10"
            style={{ width: `${thumbPosition}%` }}
        ></div>

        {/* Custom Thumb */}
        <motion.div
          className="absolute w-3.5 h-3.5 bg-white rounded-full z-30 shadow-[0_0_10px_rgba(0,194,255,0.8)] border border-ieee-deep top-1/2 transform -translate-y-1/2"
          style={{ left: `calc(${thumbPosition}% - 7px)` }}
          animate={{ scale: isDragging ? 1.35 : 1 }}
          transition={{ type: "spring", stiffness: 500, damping: isDragging ? 18 : 28 }}
        />
      </div>

       <AnimatePresence mode="wait">
         <motion.div
           key={value}
           initial={{ opacity: 0, y: -5 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: 5 }}
           transition={{ duration: 0.2 }}
           className="text-xs font-mono text-ieee-cyan mt-1 font-semibold"
         >
           {value}°
         </motion.div>
       </AnimatePresence>
    </div>
  );
};

interface FeatureItemProps {
  name: string;
  value: string;
  position: string;
}

interface LightningProps {
  hue?: number;
  xOffset?: number;
  speed?: number;
  intensity?: number;
  size?: number;
}

const Lightning: React.FC<LightningProps> = ({
  hue = 230,
  xOffset = 0,
  speed = 1,
  intensity = 1,
  size = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    const vertexShaderSource = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform float uHue;
      uniform float uXOffset;
      uniform float uSpeed;
      uniform float uIntensity;
      uniform float uSize;
      
      #define OCTAVE_COUNT 10

      vec3 hsv2rgb(vec3 c) {
          vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
          return c.z * mix(vec3(1.0), rgb, c.y);
      }

      float hash11(float p) {
          p = fract(p * .1031);
          p *= p + 33.33;
          p *= p + p;
          return fract(p);
      }

      float hash12(vec2 p) {
          vec3 p3 = fract(vec3(p.xyx) * .1031);
          p3 += dot(p3, p3.yzx + 33.33);
          return fract((p3.x + p3.y) * p3.z);
      }

      mat2 rotate2d(float theta) {
          float c = cos(theta);
          float s = sin(theta);
          return mat2(c, -s, s, c);
      }

      float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 fp = fract(p);
          float a = hash12(ip);
          float b = hash12(ip + vec2(1.0, 0.0));
          float c = hash12(ip + vec2(0.0, 1.0));
          float d = hash12(ip + vec2(1.0, 1.0));
          
          vec2 t = smoothstep(0.0, 1.0, fp);
          return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
      }

      float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < OCTAVE_COUNT; ++i) {
              value += amplitude * noise(p);
              p *= rotate2d(0.45);
              p *= 2.0;
              amplitude *= 0.5;
          }
          return value;
      }

      void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
          vec2 uv = fragCoord / iResolution.xy;
          uv = 2.0 * uv - 1.0;
          uv.x *= iResolution.x / iResolution.y;
          uv.x += uXOffset;
          
          uv += 2.0 * fbm(uv * uSize + 0.8 * iTime * uSpeed) - 1.0;
          
          float dist = abs(uv.x);
          vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.75, 0.85));
          vec3 col = baseColor * pow(mix(0.0, 0.07, hash11(iTime * uSpeed)) / dist, 1.0) * uIntensity;
          col = pow(col, vec3(1.0));
          fragColor = vec4(col, 1.0);
      }

      void main() {
          mainImage(gl_FragColor, gl_FragCoord.xy);
      }
    `;

    const compileShader = (
      source: string,
      type: number
    ): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(
      fragmentShaderSource,
      gl.FRAGMENT_SHADER
    );
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const vertices = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const iResolutionLocation = gl.getUniformLocation(program, "iResolution");
    const iTimeLocation = gl.getUniformLocation(program, "iTime");
    const uHueLocation = gl.getUniformLocation(program, "uHue");
    const uXOffsetLocation = gl.getUniformLocation(program, "uXOffset");
    const uSpeedLocation = gl.getUniformLocation(program, "uSpeed");
    const uIntensityLocation = gl.getUniformLocation(program, "uIntensity");
    const uSizeLocation = gl.getUniformLocation(program, "uSize");

    const startTime = performance.now();
    const render = () => {
      resizeCanvas();
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(iResolutionLocation, canvas.width, canvas.height);
      const currentTime = performance.now();
      gl.uniform1f(iTimeLocation, (currentTime - startTime) / 1000.0);
      gl.uniform1f(uHueLocation, hue);
      gl.uniform1f(uXOffsetLocation, xOffset);
      gl.uniform1f(uSpeedLocation, speed);
      gl.uniform1f(uIntensityLocation, intensity);
      gl.uniform1f(uSizeLocation, size);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [hue, xOffset, speed, intensity, size]);

  return <canvas ref={canvasRef} className="w-full h-full relative" />;
};

const FeatureItem: React.FC<FeatureItemProps> = ({ name, value, position }) => {
  return (
    <div className={`absolute ${position} z-20 group transition-all duration-300 hover:scale-110`}>
      <div className="flex items-center gap-2 relative">
        <div className="relative">
          <div className="w-2.5 h-2.5 bg-white rounded-full group-hover:animate-pulse"></div>
          <div className="absolute -inset-1.5 bg-ieee-cyan/40 rounded-full blur-md opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="text-white relative">
          <div className="font-display font-semibold text-xs tracking-wider group-hover:text-ieee-cyan transition-colors duration-300">{name}</div>
          <div className="text-white/60 text-[10px] uppercase font-mono tracking-wider group-hover:text-white/80 transition-colors duration-300">{value}</div>
          <div className="absolute -inset-2 bg-ieee-deep/60 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 border border-white/5"></div>
        </div>
      </div>
    </div>
  );
};

export const HeroSection: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lightningHue, setLightningHue] = useState(205); // Elegant blue-cyan default hue

  // Framer-motion scroll hooks for parallax and liquify morphing
  const { scrollY } = useScroll();
  
  // Transform scale and y positions of elements based on scroll
  const logoScale = useTransform(scrollY, [0, 500], [1, 0.65]);
  const logoY = useTransform(scrollY, [0, 500], [0, -180]);
  const backgroundY = useTransform(scrollY, [0, 500], [0, 100]);
  const contentOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  // SVG Filter displacement map scale driven by scroll to make it look "liquified"
  const liquidDistortionScale = useTransform(scrollY, [0, 150, 400], [0, 45, 5]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.215, 0.61, 0.355, 1]
      }
    }
  };

  return (
    <div className="relative w-full bg-black text-white overflow-hidden min-h-screen">
      
      {/* 1. Immersive PCB Animated Background */}
      <CircuitBackground />

      {/* SVG Liquid Distortion Filter Definition */}
      <svg className="hidden">
        <defs>
          <filter id="liquid-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
            {/* The scale attribute is bound dynamically by animating the inline CSS variable */}
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale="20" 
              xChannelSelector="R" 
              yChannelSelector="G" 
              id="displacement-map"
            />
          </filter>
        </defs>
      </svg>

      {/* Custom Liquid Filter script to update displacements in real-time based on scroll */}
      <LiquidFilterUpdater scale={liquidDistortionScale} />

      {/* Main container with space for content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen flex flex-col justify-between">
        
        {/* Navigation - Matching User Screenshot */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-between items-center py-4 px-6 rounded-full border border-white/5 bg-black/40 backdrop-blur-2xl mt-2"
        >
          {/* Logo & IEEE SRM label */}
          <div className="flex items-center gap-3">
            <IeeeLogo className="w-8 h-8 drop-shadow-[0_0_8px_rgba(0,194,255,0.4)]" />
            <span className="font-display font-bold text-xl tracking-wider bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              IEEE <span className="text-ieee-cyan italic">SRM</span>
            </span>
          </div>

          {/* Nav Items (Pill shaped selection bar) */}
          <div className="hidden md:flex items-center bg-white/5 border border-white/5 rounded-full px-2 py-1 font-display text-xs font-semibold tracking-widest uppercase">
            <button className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white border border-white/10 shadow-[0_0_12px_rgba(255,255,255,0.05)]">
              EVENTS
            </button>
            <button className="px-5 py-2 rounded-full hover:text-ieee-cyan transition-colors text-white/80">
              SPONSORS
            </button>
            <button className="px-5 py-2 rounded-full hover:text-ieee-cyan transition-colors text-white/80">
              TEAM
            </button>
          </div>

          {/* Join Button */}
          <div className="flex items-center gap-4">
            <a 
              href="https://www.ieee.org" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-6 py-2.5 bg-white text-black font-display font-bold text-xs uppercase tracking-wider rounded-full hover:bg-ieee-cyan hover:text-black transition-all flex items-center gap-2 group shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              {/* Pulsing indicator dot */}
              <span className="w-2 h-2 bg-ieee-deep rounded-full group-hover:animate-ping"></span>
              JOIN IEEE
            </a>
            
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md focus:outline-none text-white hover:text-ieee-cyan transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </motion.div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-center items-center gap-6"
            >
              <button
                className="absolute top-6 right-6 p-2 text-white hover:text-ieee-cyan transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <IeeeLogo className="w-16 h-16 drop-shadow-[0_0_12px_rgba(0,194,255,0.4)] mb-4" />
              <button className="px-8 py-3 bg-white/10 rounded-full text-lg w-2/3 border border-white/5 font-display font-medium text-white hover:text-ieee-cyan">EVENTS</button>
              <button className="px-8 py-3 text-lg w-2/3 font-display font-medium text-white/80 hover:text-ieee-cyan">SPONSORS</button>
              <button className="px-8 py-3 text-lg w-2/3 font-display font-medium text-white/80 hover:text-ieee-cyan">TEAM</button>
              <a href="https://www.ieee.org" target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-white text-black font-display font-bold text-center text-lg rounded-full w-2/3 shadow-lg">JOIN IEEE</a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Electronics Circuit Floating Features */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full relative h-[150px] hidden md:block"
        >
          <motion.div variants={itemVariants}>
            <FeatureItem name="Microcontrollers" value="Embedded Systems" position="left-4 top-16" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <FeatureItem name="Analog Circuits" value="Signal Processing" position="left-1/4 top-4" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <FeatureItem name="Digital VLSI" value="FPGA Designing" position="right-1/4 top-4" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <FeatureItem name="RF & Antennas" value="Electro-Magnetics" position="right-4 top-16" />
          </motion.div>
        </motion.div>

        {/* Main Content Area */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-30 flex flex-col items-center text-center max-w-4xl mx-auto py-12"
          style={{ opacity: contentOpacity }}
        >
          {/* Scroll-distortion interactive Logo */}
          <motion.div
            style={{ 
              scale: logoScale,
              y: logoY,
              filter: 'url(#liquid-filter)',
              willChange: 'transform'
            }}
            whileHover={{ scale: 1.05 }}
            className="cursor-grab active:cursor-grabbing select-none relative mb-6 drop-shadow-[0_0_25px_rgba(0,194,255,0.3)]"
          >
            <IeeeLogo className="w-40 h-40 md:w-48 md:h-48" />
          </motion.div>

          {/* Join tag */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 border border-white/5 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-full text-xs mb-4 transition-all duration-300 group"
          >
            <span className="text-gray-400">Discover IEEE Student Chapter</span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="transform group-hover:translate-x-1 transition-transform duration-300">
              <path d="M8 3L13 8L8 13M13 8H3" stroke="#00C2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-display font-light mb-1 leading-tight tracking-tight text-white"
          >
            Hero Odyssey
          </motion.h1>

          <motion.h2
            variants={itemVariants}
            className="text-2xl md:text-4xl pb-3 font-display font-light bg-gradient-to-r from-ieee-cyan via-white to-ieee-bright bg-clip-text text-transparent tracking-wide"
          >
            Lighting Up The Future
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-sm md:text-base text-gray-400 mb-6 max-w-2xl leading-relaxed"
          >
            Interact with real electronics components below. Use the spectrum tuner to calibrate the energy beams and watch physics morph in real time.
          </motion.p>

          <motion.div variants={itemVariants} className="w-full flex justify-center">
            <ElasticHueSlider
              value={lightningHue}
              onChange={setLightningHue}
              label="Spectrum Tuner (KHz)"
            />
          </motion.div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight - 80,
                behavior: 'smooth'
              });
            }}
            className="mt-8 px-8 py-3 bg-white text-black font-display font-bold text-xs uppercase tracking-wider rounded-full hover:bg-ieee-cyan hover:text-black transition-all shadow-[0_0_20px_rgba(0,194,255,0.2)]"
          >
            Discover Those Worlds
          </motion.button>
        </motion.div>

        {/* Footer padding spacer */}
        <div className="h-6"></div>
      </div>

      {/* Background Graphic elements & Shaders */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/90"></div>

        {/* Glowing circuit ring backdrop */}
        <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-b from-ieee-bright/15 to-purple-600/5 blur-3xl opacity-60"></div>

        {/* Main lightning shader */}
        <div className="absolute top-0 w-full left-1/2 transform -translate-x-1/2 h-full opacity-70">
          <Lightning
            hue={lightningHue}
            xOffset={0}
            speed={1.4}
            intensity={0.65}
            size={1.8}
          />
        </div>

        {/* Floating Planet-core sphere */}
        <div className="z-10 absolute top-[60%] left-1/2 transform -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_30%_30%,_#0A1F44_0%,_#030914_60%,_#000000_100%)] border border-white/5 shadow-[0_0_60px_rgba(10,102,194,0.15)] opacity-85"></div>
      </motion.div>
    </div>
  );
};

// Component to dynamically map motion transform values onto SVG filter attributes
const LiquidFilterUpdater: React.FC<{ scale: any }> = ({ scale }) => {
  useEffect(() => {
    const unsub = scale.on('change', (latestValue: number) => {
      const map = document.getElementById('displacement-map');
      if (map) {
        map.setAttribute('scale', latestValue.toString());
      }
    });
    return () => unsub();
  }, [scale]);

  return null;
};

const DemoOne: React.FC = () => {
  return (
    <div className="flex w-full min-h-screen justify-center items-center bg-black">
      <HeroSection />
    </div>
  );
};

export { DemoOne };
