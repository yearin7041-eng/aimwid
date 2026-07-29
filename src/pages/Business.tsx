import { motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import Breadcrumb from "../components/Breadcrumb";
import {
  Zap,
  Building2,
  Leaf,
  Boxes,
  ArrowRight,
} from "lucide-react";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

// Four-sided dissolve for card art that has no alpha of its own. Two gradients composited with
// `intersect` (webkit: `source-in`) — one fades left/right, the other top/bottom, and multiplying
// them gives soft corners too. A single radial would vignette the corners much harder and clip the
// isometric island's tips. Both the standard and -webkit- properties are set: Safari still needs
// the prefixed pair, and its composite keyword differs from the standard one.
//
// The LEFT ramp is long and starts flat, and the numbers are tied to the card's geometry — retune
// them together or not at all. Cards 01/02 and card 03 have different aspects, so one % ramp lands at
// two places; both are checked below (card ≈ 1160 wide, art is h-full w-auto pinned right):
//   01/02  1448×1086 ⇒ 600 × 1.333 ≈ 800 wide ⇒ occupies 360…1160
//   03     1402×1122 ⇒ 600 × 1.250 ≈ 750 wide ⇒ occupies 410…1160
// The column is lg:max-w-[52%] ≈ 603, but the TEXT inside it only reaches ≈ 315 (64px of padding plus
// the longest bullet). The ramp clears the TEXT, not the column — % below are of the art's own width:
// flat through 12% (screen 456 / 500, both clear of 315), 0.35 by 32% (616 / 650), solid by 60%
// (840 / 860). Card height drives the art width (h-full), so these move with min-h/lg:h — recomputed
// when the card went 660→600. Don't push the flat section below ~10%: that is where the art starts
// colliding with the bullets.
const EDGE_FADE = [
  "linear-gradient(to right, transparent 0%, transparent 12%, rgba(0,0,0,0.35) 32%, #000 60%, #000 94%, transparent 100%)",
  "linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)",
].join(", ");
const edgeFadeStyle = {
  WebkitMaskImage: EDGE_FADE,
  maskImage: EDGE_FADE,
  WebkitMaskComposite: "source-in",
  maskComposite: "intersect",
} as const;

// Heading system for this page: label 20px #0cc → 16px gap → title Bold 50px leading-1.5. All five
// sections use it; only Our Business is centred. The spec was Figma 410-96's (24px label, 48px title
// leading-1.6) until the user reset it site-wide on 2026-07-16 — every heading component now matches,
// including AimGuard's SectionHeading, which used to be the odd one out at leading-[1.3].
const BizHeading = ({ label, title, align = "left" }: { label: string; title: ReactNode; align?: "left" | "center" }) => (
  <div className={`flex flex-col gap-4 ${align === "center" ? "items-center text-center" : "items-start"}`}>
    <p className="text-[#2fd4c4] text-[17px] md:text-[20px] font-normal leading-[1.2]">{label}</p>
    <h2 className="text-[24px] md:text-[50px] font-bold text-white leading-[1.5] break-keep">{title}</h2>
  </div>
);

// --- 1. Hero ---
// Title and body are verbatim from Figma (410:109 / 410:151); the hero carries a gray eyebrow
// ("산업 AI 전환의 시작") in the #90a1b9/20px style every hero shares.
//
// The mockup's hero image layer (410:99 "sub_visual_product 1") is HIDDEN — it is an empty 1920×943
// placeholder rect, so the frame ships with no visual and this is drawn in code. To swap in a raster
// later, replace HeroVisual — nothing else depends on it.
//
// REBUILT 2026-07-16. The previous version drew a hex-tiled floor plus a floating node cloud: hexes
// standing in for 현장, a node graph standing in for AI. That is geometry-as-metaphor on an empty
// black frame — the exact pattern the client rejected six times on this page's Our Business graphic
// ("너무 추상적", "비어보여"). It also said nothing specific to this page: the same picture would fit
// any AI product anywhere.
//
// This one depicts the work the page actually describes ("고객의 데이터로, 현장에 맞는 AI를 만듭니다"):
// one customer site rendered as a dense isometric mass of real equipment, instrumented with sensors,
// feeding live panels above it. One site, deep — Solution's hero already does the three-scene lineup
// (도시·플랜트·안전), so repeating it here would collide. Every element is a thing, not a metaphor.

// --- Shared isometric kit ---
// True isometric projection (30° axes), z up, authored in world units so a structure moves by
// editing its x/y/z rather than by re-deriving polygon points. Used by BOTH the hero above and the
// How We Work scenes below — it lived down beside How We Work until the hero started drawing a site
// too. Stroke widths here are absolute, so a scene must be authored at roughly this unit scale
// (tens-to-hundreds) rather than shrunk with a group `scale()`, which would thicken every edge.
const ISO_A = 0.866;
const ISO_B = 0.5;
const ip = (x: number, y: number, z: number): [number, number] => [(x - y) * ISO_A, (x + y) * ISO_B - z];
const poly = (pts: [number, number][]) => pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
// draw normal 2D content in this transform and it lands on a top face at height z
const onTop = (z: number) => `matrix(${ISO_A},${ISO_B},${-ISO_A},${ISO_B},0,${-z})`;

// `ghost` draws the same volume as a dashed outline instead of a solid: "this belongs here but is not
// here yet". It must NOT be done with a low `o` on a solid box — a dim solid reads as a faded copy of
// its neighbour, not as an empty slot. That mistake is what made the first Our Business graphic read
// as one site drawn twice.
const Box = ({
  x = 0,
  y = 0,
  z = 0,
  a,
  b,
  h,
  hot = false,
  o = 1,
  ghost = false,
}: {
  x?: number;
  y?: number;
  z?: number;
  a: number;
  b: number;
  h: number;
  hot?: boolean;
  o?: number;
  ghost?: boolean;
}) => {
  const top: [number, number][] = [ip(x, y, z + h), ip(x + a, y, z + h), ip(x + a, y + b, z + h), ip(x, y + b, z + h)];
  const right: [number, number][] = [ip(x + a, y, z + h), ip(x + a, y + b, z + h), ip(x + a, y + b, z), ip(x + a, y, z)];
  const left: [number, number][] = [ip(x, y + b, z + h), ip(x + a, y + b, z + h), ip(x + a, y + b, z), ip(x, y + b, z)];
  if (ghost) {
    return (
      <g opacity={o} fill="none" stroke="#22e0e0" strokeDasharray="5 4" strokeLinejoin="round">
        <polygon points={poly(left)} strokeOpacity="0.3" strokeWidth="0.8" />
        <polygon points={poly(right)} strokeOpacity="0.38" strokeWidth="0.8" />
        <polygon points={poly(top)} fill="#22e0e0" fillOpacity="0.05" strokeOpacity="0.62" strokeWidth="1" />
      </g>
    );
  }
  return (
    <g opacity={o}>
      <polygon points={poly(left)} fill="#071a26" stroke="#12475a" strokeWidth="0.7" />
      <polygon points={poly(right)} fill="#0c2c3c" stroke="#175263" strokeWidth="0.7" />
      <polygon
        points={poly(top)}
        fill={hot ? "url(#hw-top-hot)" : "url(#hw-top)"}
        stroke={hot ? "#5ff5f5" : "#22e0e0"}
        strokeOpacity={hot ? 0.95 : 0.5}
        strokeWidth={hot ? 1.3 : 0.9}
      />
    </g>
  );
};

// A flat panel lying on a box's +x face (`axis="x"`, the face toward screen-right) or its +y face
// (toward screen-left). Four corners straight from ip() — less machinery than a face matrix, and it
// is what turns a block into a building: windows and shutters are the whole difference between "a
// site" and "a rectangle", and "너무 추상적" is this page's standing rejection.
const Face = ({ axis, at, u, v, du, dv, fill = "#7ff5ff", o = 0.5 }: { axis: "x" | "y"; at: number; u: number; v: number; du: number; dv: number; fill?: string; o?: number }) => {
  const c: [number, number][] =
    axis === "x"
      ? [ip(at, u, v), ip(at, u + du, v), ip(at, u + du, v + dv), ip(at, u, v + dv)]
      : [ip(u, at, v), ip(u + du, at, v), ip(u + du, at, v + dv), ip(u, at, v + dv)];
  return <polygon points={poly(c)} fill={fill} fillOpacity={o} />;
};

// Tanks. A world circle projects to an axis-aligned ellipse: sampling (r·cosθ, r·sinθ) through `ip`
// gives x-amplitude r·ISO_A·√2 and y-amplitude r·ISO_B·√2. The body is the skirt between the two
// rims. Faces match Box's exactly so the two mix in one scene. Kept because a site drawn only from
// Box reads as a pile of rectangles, and "박스 형태가 너무 많아" is standing client feedback.
const Cyl = ({ x, y, z = 0, r, h, hot = false, o = 1, ghost = false }: { x: number; y: number; z?: number; r: number; h: number; hot?: boolean; o?: number; ghost?: boolean }) => {
  const rx = r * ISO_A * Math.SQRT2;
  const ry = r * ISO_B * Math.SQRT2;
  const [cx, ct] = ip(x, y, z + h);
  const cb = ip(x, y, z)[1];
  const body = `M ${cx - rx} ${ct} L ${cx - rx} ${cb} A ${rx} ${ry} 0 0 0 ${cx + rx} ${cb} L ${cx + rx} ${ct} A ${rx} ${ry} 0 0 1 ${cx - rx} ${ct} Z`;
  // Matches Box's ghost exactly — a slot must look the same whatever shape goes in it, or the dim
  // ones read as a different idea from the dashed ones.
  if (ghost) {
    return (
      <g opacity={o} fill="none" stroke="#22e0e0" strokeDasharray="5 4">
        <path d={body} strokeOpacity="0.32" strokeWidth="0.8" />
        <ellipse cx={cx} cy={ct} rx={rx} ry={ry} fill="#22e0e0" fillOpacity="0.05" strokeOpacity="0.62" strokeWidth="1" />
      </g>
    );
  }
  return (
    <g opacity={o}>
      <path d={body} fill="#0c2c3c" stroke="#175263" strokeWidth="0.7" />
      <ellipse
        cx={cx}
        cy={ct}
        rx={rx}
        ry={ry}
        fill={hot ? "url(#hw-top-hot)" : "url(#hw-top)"}
        stroke={hot ? "#5ff5f5" : "#22e0e0"}
        strokeOpacity={hot ? 0.95 : 0.5}
        strokeWidth={hot ? 1.3 : 0.9}
      />
    </g>
  );
};

const Bars = ({ x, y, vals }: { x: number; y: number; vals: number[] }) => (
  <g>
    {vals.map((v, i) => (
      <rect key={i} x={x + i * 11} y={y - v} width="6" height={v} rx="1.5" fill="#7ff5ff" fillOpacity={0.5 + i * 0.1} />
    ))}
  </g>
);

const SvgDefs = () => (
  <defs>
    <linearGradient id="hw-top" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#153b52" />
      <stop offset="1" stopColor="#0c2434" />
    </linearGradient>
    <linearGradient id="hw-top-hot" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#1e7d94" />
      <stop offset="1" stopColor="#0d4356" />
    </linearGradient>
    <radialGradient id="hw-glow">
      <stop offset="0" stopColor="#2fd4c4" stopOpacity="0.3" />
      <stop offset="100%" stopColor="#2fd4c4" stopOpacity="0" />
    </radialGradient>
  </defs>
);

// Figma 441:125, a ChatGPT raster the client supplied — the same site-plus-floating-panels concept
// the code graphic drew, but photoreal, which is what settles it: every other visual on this page
// (business_app_*, Related Solutions) is a photoreal render, and hand-drawn vector read flat beside
// them. The code version it replaced is archived in memory (business-hero-code-graphic-archive) —
// Business.tsx is untracked, so that archive is its only copy.
//
// Downloaded from the node's RAW fill, not its export: the node is a rounded-rectangle, so exporting
// it bakes in rounded corners. The raw is the clean 1672×941 original. Re-encoded to webp with sharp
// (1471KB → 59KB); Figma cannot export webp itself.
//
// Sized by HEIGHT and pinned right, like Solution's hero visual — NOT object-cover. Cover scales by
// width on a fixed-height hero, so a wider viewport would crop the site's base off the bottom.
// Height-sizing keeps the whole composition (panels → site → base) identical at every width — 1720px
// wide at 1440/1600/1920 alike — and lets the surplus bleed off the right.
//
// h-[118%], not h-full: at h-full the site sat too far right, because the raster's own composition
// already places it right-of-centre. Growing the height widens the image proportionally while the
// right edge stays pinned, so the extra width — and the site with it — extends LEFT. Vertically
// centred so the 18% surplus splits top and bottom rather than dumping the site's base past the fold.
//
// Left edge IS masked (changed 2026-07-23 with the new raster). The previous 16:9 image was ~1720px wide
// here and its edges sat within a couple of points of the section's #040813, so it needed nothing. This
// raster is 4:3 — only ~1290px wide at the same height, so its left edge lands further into view — and its
// mid-left is #011c48, bright enough to read as a vertical seam. The fade dissolves that edge; top and
// bottom are still the image's own dark sky and the bottom fade below.
// On mobile the raster stacks as an in-flow block above the copy (matching the AIMNIS/AIM GUARD/Solution
// heroes); from lg it returns to the right-pinned background. Two <img> (same file → one download): the
// mobile one gets a simple radial edge-fade, the desktop one keeps the left+top+bottom intersect mask.
const HeroVisual = () => (
  <div className="relative pt-[104px] lg:pt-0 lg:absolute lg:inset-0 pointer-events-none">
    {/* mobile: contained block above the copy — uses a pre-baked "_m" version whose radial edge-fade is
        burned into the file's alpha so the blue scene dissolves into the dark section (CSS mask was flaky). */}
    <img
      src={asset("business_hero_m.webp")}
      alt=""
      aria-hidden
      className="lg:hidden mx-auto block w-[92%] max-w-[520px] h-auto select-none"
    />
    {/* desktop: right-pinned. Below 100% height the raster no longer covers the hero, so its top and bottom
        edges would cut against the section too — left + top + bottom fades are intersected to dissolve them. */}
    <img
      src={asset("business_hero.webp")}
      alt=""
      aria-hidden
      className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-[85%] w-auto max-w-none select-none"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, #000 22%), linear-gradient(to bottom, transparent 0%, #000 14%), linear-gradient(to bottom, #000 86%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, #000 22%), linear-gradient(to bottom, transparent 0%, #000 14%), linear-gradient(to bottom, #000 86%, transparent 100%)",
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    />

    {/* readability: left→right darkening, then a fade into Our Business below — desktop only (mobile stacks) */}
    <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#040813] from-6% via-[#040813]/55 via-[36%] to-transparent to-[62%]" />
    <div className="hidden lg:block absolute inset-x-0 bottom-0 h-[180px] bg-gradient-to-b from-transparent to-[#020617]" />
  </div>
);

const Hero = () => (
  <section className="relative overflow-hidden bg-[#040813] lg:min-h-[820px]">
    {/* Header → hero color bridge — darkens the navbar strip only */}
    <div className="absolute top-0 inset-x-0 h-[96px] bg-gradient-to-b from-[#020617] via-[#020617]/55 to-transparent pointer-events-none z-[1]" />

    <Breadcrumb />

    <HeroVisual />

    <div className="container-custom relative z-10 pt-8 lg:pt-[200px] pb-[70px] lg:pb-[120px]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-[760px] flex flex-col"
      >
        {/* same rhythm as the Solution-menu heroes: label 16px off the title, title 28px off the body */}
        <p className="text-[#90a1b9] text-[16px] md:text-[20px] font-bold leading-[1.4] mb-4">산업 AI 전환의 시작</p>
        <h1 className="text-[30px] sm:text-[40px] md:text-[64px] font-bold text-white leading-[1.2] mb-7 break-keep">
          고객의 데이터로,<br />
          현장에 맞는 AI를 만듭니다.
        </h1>
        <p className="text-white text-[16px] md:text-[18px] font-normal leading-[1.5]">
          복잡한 현장과 업무 환경을 이해하고,<br />
          운영 과제를 해결하는 맞춤형 AI 시스템을 구축합니다.
        </p>
      </motion.div>
    </div>
  </section>
);

// --- Our Business graphic ---
// Attempt #7. Six died before it — converge/AI-core/diverge, icon+text+box tiers, widgets-in-boxes,
// a strata cross-section, hex outlines, hex prisms — all rejected as "너무 추상적", "비어보여",
// "박스 형태가 너무 많아", "구조 자체를 다시 고민해". Every one drew geometry as a metaphor on a mostly
// empty black frame. This one draws the section's own title literally: the site on the left is built,
// and the parts it produced are what the site on the right is going up from.
//
// Two pads, side by side. That silhouette is the point — How We Work below already owns the other
// three (01 a single specimen, 02 a vertical stack, 03 a scattered field), and a graphic here must
// not read as a fourth card in that set.
//
// Deliberately small: six structures per site. "너무 복잡하지 않게" — and the hero above is now the
// page's dense visual, so this one should not compete with it.
const OB_PAD_A = 250;
const OB_PAD_B = 210;
const OB_PAD_Z = 10;

// Site B sits at world (+OB_SHIFT, −OB_SHIFT). Offsetting x and y by equal-and-opposite amounts moves
// a thing purely sideways on screen — (x−y) grows by 2·shift while (x+y) is unchanged — so both pads
// land at the same height, 2·310·ISO_A ≈ 537px apart, without hand-placing the second one. It also
// leaves the depth key (x+y) untouched, so ONE sort serves both sites.
const OB_SHIFT = 310;

type ObPart = { kind: "box"; x: number; y: number; a: number; b: number; h: number; hot?: boolean } | { kind: "cyl"; x: number; y: number; r: number; h: number; hot?: boolean };

// The same six parts stand on both pads — that repetition IS the message here (a part proven on one
// site is a product on the next), unlike How We Work, where a silhouette shared across its three
// scenes would have read as one object repeated by accident.
const obParts: ObPart[] = [
  { kind: "box", x: 22, y: 22, a: 84, b: 88, h: 60, hot: true }, // 0 main hall
  { kind: "box", x: 130, y: 28, a: 58, b: 52, h: 38 }, // 1 annex
  { kind: "cyl", x: 58, y: 150, r: 26, h: 48 }, // 2 tank
  { kind: "cyl", x: 144, y: 138, r: 17, h: 32, hot: true }, // 3 small tank
  { kind: "box", x: 178, y: 152, a: 40, b: 34, h: 18 }, // 4 skid
  { kind: "box", x: 22, y: 178, a: 30, b: 26, h: 14 }, // 5 gate house
];
const obSorted = [...obParts]
  .map((p, i) => ({ p, i }))
  .sort((u, v) => u.p.x + u.p.y - (v.p.x + v.p.y));

// Which parts are actually standing. Site A has all six; site B has only the two SMALLEST (skid,
// gate house) so the pads cannot read as the same picture twice — B is visibly early, and every big
// volume on it is still a dashed slot waiting for the part crossing the sky.
const OB_BUILT_A = new Set([0, 1, 2, 3, 4, 5]);
const OB_BUILT_B = new Set([4, 5]);

const ObSite = ({ dx = 0, built, live }: { dx?: number; built: Set<number>; live: boolean }) => (
  <g>
    <Box x={dx} y={-dx} a={OB_PAD_A} b={OB_PAD_B} h={OB_PAD_Z} o={live ? 0.55 : 0.4} />
    {obSorted.map(({ p, i }) => {
      const done = built.has(i);
      return (
        <g key={i}>
          {p.kind === "box" ? (
            <Box x={p.x + dx} y={p.y - dx} z={OB_PAD_Z} a={p.a} b={p.b} h={p.h} hot={done && p.hot} ghost={!done} />
          ) : (
            <Cyl x={p.x + dx} y={p.y - dx} z={OB_PAD_Z} r={p.r} h={p.h} hot={done && p.hot} ghost={!done} />
          )}
        </g>
      );
    })}

    {/* Only the running site gets windows, roof plant and sensors. That detail is what separates
        "a finished, operating place" from "a pad with parts on it" at a glance. */}
    {live && (
      <g>
        {[0, 1, 2].map((r) => (
          <g key={`w-${r}`}>
            <Face axis="x" at={106 + dx} u={32 - dx} v={OB_PAD_Z + 12 + r * 16} du={14} dv={9} o={0.5} />
            <Face axis="x" at={106 + dx} u={54 - dx} v={OB_PAD_Z + 12 + r * 16} du={14} dv={9} o={0.38} />
            <Face axis="x" at={106 + dx} u={76 - dx} v={OB_PAD_Z + 12 + r * 16} du={14} dv={9} o={0.5} />
          </g>
        ))}
        <Face axis="y" at={80 + dx} u={140 - dx} v={OB_PAD_Z + 10} du={38} dv={12} o={0.32} />
        <g transform={onTop(OB_PAD_Z + 60)}>
          <Bars x={38} y={92} vals={[8, 12, 9]} />
        </g>
        <g transform={onTop(OB_PAD_Z + 38)}>
          <Bars x={142} y={68} vals={[7, 10]} />
        </g>
        {([[64, 66, OB_PAD_Z + 60], [159, 54, OB_PAD_Z + 38], [58, 150, OB_PAD_Z + 48]] as [number, number, number][]).map(([sx, sy, sz], i) => {
          const [px, py] = ip(sx + dx, sy - dx, sz);
          return (
            <motion.circle
              key={`s-${i}`}
              cx={px}
              cy={py}
              r="3"
              fill="#5ff5f5"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
            />
          );
        })}
      </g>
    )}
  </g>
);

const OurBusinessGraphic = () => (
  <svg viewBox="0 0 1060 500" className="w-full h-auto max-w-[1180px] mx-auto" aria-hidden>
    <SvgDefs />
    {/* the running site is lit; the new pad is not yet */}
    <ellipse cx="255" cy="330" rx="250" ry="140" fill="url(#hw-glow)" />
    <ellipse cx="790" cy="330" rx="250" ry="140" fill="url(#hw-glow)" opacity="0.4" />

    <g transform="translate(255, 215)">
      <ObSite built={OB_BUILT_A} live />
      <ObSite dx={OB_SHIFT} built={OB_BUILT_B} live={false} />

      {/* The route the parts take. Without a drawn path the blocks just hover — the line is what makes
          them read as leaving one site FOR the other rather than as decoration. */}
      {/* dasharray period MUST divide flow-dash's 32px offset (8+8=16 → exactly two dashes per cycle),
          or the loop jumps at the seam. That constraint is why it is 8 8 and not something prettier. */}
      <path
        d="M 40 -46 Q 285 -150 500 -46"
        fill="none"
        stroke="#22e0e0"
        strokeOpacity="0.4"
        strokeWidth="1.2"
        strokeDasharray="8 8"
        className="animate-[flow-dash_1.6s_linear_infinite]"
      />

      {/* Parts in transit, offset in time so the traffic reads as continuous. Keyframes trace the
          path above — motion tweens straight between keys, so five points, not two, or the arc
          collapses into a V. */}
      {[0, 1, 2].map((i) => (
        <motion.g
          key={`m-${i}`}
          animate={{ x: [40, 155, 270, 385, 500], y: [-46, -108, -128, -108, -46], opacity: [0, 1, 1, 1, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, delay: i * 1.2, ease: "linear" }}
        >
          <Box a={26} b={26} h={16} hot />
        </motion.g>
      ))}
    </g>
  </svg>
);

// --- 2. Our Business ---
// Heading + intro only. The diagram that sat here was removed on 2026-07-15 after four passes
// failed: every version came back as tiers of rectangles joined by lines (icon+text+box, then
// widgets-inside-boxes, then a strata cross-section), which read as a consulting slide next to
// the digital-twin renders in Business Applications below. The section is deliberately empty
// below the intro until a graphic is agreed — an absent graphic beats a bad one.

const OurBusiness = () => (
  <section className="relative overflow-hidden py-[86px] lg:pt-[140px] lg:pb-28 bg-[#020617]">
    {/* glossy glows — same teal/blue alternation Solution runs down its sections */}
    <div
      className="pointer-events-none absolute -left-[520px] -top-[10%] h-[1000px] w-[1120px] rounded-[50%]"
      style={{ background: "radial-gradient(closest-side, rgba(47,212,196,0.30), rgba(47,212,196,0) 72%)" }}
    />
    {/* h trimmed 1100→900 so the 72% alpha-0 stop lands ~y1035, inside this ~1087px section —
        overflow-hidden was clipping the old glow ~120px early into a seam at the next section. */}
    <div
      className="pointer-events-none absolute -right-[440px] top-[24%] h-[900px] w-[940px] rounded-[50%]"
      style={{ background: "radial-gradient(closest-side, rgba(54,132,247,0.26), rgba(54,132,247,0) 72%)" }}
    />

    {/* Mobile seam bridge. The two glows above are sized for the tall desktop section (~1087px) and
        land inside it; on the much shorter mobile section they overflow the bottom and overflow-hidden
        cuts them into a hard bright line against BusinessApplications. Both sections are #020617, so
        fading the bottom to #020617 makes them read as one continuous background. Desktop is unaffected
        (lg:hidden). z-[2] sits above the glows; the content below is lifted to z-10 so it stays lit. */}
    <div className="lg:hidden pointer-events-none absolute inset-x-0 bottom-0 h-[140px] bg-gradient-to-b from-transparent to-[#020617] z-[2]" />

    <div className="container-custom relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Diverges from the mockup (Figma 410:103 read "현장의 데이터가 / 실제 운영의 변화로 이어지도록").
            That line had no subject — nobody did anything in it — and answered "무슨 사업을 하는가"
            with a slogan.
            REWRITTEN 2026-07-16. The approved replacement was "고객 현장의 시스템을 직접 구축하고, /
            검증된 기능을 제품으로 표준화합니다" — it collided with How We Work's "고객과 함께 문제를
            검증하고, 구축하고, 확산합니다": same two verbs, same 고객+동사나열+합니다 shape, so the two
            headings read as one sentence told twice. It was ALSO a lossy compression of its own
            subtitle below, which says the same thing while additionally naming the three areas and
            AIMNIS — the title carried no information of its own.
            The split now: Our Business answers 무엇을, How We Work answers 어떻게 (검증/구축/확산,
            which is verbatim what its 01/02/03 cards are named). Do not put a process verb back here.
            A draft that named the three areas outright at 48px was rejected the same day — the client
            does not want the 사업분야 spelled out that baldly. So the title states the business MODEL
            (one site's experience becomes the next site's product — the subtitle's own arc, and the
            thing no other section says) and the areas live only in the subtitle below.
            The eye of the needle this line threads: not the areas (too bald), not abstract either
            ("너무 추상적" is the standing complaint on this page's graphics — a slogan with no subject
            is what got the mockup's own line pulled); 만들다 is the Hero's verb, 적용 is Business
            Applications', 확인 is Related Solutions', 검증/구축/확산 are How We Work's; "산업 현장" is
            banned (opens both AimGuard's and Solution's h1, already in this page's CTA); and
            restating the "Our Business" label in Korean is the failure mode that killed this page's
            tab hint lines. That rules out most of the obvious phrasings — check a new draft against
            all of it. */}
        <BizHeading
          label="Our Business"
          title={
            <>
              한 현장의 경험이<br />
              다음 현장의 제품이 됩니다
            </>
          }
          align="center"
        />
        {/* Diverges from the mockup (Figma 414:113), approved 2026-07-15. The original was
            interchangeable — swap the company name and nothing breaks: no industry, customer or
            product in it. Its two-sentence structure and plain "…합니다" register are kept verbatim;
            only the abstractions are swapped for facts.
            The three areas are AIMWID's OWN taxonomy, from the 사업분야 page of its 회사소개서.
            NEVER name projects or clients here — the brochure lists ten (부산시 디지털트윈, 서부발전,
            KETI, 부여군, 한양대, 한전KDN …) and the client ruled all of them out. An earlier draft
            listed six system names lifted from App.tsx's Use case; three of those (배터리 화재,
            스마트 팩토리, 물류 관제) don't appear in the brochure at all, so that list is not a
            reliable source either. Areas only. */}
        {/* Approved copy, verbatim. This paragraph is now the ONLY place the three areas are named —
            the client does not want them spelled out at 48px (2026-07-16), so the title generalises
            and this carries the list. Do not trim the list out of the opener to "세 분야" or similar:
            with the title no longer naming them, that reference would point at nothing. */}
        <p className="max-w-[1223px] text-center text-[#9fb0c4] text-[16px] md:text-[20px] font-normal leading-[1.6] break-keep">
          에임위드는 에너지산업, 스마트시티, 안전·환경 분야에서 고객 현장의 시스템을 직접 구축해 왔습니다.<br /> 현장에서 검증된
          기능은 재사용 가능한 제품으로 표준화되고, AI 빌더 AIMNIS 위에서 조립되어 다음 현장에 더 빠르게 적용됩니다.
        </p>
      </motion.div>

      <OurBusinessGraphic />
    </div>
  </section>
);

// --- 3. Business Applications ---
// Rebuilt 2026-07-16 from Figma 445-126 / 447-134 / 447-140 (the three tab states). This replaced the
// five 운영 과제 tabs — 환경 운영 / 에너지·설비 / 문서·데이터 / 도시·인프라 / 안전·위험 — that Claude had
// derived when only card 01 was designed and 02–05 were unconfirmed guesswork.
//
// The section now runs on the brochure's 산업 분야 axis: 에너지산업 / 스마트시티 / 안전·환경, which are
// AIMWID's own 회사소개서 사업분야 verbatim. Every bullet is one of that document's ten named projects,
// so nothing on this card is authored any more — this is the first version of this section that is
// entirely client copy.
//
// TWO STANDING RULES DIED HERE, both on the client's own design — don't "restore" either:
//   1. Naming clients/projects on this page was ruled out ("areas only"). These cards name 서부발전,
//      KETI, 한전KDN, 부여군, 한양대 outright. Confirmed lifted by the user 2026-07-16.
//   2. Tab icons were rejected twice for restating the label (a leaf beside "환경 운영"). The Figma
//      puts a bolt / buildings / leaf back on the tabs. Design wins.
//
// The 산업 분야 axis DOES now overlap Solution's product tabs (에너지 운영 / 통합환경 감시 / 전력
// 데이터 / 스마트시티 / 스마트빌리지 / 작업자 안전) — the old 운영 과제 axis existed partly to avoid
// that. Client's call; the pages answer different questions (어디에 적용되는가 vs 어떤 제품인가).
//
// Art: the Figma cards are single ChatGPT rasters with the text baked in, so nothing is extractable —
// these reuse the existing webps, which match what those rasters depict. 안전·환경 takes env, not
// safety: the Figma scene is env's (weather mast, water sensors, greenery, refinery behind) with a
// worker added, and safety.webp's red hazard zone appears nowhere in the new design.
// business_app_doc.webp and business_app_safety.webp are now unused.
const applications = [
  {
    id: "app-energy",
    no: "01",
    tab: "에너지산업",
    en: "Energy Industry",
    icon: Zap,
    title: "발전·에너지 분야의\n검증된 AI 프로젝트",
    projects: [
      "서부발전 발전데이터 비즈니스 플랫폼",
      "KETI 발전소 AI 모니터링 시스템",
      "동반상생 기지개 통합관리 플랫폼",
    ],
    img: "business_app_energy.webp",
    fade: true,
  },
  {
    id: "app-city",
    no: "02",
    tab: "스마트시티",
    en: "Smart City",
    icon: Building2,
    title: "스마트시티 분야의\n검증된 AI 프로젝트",
    projects: [
      "부여군 스마트 빌리지 통합 연계 구축",
      "한양대(에리카) EmerGREEN 사업",
      "부여군 스마트 빌리지 2차 사업",
    ],
    img: "business_app_city.webp",
    fade: true,
  },
  {
    id: "app-safety",
    no: "03",
    tab: "안전 · 환경",
    en: "Safety & Environment",
    icon: Leaf,
    // The raster renders this one "안전 · 환경 본야의" — a ChatGPT glitch, not copy. 01 and 02 both
    // say 분야의 and that is the word.
    title: "안전 · 환경 분야의\n검증된 AI 프로젝트",
    projects: [
      "사업장 작업자 안전관리 솔루션",
      "한전 KDN GPT 위험성평가 플랫폼",
      "서부발전 대기환경오염물질 모니터링",
    ],
    // Figma 472:115 — the client's own art for this card, supplied 2026-07-16, replacing the env.webp
    // stand-in. Downloaded as the node's RAW fill (the export bakes in the rounded corners) and
    // re-encoded to webp; the figma.com asset URL is short-lived. 1402×1122, so this is the one card
    // whose art is 5:4 rather than 4:3 — see the EDGE_FADE geometry note.
    img: "business_app_safety_env.webp",
    fade: true,
  },
];


const BusinessApplications = () => {
  const [active, setActive] = useState(0);
  const app = applications[active];

  return (
    <section className="relative overflow-hidden py-[86px] lg:py-28 bg-[#020617]">
      <div
        className="pointer-events-none absolute -right-[460px] top-[-6%] h-[1100px] w-[980px] rounded-[50%]"
        style={{ background: "radial-gradient(closest-side, rgba(47,212,196,0.22), rgba(47,212,196,0) 72%)" }}
      />
      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Figma 445-126, verbatim. Was "고객의 운영 과제에 맞춰 / AI를 적용합니다." — that titled the
              운영 과제 axis this section no longer runs on. */}
          <BizHeading
            label="Business Applications"
            title={
              <>
                세 가지 핵심 산업에서<br />
                검증된 AI 솔루션을 제공합니다.
              </>
            }
          />
        </motion.div>

        {/* Vertical tab list + preview. Column width and gap follow the mockup (≈410px of its 1692px
            block, ~20px gutter). flex-1 makes the three tabs share the card's height — the grid
            stretches this column to the card, so each tab is (600 − 24 gap)/3 ≈ 192px and the two
            edges stay aligned. Card height changes carry to the tabs automatically. */}
        <div className="grid grid-cols-1 md:grid-cols-[410px_1fr] gap-6 mt-12">
          <div className="flex flex-col gap-3" role="tablist" aria-label="사업 분야">
            {applications.map((a, i) => {
              const isActive = active === i;
              return (
                <button
                  key={a.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(i)}
                  className={`flex-1 min-h-[88px] lg:min-h-[150px] px-6 py-5 lg:py-9 rounded-[10px] flex flex-col justify-between text-left border transition-all ${
                    isActive
                      ? "border-[#2fd4c4]/70 shadow-[0_0_24px_rgba(47,212,196,0.18)]"
                      : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                  }`}
                  style={
                    isActive
                      ? { background: "linear-gradient(90deg, rgba(0,168,168,0.45) 0%, rgba(0,72,92,0.18) 100%)" }
                      : undefined
                  }
                >
                  {/* justify-between splits the tab: 번호+한글+icon ride the top, 영문 the bottom. The
                      tabs stretch to the card's 600px (≈192px each), and centring the text left a big
                      empty band top and bottom; pushing the two lines to the edges turns that gap into
                      the layout instead of dead space. The icon is the Figma's — it reverses a standing
                      rule here (icons were rejected twice for restating the label, e.g. a leaf beside
                      "환경 운영"), but survives because the tabs are 산업 분야, so the glyph names an
                      industry rather than echoing a verb. */}
                  <div className="flex items-center gap-3">
                    <span className={`text-[15px] tabular-nums shrink-0 ${isActive ? "text-[#7fecec]/80" : "text-white/40"}`}>
                      {a.no}
                    </span>
                    <span
                      className={`whitespace-nowrap text-[17px] lg:text-[20px] ${
                        isActive ? "text-[#7fecec] font-semibold" : "text-white/80 font-medium"
                      }`}
                    >
                      {a.tab}
                    </span>
                    <a.icon
                      className={`ml-auto w-[22px] h-[22px] shrink-0 ${isActive ? "text-[#7fecec]" : "text-white/30"}`}
                      strokeWidth={1.6}
                      aria-hidden
                    />
                  </div>
                  <p
                    className={`text-[13px] lg:text-[16px] font-normal tracking-[0.04em] pl-[30px] ${
                      isActive ? "text-[#7fecec]/60" : "text-white/35"
                    }`}
                  >
                    {a.en}
                  </p>
                </button>
              );
            })}
          </div>

          {/* key={active} remounts the card, so the enter animation replays on every tab switch */}
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="group relative overflow-hidden rounded-[30px] border border-[#2fd4c4] bg-[rgba(10,18,30,0.5)] backdrop-blur-[10px] shadow-[0_0_40px_-6px_rgba(47,212,196,0.4)] lg:min-h-[600px]"
          >
            {/* Art bleeds in from the right at full height — Solution's card treatment verbatim
                (Solution.tsx:479). NOT a grid cell: boxing the image in a column made its left edge
                stop dead on the column line, which is what read as "cut off". Free-floating and
                h-full w-auto, it also keeps its own 4:3 — no horizontal crop. */}
            <img
              src={asset(app.img)}
              alt=""
              aria-hidden
              className="hidden lg:block pointer-events-none select-none absolute right-0 top-1/2 -translate-y-1/2 h-full w-auto max-w-none"
              style={app.fade ? edgeFadeStyle : undefined}
            />

            {/* Text sits over the art at 52%, vertically centred so spacing adapts to the height —
                again Solution's pattern rather than a fixed 3-group justify-between. */}
            <div className="relative z-10 flex flex-col justify-center lg:h-[600px] lg:max-w-[52%] px-6 py-8 lg:pl-[64px] lg:pr-6 lg:py-0">
              <p className="text-[#2fd4c4] text-[14px] font-bold tracking-[0.14em] uppercase">{app.en}</p>
              <h3 className="whitespace-pre-line text-white text-[26px] md:text-[36px] font-bold leading-[1.45] mt-4 break-keep">
                {app.title}
              </h3>

              {/* Named projects, straight from the 회사소개서. These replaced three invented feature
                  chips (실시간 현황 / 이상 감지 / …) — the chips described a capability in the abstract,
                  these are work that actually shipped, which is the whole point of the section. */}
              <ul className="flex flex-col gap-3 mt-8 max-w-[560px]">
                {app.projects.map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <span className="mt-[9px] w-[5px] h-[5px] rounded-full bg-[#22e0e0] shrink-0" aria-hidden />
                    <span className="text-white/85 text-[15px] font-normal leading-[1.6] break-keep">{p}</span>
                  </li>
                ))}
              </ul>

              {/* The solution-name chip that sat beside this link is gone — the Figma drops it, and with
                  real project names above, a product name here was the third thing competing for the
                  same glance. */}
              <div className="mt-9">
                <Link to="/solution" className="inline-flex items-center gap-2.5 text-[#22e0e0] text-[14px] font-semibold hover:gap-4 transition-all">
                  관련 솔루션 보기
                  <ArrowRight className="w-[18px] h-[18px]" strokeWidth={1.8} />
                </Link>
              </div>
            </div>

            {/* phones: stacked under the text, unmasked — a mask tuned for the desktop bleed reads
                as damage at this size */}
            <img src={asset(app.img)} alt="" aria-hidden className="lg:hidden block w-[calc(100%-2rem)] mx-auto h-auto select-none mb-6 rounded-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- 4. How We Work ---
// 01 검증 / 02 구축 / 03 확산, copy verbatim from the mockup. (Its English for 02 reads "Custom
// Implemention"; corrected to "Implementation".)
//
// Structure follows AIMNIS's Features section (the client's reference): three cards, isometric
// illustration over 한글 → English → description. No stat chip: there are no real numbers for these
// stages and inventing them would undo the named evidence this page is built on. Three cards
// deliberately echo Solution's Lifecycle — the client supplied that as a reference, so clarity beat
// the originality Claude had been chasing.
//
// EACH SCENE HAS ITS OWN SILHOUETTE, which is the whole job here. A previous pass drew all three as
// "isometric panel with a chart on it" and they read as one object repeated. The reference works
// because its three illustrations share nothing but the projection. So:
//   01 검증 — one specimen on a test bench, scanned. Compact, centred, a single mass.
//   02 구축 — layers stacking into a tower on top of the customer's existing system. Vertical.
//   03 확산 — one built unit replicated across a wide field. Horizontal, many, small.
// Compact / tall / wide: distinguishable at a glance, before any label is read.
//
// True isometric: ip() projects (x, y, z) with the x-axis going right-down, y left-down, z up. All
// three scenes share it, so they read as one world. Each box draws its two visible side faces at
// different values — a flat fill reads as a sticker, shading is what gives mass.
const workSteps = [
  {
    no: "01",
    ko: "검증",
    en: "PoC & Validation",
    desc: "고객 과제와 데이터를 기반으로\n기술 적용 가능성을 검증합니다.",
  },
  {
    no: "02",
    ko: "구축",
    en: "Custom Implementation",
    desc: "현장과 기존 시스템 환경에 맞는\n맞춤형 플랫폼을 구축합니다.",
  },
  {
    no: "03",
    ko: "확산",
    en: "Scale & Operation",
    desc: "검증된 기능을 다른 사업장과\n서비스로 확산하고 운영합니다.",
  },
];

// 01 — ONE specimen on a bench, being scanned, then stamped. Compact and centred: a single mass,
// nothing repeated. That singularity is the point — 검증 is one small trial.
const SceneVerify = () => (
  <svg viewBox="0 0 400 240" className="w-full h-auto" aria-hidden>
    <SvgDefs />
    <ellipse cx="200" cy="130" rx="140" ry="80" fill="url(#hw-glow)" />
    <g transform="translate(200, 108)">
      <Box a={124} b={92} h={5} o={0.6} />
      <Box x={33} y={24} a={58} b={44} h={30} z={5} hot />
      <g transform={onTop(35)}>
        <Bars x={40} y={58} vals={[9, 15, 11, 18]} />
      </g>
      {/* the scan sweeping up through it */}
      <motion.g animate={{ y: [8, -34] }} transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}>
        <polygon
          points={poly([ip(28, 20, 0), ip(96, 20, 0), ip(96, 72, 0), ip(28, 72, 0)])}
          fill="#2fd4c4"
          fillOpacity="0.14"
          stroke="#5ff5f5"
          strokeWidth="1.1"
        />
      </motion.g>
    </g>
    {/* verdict, stamped in screen space so it sits ON the scene, not inside it */}
    <motion.g
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: 0.6, ease: "backOut" }}
      style={{ transformOrigin: "296px 62px" }}
    >
      <circle cx="296" cy="62" r="25" fill="#052a2c" stroke="#2fd4c4" strokeWidth="2" />
      <path d="M285 62 L293 70 L308 54" fill="none" stroke="#5ff5f5" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </motion.g>
    <motion.circle
      cx="296"
      cy="62"
      r="25"
      fill="none"
      stroke="#2fd4c4"
      strokeWidth="1.4"
      animate={{ r: [25, 40], opacity: [0.7, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
    />
  </svg>
);

// 02 — layers stacking ONTO the customer's existing system (the dim slab at the bottom). Tall and
// vertical: nothing in 01 or 03 has this silhouette. The top layer keeps landing, so the scene is
// building rather than built.
const SceneBuild = () => (
  <svg viewBox="0 0 400 240" className="w-full h-auto" aria-hidden>
    <SvgDefs />
    <ellipse cx="200" cy="150" rx="150" ry="80" fill="url(#hw-glow)" />
    <g transform="translate(196, 150)">
      {/* 기존 시스템 — dim, it was already there */}
      <Box a={108} b={80} h={9} z={0} o={0.45} />
      <Box a={108} b={80} h={9} z={26} o={0.7} />
      <Box a={108} b={80} h={9} z={52} o={0.85} />
      {/* 관제 화면 — still coming down */}
      <motion.g animate={{ y: [-30, 0, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeIn", times: [0, 0.55, 1] }}>
        <Box a={108} b={80} h={9} z={78} hot />
        <g transform={onTop(87)}>
          <Bars x={22} y={54} vals={[10, 16, 12, 19]} />
          <rect x="66" y="30" width="30" height="4" rx="2" fill="#7ff5ff" fillOpacity="0.55" />
          <rect x="66" y="40" width="20" height="4" rx="2" fill="#7ff5ff" fillOpacity="0.3" />
        </g>
      </motion.g>
    </g>
  </svg>
);

// 03 — the built unit, replicated across a field. Wide and many and small: the opposite silhouette
// to 02's tower. Nothing here is newly designed; that is exactly what 확산 means.
const SATS: { x: number; y: number; d: number }[] = [
  { x: 92, y: 8, d: 1 },
  { x: 120, y: 62, d: 2 },
  { x: 30, y: 96, d: 2 },
  { x: 150, y: 118, d: 3 },
  { x: 78, y: 140, d: 3 },
];

const SceneScale = () => (
  <svg viewBox="0 0 400 240" className="w-full h-auto" aria-hidden>
    <SvgDefs />
    <ellipse cx="200" cy="128" rx="180" ry="88" fill="url(#hw-glow)" />
    <g transform="translate(196, 58)">
      {/* ground the whole field sits on */}
      <polygon
        points={poly([ip(-14, -14, 0), ip(190, -14, 0), ip(190, 176, 0), ip(-14, 176, 0)])}
        fill="#061620"
        fillOpacity="0.7"
        stroke="#12475a"
        strokeWidth="0.8"
      />
      {/* links out to every copy */}
      {SATS.map((s) => (
        <line
          key={`l-${s.x}-${s.y}`}
          x1={ip(22, 22, 0)[0]}
          y1={ip(22, 22, 0)[1]}
          x2={ip(s.x + 13, s.y + 10, 0)[0]}
          y2={ip(s.x + 13, s.y + 10, 0)[1]}
          stroke="#22e0e0"
          strokeOpacity="0.4"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
      ))}
      {/* origin — the unit built in 02 */}
      <Box x={4} y={4} a={36} b={30} h={20} z={0} hot />
      {/* copies, drawn back-to-front so nearer ones overlap */}
      {[...SATS]
        .sort((p, q) => p.x + p.y - (q.x + q.y))
        .map((s) => (
          <g key={`s-${s.x}-${s.y}`}>
            <Box x={s.x} y={s.y} a={26} b={21} h={13} z={0} o={0.9 - s.d * 0.13} />
          </g>
        ))}
      {/* the spread, still going */}
      {SATS.map((s, i) => (
        <motion.circle
          key={`p-${i}`}
          cx={ip(s.x + 13, s.y + 10, 15)[0]}
          cy={ip(s.x + 13, s.y + 10, 15)[1]}
          r="3"
          fill="#5ff5f5"
          animate={{ opacity: [0.15, 1, 0.15] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.35 }}
        />
      ))}
    </g>
  </svg>
);

// --- Business Partner ---
// Names taken from Company's 연혁 (the client list), deduplicated to organisations. NOTE the mockup's
// logos were LG·삼성·현대·SK, which appear nowhere in that history — they read as the designer's
// stock placeholders, so the real clients are used instead. This section also names clients on the
// Business page, which the client had previously ruled out here ("areas only"); the user lifted that
// on 2026-07-16 for the logo wall specifically.
// `logo` is the client's own brand mark (Figma 474:126-150, downloaded as raw fills, re-encoded to
// alpha webp at 2× the slot height; 화성시·광명시 came later from 477:203-204, the latter keyed off a
// flat-white JPEG). 한국서부발전 came from 474:117, whose fill is a sheet of five lockups — the node
// renders the first, so only that crop is used. 한국전력연구원's slot carries 479:96, which is the
// parent 한국전력공사 (KEPCO) corporate mark, not a KEPRI one — that is what the client supplied.
// All alpha, so they sit straight on the dark slot.
const partners: { name: string; logo?: string }[] = [
  { name: "한국서부발전", logo: "partner_kowepo.webp" },
  { name: "한국전력공사", logo: "partner_kepco.webp" },
  { name: "한전KDN", logo: "partner_kdn.webp" },
  { name: "한국전자기술연구원", logo: "partner_keti.webp" },
  { name: "부산광역시", logo: "partner_busan.webp" },
  { name: "광명시", logo: "partner_gwangmyeong.webp" },
  { name: "부여군", logo: "partner_buyeo.webp" },
  { name: "화성시", logo: "partner_hwaseong.webp" },
  { name: "한양대학교 ERICA", logo: "partner_hanyang.webp" },
  { name: "한국외국어대학교", logo: "partner_hufs.webp" },
];

const BusinessPartner = () => (
  <section className="relative lg:min-h-[700px] flex flex-col justify-center overflow-hidden py-[86px] lg:py-24 bg-[#020617]">
    {/* Left blue glow, pulled UP toward the Applications seam (user: "위로, 섹션 사이로"). Centre at
        y250 (top-[-160px] + h/2), so it sits high in the section and brightens the boundary; its alpha
        is already near-zero at the top edge (centre 250 vs the ~295 alpha-0 radius), so the ~45px that
        overflow-hidden clips above y0 is invisible — no seam. Bottom (~y545) still dies inside the
        700px section. Stays LEFT for the page zigzag (Applications right, this left, How We Work right,
        Related left). */}
    <div
      className="pointer-events-none absolute -left-[460px] top-[-160px] h-[820px] w-[980px] rounded-[50%]"
      style={{ background: "radial-gradient(closest-side, rgba(54,132,247,0.20), rgba(54,132,247,0) 72%)" }}
    />

    <div className="container-custom relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
      >
        <BizHeading label="Business Partner" title="주요고객사 및 파트너사" align="center" />
      </motion.div>

      {/* Mobile: a static 2-col grid instead of the marquee. On a phone the marquee shows only ~1
          logo at a time with big empty gaps around it (slot 200px + 40px margins ≫ viewport); a grid
          puts all 10 partners on screen at once, compact and even. Desktop keeps the marquee below. */}
      <div className="lg:hidden grid grid-cols-2 gap-x-7 gap-y-11 mt-12">
        {partners.map((p) => (
          <div key={p.name} className="flex h-[48px] items-center justify-center">
            {p.logo ? (
              <img
                src={asset(p.logo)}
                alt={p.name}
                className="max-h-[32px] max-w-[128px] w-auto h-auto object-contain select-none"
              />
            ) : (
              <span className="text-white/45 text-[14px] font-medium">{p.name}</span>
            )}
          </div>
        ))}
      </div>

      {/* The row is clipped to the 1600 column, so slots appear and vanish at its edges rather than the
          window's. Something has to soften that — without it the loop reads as popping, not flowing.
          This is a MASK on the row, not a pair of overlay strips painted in the section colour. The
          strips were opaque #020617, so over the blue glow behind this section they stopped reading as
          a fade and became a visible dark rectangle around the row. A mask fades the logos themselves
          and leaves whatever is behind untouched, so the glow carries straight through. Don't go back
          to painted strips: any solid colour here is wrong the moment the backdrop isn't flat. */}
      <div
        className="relative mt-[100px] overflow-hidden hidden lg:block"
        style={{
          maskImage: "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
        }}
      >

        {/* No box — just the logo (transparent PNG) floating on the section, per the client. The slot
            keeps its 200×72 footprint and centring so the marquee spacing stays even and every logo
            reads at one visual weight regardless of aspect ratio; only the border/fill are gone. Names
            without a logo yet fall back to text. Inlined rather than a component on purpose: `key` on a
            component (not an intrinsic) trips a TS2322 false positive here, baseline stays at 7.

            The marks are the artwork exactly as supplied. Most are dark-navy wordmarks and measure
            2.1:1 (한양대) to 3.9:1 (부여군) against #020617, which is low — that is a known, accepted
            state as of 2026-07-20, not an oversight. Five fixes were built and rejected, so don't
            re-propose them blind: recolouring to one flat tone (erases the brand colours), brightening
            the marks in place (same objection — it is still a colour modification, and public bodies
            like 한전 forbid it in their CI manuals), a near-white band behind the row (reads as a bright
            slab on a dark page), an edgeless light band dissolving into the section top and bottom (the
            softest version buildable — still too loud), and nudging the surface to a mid navy. That last
            one is not just unappealing but arithmetically backwards: the ink is already brighter than
            the section, so a mid-tone moves the background toward the ink (한양대 2.1 → 1.8 at #0f1a33).

            Note the search is genuinely exhausted, not merely unfinished. Ink luminance is ~0.061, so
            going darker caps out at 2.2:1 even at pure black — only a brighter surface can help, and
            every brightness that helps has been rejected as too loud. The remaining fix is upstream:
            obtain each body's dark-background CI variant and drop it in as-is. */}
        <div className="partner-marquee flex w-max">
          {[...partners, ...partners].map((p, i) => (
            <div
              key={i}
              className="mx-[20px] flex h-[72px] w-[200px] shrink-0 items-center justify-center"
            >
              {p.logo ? (
                <img
                  src={asset(p.logo)}
                  alt={p.name}
                  className="max-h-[44px] max-w-[176px] w-auto h-auto object-contain select-none"
                />
              ) : (
                <span className="text-white/45 text-[15px] font-medium">{p.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const SCENES = [SceneVerify, SceneBuild, SceneScale];

const HowWeWork = () => (
  <section className="relative overflow-hidden py-[86px] lg:py-28 bg-[#020617]">
    {/* Right teal glow (zigzag: Partner left → this right → Related left). Nudged up to top-[-120px]
        (was ~-37); centre y380, alpha-0 radius ~360, so it stops ~y20 — just inside the top edge, no
        clip against Partner above. Bottom (~y740) still dies inside this ~928px section. */}
    <div
      className="pointer-events-none absolute -right-[520px] top-[-120px] h-[1000px] w-[1120px] rounded-[50%]"
      style={{ background: "radial-gradient(closest-side, rgba(47,212,196,0.24), rgba(47,212,196,0) 72%)" }}
    />

    <div className="container-custom relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <BizHeading label="How We Work" title="고객과 함께 문제를 검증하고, 구축하고, 확산합니다." />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
        {workSteps.map((s, i) => {
          const Scene = SCENES[i];
          return (
            <motion.div
              key={s.no}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="rounded-[16px] border border-white/10 bg-[#0a1420] px-7 pt-6 pb-9 flex flex-col items-center text-center"
            >
              {/* Text scale matches AIMNIS's Features cards verbatim (AimNis.tsx:42-44): 22px bold
                  title / mt-2 / 15px #22e0e0 semibold / mt-4 / 16px white-80 leading-relaxed. The
                  description being LARGER than the English label is intentional there, so it is
                  here. Keep the two in sync — this section is meant to read as the same component. */}
              <Scene />
              <span className="h-7 px-3 rounded-full bg-[#2fd4c4] text-[#00121a] text-[13px] font-extrabold tracking-wide flex items-center shadow-[0_0_16px_rgba(47,212,196,0.5)] mt-5">
                {s.no}
              </span>
              <h3 className="text-white text-[22px] font-bold mt-4">{s.ko}</h3>
              <p className="text-[#22e0e0] text-[15px] font-semibold mt-2">{s.en}</p>
              <p className="whitespace-pre-line text-white/80 text-[16px] leading-relaxed mt-4 break-keep">{s.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

// --- 5. Related Solutions ---
// Card copy verbatim from the mockup.
const related = [
  {
    to: "/aimnis",
    name: "AIMNIS",
    logo: "aimnis_logo.png",
    desc: "현장 담당자가 AI와 위젯으로\n업무 화면을 구현하는\n엔터프라이즈 AI 플랫폼",
    img: "aimnis_hero.png",
  },
  {
    to: "/aimguard",
    name: "AIM GUARD",
    logo: "aimguard_logo_bi.png",
    desc: "영상과 현장 데이터를 통합해\n안전과 시설을 관리하는\n지능형 관제 솔루션",
    img: "aimguard_hero_main.png",
  },
  {
    to: "/solution",
    name: "INDUSTRY AI SOLUTIONS",
    logo: null, // no BI exists for the lineup — the mockup draws a cube glyph + wordmark instead
    desc: "에너지, 환경, 도시, 안전 분야에서\n검증된 산업 특화 솔루션",
    img: "solution_hero_v2.webp",
  },
];

const RelatedSolutions = () => (
  <section className="relative overflow-hidden py-[86px] lg:py-28 bg-[#020617]">
    {/* Left blue glow — flipped from right so the zigzag holds: How We Work (right) → this (left).
        h-[780px] top-[-60px] keeps the 72% alpha-0 stop ~y611, inside this ~677px section (the old
        h-[1200px] was clipped into the page's worst seam against the CTA below). */}
    <div
      className="pointer-events-none absolute -left-[440px] top-[-60px] h-[780px] w-[940px] rounded-[50%]"
      style={{ background: "radial-gradient(closest-side, rgba(54,132,247,0.28), rgba(54,132,247,0) 72%)" }}
    />

    <div className="container-custom relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <BizHeading label="Related Solutions" title="사업 목적에 맞는 에임위드 솔루션을 확인하세요." />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {related.map((r, i) => (
          <motion.div
            key={r.to}
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
          >
            <Link
              to={r.to}
              className="group relative flex flex-col lg:block lg:h-[290px] rounded-[14px] overflow-hidden border border-white/10 bg-[#0a1420] hover:border-[#2fd4c4]/45 transition-colors"
            >
              {/* Mobile: image is a full-width top banner in normal flow. Desktop: it bleeds in from
                  the right at 62% as an absolute overlay (the mockup's split). One <img>, positioning
                  switches at lg — on the narrow phone column the old 62% overlay squeezed the art and
                  ran it under the text. */}
              <img
                src={asset(r.img)}
                alt=""
                aria-hidden
                className="w-full h-[150px] object-cover lg:absolute lg:right-0 lg:inset-y-0 lg:h-full lg:w-[62%] opacity-90 group-hover:scale-105 transition-transform duration-700"
              />
              {/* text column reads over a solid-to-transparent wash, matching the mockup's split — desktop only (mobile stacks) */}
              <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#0a1420] from-40% via-[#0a1420]/80 to-transparent" />

              <div className="relative w-full p-6 lg:h-full lg:w-[62%] lg:p-7 flex flex-col gap-4 lg:gap-0 lg:justify-between">
                <div>
                  {/* 1.2× across all three marks, so the two image logos and the drawn INDUSTRY AI
                      SOLUTIONS lockup stay the same optical weight: 28→34, 26→31, 17→20. */}
                  {r.logo ? (
                    <img src={asset(r.logo)} alt={r.name} className="h-[34px] w-auto" />
                  ) : (
                    <div className="flex items-center gap-3">
                      <Boxes className="w-[31px] h-[31px] text-white" strokeWidth={1.5} />
                      <span className="text-white text-[20px] font-bold tracking-tight">{r.name}</span>
                    </div>
                  )}
                  <p className="whitespace-pre-line text-white/65 text-[15px] leading-[1.7] mt-5 break-keep">{r.desc}</p>
                </div>
                <span className="inline-flex items-center gap-2 text-[#22e0e0] text-[15px] font-semibold group-hover:gap-3.5 transition-all">
                  자세히 보기
                  <ArrowRight className="w-[18px] h-[18px]" strokeWidth={1.8} />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// --- 6. CTA ---
// Uses the site-wide CTA shell verbatim (Solution.tsx:519 / AimNis.tsx:978 / AimGuard.tsx:656): a
// contained rounded card inside container-custom — section py-20, card rounded-[20px] with a
// #2fd4c4/25 border, inner py-[68px], h2 26/42px, body 15/18px mt-3, buttons mt-7 at 54×232.
// The mockup draws a full-bleed 1920×458 band instead; consistency with the other pages won.
//
// Backdrop is solution_hero_bg.png — the same clean abstract particle field Solution's CTA uses.
// It replaces aimnis_cta_graphic.png, which has AIMNIS's OWN copy baked into the pixels ("복잡한 SI
// 프로젝트를 2개월 만에…" plus SAP/ERP logos) and was legibly showing through on this page. Never
// reuse another page's CTA graphic here: they all carry that page's text in the image.
//
// Button LABELS are the mockup's (프로젝트 문의 / 회사소개서 다운로드), not the shared ActionButtons
// pair (도입 상담 신청 / 소개서 다운로드) — only the geometry is shared.
const CTA = () => (
  <section className="py-[50px] md:py-20 bg-[#020617]">
    <div className="container-custom">
      <div className="relative w-full mx-auto rounded-[20px] overflow-hidden border border-[#2fd4c4]/25 bg-[#04090f]">
        <img
          src={asset("solution_hero_bg.png")}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-70 pointer-events-none select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/70 via-[#020617]/40 to-[#020617]/80" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex flex-col items-center text-center px-6 py-[68px]"
        >
          <h2 className="text-[26px] md:text-[42px] font-bold leading-[1.3] drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
            <span className="text-white">당신의 데이터로 시작하는 </span>
            <span className="text-[#2fd4c4]">맞춤형 AI 사업</span>
          </h2>
          <p className="text-white/70 text-[15px] md:text-[18px] leading-[1.6] mt-3 break-keep">
            산업 현장과 업무 과제에 맞는<br />
            시스템과 플랫폼 구축 방향을 함께 찾습니다.
          </p>

          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 sm:gap-5 mt-7 w-full sm:w-auto">
            <Link
              to="/contact"
              onClick={() => window.scrollTo(0, 0)}
              className="flex h-[48px] w-full sm:h-[54px] sm:w-[232px] items-center justify-center rounded-[8px] text-[#000028] text-[16px] sm:text-[18px] font-bold hover:shadow-[0_0_30px_rgba(0,230,219,0.5)] transition-all"
              style={{ background: "linear-gradient(90deg, #00feb9 0%, #00e6db 100%)" }}
            >
              프로젝트 문의
            </Link>
            <a
              href={asset("aimwid_brochure.pdf")}
              download="2026_AIMWID_회사소개서.pdf"
              className="flex h-[48px] w-full sm:h-[54px] sm:w-[232px] items-center justify-center rounded-[8px] border border-[#2fd4c4] bg-white/20 text-white text-[16px] sm:text-[18px] font-bold hover:bg-white/30 transition-all"
            >
              회사소개서 다운로드
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default function Business() {
  return (
    <div className="pt-[80px] min-h-screen text-white bg-[#020617] font-sans overflow-hidden">
      <Hero />
      <OurBusiness />
      <BusinessApplications />
      <BusinessPartner />
      <HowWeWork />
      <RelatedSolutions />
      <CTA />
    </div>
  );
}
