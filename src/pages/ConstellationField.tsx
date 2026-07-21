import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

// About-section ambient background: a slow-drifting field of dots with near-neighbour links (user chose
// this over an aurora on 2026-07-21, and over the earlier two literal side-graphics before that). It's
// atmosphere, not a diagram — the site's dot/line language spread thin behind the copy. Sits absolute
// behind the centered text; the parent clips it. Reduced-motion renders one static frame.
const ConstellationField = ({ className = "" }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1, raf = 0;
    let pts: { x: number; y: number; vx: number; vy: number; r: number }[] = [];

    const seed = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = Math.round(canvas.clientWidth * dpr);
      h = canvas.height = Math.round(canvas.clientHeight * dpr);
      // density scales with area so it stays even across widths, capped so it never gets busy
      const n = Math.min(150, Math.round((canvas.clientWidth * canvas.clientHeight) / 15000));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.12 * dpr,
        vy: (Math.random() - 0.5) * 0.12 * dpr,
        r: (Math.random() * 1.4 + 0.6) * dpr,
      }));
    };

    const link = () => 120 * dpr;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const L = link();
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < L) {
            ctx.strokeStyle = `rgba(79,210,255,${0.11 * (1 - d / L)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(120,220,255,0.5)";
        ctx.fill();
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    seed();
    draw();
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      seed();
      draw();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reduce]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};

export default ConstellationField;
