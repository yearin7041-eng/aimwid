import { motion } from "motion/react";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Clock,
  Wallet,
  BarChart3,
  ShieldCheck,
  Quote,
  ChevronDown,
  Blocks,
  SwatchBook,
  BadgeCheck,
} from "lucide-react";
import { SectionHeading, boxGrad, MiniChart } from "./AimGuard";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

// Shared CTA button pair (도입 상담 신청 / 소개서 다운로드)
const ActionButtons = () => (
  <div className="flex flex-wrap gap-5">
    <button
      className="h-[54px] w-[232px] rounded-[8px] text-[#000028] text-[18px] font-bold hover:shadow-[0_0_30px_rgba(0,230,219,0.5)] transition-all"
      style={{ background: "linear-gradient(90deg, #00feb9 0%, #00e6db 100%)" }}
    >
      도입 상담 신청
    </button>
    <button className="h-[54px] w-[232px] rounded-[8px] border border-[#00cccc] bg-white/20 text-white text-[18px] font-bold hover:bg-white/30 transition-all">
      소개서 다운로드
    </button>
  </div>
);

// --- 1. Hero ---
const Hero = () => (
  <section className="relative min-h-[900px] overflow-hidden bg-[#040813]">
    {/* Ecosystem loop video — placed in the right area (not full-bleed). The clip's rings bleed off
        its edges, so each edge fades into the hero background to hide the crop. Poster = still image
        until the video loads. */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[62%] aspect-video">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={asset("aimnis_hero.png")}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={asset("aimnis_hero.mp4")} type="video/mp4" />
        </video>
        {/* fade the ring crop on each edge of the clip */}
        <div className="absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-[#040813] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-[#040813] to-transparent" />
        <div className="absolute inset-y-0 left-0 w-[26%] bg-gradient-to-r from-[#040813] to-transparent" />
      </div>

      {/* left → right darkening so the headline stays readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#040813] from-20% via-[#040813]/45 via-40% to-transparent to-56%" />
    </div>

    {/* Header → hero color bridge */}
    <div className="absolute top-0 inset-x-0 h-[200px] bg-gradient-to-b from-[#020617] via-[#020617]/70 to-transparent pointer-events-none z-[1]" />

    <div className="container-custom relative z-10 pt-[141px]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-[714px] flex flex-col gap-[74px]"
      >
        <div className="flex flex-col gap-7">
          <p className="text-[#00cccc] text-[18px] font-bold leading-[1.4]">데이터 연동부터 통합관제까지,</p>
          <h1 className="text-[40px] md:text-[64px] font-bold text-white leading-[1.2]">
            엔터프라이즈를 위한 <br /> 
            단 하나의 화이트 라벨 <br /> AI 빌더
          </h1>
          <p className="text-white text-[18px] font-normal leading-[1.5]">
            6개월이 걸리던 복잡한 프로젝트를 단 2개월 만에.<br />
            AI 에이전트와 함께 코딩 없이 조립하고,<br />
            완벽한 자사 브랜드 플랫폼으로 커스터마이징 하십시오.
          </p>
        </div>
        <ActionButtons />
      </motion.div>
    </div>
  </section>
);

// --- 2. Problem (SI comparison) ---
// Detailed metal/slate emblems (legacy = muted, negative tone)

const HourglassEmblem = () => (
  <svg viewBox="0 0 120 134" className="w-[104px] h-auto" fill="none" role="img" aria-label="구축 기간이 길다">
    <defs>
      <radialGradient id="hg-glow" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stopColor="#8a949e" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#8a949e" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="hg-frame" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8b95a0" />
        <stop offset="100%" stopColor="#454c55" />
      </linearGradient>
      <linearGradient id="hg-glass" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#cfd6dd" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#8a949e" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="hg-sand" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#a6afb8" />
        <stop offset="100%" stopColor="#6f7883" />
      </linearGradient>
    </defs>
    <ellipse cx="60" cy="67" rx="52" ry="54" fill="url(#hg-glow)" />
    <rect x="30" y="24" width="4" height="86" rx="2" fill="#5a626c" />
    <rect x="86" y="24" width="4" height="86" rx="2" fill="#5a626c" />
    <path d="M37 27 H83 L60 66 Z" fill="url(#hg-glass)" stroke="#aeb6bf" strokeOpacity="0.5" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M60 68 L83 107 H37 Z" fill="url(#hg-glass)" stroke="#aeb6bf" strokeOpacity="0.5" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M46 46 H74 L60 66 Z" fill="url(#hg-sand)" />
    <path d="M43 107 Q60 83 77 107 Z" fill="url(#hg-sand)" />
    <rect x="59" y="60" width="2" height="36" rx="1" fill="#8b939d" />
    <rect x="26" y="16" width="68" height="11" rx="4" fill="url(#hg-frame)" />
    <rect x="26" y="107" width="68" height="11" rx="4" fill="url(#hg-frame)" />
    <path d="M45 31 L53 31 L51 41" stroke="#e9eef2" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Gear = ({ cx, cy, R, teeth, tw }: { cx: number; cy: number; R: number; teeth: number; tw: number }) => {
  const r = R - 9;
  return (
    <g>
      {Array.from({ length: teeth }).map((_, i) => (
        <rect
          key={i}
          x={cx - tw / 2}
          y={cy - R - 2}
          width={tw}
          height={16}
          rx={2.5}
          transform={`rotate(${(360 / teeth) * i} ${cx} ${cy})`}
          fill="url(#mt-metal)"
        />
      ))}
      <circle cx={cx} cy={cy} r={r} fill="url(#mt-metal)" stroke="#aeb6bf" strokeOpacity="0.3" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r - 8} fill="url(#mt-dark)" />
      <circle cx={cx} cy={cy} r={R * 0.3} fill="url(#mt-metal)" />
      <circle cx={cx} cy={cy} r={R * 0.15} fill="#23272d" />
    </g>
  );
};

const MaintenanceEmblem = () => (
  <svg viewBox="0 0 120 134" className="w-[108px] h-auto" fill="none" role="img" aria-label="유지보수 비용이 반복된다">
    <defs>
      <radialGradient id="mt-glow" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stopColor="#8a949e" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#8a949e" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="mt-metal" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8b95a0" />
        <stop offset="100%" stopColor="#464d56" />
      </linearGradient>
      <linearGradient id="mt-dark" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3b414a" />
        <stop offset="100%" stopColor="#262b31" />
      </linearGradient>
    </defs>
    <ellipse cx="60" cy="66" rx="54" ry="54" fill="url(#mt-glow)" />
    <Gear cx="90" cy="44" R="22" teeth={7} tw={7} />
    <Gear cx="52" cy="72" R="40" teeth={9} tw={11} />
  </svg>
);

const LockEmblem = () => (
  <svg viewBox="0 0 120 134" className="w-[102px] h-auto" fill="none" role="img" aria-label="폐쇄망과 보안 제약">
    <defs>
      <radialGradient id="lk-glow" cx="50%" cy="52%" r="55%">
        <stop offset="0%" stopColor="#8a949e" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#8a949e" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="lk-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8b95a0" />
        <stop offset="100%" stopColor="#434a53" />
      </linearGradient>
      <linearGradient id="lk-shackle" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#697079" />
        <stop offset="50%" stopColor="#aab2bb" />
        <stop offset="100%" stopColor="#697079" />
      </linearGradient>
    </defs>
    <ellipse cx="60" cy="72" rx="50" ry="52" fill="url(#lk-glow)" />
    <path d="M42 68 V50 A18 18 0 0 1 78 50 V68" fill="none" stroke="url(#lk-shackle)" strokeWidth="10" strokeLinecap="round" />
    <rect x="30" y="60" width="60" height="56" rx="13" fill="url(#lk-body)" />
    <rect x="30" y="60" width="60" height="56" rx="13" fill="none" stroke="#aeb6bf" strokeOpacity="0.4" strokeWidth="1.5" />
    <rect x="38" y="69" width="44" height="38" rx="9" fill="#000000" fillOpacity="0.18" />
    <circle cx="60" cy="83" r="7" fill="#23272d" />
    <path d="M60 84 L56 101 H64 Z" fill="#23272d" />
    <circle cx="37" cy="67" r="2" fill="#5a626c" />
    <circle cx="83" cy="67" r="2" fill="#5a626c" />
    <circle cx="37" cy="109" r="2" fill="#5a626c" />
    <circle cx="83" cy="109" r="2" fill="#5a626c" />
    <rect x="35" y="64" width="7" height="48" rx="3.5" fill="#e9eef2" fillOpacity="0.12" />
  </svg>
);

const legacyCards = [
  {
    label: "Legacy SI",
    emblem: HourglassEmblem,
    title: "구축 기간이 길다",
    points: ["백지에서 시작하는 고비용 구조", "코드 증가에 따른 유지보수 피로도", "단일 이벤트 처리 및 제한된 확장성"],
  },
  {
    label: "Framework SI",
    emblem: MaintenanceEmblem,
    title: "유지보수 비용이 반복된다",
    points: ["특정 프레임워크 종속으로 인한 유연성 저하", "업데이트 및 마이그레이션 비용 발생", "파편화된 구조로 통합 관리 한계"],
  },
  {
    label: "Generic Builder",
    emblem: LockEmblem,
    title: <>공공·산업 환경은<br />폐쇄망과 보안 제약이 크다</>,
    points: ["퍼블릭 클라우드 의존에 따른 보안 취약성", "내부 레거시 시스템 연동 한계", "규제 준수 및 맞춤형 로직 반영의 어려움"],
  },
];

const aimnisPoints = [
  { k: "구축속도", v: "AI 에이전트로 80% 생산성 향상" },
  { k: "아키텍처", v: "초고속 스트리밍 및 폐쇄망 지원" },
  { k: "통합관리", v: "산업 모듈 제어 마스터 SaaS" },
  { k: "신뢰성", v: "100% 검증 및 감사가 가능한 AI 제어" },
];

// "검증된 AI 마스터 플랫폼" emblem — verified shield with orbit glow
const AimnisEmblem = () => (
  <svg viewBox="0 0 140 152" className="w-[124px] h-auto" fill="none" role="img" aria-label="검증된 AI 마스터 플랫폼">
    <defs>
      <radialGradient id="ani-glow" cx="50%" cy="46%" r="58%">
        <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.5" />
        <stop offset="55%" stopColor="#00cccc" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#00cccc" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="ani-shield" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1fd8d8" />
        <stop offset="100%" stopColor="#0a7f8c" />
      </linearGradient>
    </defs>

    {/* glow */}
    <ellipse cx="70" cy="70" rx="68" ry="62" fill="url(#ani-glow)" />

    {/* orbit ring */}
    <g className="animate-[spin_16s_linear_infinite]" style={{ transformOrigin: "70px 72px" }}>
      <ellipse cx="70" cy="72" rx="60" ry="30" stroke="#00e5e5" strokeOpacity="0.4" strokeWidth="1.2" strokeDasharray="2 9" />
      <circle cx="10" cy="72" r="2.5" fill="#00e5e5" />
      <circle cx="130" cy="72" r="2.5" fill="#00e5e5" />
    </g>

    {/* shield */}
    <path
      d="M70 20 L110 37 V74 C110 101 93 120 70 130 C47 120 30 101 30 74 V37 Z"
      fill="url(#ani-shield)"
      stroke="#00f5ff"
      strokeWidth="2"
    />
    <path
      d="M70 29 L101 42 V74 C101 97 87 113 70 121 C53 113 39 97 39 74 V42 Z"
      fill="#062227"
      fillOpacity="0.55"
    />
    {/* check */}
    <path d="M55 74 l11 12 l20 -25" stroke="#00f5ff" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Problem = () => (
  <section className="py-24 bg-[#020617]">
    <div className="container-custom">
      <SectionHeading
        label="Problem"
        title={<>과거의 SI를 버리다<br />완벽한 AI 빌더의 시작</>}
        subtitle="코딩 없는 조립으로 현장에 최적화된 솔루션을 완성하십시오"
        align="center"
        className="mb-16"
      />

      <div className="flex flex-wrap justify-center gap-10 items-stretch">
        {legacyCards.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="w-[350px] max-w-full shrink-0 rounded-2xl bg-[rgba(32,37,41,0.5)] border border-white/5 overflow-hidden flex flex-col"
          >
            <div className="h-[60px] bg-[#33363d] flex items-center justify-center">
              <span className="text-[#8a949e] font-bold text-[20px]">{c.label}</span>
            </div>
            <div className="px-6 pt-8 pb-7 flex flex-col items-center text-center flex-1">
              <h3 className="text-white font-bold text-[20px] leading-[1.4] min-h-[56px] flex items-center justify-center">{c.title}</h3>
              <div className="my-7 flex justify-center">
                <c.emblem />
              </div>
              <div className="text-[#c2c4c8] text-[16px] leading-[1.7] text-left mt-auto space-y-1">
                {c.points.map((p, j) => (
                  <p key={j}>✓ {p}</p>
                ))}
              </div>
            </div>
          </motion.div>
        ))}

        {/* AIMNIS (highlighted) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.24, duration: 0.5 }}
          className="flex-1 min-w-[350px] rounded-2xl bg-[#103d48] border-2 border-[#00cccc] overflow-hidden flex flex-col shadow-[0_0_40px_rgba(0,204,204,0.25)]"
        >
          <div className="h-[60px] bg-[#00cccc] flex items-center justify-center">
            <span className="text-[#000028] font-bold text-[22px]">AIMNIS</span>
          </div>
          <div className="px-6 pt-8 pb-7 flex flex-col flex-1">
            <h3 className="text-[#00cccc] font-bold text-[20px] text-center leading-[1.4]">검증된 AI 마스터 플랫폼</h3>
            <div className="flex justify-center my-8">
              <AimnisEmblem />
            </div>
            <div className="text-white text-[16px] leading-[1.9] text-left mt-auto space-y-1">
              {aimnisPoints.map((p, j) => (
                <p key={j}>
                  <span className="text-[#00cccc] font-bold">✓ {p.k} :</span> {p.v}
                </p>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

// --- 3. Features ---
const featureValues = [
  {
    img: "aimnis_feat_1.png",
    title: "고속 위젯 빌더",
    en: "Fast Widget Builder",
    desc: "코딩 없는 직관적인 조립",
    metricLabel: "구축 속도",
    metricValue: "3배",
    metricSuffix: "향상",
  },
  {
    img: "aimnis_feat_2.png",
    title: "완벽한 브랜드 통제",
    en: "Headless SDK",
    desc: <>자사 브랜드 플랫폼으로<br />100% 커스터마이징</>,
    metricLabel: "디자인 유연성",
    metricValue: "100%",
    metricSuffix: "",
  },
  {
    img: "aimnis_feat_3.png",
    title: "지능형 검증 공정",
    en: "AI-SDLC",
    desc: "AI 기반 품질/보안 검증",
    metricLabel: "버그 발생률",
    metricValue: "70%",
    metricSuffix: "감소",
  },
];

const Features = () => (
  <section className="py-24 bg-[#020617]">
    <div className="container-custom">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <SectionHeading
          label="Features"
          title="AI 에이전트를 통한 에임니스 전용 위젯 빌더"
          subtitle="AIMNIS는 코딩 없는 직관적인 조립으로 현장에 최적화된 솔루션을 빠르게 완성합니다."
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="rounded-[30px] border border-[#00cccc]/45 bg-[rgba(10,18,30,0.55)] backdrop-blur-[10px] shadow-[0_0_60px_-12px_rgba(0,204,204,0.4)] px-6 py-12 md:px-14 md:py-14"
      >
        {/* 3 core values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {featureValues.map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center px-2">
              <div
                className="w-[85%] aspect-[7/6] overflow-hidden"
                style={{
                  maskImage:
                    "linear-gradient(to right, transparent, #000 9%, #000 91%, transparent), linear-gradient(to bottom, transparent, #000 9%, #000 91%, transparent)",
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent, #000 9%, #000 91%, transparent), linear-gradient(to bottom, transparent, #000 9%, #000 91%, transparent)",
                  maskComposite: "intersect",
                  WebkitMaskComposite: "source-in",
                }}
              >
                <img src={asset(f.img)} alt={f.title} className="w-full h-full object-cover" />
              </div>
              <h4 className="text-white font-bold text-[22px] mt-6">{f.title}</h4>
              <p className="text-[#22e0e0] text-[15px] font-semibold mt-2">{f.en}</p>
              <p className="text-white/80 text-[16px] mt-4 leading-relaxed">{f.desc}</p>
              <div className="mt-auto pt-7 flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#00cccc]/15 border border-[#00cccc]/40 px-5 py-2.5">
                  <span className="text-white/90 text-[14px]">{f.metricLabel}</span>
                  <span className="text-[#22e0e0] text-[18px] font-bold leading-none">{f.metricValue}</span>
                  {f.metricSuffix && <span className="text-white/90 text-[14px]">{f.metricSuffix}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// --- 4. AIMNIS brand banner ---
const bannerFeatures = [
  { icon: Blocks, title: "코딩 없는 조립", desc: <>AI 에이전트와 규격화된 위젯으로<br />구축 속도 3배 향상</> },
  { icon: SwatchBook, title: "완벽한 화이트 라벨링", desc: <>기술은 공유하되 디자인 주권은<br />100% 고객에게 드립니다.</> },
  { icon: ShieldCheck, title: "멀티 테넌트 보안", desc: <>고객사별 데이터 격리와<br />폐쇄망 환경까지 지원합니다.</> },
  { icon: BadgeCheck, title: "검증 가능한 AI", desc: <>100% 검증·감사가 가능한<br />신뢰성 있는 AI 제어</> },
];

const Banner = () => (
  <section className="relative min-h-[800px] overflow-hidden bg-[#020617]">
    <img src={asset("aimnis_banner_bg.png")} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
    <div className="absolute inset-0 bg-[#020617]/50" />

    <div className="relative z-10 flex flex-col min-h-[800px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container-custom w-full pt-14"
      >
        <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-12">
          <div className="lg:w-[300px] shrink-0 flex flex-col gap-2">
            <Quote className="w-6 h-6 text-[#00cccc] fill-[#00cccc]" />
            <p className="text-white/85 text-[18px] leading-[1.6] break-keep">
              코딩 없는 조립과 완벽한 화이트 라벨링으로 복잡한 SI를 단 2개월 만에 자사 플랫폼으로 완성했습니다.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 flex-1">
            {bannerFeatures.map((f, i) => (
              <div key={i} className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0">
                    <f.icon className="w-5 h-5 text-[#00cccc]" strokeWidth={1.7} />
                  </div>
                  <span className="text-white font-bold text-[16px]">{f.title}</span>
                </div>
                <p className="text-white/55 text-[14px] leading-[1.6]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex items-center justify-center px-6 pb-16"
      >
        <img src={asset("aimnis_logo.png")} alt="AIMNIS" className="w-[476px] max-w-[80vw] h-auto" />
      </motion.div>
    </div>
  </section>
);

// --- 5. Solutions ---
const Solutions = () => (
  <section className="py-24 bg-[#050914]">
    <div className="container-custom">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <SectionHeading
          label="Solutions"
          title="멀티 테넌트 보안과 엔터프라이즈 통합으로 완성하는 자사 브랜드 플랫폼"
          subtitle={<span className="whitespace-nowrap">복잡한 SI 프로젝트를 2개월 만에, 코딩 없이 조립하고, 완벽한 자사 브랜드 플랫폼으로 커스터마이징 하십시오.</span>}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="grid grid-cols-1 lg:grid-cols-[2.6fr_1fr] gap-5 items-stretch"
      >
        <img src={asset("aimnis_sol1.png")} alt="통합 관제 대시보드" className="w-full h-full object-cover rounded-xl border border-[#535353]" />
        <div className="flex flex-col gap-5">
          <img src={asset("aimnis_sol3.png")} alt="솔루션" className="w-full h-full object-cover rounded-xl border border-[#535353]" />
          <img src={asset("aimnis_sol2.png")} alt="솔루션" className="w-full h-full object-cover rounded-xl border border-[#535353]" />
        </div>
      </motion.div>
    </div>
  </section>
);

// --- 6. Architecture (4-Tier ecosystem) ---
// 4대 핵심 기술력을 각 Tier의 설명으로 흡수한 단일 계층 스택
const tiers = [
  {
    no: "Tier 1",
    en: "Presentation Layer",
    ko: "브랜드에 녹아드는 노코드 UI",
    tech: "Headless UI & White-Labeling",
    items: ["Workspace", "Widget Pool", "Headless SDK"],
  },
  {
    no: "Tier 2",
    en: "Integration Layer",
    ko: "표준 API로 잇는 엔터프라이즈 연동",
    tech: "Enterprise API & BFF",
    items: ["API Gateway", "BFF", "BI Instances"],
  },
  {
    no: "Tier 3",
    en: "Core Engine Layer",
    ko: "완전 격리형 멀티테넌트 코어",
    tech: "Multi-Tenant SaaS Core",
    items: ["Tenant Mgmt", "Business Logic", "Security"],
  },
  {
    no: "Tier 4",
    en: "AI & Data Pipeline",
    ko: "실시간 AI·데이터 파이프라인",
    tech: "AI-SDLC & Pipeline",
    items: ["Edge AI", "AI Model Store", "Sensor / CCTV"],
  },
];

// Per-tier surface graphic — content-matched, animates when its layer is active
const TierGraphic = ({ i, lifted }: { i: number; lifted: boolean }) => {
  const S = lifted ? "#00f5ff" : "#94a3b8";
  const svgProps = {
    viewBox: "0 0 260 260",
    className: "absolute inset-0 w-full h-full transition-opacity duration-300",
    style: { opacity: lifted ? 0.95 : 0.4 },
  };
  const pulse = lifted ? { opacity: [0.35, 1, 0.35] } : undefined;
  const pulseT = { duration: 1.6, repeat: Infinity, ease: "easeInOut" as const };

  // Tier 1 — 화면/UI: 브라우저 창 대시보드
  if (i === 0) {
    return (
      <svg {...svgProps}>
        <g stroke={S} strokeWidth="2" fill="none">
          <rect x="52" y="56" width="156" height="148" rx="12" />
          <line x1="52" y1="82" x2="208" y2="82" />
        </g>
        {/* traffic dots + address bar */}
        <g fill={S}>
          <circle cx="66" cy="69" r="3" />
          <circle cx="78" cy="69" r="3" />
          <circle cx="90" cy="69" r="3" />
        </g>
        <rect x="106" y="63" width="92" height="12" rx="6" stroke={S} strokeWidth="1.3" fill={S} fillOpacity="0.06" />
        {/* sidebar + nav items */}
        <rect x="64" y="94" width="34" height="100" rx="5" stroke={S} strokeWidth="1.4" fill={S} fillOpacity="0.06" />
        <g fill={S}>
          {[104, 122, 140, 158].map((y) => (
            <g key={y}>
              <circle cx="72" cy={y} r="2.4" fillOpacity="0.85" />
              <rect x="79" y={y - 2} width="13" height="4" rx="2" fillOpacity="0.55" />
            </g>
          ))}
        </g>
        {/* stat card 1 — donut */}
        <rect x="106" y="92" width="44" height="36" rx="5" stroke={S} strokeWidth="1.3" fill="none" />
        <circle cx="120" cy="110" r="8" fill="none" stroke={S} strokeWidth="2.6" strokeDasharray="34 16" />
        <rect x="133" y="105" width="12" height="3" rx="1.5" fill={S} fillOpacity="0.6" />
        <rect x="133" y="113" width="8" height="3" rx="1.5" fill={S} fillOpacity="0.4" />
        {/* stat card 2 — bars */}
        <rect x="154" y="92" width="44" height="36" rx="5" stroke={S} strokeWidth="1.3" fill="none" />
        <g stroke={S} strokeWidth="2.6">
          <line x1="164" y1="120" x2="164" y2="110" />
          <line x1="172" y1="120" x2="172" y2="103" />
          <line x1="180" y1="120" x2="180" y2="112" />
          <line x1="188" y1="120" x2="188" y2="101" />
        </g>
        {/* chart card */}
        <rect x="106" y="134" width="92" height="58" rx="5" stroke={S} strokeWidth="1.3" fill="none" />
        <polyline points="112,178 126,168 138,174 150,156 164,166 178,148 192,158" fill="none" stroke={S} strokeWidth="1.8" />
        <g fill={S}>
          <circle cx="150" cy="156" r="2.2" />
          <circle cx="192" cy="158" r="2.2" />
        </g>
        {/* active highlight */}
        <motion.rect x="106" y="92" width="44" height="36" rx="5" fill={S} fillOpacity="0.12" stroke={S} strokeWidth="1.5" animate={pulse} transition={pulseT} />
      </svg>
    );
  }

  // Tier 2 — 연결: 두 시스템이 체인 링크로 맞물림
  if (i === 1) {
    return (
      <svg {...svgProps}>
        {/* left & right system blocks */}
        <g stroke={S} strokeWidth="1.7" fill={S}>
          <rect x="40" y="100" width="42" height="60" rx="8" fillOpacity="0.07" />
          <rect x="178" y="100" width="42" height="60" rx="8" fillOpacity="0.07" />
        </g>
        <g fill={S} fillOpacity="0.7">
          {[112, 124, 136, 148].map((y) => (
            <rect key={`l${y}`} x="48" y={y} width="26" height="3.4" rx="1.7" />
          ))}
          {[112, 124, 136, 148].map((y) => (
            <rect key={`r${y}`} x="186" y={y} width="26" height="3.4" rx="1.7" />
          ))}
        </g>
        {/* connectors */}
        <g stroke={S} strokeWidth="1.6" strokeOpacity="0.6">
          <line x1="82" y1="130" x2="98" y2="130" />
          <line x1="162" y1="130" x2="178" y2="130" />
        </g>
        {/* central chain link */}
        <g stroke={S} strokeWidth="3.4" fill="none">
          <rect x="96" y="114" width="40" height="32" rx="16" />
          <rect x="124" y="114" width="40" height="32" rx="16" />
        </g>
        {/* flowing packets */}
        <motion.circle cx="90" cy="130" r="3" fill={S} animate={pulse} transition={pulseT} />
        <motion.circle cx="170" cy="130" r="3" fill={S} animate={pulse} transition={{ ...pulseT, delay: 0.7 }} />
        <motion.circle cx="130" cy="130" r="4" fill={S} animate={pulse} transition={{ ...pulseT, delay: 0.35 }} />
      </svg>
    );
  }

  // Tier 3 — 엔진/처리: CPU 칩 (회로 다이 + 핀)
  if (i === 2) {
    const pins = [100, 116, 130, 144, 160];
    return (
      <svg {...svgProps}>
        <g stroke={S} strokeWidth="2.2">
          {pins.map((x, k) => (
            <line key={`t${k}`} x1={x} y1="78" x2={x} y2="90" />
          ))}
          {pins.map((x, k) => (
            <line key={`b${k}`} x1={x} y1="170" x2={x} y2="182" />
          ))}
          {pins.map((y, k) => (
            <line key={`l${k}`} x1="78" y1={y} x2="90" y2={y} />
          ))}
          {pins.map((y, k) => (
            <line key={`r${k}`} x1="170" y1={y} x2="182" y2={y} />
          ))}
        </g>
        {/* chip body */}
        <rect x="90" y="90" width="80" height="80" rx="12" fill={S} fillOpacity="0.07" stroke={S} strokeWidth="2.2" />
        {/* orientation notch */}
        <circle cx="102" cy="102" r="4" fill="none" stroke={S} strokeWidth="1.5" />
        {/* inner die + circuit traces */}
        <rect x="110" y="110" width="40" height="40" rx="5" fill={S} fillOpacity="0.15" stroke={S} strokeWidth="1.7" />
        <g stroke={S} strokeWidth="1.1" strokeOpacity="0.75" fill="none">
          <path d="M130 110 V96 M130 150 V164 M110 130 H96 M150 130 H164" />
          <path d="M118 118 h12 v12 M142 142 h-12 v-12" />
          <circle cx="118" cy="142" r="2.4" fill={S} />
          <circle cx="142" cy="118" r="2.4" fill={S} />
        </g>
        <motion.circle cx="130" cy="130" r="5.5" fill={S} animate={pulse} transition={pulseT} />
      </svg>
    );
  }

  // Tier 4 — AI: 뉴럴 육각칩 (2겹 노드 메시)
  const hex = Array.from({ length: 6 })
    .map((_, k) => {
      const a = ((k * 60 - 90) * Math.PI) / 180;
      return `${(130 + Math.cos(a) * 68).toFixed(1)},${(130 + Math.sin(a) * 68).toFixed(1)}`;
    })
    .join(" ");
  const inner = Array.from({ length: 6 }).map((_, k) => {
    const a = ((k * 60 - 90) * Math.PI) / 180;
    return [130 + Math.cos(a) * 30, 130 + Math.sin(a) * 30];
  });
  const outer = Array.from({ length: 6 }).map((_, k) => {
    const a = ((k * 60 - 60) * Math.PI) / 180;
    return [130 + Math.cos(a) * 56, 130 + Math.sin(a) * 56];
  });
  return (
    <svg {...svgProps}>
      <polygon points={hex} fill={S} fillOpacity="0.05" stroke={S} strokeWidth="2" />
      <g stroke={S} strokeWidth="1.2" strokeOpacity="0.6">
        {inner.map(([x, y], k) => (
          <line key={`ci${k}`} x1="130" y1="130" x2={x} y2={y} />
        ))}
        {inner.map(([x, y], k) => {
          const [nx, ny] = inner[(k + 1) % 6];
          return <line key={`ii${k}`} x1={x} y1={y} x2={nx} y2={ny} />;
        })}
        {outer.map(([x, y], k) => {
          const a = inner[k];
          const b = inner[(k + 1) % 6];
          return (
            <g key={`io${k}`}>
              <line x1={a[0]} y1={a[1]} x2={x} y2={y} />
              <line x1={b[0]} y1={b[1]} x2={x} y2={y} />
            </g>
          );
        })}
      </g>
      <g fill={S} fillOpacity="0.7">
        {outer.map(([x, y], k) => (
          <circle key={`o${k}`} cx={x} cy={y} r="2.8" />
        ))}
      </g>
      {inner.map(([x, y], k) => (
        <motion.circle key={`n${k}`} cx={x} cy={y} r="3.4" fill={S} animate={pulse} transition={{ ...pulseT, delay: k * 0.11 }} />
      ))}
      <circle cx="130" cy="130" r="7" fill={S} />
    </svg>
  );
};

