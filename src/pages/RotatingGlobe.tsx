import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

// Code-drawn dotted globe for the Vision row (replaces the static company_mv_globe.webp raster). A
// raster can't actually rotate — spinning a flat disc of a globe reads wrong — so the surface is drawn
// on a canvas and the sphere is rotated for real each frame. Continents are DELIBERATELY approximate
// (user, 2026-07-21: "대륙은 정확하지 않아도 돼"): a handful of lat/lng ellipses stand in for the land
// masses, dotted on a grid, enough to read as Earth without embedding map data. Palette matches the
// site's blues. Reduced-motion renders a single still frame.

// Rough continents as ellipses in degrees: [centreLat, centreLng, halfLat, halfLng].
const CONTINENTS: [number, number, number, number][] = [
  [54, 15, 17, 26], // Europe
  [50, 90, 28, 55], // N/Central Asia
  [22, 79, 15, 16], // India
  [4, 112, 12, 22], // SE Asia / Indonesia
  [2, 21, 34, 24], // Africa
  [48, -100, 24, 38], // North America
  [-16, -60, 24, 17], // South America
  [-25, 134, 12, 21], // Australia
  [72, -42, 9, 22], // Greenland
];

const wrapLng = (d: number) => ((d + 540) % 360) - 180;

const isLand = (lat: number, lng: number) => {
  for (const [cLat, cLng, hLat, hLng] of CONTINENTS) {
    const dLat = (lat - cLat) / hLat;
    const dLng = wrapLng(lng - cLng) / hLng;
    if (dLat * dLat + dLng * dLng < 1) return true;
  }
  return false;
};

const RotatingGlobe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Precompute land points once (radians), with a touch of deterministic jitter so the grid doesn't
    // read as rigid rows. index-based, not Math.random, so it's stable across frames.
    const RAD = Math.PI / 180;
    const pts: { la: number; lo: number }[] = [];
    let n = 0;
    for (let lat = -84; lat <= 84; lat += 3.2) {
      for (let lng = 0; lng < 360; lng += 3.2) {
        if (!isLand(lat, lng)) continue;
        const j = ((n++ * 9301 + 49297) % 233280) / 233280 - 0.5;
        pts.push({ la: (lat + j * 1.6) * RAD, lo: (lng + j * 1.6) * RAD });
      }
    }

    let w = 0, h = 0, R = 0, cx = 0, cy = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const size = canvas.clientWidth || 460;
      w = canvas.width = Math.round(size * dpr);
      h = canvas.height = Math.round(size * dpr);
      R = size * 0.4 * dpr;
      cx = w / 2;
      cy = h / 2;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let rot = -0.5; // start with Asia roughly toward the viewer
    let raf = 0;

    const drawRing = (rx: number, ry: number, tilt: number, phase: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(tilt);
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(90,175,255,0.18)";
      ctx.lineWidth = 1 * dpr;
      ctx.stroke();
      // travelling highlight
      const px = Math.cos(phase) * rx;
      const py = Math.sin(phase) * ry;
      ctx.beginPath();
      ctx.arc(px, py, 2.4 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(150,230,255,0.9)";
      ctx.shadowColor = "rgba(120,220,255,0.9)";
      ctx.shadowBlur = 10 * dpr;
      ctx.fill();
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // sphere body — a faint lit fill so dots sit on a globe, not on void
      const g = ctx.createRadialGradient(cx - R * 0.32, cy - R * 0.34, R * 0.15, cx, cy, R);
      g.addColorStop(0, "rgba(22,66,120,0.42)");
      g.addColorStop(1, "rgba(4,14,36,0.12)");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(95,185,255,0.22)";
      ctx.lineWidth = 1 * dpr;
      ctx.stroke();

      // back orbit ring (behind the globe)
      drawRing(R * 1.24, R * 0.4, -0.32, -rot * 1.6 + Math.PI);

      // land dots — front hemisphere only, depth drives size and alpha
      for (const p of pts) {
        const lambda = p.lo + rot;
        const cosLa = Math.cos(p.la);
        const z = cosLa * Math.cos(lambda);
        if (z < -0.05) continue;
        const x = cosLa * Math.sin(lambda);
        const y = Math.sin(p.la);
        const sx = cx + x * R;
        const sy = cy - y * R;
        const rad = (0.55 + 1.5 * Math.max(0, z)) * dpr;
        const a = 0.14 + 0.86 * Math.max(0, z);
        // brighter/cyan toward the front, deeper blue toward the limb
        const gg = 175 + Math.round(60 * z);
        ctx.beginPath();
        ctx.arc(sx, sy, rad, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(90,${gg},255,${a})`;
        ctx.fill();
      }

      // front orbit ring (over the globe)
      drawRing(R * 1.24, R * 0.4, -0.32, -rot * 1.6);

      if (!reduce) {
        rot += 0.0018;
        raf = requestAnimationFrame(draw);
      }
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reduce]);

  return <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />;
};

export default RotatingGlobe;
