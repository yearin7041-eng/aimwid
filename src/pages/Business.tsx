import { motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import {
  FileText,
  Monitor,
  AlertTriangle,
  Activity,
  Search,
  BrainCircuit,
  TrendingUp,
  Bell,
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
// them together or not at all:
//   card ≈ 1160 wide · art is h-full w-auto ⇒ 660 × (1448/1086) ≈ 880 wide, pinned right
//   ⇒ art occupies 280…1160, while the text column (lg:max-w-[52%]) runs to ≈ 603
// So the art is held near-zero through 30% (≈ 545px, still behind the text), then climbs to solid by
// 66% (≈ 860px, clear of it). That is what Solution's illustrations do with their baked-in alpha;
// these are flat rectangles with no alpha at all, so the mask has to do it. An earlier version
// ramped from 0% and the edge died right on the column line, which is what read as "cut off".
const EDGE_FADE = [
  "linear-gradient(to right, transparent 0%, transparent 30%, rgba(0,0,0,0.35) 46%, #000 66%, #000 94%, transparent 100%)",
  "linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)",
].join(", ");
const edgeFadeStyle = {
  WebkitMaskImage: EDGE_FADE,
  maskImage: EDGE_FADE,
  WebkitMaskComposite: "source-in",
  maskComposite: "intersect",
} as const;

// Heading system for this page, taken verbatim from Figma 410-96: label Pretendard Regular 24px
// #0cc → 16px gap → title Pretendard Bold 48px leading-1.6. All five sections use it; only Our
// Business is centred. NOTE this is CenterHeading's spec (Solution.tsx:49), NOT AimGuard's
// SectionHeading — that one sets leading-[1.3] and would compress every title on this page.
const BizHeading = ({ label, title, align = "left" }: { label: string; title: ReactNode; align?: "left" | "center" }) => (
  <div className={`flex flex-col gap-4 ${align === "center" ? "items-center text-center" : "items-start"}`}>
    <p className="text-[#00cccc] text-[20px] md:text-[24px] font-normal leading-[1.2]">{label}</p>
    <h2 className="text-[32px] md:text-[48px] font-bold text-white leading-[1.6] break-keep">{title}</h2>
  </div>
);

// --- 1. Hero ---
// Title and body are verbatim from Figma (410:109 / 410:151).
//
// The mockup's eyebrow (410:107 "Industry AI Solutions") is deliberately DROPPED: it duplicated
// Solution's own category line, and at 18px teal it read as the same device as the 24px teal
// section labels below while doing a different job. With it gone, a teal label on this page means
// exactly one thing — "a section starts here". Business is now the only hero without an eyebrow
// (Solution / AIMNIS / AIM GUARD all keep theirs).
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
      <stop offset="0" stopColor="#00f5ff" stopOpacity="0.3" />
      <stop offset="100%" stopColor="#00f5ff" stopOpacity="0" />
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
// No edge masks: the raster's own background is #030a1c–#040c20, within a couple of points of the
// section's #040813, so its edges do not read as a seam — verified at 1440/1600/1920. The top and
// bottom are the image's own empty sky and the bottom fade. The two radial glows that used to sit
// here are gone; the raster carries its own.
const HeroVisual = () => (
  <div className="absolute inset-0 pointer-events-none">
    <img
      src={asset("business_hero.webp")}
      alt=""
      aria-hidden
      className="absolute right-0 top-1/2 -translate-y-1/2 h-[118%] w-auto max-w-none select-none"
    />

    {/* readability: left→right darkening, then a fade into Our Business below */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#040813] from-6% via-[#040813]/55 via-[36%] to-transparent to-[62%]" />
    <div className="absolute inset-x-0 bottom-0 h-[180px] bg-gradient-to-b from-transparent to-[#020617]" />
  </div>
);

const Hero = () => (
  <section className="relative min-h-[820px] overflow-hidden bg-[#040813]">
    <HeroVisual />

    {/* Header → hero color bridge — darkens the navbar strip only */}
    <div className="absolute top-0 inset-x-0 h-[96px] bg-gradient-to-b from-[#020617] via-[#020617]/55 to-transparent pointer-events-none z-[1]" />

    {/* pt = mockup's h1 top (359) minus the 80px header, so dropping the eyebrow leaves the title
        and body exactly where Figma puts them — the hero just gains headroom above. */}
    <div className="container-custom relative z-10 pt-[279px] pb-[120px]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-[760px] flex flex-col"
      >
        <h1 className="text-[40px] md:text-[64px] font-bold text-white leading-[1.2]">
          고객의 데이터로,<br />
          현장에 맞는 AI를 만듭니다.
        </h1>
        <p className="text-white text-[18px] font-normal leading-[1.4] mt-6">
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
  <section className="relative overflow-hidden pt-[140px] pb-28 bg-[#020617]">
    {/* glossy glows — same teal/blue alternation Solution runs down its sections */}
    <div
      className="pointer-events-none absolute -left-[520px] -top-[10%] h-[1000px] w-[1120px] rounded-[50%]"
      style={{ background: "radial-gradient(closest-side, rgba(0,210,210,0.30), rgba(0,210,210,0) 72%)" }}
    />
    <div
      className="pointer-events-none absolute -right-[440px] top-[24%] h-[1100px] w-[940px] rounded-[50%]"
      style={{ background: "radial-gradient(closest-side, rgba(54,132,247,0.26), rgba(54,132,247,0) 72%)" }}
    />

    <div className="container-custom relative">
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
        <p className="max-w-[1223px] text-center text-[#b3b4b9] text-[18px] md:text-[22px] font-normal leading-[1.6] break-keep">
          에임위드는 에너지산업, 스마트시티, 안전·환경 분야에서 고객 현장의 시스템을 직접 구축해 왔습니다.<br /> 현장에서 검증된
          기능은 재사용 가능한 제품으로 표준화되고, AI 빌더 AIMNIS 위에서 조립되어 다음 현장에 더 빠르게 적용됩니다.
        </p>
      </motion.div>

      <OurBusinessGraphic />
    </div>
  </section>
);

// --- 3. Business Applications ---
// Section heading and card 01 are verbatim from Figma 410-96. The tab set is NOT: the mockup shipped
// six tabs and they were checked against AIMWID's own 회사소개서 사업분야 page on 2026-07-15, which
// lists three areas (에너지산업 / 스마트시티 / 안전·환경) across ten named projects — 부산시 디지털트윈,
// 서부발전 발전데이터 비즈니스 플랫폼, KETI 발전소 AI 모니터링, 동반상생 기지개, 서부발전 대기환경
// 오염물질 모니터링, 부여군 스마트 빌리지 1·2차, 한양대 EmerGREEN, 사업장 작업자 안전관리, 한전KDN
// GPT 위험성평가. Against that:
//
//   물류 · 교통 최적화  → DROPPED. Not one of the ten projects touches logistics or traffic; the tab
//                        was advertising a business that doesn't exist. Hence five tabs, not six.
//   설비 · 생산 운영    → "에너지 · 설비 운영". The evidence is 발전 설비 (KETI, 서부발전); nothing
//                        in the brochure is about 생산.
//   시설 · 인프라 운영  → "도시 · 인프라 운영". The work is 부산시 and 부여군 — cities and villages,
//                        not facilities.
//   위험 예측 · 대응    → "안전 · 위험 관리". 작업자 안전관리 is the core of it, not just prediction.
//
// The tabs keep the mockup's 운영 과제 axis (what kind of operation) rather than the brochure's
// 산업 분야 axis, so they still don't collide with Solution's product tabs (에너지 운영 / 통합환경
// 감시 / 전력 데이터 / 스마트시티 / 스마트빌리지 / 작업자 안전).
//
// Only card 01 is designed in the mockup; 02–05 copy, feature labels and imagery are authored here
// and NOT yet client-confirmed. None of them names a client — the brochure's named projects are far
// stronger evidence and are still on the table for these cards.
//
// `img` reuses Solution's card illustrations: transparent-alpha isometric digital twins that ALREADY
// render their own dashboard, so the card never draws stats over one. Caveat: power_v6 may be the
// odd one out (it reads light-themed, unlike the others).
const applications = [
  {
    id: "app-env",
    no: "01",
    tab: "환경 운영",
    en: "Environment Operations",
    desc: "대기·수질·탄소 데이터를 연결해\n환경 변화와 이상 징후를 빠르게 파악합니다.",
    features: [
      { label: "실시간 현황", icon: Monitor },
      { label: "이상 감지", icon: AlertTriangle },
      { label: "환경 리포트", icon: FileText },
    ],
    solution: "통합환경 감시시스템",
    // Straight from Figma 432:103 (downloaded to public/ — the localhost:3845 asset URL only lives
    // while Figma desktop is open). Solid rectangle, no alpha, so `fade` turns on EDGE_FADE.
    img: "business_app_env.webp",
    fade: true,
  },
  {
    id: "app-energy",
    no: "02",
    tab: "에너지 · 설비 운영",
    en: "Energy & Facility Operations",
    desc: "발전 설비와 계통 데이터를 연결해\n고장 징후를 미리 감지합니다.",
    features: [
      { label: "설비 모니터링", icon: Monitor },
      { label: "이상 감지", icon: Activity },
      { label: "예측 정비", icon: TrendingUp },
    ],
    solution: "에너지 운영 최적화",
    // Figma 434:122 — turbine hall, transmission towers, substation. It REPLACED 433:116, which was
    // a water-quality scene (buoys, pond) that had nothing to do with 발전 설비·계통 and was also a
    // near-twin of card 01's art. Downloaded and re-encoded to webp; the localhost:3845 asset URL
    // only lives while Figma desktop is open. Solid rectangle, no alpha ⇒ fade.
    img: "business_app_energy.webp",
    fade: true,
  },
  {
    id: "app-doc",
    no: "03",
    tab: "문서 · 데이터 활용",
    en: "Document & Data Utilization",
    desc: "흩어진 데이터와 문서를 연결해\n필요한 정보를 바로 찾아냅니다.",
    features: [
      { label: "데이터 연계", icon: Search },
      { label: "문서 활용", icon: FileText },
      { label: "자동 리포트", icon: BrainCircuit },
    ],
    solution: "전력 데이터 플랫폼",
    // Figma 434:121, downloaded and re-encoded to webp (the localhost:3845 asset URL only lives
    // while Figma desktop is open). Solid rectangle, no alpha ⇒ fade.
    img: "business_app_doc.webp",
    fade: true,
  },
  {
    id: "app-city",
    no: "04",
    tab: "도시 · 인프라 운영",
    en: "City & Infrastructure Operations",
    desc: "도시와 마을의 인프라 데이터를 통합해\n운영 상태를 한 화면에서 관리합니다.",
    features: [
      { label: "통합 관제", icon: Monitor },
      { label: "상태 진단", icon: Activity },
      { label: "운영 리포트", icon: FileText },
    ],
    solution: "스마트시티 통합관제",
    // Figma 433:119, downloaded to public/ (the localhost:3845 asset URL only lives while Figma
    // desktop is open). Solid rectangle, no alpha ⇒ fade.
    img: "business_app_city.webp",
    fade: true,
  },
  {
    id: "app-safety",
    no: "05",
    tab: "안전 · 위험 관리",
    en: "Safety & Risk Management",
    desc: "영상과 현장 데이터로 위험을 인지해\n사고 이전에 대응합니다.",
    features: [
      { label: "실시간 감지", icon: Monitor },
      { label: "위험성 평가", icon: AlertTriangle },
      { label: "즉시 알림", icon: Bell },
    ],
    solution: "AIM GUARD",
    // Figma 434:123, downloaded and re-encoded to webp (the localhost:3845 asset URL only lives
    // while Figma desktop is open). Solid rectangle, no alpha ⇒ fade. The red hazard zone is the
    // only non-teal accent on the page and is deliberate — it reads as the danger being detected.
    img: "business_app_safety.webp",
    fade: true,
  },
];


const BusinessApplications = () => {
  const [active, setActive] = useState(0);
  const app = applications[active];

  return (
    <section className="relative overflow-hidden py-28 bg-[#020617]">
      <div
        className="pointer-events-none absolute -right-[460px] top-[-6%] h-[1100px] w-[980px] rounded-[50%]"
        style={{ background: "radial-gradient(closest-side, rgba(0,210,210,0.22), rgba(0,210,210,0) 72%)" }}
      />

      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <BizHeading
            label="Business Applications"
            title={
              <>
                고객의 운영 과제에 맞춰<br />
                AI를 적용합니다.
              </>
            }
          />
        </motion.div>

        {/* Vertical tab list + preview. The 6 tabs are the only nav — the mockup has no carousel dots.
            Column width and gap follow the mockup (≈410px of its 1692px block, ~20px gutter). The
            buttons flex-1 so the six of them always add up to exactly the card's height, whatever
            the card grows to — no magic number to keep in sync. */}
        <div className="grid grid-cols-1 md:grid-cols-[410px_1fr] gap-6 mt-12">
          <div className="flex flex-col gap-3" role="tablist" aria-label="운영 과제">
            {applications.map((a, i) => {
              const isActive = active === i;
              return (
                <button
                  key={a.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(i)}
                  className={`flex-1 min-h-[88px] px-6 rounded-[10px] flex flex-col justify-center text-left border transition-all ${
                    isActive
                      ? "border-[#2fd4c4]/70 shadow-[0_0_24px_rgba(0,204,204,0.18)]"
                      : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                  }`}
                  style={
                    isActive
                      ? { background: "linear-gradient(90deg, rgba(0,168,168,0.45) 0%, rgba(0,72,92,0.18) 100%)" }
                      : undefined
                  }
                >
                  {/* 번호 + 한글 + 영문, three sizes. No icon: the label already says 환경 / 에너지 /
                      문서 / 도시 / 안전, so a leaf or a bolt beside it repeats the word in a weaker
                      medium, and the card's photo answers "what is this" far better than a 22px grey
                      glyph could. A Korean hint line was tried and failed the same way — 4 of the 5
                      just restated the label ("문서 · 데이터 활용" → "문서 · 데이터 연계"). The English
                      name doesn't: it is a different register, it already exists in the data, and it
                      is this site's house pattern (How We Work's 검증 / PoC & Validation, AIMNIS
                      Features' 고속 위젯 빌더 / Fast Widget Builder). It also earns the tab's height —
                      flex-1 makes each ≈100px to match the 660px card. */}
                  <div className="flex items-baseline gap-3">
                    <span className={`text-[15px] tabular-nums shrink-0 ${isActive ? "text-[#7fecec]/80" : "text-white/40"}`}>
                      {a.no}
                    </span>
                    <span
                      className={`whitespace-nowrap text-[20px] ${
                        isActive ? "text-[#7fecec] font-semibold" : "text-white/80 font-medium"
                      }`}
                    >
                      {a.tab}
                    </span>
                  </div>
                  <p
                    className={`text-[16px] font-normal tracking-[0.04em] mt-1.5 pl-[30px] ${
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
            className="group relative overflow-hidden rounded-[30px] border border-[#00cccc] bg-[rgba(10,18,30,0.5)] backdrop-blur-[10px] shadow-[0_0_40px_-6px_rgba(0,204,204,0.4)] min-h-[660px]"
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
            <div className="relative z-10 flex flex-col justify-center lg:h-[660px] lg:max-w-[52%] px-8 py-12 lg:pl-[64px] lg:pr-6 lg:py-0">
              {/* The tab beside this card already reads "01 환경 운영", so the card repeats neither
                  the number nor the Korean name — the description takes the headline slot instead,
                  which makes the card state what the work does rather than restate its label. */}
              <p className="text-[#00cccc] text-[15px] font-bold tracking-[0.14em] uppercase">{app.en}</p>
              <h3 className="whitespace-pre-line text-white text-[26px] md:text-[32px] font-bold leading-[1.45] mt-4 break-keep">
                {app.desc}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-9 max-w-[560px]">
                {app.features.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-center gap-2.5 rounded-xl border border-[#00cccc]/25 bg-[#00cccc]/[0.04] px-4 h-[54px] transition-colors group-hover:border-[#00cccc]/40"
                  >
                    <f.icon className="w-[20px] h-[20px] text-[#22e0e0] shrink-0" strokeWidth={1.6} />
                    <span className="text-white/85 text-[14px] font-medium leading-tight">{f.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-9">
                <Link to="/solution" className="inline-flex items-center gap-2.5 text-[#22e0e0] text-[15px] font-semibold hover:gap-4 transition-all">
                  관련 솔루션 보기
                  <ArrowRight className="w-[18px] h-[18px]" strokeWidth={1.8} />
                </Link>
                <span className="h-[34px] px-4 rounded-full border border-[#00cccc]/40 text-white/85 text-[14px] flex items-center whitespace-nowrap">
                  {app.solution}
                </span>
              </div>
            </div>

            {/* phones: stacked under the text, unmasked — a mask tuned for the desktop bleed reads
                as damage at this size */}
            <img src={asset(app.img)} alt="" aria-hidden className="lg:hidden w-full h-auto select-none px-4 pb-6" />
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
          fill="#00f5ff"
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
      <circle cx="296" cy="62" r="25" fill="#052a2c" stroke="#00f5ff" strokeWidth="2" />
      <path d="M285 62 L293 70 L308 54" fill="none" stroke="#5ff5f5" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </motion.g>
    <motion.circle
      cx="296"
      cy="62"
      r="25"
      fill="none"
      stroke="#00f5ff"
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

const SCENES = [SceneVerify, SceneBuild, SceneScale];

const HowWeWork = () => (
  <section className="relative overflow-hidden py-28 bg-[#020617]">
    <div
      className="pointer-events-none absolute -left-[520px] top-[-4%] h-[1000px] w-[1120px] rounded-[50%]"
      style={{ background: "radial-gradient(closest-side, rgba(0,210,210,0.24), rgba(0,210,210,0) 72%)" }}
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
              <span className="h-7 px-3 rounded-full bg-[#00cccc] text-[#00121a] text-[13px] font-extrabold tracking-wide flex items-center shadow-[0_0_16px_rgba(0,204,204,0.5)] mt-5">
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
  <section className="relative overflow-hidden py-28 bg-[#020617]">
    <div
      className="pointer-events-none absolute -right-[440px] top-[-8%] h-[1200px] w-[940px] rounded-[50%]"
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
              className="group relative block h-[290px] rounded-[14px] overflow-hidden border border-white/10 bg-[#0a1420] hover:border-[#00cccc]/45 transition-colors"
            >
              <img
                src={asset(r.img)}
                alt=""
                aria-hidden
                className="absolute right-0 inset-y-0 h-full w-[62%] object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
              />
              {/* text column reads over a solid-to-transparent wash, matching the mockup's split */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a1420] from-40% via-[#0a1420]/80 to-transparent" />

              <div className="relative h-full w-[62%] p-7 flex flex-col justify-between">
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
                  <p className="whitespace-pre-line text-white/65 text-[18px] leading-[1.7] mt-5 break-keep">{r.desc}</p>
                </div>
                <span className="inline-flex items-center gap-2 text-[#22e0e0] text-[16px] font-semibold group-hover:gap-3.5 transition-all">
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
// #00cccc/25 border, inner py-[68px], h2 26/42px, body 15/18px mt-3, buttons mt-7 at 54×232.
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
  <section className="py-20 bg-[#020617]">
    <div className="container-custom">
      <div className="relative w-full mx-auto rounded-[20px] overflow-hidden border border-[#00cccc]/25 bg-[#04090f]">
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
            <span className="text-[#00cccc]">맞춤형 AI 사업</span>
          </h2>
          <p className="text-white/70 text-[15px] md:text-[18px] leading-[1.6] mt-3 break-keep">
            산업 현장과 업무 과제에 맞는<br />
            시스템과 플랫폼 구축 방향을 함께 찾습니다.
          </p>

          <div className="flex flex-wrap gap-5 justify-center mt-7">
            <button
              className="h-[54px] w-[232px] rounded-[8px] text-[#000028] text-[18px] font-bold hover:shadow-[0_0_30px_rgba(0,230,219,0.5)] transition-all"
              style={{ background: "linear-gradient(90deg, #00feb9 0%, #00e6db 100%)" }}
            >
              프로젝트 문의
            </button>
            <button className="h-[54px] w-[232px] rounded-[8px] border border-[#00cccc] bg-white/20 text-white text-[18px] font-bold hover:bg-white/30 transition-all">
              회사소개서 다운로드
            </button>
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
      <HowWeWork />
      <RelatedSolutions />
      <CTA />
    </div>
  );
}
