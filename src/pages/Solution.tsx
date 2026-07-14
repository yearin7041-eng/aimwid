import { motion } from "motion/react";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  Boxes,
  Puzzle,
  TrendingUp,
  CloudDownload,
  Filter,
  BrainCircuit,
  MonitorDot,
  Activity,
  Search,
  ShieldCheck,
  Clock,
  Cloud,
  Droplets,
  Share2,
  ListTree,
  Code2,
  FileText,
  Map,
  BarChart3,
  Leaf,
  Users,
  Monitor,
  AlertTriangle,
  Bell,
} from "lucide-react";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

// Shared CTA button pair (도입 상담 신청 / 소개서 다운로드) — matches AIMNIS/AIMGUARD
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

// Centered label + heading used by the 전환/Framework sections
const CenterHeading = ({ label, title }: { label: string; title: ReactNode }) => (
  <div className="text-center">
    <p className="text-[#00cccc] text-[20px] md:text-[24px] font-normal leading-[1.2]">{label}</p>
    <h2 className="text-[32px] md:text-[48px] font-bold text-white leading-[1.6] mt-3">{title}</h2>
  </div>
);

// --- 1. Hero ---
const Hero = () => (
  <section className="relative min-h-[820px] overflow-hidden bg-[#040813]">
    {/* Industrial AI solution lineup visual (right) — energy plant · smart city · worker safety */}
    <div className="absolute inset-0 pointer-events-none">
      <img
        src={asset("solution_hero_v2.webp")}
        alt="에너지, 스마트시티, 안전 분야의 산업 AI 솔루션 라인업"
        className="absolute right-[-130px] top-1/2 -translate-y-1/2 h-[104%] w-auto max-w-none object-contain"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#040813] from-6% via-[#040813]/40 via-[34%] to-transparent to-[56%]" />
      {/* subtle right-edge safety fade (the main dissolve is baked into the visual's long right fade) */}
      <div className="absolute inset-y-0 right-0 w-[180px] bg-gradient-to-l from-[#040813] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[180px] bg-gradient-to-b from-transparent to-[#020617]" />
    </div>

    {/* Header → hero color bridge — kept short so it only darkens the navbar strip (readability) while the city/plant tops stay fully visible */}
    <div className="absolute top-0 inset-x-0 h-[96px] bg-gradient-to-b from-[#020617] via-[#020617]/55 to-transparent pointer-events-none z-[1]" />

    <div className="container-custom relative z-10 pt-[180px] pb-[120px]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-[760px] flex flex-col gap-7"
      >
        <p className="text-[#00cccc] text-[18px] font-bold leading-[1.4]">Industry AI Solutions</p>
        <h1 className="text-[40px] md:text-[64px] font-bold text-white leading-[1.2]">
          산업 현장에서 검증된<br />
          AI 솔루션 라인업
        </h1>
        <p className="text-white text-[18px] font-normal leading-[1.5]">
          에너지, 스마트시티, 안전·환경 분야의 실제 구축 경험을 바탕으로<br />
          데이터 통합, AI 분석, 예측 유지보수, 통합관제를 하나의 솔루션 구조로 확장합니다.
        </p>
      </motion.div>
    </div>
  </section>
);

