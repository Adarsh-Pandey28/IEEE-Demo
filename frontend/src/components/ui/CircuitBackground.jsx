import React, { useRef, useEffect } from 'react';

export default function CircuitBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Create circuit lines and nodes
    const traces = [];
    const numTraces = 35;

    // Helper to generate a trace
    const createTrace = () => {
      const points = [];
      let x = Math.random() * width;
      let y = Math.random() * height;
      points.push({ x, y });

      const segments = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < segments; i++) {
        const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
        const length = (Math.random() * 120) + 50;
        
        if (direction === 'horizontal') {
          x += Math.random() > 0.5 ? length : -length;
        } else {
          y += Math.random() > 0.5 ? length : -length;
        }
        
        // Clamp to screen bounds
        x = Math.max(20, Math.min(width - 20, x));
        y = Math.max(20, Math.min(height - 20, y));
        
        points.push({ x, y });
      }

      return {
        points,
        progress: Math.random(),
        speed: (Math.random() * 0.003) + 0.0015,
        width: Math.random() * 1.5 + 0.5,
        pulseColor: Math.random() > 0.4 ? 'rgba(0, 194, 255, 0.85)' : 'rgba(10, 102, 194, 0.85)',
      };
    };

    for (let i = 0; i < numTraces; i++) {
      traces.push(createTrace());
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint PCB grid background lines
      ctx.strokeStyle = 'rgba(10, 102, 194, 0.04)';
      ctx.lineWidth = 0.5;
      const gridSize = 45;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw trace lines
      traces.forEach((trace) => {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(10, 31, 68, 0.12)';
        ctx.lineWidth = trace.width;
        ctx.moveTo(trace.points[0].x, trace.points[0].y);
        for (let i = 1; i < trace.points.length; i++) {
          ctx.lineTo(trace.points[i].x, trace.points[i].y);
        }
        ctx.stroke();

        // Draw electron pulse running along traces
        trace.progress += trace.speed;
        if (trace.progress > 1) {
          trace.progress = 0;
          // Re-generate trace on completion to make it dynamic
          const newTrace = createTrace();
          trace.points = newTrace.points;
          trace.speed = newTrace.speed;
          trace.pulseColor = newTrace.pulseColor;
        }

        // Find current position on trace path
        const numSegments = trace.points.length - 1;
        const targetSegment = Math.floor(trace.progress * numSegments);
        const segmentProgress = (trace.progress * numSegments) % 1;

        if (targetSegment < numSegments) {
          const p1 = trace.points[targetSegment];
          const p2 = trace.points[targetSegment + 1];
          const currentX = p1.x + (p2.x - p1.x) * segmentProgress;
          const currentY = p1.y + (p2.y - p1.y) * segmentProgress;

          // Glowing pulse circle
          ctx.beginPath();
          const gradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 8);
          gradient.addColorStop(0, trace.pulseColor);
          gradient.addColorStop(0.3, trace.pulseColor.replace('0.85', '0.4'));
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = gradient;
          ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
          ctx.fill();

          // Small electron core
          ctx.beginPath();
          ctx.fillStyle = '#ffffff';
          ctx.arc(currentX, currentY, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-10">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
