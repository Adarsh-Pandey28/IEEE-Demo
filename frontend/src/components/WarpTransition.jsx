import { useEffect, useRef } from "react";
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
        ctx.strokeStyle = `rgba(${Math.floor(10+t*0)},${Math.floor(31+t*163)},${Math.floor(68+t*187)},${0.25+t*0.75})`;
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