// --- 2. Solution nav tabs — a quick-jump menu at the top of the section. Clicking scrolls to the
// matching solution card. Labels map 1:1 to the 6 solutions. ---
const CategoryTabs = ({
  items,
  active,
  onSelect,
}: {
  items: { id: string; label: string }[];
  active: number;
  onSelect: (i: number) => void;
}) => (
  <section className="relative z-10 bg-[#020617] -mt-[4px]">
    <div className="container-custom">
      <div className="flex flex-wrap md:flex-nowrap">
        {items.map((t, i) => {
          const isActive = active === i;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(i)}
              className={`flex-1 min-w-[140px] h-[54px] flex items-center justify-center px-2.5 text-[16px] md:text-[18px] whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-[#003345] border-b-2 border-[#2fd4c4] text-white font-semibold"
                  : "border-b border-white/60 text-white/80 font-normal hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  </section>
);

// --- 3. From Project to Platform (3-step lifecycle) ---
const steps = [
  {
    no: "01",
    icon: Boxes,
    title: "Build",
    desc: (
      <>산업 현장의 요구에 맞춘<br />AI 솔루션을 구축합니다.</>
    ),
  },
  {
    no: "02",
    icon: Puzzle,
    title: "Modularize",
    desc: (
      <>검증된 기능을 모듈화하여<br />재사용 가능한 자산으로 만듭니다.</>
    ),
  },
  {
    no: "03",
    icon: TrendingUp,
    title: "Scale",
    desc: (
      <>플랫폼 기반으로 확장하여<br />다양한 산업에 가치를 제공합니다.</>
    ),
  },
];

const Lifecycle = () => (
  <section className="relative pt-[170px] pb-28 bg-[#020617] overflow-hidden">
    {/* ambient depth behind the row */}
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_48%_at_50%_46%,rgba(0,204,204,0.07),transparent_70%)]" />

    <div className="container-custom relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <CenterHeading
          label="From Project to Platform"
          title={
            <>
              에임위드의 솔루션은 구축 경험에서 시작해<br />
              플랫폼 자산으로 확장됩니다.
            </>
          }
        />
      </motion.div>

      <div className="relative mt-24">
        {/* energy rail — one glowing line the three cards sit on, with a pulse flowing through it */}
        <div className="hidden md:block absolute left-[9%] right-[9%] top-[104px] h-px bg-gradient-to-r from-transparent via-[#00cccc]/45 to-transparent">
          <span className="absolute top-1/2 -translate-y-1/2 h-[3px] w-[90px] rounded-full bg-gradient-to-r from-transparent via-[#00f5ff] to-transparent shadow-[0_0_14px_2px_rgba(0,245,255,0.7)] animate-[rail-flow_3.6s_linear_infinite]" />
        </div>

        <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 md:gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.no}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.15 }}
              className="group relative flex-1 md:max-w-[330px]"
            >
              <div className="relative flex flex-col items-center text-center rounded-[20px] border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.012] px-8 pt-12 pb-9 backdrop-blur-sm transition-all duration-300 group-hover:border-[#00cccc]/45 group-hover:-translate-y-1.5 group-hover:shadow-[0_12px_50px_-12px_rgba(0,204,204,0.55)]">
                {/* icon orb */}
                <div className="relative w-[112px] h-[112px] flex items-center justify-center">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{ background: `radial-gradient(circle, rgba(0,204,204,${0.2 + i * 0.07}), transparent 68%)` }}
                  />
                  <div className="absolute inset-0 rounded-full border border-dashed border-[#00cccc]/25 animate-[spin_18s_linear_infinite]" />
                  <div className="absolute inset-[9px] rounded-full border border-[#00cccc]/45 bg-[#020617]/70 transition-colors duration-300 group-hover:border-[#00cccc]/75" />
                  <s.icon className="relative w-[44px] h-[44px] text-[#22e0e0] transition-colors duration-300 group-hover:text-[#5ff5f5]" strokeWidth={1.4} />
                  {/* number badge integrated on the orb */}
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-7 px-3 rounded-full bg-[#00cccc] text-[#00121a] text-[13px] font-extrabold tracking-wide flex items-center shadow-[0_0_16px_rgba(0,204,204,0.6)]">
                    {s.no}
                  </div>
                </div>
                <h3 className="text-white font-bold text-[24px] mt-8">{s.title}</h3>
                <p className="text-white/55 text-[16px] leading-[1.7] mt-3">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// --- 4. Framework (4-layer stack) ---
const layers = [
  {
    no: "Layer 1",
    icon: CloudDownload,
    krTitle: "통합 데이터 수집",
    title: "Universal Ingestion",
    kr: "IoT·SCADA·센서·영상까지 어떤 소스든 원천 형식 그대로 받아들입니다.",
    tags: ["IoT", "SCADA", "Sensor", "Log", "Image", "Video", "API"],
  },
  {
    no: "Layer 2",
    icon: Filter,
    krTitle: "AI 표준 전처리",
    title: "Standard AI Pre-processing",
    kr: "정제·검증·표준화로 학습 가능한 데이터 자산으로 만듭니다.",
    tags: ["Cleaning", "Validation", "Normalization", "Feature Engineering"],
  },
  {
    no: "Layer 3",
    icon: BrainCircuit,
    krTitle: "통합 지능 분석",
    title: "Integrated Intelligence",
    kr: "AI 모델·예측·최적화가 하나의 지능으로 통합 작동합니다.",
    tags: ["AI/ML Models", "Analytics", "Predictive", "Optimization"],
  },
  {
    no: "Layer 4",
    icon: MonitorDot,
    krTitle: "통합 인터페이스",
    title: "Universal Interface",
    kr: "대시보드·API·SDK로 분석 결과를 어디에나 연결합니다.",
    tags: ["Dashboard", "Report", "Alert", "API", "SDK"],
  },
];

// Hexagon frame behind each layer icon
const HexIcon = ({ icon: Icon, emphasis = false }: { icon: typeof CloudDownload; emphasis?: boolean }) => (
  <div className="relative w-[96px] h-[104px] shrink-0 flex items-center justify-center">
    {/* radial glow core */}
    <div
      className={`absolute w-[64px] h-[64px] rounded-full blur-[12px] ${emphasis ? "bg-[#00cccc]/40" : "bg-[#00cccc]/15"}`}
    />
    <svg viewBox="0 0 96 104" className="absolute inset-0 w-full h-full" fill="none">
      <path
        d="M48 3 L90 27 V77 L48 101 L6 77 V27 Z"
        fill={emphasis ? "rgba(0,204,204,0.10)" : "rgba(0,204,204,0.05)"}
        stroke={emphasis ? "rgba(0,245,255,0.8)" : "rgba(0,204,204,0.45)"}
        strokeWidth="1.5"
      />
    </svg>
    <Icon
      className={`relative w-[40px] h-[40px] ${emphasis ? "text-[#5ff5f5]" : "text-[#22e0e0]"}`}
      strokeWidth={1.4}
    />
  </div>
);

const Framework = () => (
  <section className="py-24 bg-[#020617]">
    <div className="container-custom">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <CenterHeading label="Framework" title="하나의 Framework, 다양한 솔루션" />
      </motion.div>

      <div className="relative mt-16 max-w-[1040px] mx-auto">
        {/* vertical pipeline rail — ties the 4 layers into one top→down data flow */}
        <div className="hidden md:block absolute top-[52px] bottom-[150px] left-[72px] w-px bg-gradient-to-b from-[#00cccc]/10 via-[#00cccc]/45 to-[#00cccc]/10 z-0">
          <span className="absolute left-1/2 -translate-x-1/2 w-[3px] h-[64px] rounded-full bg-gradient-to-b from-transparent via-[#00f5ff] to-transparent shadow-[0_0_14px_2px_rgba(0,245,255,0.65)] animate-[rail-flow-v_4.2s_linear_infinite]" />
        </div>

        <div className="relative z-[1] flex flex-col gap-5">
          {layers.map((l, i) => (
            <motion.div
              key={l.no}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="group"
            >
              <div className="relative rounded-2xl border border-white/10 bg-[rgba(12,20,34,0.6)] backdrop-blur-[8px] p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-5 md:gap-8 transition-all duration-300 group-hover:border-[#00cccc]/45 group-hover:shadow-[0_10px_44px_-16px_rgba(0,204,204,0.5)]">
                <HexIcon icon={l.icon} />
                <div className="min-w-0 md:w-[300px] shrink-0">
                  <p className="text-[#00cccc] text-[12.5px] font-bold tracking-[0.16em] uppercase">{l.no}</p>
                  <h3 className="text-white font-bold text-[22px] md:text-[23px] mt-2 leading-tight">{l.krTitle}</h3>
                  <p className="text-[#22e0e0]/65 text-[13px] font-medium mt-1">{l.title}</p>
                  <p className="text-white/45 text-[13.5px] leading-[1.6] mt-2.5">{l.kr}</p>
                </div>
                <div className="flex-1 md:self-stretch md:border-l md:border-white/10 md:pl-8 flex flex-wrap content-center gap-2">
                  {l.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[#00cccc]/20 bg-[#00cccc]/[0.05] text-white/75 text-[13.5px] font-medium leading-none px-3.5 py-2 whitespace-nowrap transition-colors group-hover:border-[#00cccc]/35"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  </section>
);

// --- 5. Solution cards ---
const solutionCards = [
  {
    no: "SOLUTION 01",
    id: "sol-energy",
    tab: "에너지 운영",
    en: "Energy AI Operations",
    kr: "발전·에너지 운영 최적화 솔루션",
    desc: "발전소 및 에너지 설비의 데이터를 실시간으로 모니터링하고, 이상 징후를 조기에 \n 탐지하여 예측 정비와 운영 최적화를 지원하는 AI 기반 솔루션입니다.",
    img: "solution_card_energy_v.webp",
    chips: [
      { icon: Activity, label: "설비 상태 모니터링" },
      { icon: Search, label: "이상 징후 조기 탐지" },
      { icon: ShieldCheck, label: "H-Score" },
      { icon: Clock, label: "TTF / RUL" },
    ],
  },
  {
    no: "SOLUTION 02",
    id: "sol-tms",
    tab: "통합환경 감시",
    en: "TMS Integrated Environment Monitoring",
    kr: "통합환경 감시시스템",
    desc: "대기, 수질, 환경 측정망을 통합하여 실시간 모니터링과 데이터 분석을 제공하고,\n 규제 대응, 환경 리포트, 통합 관제를 통해 지속가능한 환경 관리를 지원합니다.",
    img: "solution_card_tms_v.webp",
    chips: [
      { icon: Cloud, label: "대기 모니터링" },
      { icon: Droplets, label: "수질 모니터링" },
      { icon: Share2, label: "환경 측정망 통합" },
      { icon: ShieldCheck, label: "규제 대응" },
    ],
  },
  {
    no: "SOLUTION 03",
    id: "sol-power",
    tab: "전력 데이터",
    en: "Power Data Business Platform",
    kr: "발전 데이터 비즈니스 연계 플랫폼",
    desc: "발전 데이터의 체계적인 카탈로그 관리와 통합 검색, 활용 신청 워크플로우를 제공합니다. API 기반으로 데이터를 안전하고 빠르게 제공하며, 제도적 상담 지원을 통해 데이터의 활용 가치를 높입니다.",
    img: "solution_card_power_v6.webp",
    chips: [
      { icon: ListTree, label: "데이터 카탈로그" },
      { icon: Search, label: "데이터 검색" },
      { icon: Code2, label: "API 제공" },
      { icon: FileText, label: "활용 신청" },
    ],
  },
  {
    no: "SOLUTION 04",
    id: "sol-city",
    tab: "스마트시티",
    en: "Smart City Data Platform",
    kr: "스마트시티 데이터 통합 플랫폼",
    desc: "지도 기반 데이터 조회와 도시 데이터 시각화로 도시 현황을 한눈에 파악하고, \n 탄소·에너지 지표와 데이터 카탈로그를 통해 지속가능한 도시 운영과 시민 서비스 연계를 지원합니다.",
    img: "solution_card_city_v.webp",
    chips: [
      { icon: Map, label: "지도 기반 데이터 조회" },
      { icon: BarChart3, label: "도시 데이터 시각화" },
      { icon: Leaf, label: "탄소·에너지 지표" },
      { icon: Users, label: "시민 서비스 연계" },
    ],
  },
  {
    no: "SOLUTION 05",
    id: "sol-village",
    tab: "스마트빌리지",
    en: "Smart Village Operation Platform",
    kr: "지역 맞춤형 스마트 시설 통합 운영 플랫폼",
    desc: "지역 내 개별 스마트 시설과 현장 데이터를 하나의 통합 플랫폼으로 연동하여,\n 운영 현황을 중앙에서 관리하고 모니터링하는 지역 맞춤형 스마트 운영 솔루션입니다.",
    img: "solution_card_village_v.webp",
    chips: [
      { icon: Activity, label: "스마트 시설 상태 모니터링" },
      { icon: BarChart3, label: "AP 상태 추이" },
      { icon: Filter, label: "필터 현황" },
      { icon: Monitor, label: "디스플레이 장비" },
    ],
  },
  {
    no: "SOLUTION 06",
    id: "sol-safety",
    tab: "작업자 안전",
    en: "Safety & Risk Intelligence",
    kr: "작업자 안전·위험성 평가 AI 솔루션",
    desc: "작업자 안전 데이터와 위험성 평가 프로세스를 AI로 연결하여 사고 예방, 위험 식별, \n 현장 대응을 지원하는 산업 안전 AI 솔루션입니다.",
    img: "solution_card_safety_v.webp",
    chips: [
      { icon: ShieldCheck, label: "작업자 안전 모니터링" },
      { icon: AlertTriangle, label: "위험성 평가" },
      { icon: BrainCircuit, label: "GPT 기반 위험 요인 도출" },
      { icon: Bell, label: "현장 이벤트 알림" },
    ],
  },
];

const SolutionCards = () => (
  <section className="pt-[110px] pb-16 bg-[#020617]">
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="container-custom mb-14 md:mb-20"
    >
      <CenterHeading label="Industry Solutions" title="현장에서 검증된 6개 산업 솔루션" />
    </motion.div>
    <div className="container-custom flex flex-col gap-12 md:gap-16">
      {solutionCards.map((c, i) => (
        <motion.div
          key={c.img}
          id={c.id}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="group relative w-full max-w-[1472px] mx-auto md:h-[840px] scroll-mt-[150px] overflow-hidden rounded-[30px] border border-[#00cccc] bg-[rgba(10,18,30,0.5)] backdrop-blur-[10px] shadow-[0_0_40px_-6px_rgba(0,204,204,0.4)] hover:shadow-[0_0_60px_-2px_rgba(0,204,204,0.6)] transition-shadow duration-300"
        >
          {/* 3D visual (cropped from the original render) — right side on desktop */}
          <img
            src={asset(c.img)}
            alt=""
            aria-hidden
            className="hidden md:block pointer-events-none select-none absolute right-0 top-1/2 -translate-y-1/2 h-full w-auto max-w-none"
            loading={i === 0 ? "eager" : "lazy"}
          />

          {/* text content — real HTML, vertically centered so spacing adapts to the 840px height */}
          <div className="relative z-10 flex flex-col justify-center md:h-full md:max-w-[48%] px-8 py-12 md:pl-[72px] md:pr-6 md:py-0">
            <p className="text-[#00cccc] text-[15px] md:text-[16px] font-bold tracking-[0.14em]">{c.no}</p>
            <h3 className="whitespace-pre-line text-white font-bold text-[30px] md:text-[42px] leading-[1.12] mt-3 md:mt-4">{c.en}</h3>
            <p className="whitespace-pre-line text-white text-[18px] md:text-[22px] font-semibold mt-2.5 md:mt-3">{c.kr}</p>
            <p className="whitespace-pre-line text-white/55 text-[15px] md:text-[16px] leading-[1.75] mt-5 md:mt-6 max-w-[540px]">{c.desc}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-7 md:mt-9 max-w-[560px]">
              {c.chips.map((chip) => (
                <div
                  key={chip.label}
                  className="flex items-center gap-3 rounded-xl border border-[#00cccc]/25 bg-[#00cccc]/[0.04] px-5 h-[58px] transition-colors group-hover:border-[#00cccc]/40"
                >
                  <chip.icon className="w-[20px] h-[20px] text-[#22e0e0] shrink-0" strokeWidth={1.6} />
                  <span className="text-white/85 text-[14px] md:text-[15px] font-medium leading-tight">{chip.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3D visual — stacked below text on mobile */}
          <img
            src={asset(c.img)}
            alt={`${c.en} — ${c.kr}`}
            className="md:hidden w-full h-auto select-none px-4 pb-6"
            loading="lazy"
          />
        </motion.div>
      ))}
    </div>
  </section>
);

// --- 6. CTA ---
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
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/85 via-[#020617]/55 to-[#020617]/85" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex flex-col items-center text-center px-6 py-[72px]"
        >
          <h2 className="text-[26px] md:text-[42px] font-bold leading-[1.3] drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
            <span className="text-white">산업 AI의 미래, </span>
            <span className="text-[#00cccc]">지금 바로 시작하세요</span>
          </h2>
          <p className="text-white/70 text-[15px] md:text-[18px] mt-3">
            전문가와 상담하고 에임위드의 AI 솔루션을 직접 경험해 보세요.
          </p>
          <div className="mt-8">
            <ActionButtons />
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const navItems = solutionCards.map((c) => ({ id: c.id, label: c.tab }));

export default function Solution() {
  const [activeTab, setActiveTab] = useState(0);

  // click → smooth-scroll to the matching solution card
  const goTo = (i: number) => {
    setActiveTab(i);
    document.getElementById(navItems[i].id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="pt-[80px] min-h-screen text-white bg-[#020617] font-sans overflow-hidden">
      <Hero />
      <CategoryTabs items={navItems} active={activeTab} onSelect={goTo} />
      <Lifecycle />
      <Framework />
      <SolutionCards />
      <CTA />
    </div>
  );
}