const Architecture = () => {
  const [active, setActive] = useState(0);
  return (
  <section className="py-24 bg-[#020617]">
    <div className="container-custom">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <SectionHeading
          label="Architecture"
          title="확장에 한계가 없는 엔터프라이즈 모듈형 생태계"
          subtitle={<span className="whitespace-nowrap">프론트엔드부터 AI 인프라까지, 4개 계층이 독립적으로 동작하며 필요한 만큼 확장하는 모듈형 아키텍처입니다.</span>}
        />
      </motion.div>

      {/* Unified 4-Tier panel */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mt-14"
      >
        <div className="grid lg:grid-cols-[minmax(0,450px)_1fr] gap-8 lg:gap-12 items-stretch">
          {/* LEFT — label + 3D tower grouped, vertically centered against cards */}
          <div className="flex flex-col items-center justify-center overflow-visible">
            <h3 className="text-[#00cccc] text-[20px] font-bold mb-14 text-center">4-Tier System Architecture</h3>
            <div className="scale-[0.8] sm:scale-95 lg:scale-110 lg:translate-y-[44px]">
              <div
                className="relative flex items-center justify-center"
                style={{ width: 300, height: 380, perspective: "1300px" }}
              >
                <div
                  className="absolute left-1/2 bottom-8 -translate-x-1/2 w-[240px] h-[120px] rounded-full blur-2xl pointer-events-none"
                  style={{ background: "radial-gradient(ellipse, rgba(0,204,204,0.3), transparent 70%)" }}
                />
                <div
                  className="relative"
                  style={{
                    width: 260,
                    height: 260,
                    transformStyle: "preserve-3d",
                    transform: "rotateX(56deg) rotateZ(46deg)",
                  }}
                >
                  {tiers.map((t, i) => {
                    const depth = tiers.length - 1 - i;
                    const lifted = active === i;
                    // active = brand cyan, inactive = neutral slate → contrast rhythm
                    const rgb = lifted ? "0, 245, 255" : "148, 163, 184";
                    // active layer rises to the front so its content-matched graphic is fully visible
                    const z = lifted ? 190 : depth * 54;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.12, duration: 0.6 }}
                        onMouseEnter={() => setActive(i)}
                        className="absolute inset-0 rounded-[24px] border cursor-pointer transition-[transform,box-shadow,border-color] duration-300"
                        style={{
                          transform: `translateZ(${z}px)`,
                          borderColor: lifted ? "rgba(0,245,255,0.9)" : "rgba(148,163,184,0.28)",
                          background: `linear-gradient(135deg, rgba(${rgb}, ${lifted ? 0.2 : 0.09}), rgba(4,13,25,0.64))`,
                          boxShadow: lifted
                            ? "0 0 60px -4px rgba(0,245,255,0.75)"
                            : "0 0 24px -12px rgba(148,163,184,0.35)",
                          backdropFilter: "blur(2px)",
                        }}
                      >
                        {/* surface grid */}
                        <div
                          className="absolute inset-0 rounded-[24px]"
                          style={{
                            backgroundImage: `repeating-linear-gradient(0deg, rgba(${rgb}, 0.09) 0 1px, transparent 1px 24px), repeating-linear-gradient(90deg, rgba(${rgb}, 0.09) 0 1px, transparent 1px 24px)`,
                            maskImage: "radial-gradient(ellipse at center, #000 52%, transparent 92%)",
                            WebkitMaskImage: "radial-gradient(ellipse at center, #000 52%, transparent 92%)",
                          }}
                        />
                        {/* inner frame */}
                        <div className="absolute inset-[10px] rounded-[18px] border" style={{ borderColor: `rgba(${rgb}, 0.15)` }} />
                        {/* stage-based abstract surface graphic */}
                        <TierGraphic i={i} lifted={lifted} />
                        {/* corner accents */}
                        {["left-3 top-3", "right-3 top-3", "left-3 bottom-3", "right-3 bottom-3"].map((pos) => (
                          <div key={pos} className={`absolute ${pos} w-1.5 h-1.5 rounded-full`} style={{ background: `rgba(${rgb}, 0.6)` }} />
                        ))}
                        {/* center core node */}
                        <div
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full"
                          style={{ background: `rgb(${rgb})`, boxShadow: `0 0 18px 6px rgba(${rgb}, ${lifted ? 0.85 : 0.4})` }}
                        />
                        {/* tier number watermark */}
                        <span className="absolute right-5 bottom-3 font-black text-[52px] leading-none select-none" style={{ color: `rgba(${rgb}, 0.2)` }}>
                          {i + 1}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — upright layer details (hover-synced) */}
          <div className="flex flex-col gap-3">
            {tiers.map((t, i) => {
              const lifted = active === i;
              return (
                <div
                  key={i}
                  onMouseEnter={() => setActive(i)}
                  className={`rounded-xl border p-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-5 cursor-pointer transition-colors duration-300 ${
                    lifted ? "border-[#00f5ff]/50 bg-[#00cccc]/[0.06]" : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  {/* number */}
                  <div
                    className={`w-11 h-11 rounded-full border-2 flex items-center justify-center shrink-0 text-[16px] font-bold transition-colors ${
                      lifted
                        ? "border-[#00f5ff] text-[#00f5ff] bg-[#00f5ff]/10"
                        : "border-white/20 text-white/60 bg-white/[0.03]"
                    }`}
                  >
                    {i + 1}
                  </div>

                  {/* identity + value */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[11px] font-bold uppercase tracking-[0.14em] transition-colors ${lifted ? "text-[#00e5ff]" : "text-white/45"}`}>{t.no}</span>
                      <span className="w-1 h-1 rounded-full bg-white/25" />
                      <span className="text-white/40 text-[12px]">{t.en}</span>
                    </div>
                    <p className="text-white font-bold text-[19px] leading-snug">{t.ko}</p>
                    <p className={`text-[13px] font-semibold mt-2 transition-colors ${lifted ? "text-[#22e0e0]" : "text-white/50"}`}>{t.tech}</p>
                  </div>

                  {/* components — freed right area */}
                  <div className="shrink-0 md:w-[290px] md:self-stretch md:border-l md:border-white/10 md:pl-5 flex flex-col justify-center">
                    <p className="text-white/40 text-[11px] font-semibold tracking-[0.1em] uppercase mb-2.5">구성 요소</p>
                    <div className="flex flex-wrap gap-2">
                      {t.items.map((it) => (
                        <span
                          key={it}
                          className={`rounded-md border px-2.5 py-1.5 text-[12.5px] whitespace-nowrap transition-colors ${
                            lifted
                              ? "border-[#00f5ff]/30 bg-[#00f5ff]/[0.07] text-white/90"
                              : "border-white/10 bg-white/[0.05] text-white/70"
                          }`}
                        >
                          {it}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  </section>
  );
};

// --- 7. Impact & Result ---
const stats = [
  { id: "aimnis-time", icon: Clock, label: "구축 시간 절감", value: 72, up: false, unit: "단축", data: [100, 80, 58, 32, 10] },
  { id: "aimnis-cost", icon: Wallet, label: "유지보수 비용", value: 65, up: false, unit: "절감", data: [88, 68, 46, 24, 8] },
  { id: "aimnis-prod", icon: BarChart3, label: "개발 생산성", value: 48, up: true, unit: "향상", data: [12, 32, 58, 80, 100] },
  { id: "aimnis-verify", icon: ShieldCheck, label: "코드 검증률", value: 96, up: true, unit: "달성", data: [48, 66, 86, 92, 100] },
];

const ImpactResult = () => (
  <section className="py-24 bg-[#020617]">
    <div className="container-custom">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <SectionHeading
          label="Impact & Result"
          title="데이터로 증명된 확실한 효과"
          subtitle="복잡한 SI 프로젝트를 2개월 만에, 코딩 없이 조립하고, 완벽한 자사 브랜드 플랫폼으로 완성합니다."
        />
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
        {stats.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className={`rounded-2xl ${boxGrad} border border-white/10 p-6 flex flex-col`}
          >
            {/* icon + metric grouped on the left */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#00cccc]/[0.08] border border-[#00cccc]/25 flex items-center justify-center shrink-0 shadow-[0_0_18px_-6px_rgba(0,204,204,0.6)]">
                <s.icon className="w-[22px] h-[22px] text-[#00cccc]" strokeWidth={1.7} />
              </div>
              <div className="flex flex-col">
                <span className="text-white/70 text-[14px] font-medium">{s.label}</span>
                <div className="flex items-end gap-1.5 mt-2">
                  <span className="text-[40px] font-bold text-brand-cyan leading-none tracking-tight">{s.value}%</span>
                  {s.up ? (
                    <ArrowUp className="w-6 h-6 text-brand-cyan mb-1" strokeWidth={3} />
                  ) : (
                    <ArrowDown className="w-6 h-6 text-brand-cyan mb-1" strokeWidth={3} />
                  )}
                  <span className="text-white/50 text-[13px] mb-1.5">{s.unit}</span>
                </div>
              </div>
            </div>
            <div className="mt-2.5">
              <MiniChart data={s.data} gradId={s.id} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// --- 8. CTA ---
const CTA = () => (
  <section className="py-20 bg-[#020617]">
    <div className="container-custom">
      <div className="relative w-full mx-auto rounded-[20px] overflow-hidden border border-[#00cccc]/25 bg-[#04090f]">
        <img
          src={asset("aimnis_cta_graphic.png")}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-90 pointer-events-none select-none"
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
            <span className="text-white">현장에 최적화된 에임니스, </span>
            <span className="text-[#00cccc]">지금 바로 시작하세요</span>
          </h2>
          <p className="text-white/70 text-[15px] md:text-[18px] mt-3">
            전문가와 상담하고 에임니스를 직접 경험해 보세요.
          </p>
          <div className="mt-7">
            <ActionButtons />
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default function AimNis() {
  return (
    <div className="pt-[80px] min-h-screen text-white bg-[#020617] font-sans overflow-hidden">
      <Hero />
      <Problem />
      <Features />
      <Banner />
      <Solutions />
      <Architecture />
      <ImpactResult />
      <CTA />
    </div>
  );
}
