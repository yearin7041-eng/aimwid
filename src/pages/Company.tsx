import { motion, useReducedMotion, useScroll, useTransform, useInView } from "motion/react";
import { useRef } from "react";
import type { ReactNode } from "react";
import Breadcrumb from "../components/Breadcrumb";
import ConstellationField from "./ConstellationField";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

// Heading system, same spec the whole site uses: label 20px #0cc → 16px gap → title Bold 50px
// leading-1.5. Matches BizHeading / CenterHeading / AimGuard's SectionHeading — all four were
// unified on 2026-07-16.
const CoHeading = ({ label, title, align = "left" }: { label: string; title: ReactNode; align?: "left" | "center" }) => (
  <div className={`flex flex-col gap-4 ${align === "center" ? "items-center text-center" : "items-start"}`}>
    <p className="text-[#00cccc] text-[20px] font-normal leading-[1.2]">{label}</p>
    <h2 className="text-[32px] md:text-[50px] font-bold text-white leading-[1.5] break-keep">{title}</h2>
  </div>
);

// --- 1. Hero ---
// Structure only, matching the other pages so the section is in place: min-h-[820px] on #040813 like
// Solution and Business (AIMNIS / AIM GUARD run 900px), h1 40/64px, 18px body, the 96px header bridge,
// and the left→right darkening a visual would sit behind. No eyebrow — all four heroes dropped theirs
// (see the hero-eyebrow memory), so a teal label on this site means "a section starts here".
//
// TWO THINGS ARE PROVISIONAL AND NEED THE CLIENT:
//   1. The copy below is DERIVED from the 소개 section's own text, not supplied. It is a placeholder.
//   2. There is no visual. The other four heroes all carry one (Business/Solution a raster pinned
//      right, AIMNIS a video). The gradients here already assume that shape, so dropping an image in
//      later means adding one <img> — nothing else moves.
const Hero = () => (
  <section className="relative min-h-[820px] overflow-hidden bg-[#040813]">
    <div className="absolute inset-0 pointer-events-none">
      <div
        className="absolute right-[-10%] top-[4%] h-[820px] w-[980px] rounded-[50%]"
        style={{ background: "radial-gradient(closest-side, rgba(0,204,204,0.20), rgba(0,204,204,0) 70%)" }}
      />
      <div
        className="absolute right-[14%] bottom-[-16%] h-[700px] w-[860px] rounded-[50%]"
        style={{ background: "radial-gradient(closest-side, rgba(54,132,247,0.18), rgba(54,132,247,0) 70%)" }}
      />
      {/* Hero visual (Figma 492:259) — the render's white ground was keyed to alpha (it was built on
          white; here it floats on the dark hero). Pinned right, behind the copy; the left→right darkening
          below keeps the text side legible where the two overlap. A bottom mask dissolves the render's
          hard lower edge into the section instead of cutting off square. */}
      <img
        src={asset("company_hero_visual.webp")}
        alt=""
        aria-hidden="true"
        className="absolute right-[-3%] top-1/2 w-[60%] max-w-[1000px] -translate-y-1/2 select-none"
        style={{
          maskImage: "linear-gradient(to bottom, #000 72%, transparent 96%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 72%, transparent 96%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#040813] from-6% via-[#040813]/55 via-[36%] to-transparent to-[62%]" />
      <div className="absolute inset-x-0 bottom-0 h-[180px] bg-gradient-to-b from-transparent to-[#020617]" />
    </div>

    {/* Header → hero color bridge — darkens the navbar strip only */}
    <div className="absolute top-0 inset-x-0 h-[96px] bg-gradient-to-b from-[#020617] via-[#020617]/55 to-transparent pointer-events-none z-[1]" />

    <Breadcrumb />

    {/* pt matches Business */}
    <div className="container-custom relative z-10 pt-[227px] pb-[120px]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-[760px] flex flex-col"
      >
        <p className="text-[#90a1b9] text-[20px] font-bold leading-[1.4] mb-[27px]">에임위드를 움직이는 기술</p>
        <h1 className="text-[40px] md:text-[64px] font-bold text-white leading-[1.2]">
          기술로 앞서가는<br />
          AI 기술 중심 기업
        </h1>
        <p className="text-white text-[18px] font-normal leading-[1.4] mt-6">
          AI 기술과 스마트 모니터링 솔루션으로<br />
          고객의 비즈니스 환경을 더 효율적이고 지능적으로 바꿉니다.
        </p>
      </motion.div>
    </div>
  </section>
);

// --- 2. About ---
// Rebuilt from Figma 507:104 (user, 2026-07-21) — the statement-panel version and the previous client
// copy are BOTH replaced. Centred type over the void again, but no longer floating: two ambient graphics
// flank it (isometric data layers left, particle wave right, both cropped from the 507:104 raster and
// feathered) and give the emptiness a subject. Their corner micro-labels — DATA INTELLIGENCE /
// AI TECHNOLOGY — are baked into the crops, not rebuilt as text, so they can't drift out of place.
// The three paragraphs are the 507:104 copy verbatim; it differs from the older approved 소개 text and
// still leans on 현장 elsewhere on the page — flagged for the client, used as the mock has it.
const ABOUT_BODY = [
  <>에임위드는 AI 기술과 스마트 도시 인프라 솔루션을 결합해<br />현실의 문제를 해결하고 새로운 가치를 만드는 기술 중심 기업입니다.</>,
  <>빅데이터, 엣지 AI, 디지털 트윈, 자동화 기술을 기반으로<br />공공기관과 민간 기업의 디지털 전환을 지원합니다.</>,
  <>신뢰할 수 있는 기술과 지속적인 연구개발로<br />더 안전하고, 더 편리하며, 더 지속 가능한 사회를 구현합니다.</>,
];

// This section owns BOTH page gaps: History has no pt, so About's pb is the About→History gap; Hero has
// no mb, so About's pt is the Hero→About gap. Deliberately unequal — 150 after the hero, 320 before
// History — because the hero already carries its own pb-[120px] inside its container.
const Intro = () => (
  <section className="relative bg-[#020617] pt-[150px] pb-[130px] overflow-hidden">
    {/* Ambient background — a drifting constellation across the whole section (user, 2026-07-21),
        replacing the two literal side-graphics that read as meaningless boxes. It's mood, not a diagram.
        A radial fade over it keeps the centre dark enough for the copy to stay legible. */}
    <ConstellationField className="pointer-events-none absolute inset-0 h-full w-full select-none" />
    <div
      className="pointer-events-none absolute inset-0"
      style={{ background: "radial-gradient(60% 55% at 50% 46%, rgba(2,6,23,0.82) 0%, rgba(2,6,23,0.35) 60%, transparent 100%)" }}
    />

    <div className="container-custom relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex max-w-[820px] flex-col items-center text-center"
      >
        <p className="text-[#00cccc] text-[20px] font-normal leading-[1.2]">About</p>
        <h2 className="mt-6 text-[32px] md:text-[50px] font-bold leading-[1.4] text-white break-keep">
          끊임없는 연구개발로<br />
          기술경쟁력에서 앞서갑니다.
        </h2>
        <div className="mx-auto mt-8 h-px w-[60px] bg-[#00cccc]/60" />
        <div className="mt-10 flex flex-col gap-7">
          {ABOUT_BODY.map((p, i) => (
            <p key={i} className="text-[#9fb0c4] text-[16px] md:text-[18px] font-normal leading-[1.85] break-keep">
              {p}
            </p>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// --- 2.5 성과 지표 (stats band) ---
// New in the 2026-07-21 rhythm rework. A tight horizontal band of big numbers right after About — the
// page was all prose on one flat ground, and this is the texture change: tabular figures between
// hairlines, a different density from everything around it, and the first place the eye can land on
// something concrete. NUMBERS ARE PROVISIONAL, derived from the page's own content (연혁 has ~23 entries
// and 2 [특허]; the partner wall ~10 orgs; 설립 2023) — confirm with the client before shipping.
const STATS = [
  { n: "2023", label: "설립" },
  { n: "20+", label: "수행 프로젝트" },
  { n: "10+", label: "협력 기관" },
  { n: "2", label: "등록 특허" },
];

const StatsBand = () => (
  <section className="relative bg-[#020617] pb-[210px]">
    <div className="container-custom">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto grid max-w-[1120px] grid-cols-2 gap-y-12 border-y border-white/10 bg-white/[0.015] py-14 md:grid-cols-4 md:divide-x md:divide-white/10"
      >
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-2.5 text-center">
            <span className="text-[46px] md:text-[56px] font-bold leading-none text-white tabular-nums">{s.n}</span>
            <span className="text-[15px] md:text-[16px] text-[#9fb0c4]">{s.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

// --- 3. Mission / Vision ---
// RE-PLANNED as an image-card zigzag (user, 2026-07-21), referencing pintel.co.kr's company page but not
// copying it. The rail-connected typographic version clashed with History's rail directly below; the
// earlier abstract diagrams read as meaningless. This resolves both: NO rail (nothing to collide with
// History), and a large evocative IMAGE per pillar instead of a diagram. Each row is a big rounded media
// block beside a big display label ("Mission"/"Vision") + statement + body, alternating sides. Airy, not
// banded — the images carry the visual weight.
//
// IMAGES ARE PLACEHOLDERS. `img` names a file to drop into public/ (company_mission.webp /
// company_vision.webp); until it exists the card shows a branded placeholder. Real imagery (a data/city
// scene for Mission, a global/AI scene for Vision) is what makes this composition work — to be supplied.
const PILLARS = [
  {
    label: "Mission",
    title: (
      <>
        고객의 데이터를<br />
        현장의 실행으로 연결합니다.
      </>
    ),
    body: (
      <>
        정확한 데이터, 현장 중심의 통찰, AI 사이의 연결을 통해<br className="hidden md:block" />
        실질적인 변화를 만듭니다.
      </>
    ),
    img: "company_mission.webp",
    imageLeft: true,
  },
  {
    label: "Vision",
    title: (
      <>
        모든 산업 현장이<br />
        자신에게 맞는 AI를 찾는 세상
      </>
    ),
    body: (
      <>
        누구나 상황에 최적화된 AI를 활용하여 지속 가능한 혁신과<br className="hidden md:block" />
        새로운 가치를 쉽게 만들 수 있도록 합니다.
      </>
    ),
    img: "company_vision.webp",
    imageLeft: false,
  },
];

const MediaCard = ({ label }: { label: string }) => (
  // Placeholder until real imagery is supplied — a branded rounded block, clearly a stand-in.
  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-[#0c2036] to-[#040d18]">
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.4]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,204,204,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,204,204,0.06) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    />
    <img
      src={asset("brand_symbol.webp")}
      alt=""
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 w-[110px] -translate-x-1/2 -translate-y-1/2 select-none opacity-[0.12]"
    />
    <span className="absolute bottom-5 right-6 text-[11px] font-medium tracking-[0.25em] text-white/25">
      {label.toUpperCase()} IMAGE
    </span>
  </div>
);

const MissionVision = () => (
  <section className="relative overflow-hidden bg-[#020617] pt-[150px] pb-[180px]">
    {/* a soft central glow for warmth — no framed band, so the section reads open (pintel is airy) */}
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 h-[900px] w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-[50%]"
      style={{ background: "radial-gradient(closest-side, rgba(0,204,204,0.08), rgba(0,204,204,0) 70%)" }}
    />

    <div className="container-custom relative">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-[120px] lg:gap-[150px]">
        {PILLARS.map((p) => (
          <motion.div
            key={p.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`flex flex-col items-center gap-12 lg:items-center lg:gap-24 ${
              p.imageLeft ? "lg:flex-row" : "lg:flex-row-reverse"
            }`}
          >
            <div className="w-full lg:w-[50%] shrink-0">
              <MediaCard label={p.label} />
            </div>

            <div className={`flex-1 text-center ${p.imageLeft ? "lg:text-left" : "lg:text-right"}`}>
              {/* Label at the site's shared 20px spec (CoHeading / BizHeading …), not the big display
                  word — user, 2026-07-21. Title/body bumped 2px the same day. */}
              <p className="text-[#00cccc] text-[20px] font-normal leading-[1.2]">{p.label}</p>
              <div
                className={`mx-auto mt-6 h-[26px] w-px bg-gradient-to-b from-[#00cccc] to-transparent ${
                  p.imageLeft ? "lg:mx-0" : "lg:ml-auto lg:mr-0"
                }`}
              />
              <p className="mt-7 text-[26px] md:text-[34px] font-bold leading-[1.4] text-white break-keep">{p.title}</p>
              <p className="mt-7 max-w-[560px] text-[18px] font-normal leading-[1.9] text-[#b3b4b9] break-keep lg:max-w-none">
                {p.body}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// --- 4. 연혁 ---
// Verbatim from the client's 성장 slide, 2026-07-16. NOTE this section names clients and projects
// outright (한국서부발전, 한전KDN, 부산시, KETI …), which the client had ruled out for the Business
// page — "areas only" there. Company is treated as the exception, since a 연혁 cannot exist without
// them, but that is an assumption worth re-confirming.
//
// Order runs newest-first, left to right, exactly as the slide does. `patent` marks the two entries
// the slide badges as [특허]; it stays brand-cyan rather than the slide's gold, because the site has
// exactly one non-teal accent so far (Business card 05's hazard red) and it is unconfirmed.
type Milestone = { year: string; items: { text: string; patent?: boolean }[] };

const milestones: Milestone[] = [
  {
    year: "2026",
    items: [
      { text: "한국전력연구원 가스복합발전 운영 최적화 솔루션 고도화 사업" },
      { text: "한양대[에리카] EmerGREEN SW 개발 사업" },
      { text: "OPC UA 규격 적합성 검증 장치, 방법 및 이를 이용한 프로그램", patent: true },
      { text: "광명시 스마트시티 데이터플랫폼 개발 사업" },
      { text: "부여군 스마트 빌리지 사업" },
      { text: "화성시 맞춤형 대장관리시스템 유지보수 사업" },
    ],
  },
  {
    year: "2025",
    items: [
      { text: "인공지능 기반 발전데이터 통합관리 및 예측유지보수 시스템", patent: true },
      { text: "부여군 스마트 빌리지 통합 연계 구축" },
      { text: "서부발전 동반상생 통합관리 플랫폼 구축" },
      { text: "한전 KDN GPT 위험성평가 플랫폼 POC사업" },
      { text: "부산시 디지털트윈 대국민 포털서비스 구축" },
      { text: "한국전자기술연구원(KETI) AI발전모니터링 시스템 구축" },
      { text: "한국서부발전 발전소 통합환경감지시스템 구축" },
    ],
  },
  {
    year: "2024",
    items: [
      { text: "한국서부발전 발전데이터활용 창업벤처기업 선정" },
      { text: "한국외국어대학교 MOU 체결 (LLM)" },
      { text: "㈜이든TNS 생성형AI사업 파트너사 계약" },
      { text: "한국서부발전 발전데이터 비즈니스 플랫폼 사업" },
      { text: "한국전력연구원 IDPP포털 고도화 사업" },
    ],
  },
  {
    year: "2023",
    items: [
      { text: "김포복합화력(KDN) 데이터연계사업 진행" },
      { text: "한국서부발전 스마트대기환경 관리시스템 구축사업 수주" },
      { text: "한국외국어대학교 중소기업지원사업 선정 (생성형 AI시범사업)" },
      { text: "한국서부발전 발전데이터 활용 창업벤처기업 선정" },
      { text: "㈜에임위드 설립" },
    ],
  },
];

// pb is the History→핵심가치 gap now that a section follows, so it matches the 320px the page uses
// between body sections rather than the 160px it had when it was the last one before the footer.
// One timeline entry. Split out so each node can own its light-up. The observer root is the top ~65% of
// the viewport (bottom margin -35%): `lit` flips true as the node crosses a line a little BELOW centre,
// so it lights a beat before the node reaches the middle (user, 2026-07-21) — reading as the fill's glow
// arriving just ahead of it. It unlights symmetrically on the way back up. NOTE an earlier -50%/-50%
// collapsed the root to a zero-height line; a zero-area root never reports an intersection, so every
// node stayed dark. Reduced-motion keeps every node lit.
const MilestoneRow = ({ m, right }: { m: Milestone; right: boolean }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(nodeRef, { margin: "0px 0px -35% 0px" });
  const lit = reduce || inView;

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.5, delay: 0.05 }}
      className="relative grid md:grid-cols-2 pl-9 md:pl-0 pb-16 md:pb-24 last:pb-0"
    >
      <span
        ref={nodeRef}
        className={`absolute left-[6px] md:left-1/2 top-[10px] -translate-x-1/2 h-[13px] w-[13px] rounded-full border transition-all duration-500 ${
          lit
            ? "bg-[#00f5ff] border-white shadow-[0_0_16px_4px_rgba(0,245,255,0.5)]"
            : "bg-[#0e2731] border-white/30"
        }`}
      />

      <div className={right ? "md:col-start-2 md:pl-14" : "md:col-start-1 md:pr-14"}>
        {/* Year rides the same `lit` as the node: dim until the lamp fires, then white — so the whole
            year block activates together, not just the dot. */}
        <p
          className={`text-[30px] md:text-[48px] font-bold leading-none transition-colors duration-500 ${
            lit ? "text-white" : "text-white/25"
          } ${right ? "" : "md:text-right"}`}
        >
          {m.year}
        </p>

        <ul className={`mt-5 flex flex-col gap-3 ${right ? "" : "md:items-end"}`}>
          {m.items.map((it, k) => (
            <li key={k} className={`flex gap-2.5 text-[15px] md:text-[16px] leading-[1.65] break-keep ${right ? "" : "md:flex-row-reverse"}`}>
              <span className="mt-[9px] h-[3px] w-[3px] shrink-0 rounded-full bg-white/45" />
              <span className={`text-white/75 ${right ? "" : "md:text-right"}`}>
                {it.patent && <span className="text-[#00f5ff] font-semibold">[특허] </span>}
                {it.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

const History = () => {
  // Scroll-driven rail fill (the interaction lifted from the rejected Mission/Vision 안 2). The bright
  // cyan→blue segment grows as the timeline passes the viewport centre, so "how full the line is" reads
  // as "how far through 2023→2026 you've scrolled" — the fill IS the passage of time. offset runs from
  // the block's top reaching centre to its bottom reaching centre. Reduced-motion shows it fully filled.
  const railRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: railRef, offset: ["start center", "end center"] });
  const fillHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="relative bg-[#020617] pt-[150px] pb-[220px] overflow-hidden">
    {/* Faint tech grid — the History chapter gets its own ground so it reads as distinct from the airy
        sections around it (2026-07-21 rhythm rework). Kept very low so the timeline stays the subject. */}
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.5]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,204,204,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(0,204,204,0.045) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }}
    />
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_44%_at_50%_38%,rgba(0,204,204,0.07),transparent_70%)]" />
    <div className="container-custom relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-6"
      >
        <CoHeading label="History" title="AIMWID의 성장" align="center" />
        <p className="max-w-[1000px] text-center text-[#b3b4b9] text-[17px] md:text-[19px] font-normal leading-[1.7] break-keep">
          에임위드는 2023년 설립 이후 빠른 속도로 성장하며 주요 공공기관 및 에너지 기업과의 협력을 확대해 왔습니다.
        </p>
      </motion.div>

      {/* Vertical and alternating. It started as four columns across, which split 23 uneven entries
          (2025 has seven, 2024 five) into a ragged row of narrow measures that wrapped most lines in
          two. Stacking fixed the wrapping but ran everything down one left rail, which read flat and
          left the years crowding each other.
          Zigzag does three jobs at once: it uses the full width instead of leaving a dead right half,
          it gives each year its own side so the eye groups the entries without needing a divider, and
          the side flip is itself the separation the years were missing.

          Left-hand years are right-aligned INCLUDING their bullets (`items-end` + `flex-row-reverse`),
          so both sides read toward the rail. Reversing the row without `items-end` would leave the
          bullets floating at the block's right edge instead of beside their text.

          Below md the whole thing collapses to one left rail — a zigzag at phone width is two
          half-width columns of two-word fragments. */}
      <div ref={railRef} className="relative mx-auto mt-[120px] max-w-[1120px]">
        {/* one rail for the whole run: centred on md+, hard left below it. The dim gradient is the
            unfilled TRACK; the bright motion.div nested inside is the scroll-driven fill. */}
        <div className="absolute top-2 bottom-2 left-[6px] md:left-1/2 md:-translate-x-1/2 w-[2px] bg-gradient-to-b from-[#00cccc]/10 via-[#00cccc]/45 to-[#00cccc]/10">
          <motion.div
            style={{ height: reduce ? "100%" : fillHeight }}
            className="absolute inset-x-0 top-0 origin-top bg-gradient-to-b from-[#00e0e0] via-[#2fa8e8] to-[#3684f7] shadow-[0_0_12px_rgba(79,210,255,0.55)]"
          />
        </div>

        {milestones.map((m, i) => (
          <MilestoneRow key={m.year} m={m} right={i % 2 === 1} />
        ))}
      </div>
    </div>
    </section>
  );
};

// --- 5. 핵심가치 ---
// Figma 492:266, another flat raster. The three icons are DRAWN, not cropped out of it: at 1× the comp
// gives about 150px of icon, and every raster on this project has ended up fighting the same battle —
// crop it, feather it, discover it upscales soft on a HiDPI screen. Vector sidesteps all of that, and
// these three shapes (rings, an isometric cube, a shield) are geometry, not illustration. The user
// explicitly allowed reworking the artwork on 2026-07-20.
//
// The shield's mark is the real brand symbol, cropped straight off logo_horizontal.png and left in its
// own green→blue gradient. Redrawing it by hand would have meant approximating a logo, and recolouring
// it to match the section's cyan would have meant modifying one — the same objection that killed the
// partner-logo tint. It is the one raster here, and being a flat-colour mark it stays crisp.
const ICON = { className: "h-[195px] w-[195px]", viewBox: "0 0 160 160", fill: "none" } as const;

// Ambient motion, not hover: these run on their own, the way Business's SVG graphics do (framer-motion
// with repeat: Infinity). Each movement means something about its value — a scan going out, a structure
// settling, a guard sweeping — rather than being decoration that merely moves. useReducedMotion stops
// all three for anyone who has asked the OS for less motion, matching what index.css does for the
// partner marquee.
const LOOP = { repeat: Infinity, ease: "easeInOut" } as const;

const FieldDrivenIcon = () => {
  const still = useReducedMotion();
  return (
    <svg {...ICON} aria-hidden="true">
      <defs>
        <radialGradient id="fd-core">
          <stop offset="0%" stopColor="#dffbff" />
          <stop offset="35%" stopColor="#4fd2ff" />
          <stop offset="100%" stopColor="#0a7fd0" stopOpacity="0" />
        </radialGradient>
      </defs>
      {[26, 43, 60].map((r, i) => (
        <circle key={r} cx="80" cy="80" r={r} stroke="#2f9fd8" strokeOpacity={0.55 - i * 0.13} />
      ))}
      {/* Pings leaving the centre — the section says "고객의 현장에서 시작합니다", so the motion starts
          at the core and travels out, never the other way round. Two, half a cycle apart. */}
      {!still &&
        [0, 1.6].map((delay) => (
          <motion.circle
            key={delay}
            cx="80"
            cy="80"
            stroke="#7fe2ff"
            fill="none"
            initial={{ r: 8, opacity: 0 }}
            animate={{ r: [8, 62], opacity: [0, 0.5, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeOut", delay, times: [0, 0.25, 1] }}
          />
        ))}
      {/* Ticks sitting on the rings, plus the one lit contact and its bearing line to the centre — the
          detail that makes this read as a scan rather than a bullseye. */}
      {[[80, 20], [126, 63], [46, 118], [113, 122]].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.5" fill="#3ec6f0" fillOpacity="0.75" />
      ))}
      <line x1="80" y1="80" x2="121" y2="42" stroke="#7fe2ff" strokeOpacity="0.5" />
      <motion.circle
        cx="121"
        cy="42"
        fill="#bff0ff"
        animate={still ? { r: 5 } : { r: [4.2, 5.6, 4.2], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 2.4, ...LOOP }}
      />
      <circle cx="80" cy="80" r="26" fill="url(#fd-core)" />
      <motion.circle
        cx="80"
        cy="80"
        fill="#eafcff"
        animate={still ? { r: 6 } : { r: [5.4, 6.8, 5.4] }}
        transition={{ duration: 2.4, ...LOOP }}
      />
    </svg>
  );
};

const CustomBuiltIcon = () => {
  const still = useReducedMotion();
  return (
    <svg {...ICON} aria-hidden="true">
      <defs>
        <linearGradient id="cb-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7fe2ff" />
          <stop offset="100%" stopColor="#0f6fc4" />
        </linearGradient>
        <linearGradient id="cb-face" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2f9fd8" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#0b3f74" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      {/* Ground lines removed (user, 2026-07-21). "더 구조적으로": the plain box is now an engineered
          frame — each visible face is subdivided into a 2×2 panel grid, and every visible vertex carries
          a joint node, so it reads as something built/assembled rather than a solid carton.
          "설계합니다" — it hovers, held and deliberate, rather than drifting or spinning. */}
      <motion.g animate={still ? { y: 0 } : { y: [0, -5, 0] }} transition={{ duration: 5, ...LOOP }}>
        {/* A true 2:1 isometric box: three faces off seven vertices, no perspective */}
        <path d="M80 22 L126 47 L80 72 L34 47 Z" fill="url(#cb-face)" />
        <path d="M34 47 L80 72 L80 124 L34 99 Z" fill="url(#cb-face)" />
        <path d="M126 47 L126 99 L80 124 L80 72 Z" fill="url(#cb-face)" />

        {/* Panel grid — the mid-edge cross on each of the three faces. Faint, so it reads as structure
            under the bright silhouette rather than competing with it. */}
        <g stroke="#6fc7f0" strokeOpacity="0.32" strokeWidth="1">
          {/* top face */}
          <line x1="57" y1="34.5" x2="103" y2="59.5" />
          <line x1="103" y1="34.5" x2="57" y2="59.5" />
          {/* left face */}
          <line x1="34" y1="73" x2="80" y2="98" />
          <line x1="57" y1="59.5" x2="57" y2="111.5" />
          {/* right face */}
          <line x1="126" y1="73" x2="80" y2="98" />
          <line x1="103" y1="59.5" x2="103" y2="111.5" />
        </g>

        {/* Silhouette, then only the THREE edges that meet at the near-top corner. The back edge from
            the far vertex down to that corner is hidden inside a solid box — drawing it turned the cube
            into an open carton. */}
        <path
          d="M80 22 L126 47 L126 99 L80 124 L34 99 L34 47 Z M80 72 L126 47 M80 72 L34 47 M80 72 L80 124"
          stroke="url(#cb-edge)"
          strokeWidth="2"
          strokeLinejoin="round"
        />


        {/* Joint nodes at the seven visible vertices — the detail that makes it an assembled frame */}
        <g fill="#bfeeff">
          {[[80, 22], [126, 47], [34, 47], [80, 72], [126, 99], [34, 99], [80, 124]].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.4" />
          ))}
        </g>
      </motion.g>
    </svg>
  );
};

const OperationalAiIcon = () => {
  const still = useReducedMotion();
  return (
    <svg {...ICON} aria-hidden="true">
      <defs>
        <linearGradient id="oa-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8ee7ff" />
          <stop offset="100%" stopColor="#0d63b8" />
        </linearGradient>
        <linearGradient id="oa-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1d6ea8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#06203f" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="oa-scan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7fe2ff" stopOpacity="0" />
          <stop offset="50%" stopColor="#7fe2ff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#7fe2ff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="oa-clip">
          <path d="M80 16 L134 36 V84 C134 114 110 134 80 146 C50 134 26 114 26 84 V36 Z" />
        </clipPath>
      </defs>
      <path
        d="M80 16 L134 36 V84 C134 114 110 134 80 146 C50 134 26 114 26 84 V36 Z"
        fill="url(#oa-fill)"
        stroke="url(#oa-edge)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M80 28 L123 44 V84 C123 108 103 124 80 134 C57 124 37 108 37 84 V44 Z"
        stroke="#7fe2ff"
        strokeOpacity="0.28"
      />
      {/* A band sweeping down the inside of the shield, clipped to its outline — "현장에서 실제로
          작동하고" is about something running continuously, so this one never rests at a pose. */}
      {!still && (
        <g clipPath="url(#oa-clip)">
          <motion.rect
            x="26"
            width="108"
            height="30"
            fill="url(#oa-scan)"
            animate={{ y: [6, 146] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "linear", repeatDelay: 1.2 }}
          />
        </g>
      )}
      <image href={asset("brand_symbol.webp")} x="50" y="52" width="60" height="60" />
    </svg>
  );
};

const VALUES = [
  {
    Icon: FieldDrivenIcon,
    title: "Field Driven",
    body: (
      <>
        고객의 현장과 과제에서<br />
        시작합니다.
      </>
    ),
  },
  {
    Icon: CustomBuiltIcon,
    title: "Custom Built",
    body: (
      <>
        데이터와 업무 환경에 맞는<br />
        시스템을 설계합니다.
      </>
    ),
  },
  {
    Icon: OperationalAiIcon,
    title: "Operational AI",
    body: (
      <>
        현장에서 실제로 작동하고<br />
        확장되는 AI를 만듭니다.
      </>
    ),
  },
];

// pb-[160px] is the gap to the footer, the value History carried while it was the last section.
const Values = () => (
  <section className="relative bg-[#020617] pb-[160px] overflow-hidden">
    <div className="container-custom relative">
      {/* Label ONLY, no title (user, 2026-07-20). A title was tried and dropped for two reasons: any
          version leaned on the word 현장, which this page already overuses (it is in two of the three
          cards below), and a made-up headline over three self-explaining values added nothing. Letting
          Company diverge from the label+title pattern the other sections share is the point, not a
          compromise — the three names ARE the content. `Core Value` is the client's label. */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-[90px] text-center"
      >
        <p className="text-[#00cccc] text-[20px] font-normal leading-[1.2]">Core Value</p>
      </motion.div>

      {/* Hairline dividers BETWEEN the columns only, as drawn — divide-x gives that without a trailing
          rule on the last column. They are dropped when the columns stack, where a vertical rule
          between stacked blocks would be meaningless. */}
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-16 md:grid-cols-3 md:gap-0 md:divide-x md:divide-white/10">
        {VALUES.map(({ Icon, title, body }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="flex flex-col items-center px-10 text-center"
          >
            {/* A hover version of this existed briefly and was replaced (user, 2026-07-20): the motion
                belongs in the icons themselves, running always, not behind a pointer — these three are
                as much illustration as they are icons, and on touch there is no hover to find it with. */}
            <Icon />
            <h3 className="mt-9 text-[27px] font-bold leading-[1.3] text-white">{title}</h3>
            <p className="mt-5 text-[18px] font-normal leading-[1.8] text-[#b3b4b9] break-keep">{body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// pt-[80px] clears the fixed 80px navbar — without it the hero starts at y=0 and the breadcrumb,
// which sits 60px into the hero, lands underneath the menu. Same wrapper as the other four pages.
const Company = () => (
  <div className="pt-[80px] min-h-screen text-white bg-[#020617] font-sans overflow-hidden">
    <Hero />
    <Intro />
    <StatsBand />
    <MissionVision />
    <History />
    <Values />
  </div>
);

export default Company;
