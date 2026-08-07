import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import {
  Cpu,
  Cloud,
  Cctv,
  ShieldCheck,
  Lock,
  Boxes,
  Building2,
  Monitor,
  Smartphone,
  ChevronRight,
  Clock,
  BarChart3,
  LineChart,
  ArrowUp,
  ArrowDown,
  Quote,
  FileCheck2,
} from "lucide-react";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

// Reusable section heading — consistent label/title/subtitle style across all sections
export const SectionHeading = ({
  label,
  title,
  subtitle,
  align = "left",
  className = "",
}: {
  label: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) => (
  <div className={`${align === "center" ? "text-center" : ""} ${className}`}>
    <p className="text-[#2fd4c4] text-[17px] md:text-[20px] font-normal leading-[1.2] mb-4">{label}</p>
    <h2 className="text-[24px] md:text-[50px] font-bold text-white leading-[1.5] break-keep">{title}</h2>
    {subtitle && (
      <p
        className={`text-white/70 text-[16px] md:text-[20px] font-normal leading-[1.5] mt-3 ${
          align === "center" ? "mx-auto" : "max-w-[900px]"
        }`}
      >
        {subtitle}
      </p>
    )}
  </div>
);

// --- 1. Hero ---
const Hero = () => (
  <section className="relative overflow-hidden bg-[#040813] lg:min-h-[820px]">
    {/* Header → hero color bridge (smooth transition from navbar) */}
    <div className="absolute top-0 inset-x-0 h-[200px] bg-gradient-to-b from-[#020617] via-[#020617]/70 to-transparent pointer-events-none z-[1]" />

    {/* Hero → Problem bridge: fades the hero's bottom into #020617 — the base colour the Problem section
        starts from — so the two blend rather than showing a seam (user, 2026-07-22). */}
    <div className="absolute inset-x-0 bottom-0 h-[240px] bg-gradient-to-b from-transparent to-[#020617] pointer-events-none z-[1]" />

    <Breadcrumb />

    {/* Dashboard visual. On mobile it stacks as an in-flow block above the copy so the headline sits on
        clean dark instead of over the busy dashboard — matching the AIMNIS hero (user, 2026-07-27); from
        lg it returns to the absolute right-side background overlay. Same <img>, only positioning switches.
        NOTE: aimguard_hero_main.png (the previous still) is still used by Business.tsx — do not delete. */}
    <div className="relative pt-[64px] lg:pt-0 lg:absolute lg:inset-0 pointer-events-none">
      {/* Mobile/tablet: the laptop-centred crop (aimguard_hero_main_m) so it sits dead-centre with the
          radial fade — the full still has the laptop on the right, which read off-centre when centred. */}
      <img
        src={asset("aimguard_hero_main_m.webp")}
        alt="AIM GUARD Dashboard"
        className="lg:hidden mx-auto block h-[200px] w-auto max-w-full [mask-image:radial-gradient(ellipse_closest-side_at_center,#000_40%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_closest-side_at_center,#000_40%,transparent_100%)]"
      />
      {/* Desktop: the full still, bled in from the right as an absolute background overlay. */}
      <img
        src={asset("aimguard_hero_main.webp")}
        alt="AIM GUARD Dashboard"
        aria-hidden="true"
        className="hidden lg:block absolute inset-y-0 right-0 h-full w-auto max-w-none object-cover object-right"
      />
      {/* left → right darkening so the headline stays readable — desktop only (mobile stacks, no overlap) */}
      <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#040813] from-6% via-[#040813]/40 via-30% to-transparent to-50%" />
    </div>

    <div className="container-custom relative z-10 pt-8 lg:pt-[200px] pb-[120px]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-[714px] flex flex-col"
      >
        {/* margins, not a column gap — the label sits closer to the title (16px) than the title block does to the body (28px) */}
        <p className="text-[#90a1b9] text-[16px] md:text-[20px] font-bold leading-[1.4] mb-4">AI가 위험을 감지하기 전에 대응합니다</p>
        <div className="flex flex-col gap-6 mb-7">
          <h1 className="text-[30px] sm:text-[40px] md:text-[64px] font-bold text-white leading-[1.2] break-keep">
            산업 현장의 안전을 지키는<br />
            AI 영상 분석 솔루션
          </h1>
          <img src={asset("aimguard_logo_bi.png")} alt="AIM GUARD" className="w-[488px] max-w-[80%] lg:max-w-full h-auto" />
        </div>
        <p className="text-white text-[16px] md:text-[18px] font-normal leading-[1.5] mb-10 lg:mb-[74px]">
          실시간 영상 분석과 지능형 알림으로<br />
          사고를 사전에 예측하고 대응하여 안전한 현장을 만듭니다.
        </p>

        {/* One CTA only. The hero used to pair 도입 상담 신청 with a 소개서 다운로드 outline button; the
            user dropped the second and renamed the first to 라이선스 발급 on 2026-07-20. The wrapper
            keeps flex/gap so a second button can be dropped back in without re-deriving the layout.
            It is a Link, not a button — it navigates to the licence-issue page (Figma 486:118). */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-5">
          <Link
            to="/aimguard/license"
            className="flex h-[48px] w-full sm:h-[54px] sm:w-[232px] items-center justify-center rounded-[8px] text-[#000028] text-[16px] sm:text-[18px] font-bold hover:shadow-[0_0_30px_rgba(0,230,219,0.5)] transition-all"
            style={{ background: "linear-gradient(90deg, #00feb9 0%, #00e6db 100%)" }}
          >
            라이선스 발급
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

// --- 2. Problem ---
const problems = [
  {
    icon: "aimguard_prob_ico1.svg",
    title: "사고는 발생 후에야 인지됩니다.",
    desc: (
      <>모니터링 한계로 인해 위험 상황을<br className="hidden lg:block" />실시간으로 파악하기 어렵습니다.</>
    ),
  },
  {
    icon: "aimguard_prob_ico2.svg",
    title: "야간/악천후 환경에서 감지 한계",
    desc: (
      <>어둡거나 비,눈, 안개 등 환경 요인으로<br className="hidden lg:block" />정확한 영상 분석이 어렵습니다.</>
    ),
  },
  {
    icon: "aimguard_prob_ico3.svg",
    title: "24시간 모니터링은 현실적으로 불가능",
    desc: (
      <>인력 운영의 한계로 인해 지속적인<br className="hidden lg:block" />모니터링과 집중력 유지가 어렵습니다.</>
    ),
  },
  {
    icon: "aimguard_prob_ico4.svg",
    title: "데이터는 있지만 대응은 느립니다.",
    desc: (
      <>위험 상황 발생 후 수동 확인 및 보고체계로<br className="hidden lg:block" />신속한 대응이 이루어지지 않습니다.</>
    ),
  },
];

const Problem = () => (
  <section className="relative lg:min-h-[752px] flex flex-col justify-center py-[86px] lg:py-24 overflow-hidden bg-[#020617]">
    <img
      src={asset("aimguard_problem_bg.png")}
      alt=""
      className="absolute inset-0 w-full h-full object-cover opacity-90"
    />
    <div className="absolute inset-0 bg-[#020617]/40" />
    {/* Top fade-in: the section's bg image starts as solid #020617 and reveals gradually, meeting the
        hero's bottom fade at the same colour so the boundary disappears (user, 2026-07-22). */}
    <div className="absolute inset-x-0 top-0 h-[240px] bg-gradient-to-b from-[#020617] to-transparent pointer-events-none" />

    <div className="container-custom relative z-10">
      <SectionHeading label="Problem" title="기존 솔루션으로는 사고를 막을 수 없습니다" align="center" className="mb-10 lg:mb-20" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {problems.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="flex flex-col items-center text-center"
          >
            <img src={asset(p.icon)} alt="" className="w-[130px] h-[130px] mb-8" />
            <h3 className="text-[18px] md:text-[24px] font-bold text-white mb-3 tracking-tight leading-[1.3] break-keep">
              {p.title}
            </h3>
            <p className="text-white/70 text-[14px] md:text-[16px] font-normal leading-[1.6] break-keep">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// --- 3. Features ---
const featureCards = [
  {
    no: "01",
    img: "aimguard_feat_01.png",
    title: "안전장비 착용 감지",
    desc: (
      <>
        헬멧, 안전조끼 등 보호장비 착용 여부를
        <br />
        실시간으로 감지합니다.
      </>
    ),
  },
  {
    no: "02",
    img: "aimguard_feat_02.png",
    title: "위험 접근 감지",
    desc: (
      <>
        중장비 및 위험 구역 접근을 감지하여
        <br />
        충돌 및 끼임 사고를 예방합니다.
      </>
    ),
  },
  {
    no: "03",
    img: "aimguard_feat_03.png",
    title: "낙상 및 이상행동 감지",
    desc: (
      <>
        작업자 쓰러짐 및 비정상 행동을 감지하여
        <br />
        신속한 대응을 지원합니다.
      </>
    ),
  },
  {
    no: "04",
    img: "aimguard_feat_04.png",
    title: "화재 및 연기 감지",
    desc: (
      <>
        연기와 화재를 조기에 감지하여
        <br />
        피해 확산을 최소화합니다.
      </>
    ),
  },
];

const Features = () => (
  <section className="py-[86px] lg:pt-24 lg:pb-[196px] bg-[#020617]">
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
          title="현장에 최적화된 핵심 기능"
          subtitle="AIM GUARD는 산업 현장의 다양한 위험 요소를 AI가 실시간으로 감지하여 사고를 사전에 예방합니다."
        />
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featureCards.map((c, i) => (
          <motion.div
            key={c.no}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden flex flex-col"
          >
            <div className="relative aspect-[2/1] overflow-hidden">
              <img src={asset(c.img)} alt={c.title} className="w-full h-full object-cover saturate-[0.85] brightness-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1420] via-[#0a1420]/35 to-[#0a1420]/15" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3">
                <span className="text-[#2fd4c4] text-[22px] font-bold leading-none">{c.no}</span>
                <span className="w-px h-5 bg-white/20" />
                <h4 className="text-white font-bold text-[18px] leading-tight">{c.title}</h4>
              </div>
              <p className="text-white/70 text-[15px] mt-3 leading-relaxed">{c.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// --- 4. AIM GUARD brand banner ---
const bannerFeatures = [
  { icon: ShieldCheck, title: "안전한 작업 환경 구축", desc: <>위험 요소를 사전에 감지하여<br />사고를 예방합니다.</> },
  { icon: Clock, title: "운영 비용 절감", desc: <>불필요한 비용과 리스크를 줄이고<br />효율적인 운영을 지원합니다.</> },
  { icon: BarChart3, title: "생산성 향상", desc: <>자동화된 모니터링으로<br />핵심 업무에 집중할 수 있습니다.</> },
  { icon: FileCheck2, title: "컴플라이언스 대응", desc: <>기록과 보고를 자동화하여<br />규정 준수를 지원합니다.</> },
];

const Banner = () => (
  <section className="relative min-h-[800px] overflow-hidden bg-[#020617]">
    <img
      src={asset("aimguard_banner_bg.png")}
      alt=""
      className="absolute inset-0 w-full h-full object-cover opacity-50"
    />
    <div className="absolute inset-0 bg-[#020617]/50" />

    <div className="relative z-10 flex flex-col min-h-[800px]">
      {/* Feature bullets (top) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container-custom w-full pt-14"
      >
        <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-12">
          {/* Lead quote */}
          <div className="lg:w-[300px] shrink-0 flex flex-col gap-2">
            <Quote className="w-6 h-6 text-[#2fd4c4] fill-[#2fd4c4]" />
            <p className="text-white/85 text-[18px] leading-[1.6]">
              실시간 감지와 즉각적인 알림으로 <br /> 사고를 사전에 차단하고 운영 효율을<br /> 극대화했습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 flex-1">
            {bannerFeatures.map((f, i) => (
              <div key={i} className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0">
                    <f.icon className="w-5 h-5 text-[#2fd4c4]" strokeWidth={1.7} />
                  </div>
                  <span className="text-white font-bold text-[16px] break-keep">{f.title}</span>
                </div>
                <p className="text-white/55 text-[14px] leading-[1.6] break-keep">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Logo (center) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex items-center justify-center px-6 pt-16 pb-16 lg:pt-0"
      >
        <img src={asset("aimguard_logo_bi.png")} alt="AIM GUARD" className="w-[668px] max-w-[85vw] h-auto" />
      </motion.div>
    </div>
  </section>
);

// --- 5. Solutions (GIS) ---
const Solutions = () => (
  <section className="py-[86px] lg:pt-32 lg:pb-16 bg-[#050914]">
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
          title={
            <>
              여러 화면을 오가지 않아도 됩니다
              <br />
              흩어진 데이터를 GIS 기반 하나의 화면에서 직관적으로 파악합니다
            </>
          }
          subtitle={
            <>
              방범, 교통, 안전 등 서로 다른 시스템을 오갈 필요가 없습니다.
              <br />
              AIMGUARD는 모든 이벤트를 GIS 기반의 단일 화면에서 통합하여, 신속한 상황 판단을 지원합니다.
            </>
          }
        />
      </motion.div>

      <motion.img
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        src={asset("aimguard_gis.png")}
        alt="GIS 기반 통합 관제"
        className="w-full h-auto"
      />
    </div>
  </section>
);

// --- 6. Tech & Trust (system architecture) ---
const techFeatures = [
  { icon: Cpu, title: "AI 기반 영상 분석", desc: <>자체 개발한 딥러닝 모델로<br />다양한 위험 상황을 높은<br /> 정확도로 감지</> },
  { icon: Cloud, title: "Edge + Server 구조", desc: <>Edge에서 실시간 처리 후<br />Server에서 통합 관리 및 분석</> },
  { icon: Cctv, title: "기존 인프라 연동", desc: <>다양한 CCTV 및 VMS와 연동하여 손쉽게 도입 가능</> },
  { icon: ShieldCheck, title: "보안 및 안정성", desc: <>데이터 암호화, 접근 제어 등<br />강화된 보안 체계 적용</> },
];

const cameraSources = [
  { img: "aimguard_cam_cctv.png", label: "CCTV" },
  { img: "aimguard_cam_ip.png", label: "IP Camera" },
  { img: "aimguard_cam_ptz.png", label: "PTZ Camera" },
  { img: "aimguard_cam_etc.png", label: "기타 영상 소스" },
];
const edgeItems = ["실시간 영상 수집", "AI 분석 엔진", "이벤트 감지", "알림 생성"];
const serverItems = ["데이터 저장", "이벤트 관리", "통계 및 리포트", "사용자 관리"];
const integrations = [
  { icon: Boxes, title: "TWIN-X", sub: "디지털 트윈 연동" },
  { icon: Building2, title: "BMS / FMS", sub: "빌딩/설비 관리" },
  { icon: Monitor, title: "관제 시스템", sub: "VMS 연동" },
  { icon: Smartphone, title: "모바일 / 이메일", sub: "알림 및 통보" },
];

// subtle top-lit gradient for architecture boxes
export const boxGrad = "bg-gradient-to-b from-[#12313d] to-[#0a1420]";

const ArchArrow = () => (
  <div className="flex items-center justify-center shrink-0">
    <ChevronRight className="w-5 h-5 text-[#2fd4c4]/60 rotate-90 lg:rotate-0" />
  </div>
);

const Pill = ({ children }: { children: ReactNode }) => (
  <div className={`w-full rounded-lg ${boxGrad} border border-white/10 py-2.5 px-2 text-center text-white/80 text-[13px] leading-tight`}>
    {children}
  </div>
);

const FlowColumn = ({ title, deviceImg, items }: { title: string; deviceImg: string; items: string[] }) => (
  <div className="w-full lg:flex-1 lg:min-w-[120px] flex flex-col items-center">
    <p className="text-[#2fd4c4] text-[14px] font-bold mb-3 tracking-wide shrink-0">{title}</p>
    <div className={`w-full h-[64px] rounded-lg ${boxGrad} border border-white/10 flex items-center justify-center p-2 mb-4 shrink-0`}>
      <img src={asset(deviceImg)} alt={title} className="max-h-full max-w-full object-contain" />
    </div>
    <div className="flex flex-col gap-2.5 w-full flex-1 justify-between">
      {items.map((t) => (
        <Pill key={t}>{t}</Pill>
      ))}
    </div>
  </div>
);

const TechResult = () => (
  <section className="py-[86px] lg:py-24 bg-[#020617]">
    <div className="container-custom grid lg:grid-cols-[minmax(0,500px)_1fr] gap-12 items-stretch">
      {/* Left: heading + feature grid */}
      <div className="min-w-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            label="Tech & Trust"
            title={<>검증된 기술력과<br />안정적인 시스템</>}
            subtitle={<>AIMGUARD는 AI 기반 영상 분석 기술과 안정적인 시스템 아키텍처로 높은 정확도와 신뢰성을 제공합니다.</>}
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 mt-14">
          {techFeatures.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="flex gap-4 items-start"
            >
              <div className="w-[52px] h-[52px] rounded-full bg-white/[0.04] border border-brand-cyan/25 flex items-center justify-center shrink-0">
                <f.icon className="w-6 h-6 text-brand-cyan" strokeWidth={1.6} />
              </div>
              <div>
                <h4 className="text-white font-bold text-[17px] mb-2">{f.title}</h4>
                <p className="text-white/55 text-[14px] leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right: architecture panel */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.015] p-6 md:p-8 flex flex-col"
      >
        <h3 className="text-[#2fd4c4] text-[20px] font-bold mb-8 shrink-0">AIMGUARD 시스템 아키텍처</h3>

        <div className="lg:overflow-x-auto flex-1 flex flex-col">
          <div className="lg:min-w-[820px] flex-1 flex flex-col">
            <div className="flex flex-col lg:flex-row items-stretch gap-4 lg:gap-2.5 flex-1">
              {/* Camera sources */}
              <div className={`w-full lg:flex-1 lg:min-w-[150px] rounded-xl ${boxGrad} border border-white/10 p-4 flex flex-col`}>
                <p className="text-center text-white text-[14px] font-semibold mb-5 shrink-0">카메라 / 영상 소스</p>
                <div className="flex flex-col gap-4 flex-1 justify-between">
                  {cameraSources.map((c) => (
                    <div key={c.label} className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center shrink-0">
                        <img src={asset(c.img)} alt={c.label} className="w-10 h-10 object-contain" />
                      </div>
                      <span className="text-white/80 text-[14px]">{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <ArchArrow />

              <FlowColumn title="EDGE AI" deviceImg="aimguard_dev_edge.png" items={edgeItems} />

              {/* Secure link */}
              <div className="flex flex-col items-center justify-center gap-2 px-1 shrink-0">
                <span className="text-white/50 text-[11px] whitespace-nowrap">보안 통신</span>
                <div className="w-11 h-11 rounded-full bg-white/[0.04] border border-[#2fd4c4]/40 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-[#2fd4c4]" strokeWidth={1.6} />
                </div>
              </div>

              <FlowColumn title="SERVER" deviceImg="aimguard_dev_server.png" items={serverItems} />

              <ArchArrow />

              {/* Integrations */}
              <div className={`w-full lg:flex-1 lg:min-w-[160px] rounded-xl ${boxGrad} border border-white/10 p-4 flex flex-col`}>
                <p className="text-center text-white text-[14px] font-semibold mb-5 shrink-0">연동 시스템</p>
                <div className="flex flex-col gap-4 flex-1 justify-between">
                  {integrations.map((c) => (
                    <div key={c.title} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
                        <c.icon className="w-4 h-4 text-[#2fd4c4]" strokeWidth={1.6} />
                      </div>
                      <div>
                        <p className="text-white text-[13px] font-semibold leading-tight">{c.title}</p>
                        <p className="text-white/50 text-[11px] leading-tight mt-0.5">{c.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom security bar */}
            <div className={`mt-6 shrink-0 rounded-xl ${boxGrad} border border-white/10 py-3.5 px-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1`}>
              <Lock className="w-4 h-4 text-[#2fd4c4] shrink-0" strokeWidth={1.6} />
              <span className="text-white/75 text-[13px] lg:text-[16px]">데이터 암호화 (TLS/SSL)</span>
              <span className="text-white/25">·</span>
              <span className="text-white/75 text-[13px] lg:text-[16px]">접근 제어</span>
              <span className="text-white/25">·</span>
              <span className="text-white/75 text-[13px] lg:text-[16px]">보안 감사</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

// --- 7. Impact & Result ---
export const MiniChart = ({ data, gradId }: { data: number[]; gradId: string }) => {
  const cx0 = 34, cx1 = 236, cy0 = 8, cy1 = 84;
  const n = data.length;
  const px = (i: number) => cx0 + (i * (cx1 - cx0)) / (n - 1);
  const py = (v: number) => cy1 - (v / 100) * (cy1 - cy0);
  const line = data.map((v, i) => `${i ? "L" : "M"}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(" ");
  const area = `${line} L${cx1} ${cy1} L${cx0} ${cy1} Z`;
  return (
    <svg viewBox="0 0 240 104" className="w-full h-auto mt-3" role="img">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2fd4c4" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#2fd4c4" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 50, 100].map((g) => (
        <line key={g} x1={cx0} x2={cx1} y1={py(g)} y2={py(g)} stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1" />
      ))}
      {[100, 50, 0].map((v) => (
        <text key={v} x={28} y={py(v) + 3} textAnchor="end" fontSize="8" fill="#ffffff" fillOpacity="0.4">{`${v}%`}</text>
      ))}
      <path d={area} fill={`url(#${gradId})`} />
      <path d={line} fill="none" stroke="#00e5e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => {
        const last = i === data.length - 1;
        if (last) {
          return (
            <g key={i}>
              <circle cx={px(i)} cy={py(v)} r="4" fill="#00e5e5" opacity="0.22" />
              <circle cx={px(i)} cy={py(v)} r="3.4" fill="#00e5e5" />
              <circle cx={px(i)} cy={py(v)} r="1.4" fill="#ffffff" />
            </g>
          );
        }
        return <circle key={i} cx={px(i)} cy={py(v)} r="2.6" fill="#00e5e5" />;
      })}
      <text x={cx0} y={100} textAnchor="start" fontSize="9" fill="#ffffff" fillOpacity="0.75">도입 전</text>
      <text x={cx1} y={100} textAnchor="end" fontSize="9" fill="#ffffff" fillOpacity="0.75">도입 후</text>
    </svg>
  );
};

const stats = [
  { id: "impact-accident", icon: ShieldCheck, label: "사고 발생률", value: 72, up: false, unit: "감소", data: [100, 80, 58, 32, 10] },
  { id: "impact-response", icon: Clock, label: "사고 대응 시간", value: 65, up: false, unit: "단축", data: [88, 68, 46, 24, 8] },
  { id: "impact-efficiency", icon: BarChart3, label: "운영 효율", value: 48, up: true, unit: "향상", data: [12, 32, 58, 80, 100] },
  { id: "impact-accuracy", icon: LineChart, label: "모니터링 정확도", value: 96, up: true, unit: "달성", data: [48, 66, 86, 92, 100] },
];

const ImpactResult = () => (
  <section className="py-[86px] lg:py-24 bg-[#020617]">
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
          subtitle="AIMGUARD는 사고를 예방하고 운영 효율을 높여 현장의 안전과 가치를 함께 만들어갑니다."
        />
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-16">
        {stats.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className={`rounded-2xl ${boxGrad} border border-white/10 p-4 lg:p-6 flex flex-col`}
          >
            {/* icon + metric. Stacks vertically on the narrow 2-col mobile card so the label and the 40px
                number get the card's full width — side-by-side they spilled outside the card (user,
                2026-07-27). Desktop (4-col, wide) keeps the original icon-left row. Mirrors AimNis. */}
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#2fd4c4]/[0.08] border border-[#2fd4c4]/25 flex items-center justify-center shrink-0 shadow-[0_0_18px_-6px_rgba(47,212,196,0.6)]">
                <s.icon className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-[#2fd4c4]" strokeWidth={1.7} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-white/70 text-[14px] font-medium break-keep">{s.label}</span>
                <div className="flex items-end gap-1 sm:gap-1.5 mt-1.5 sm:mt-2">
                  <span className="text-[30px] sm:text-[40px] font-bold text-brand-cyan leading-none tracking-tight">{s.value}%</span>
                  {s.up ? (
                    <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 text-brand-cyan mb-0.5 sm:mb-1" strokeWidth={3} />
                  ) : (
                    <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6 text-brand-cyan mb-0.5 sm:mb-1" strokeWidth={3} />
                  )}
                  <span className="text-white/50 text-[12px] sm:text-[13px] mb-1 sm:mb-1.5 whitespace-nowrap">{s.unit}</span>
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
  <section className="py-[50px] md:py-20 bg-[#020617]">
    <div className="container-custom">
      <div className="relative w-full mx-auto rounded-[20px] overflow-hidden border border-[#2fd4c4]/25 bg-gradient-to-b from-[#08131c] to-[#04090f] shadow-[0_0_50px_rgba(47,212,196,0.07)]">
        {/* Particle graphic (left) */}
        <img
          src={asset("aimguard_cta_particle.png")}
          alt=""
          aria-hidden
          className="absolute left-0 inset-y-0 h-full w-auto max-w-none object-cover pointer-events-none select-none"
          style={{ WebkitMaskImage: "linear-gradient(to right, black 55%, transparent)", maskImage: "linear-gradient(to right, black 55%, transparent)" }}
        />
        {/* Control room (right) */}
        <img
          src={asset("aimguard_cta_room.png")}
          alt=""
          aria-hidden
          className="absolute right-0 inset-y-0 h-full w-auto max-w-none object-cover pointer-events-none select-none"
          style={{ WebkitMaskImage: "linear-gradient(to right, transparent, black 45%)", maskImage: "linear-gradient(to right, transparent, black 45%)" }}
        />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex flex-col items-center text-center px-6 py-[68px]"
        >
          <h2 className="text-[26px] md:text-[42px] font-bold leading-[1.3] break-keep text-balance">
            <span className="text-white">현장의 안전, </span>
            <span className="text-[#2fd4c4]">지금 바로 시작하세요</span>
          </h2>
          <p className="text-white/70 text-[15px] md:text-[18px] mt-3 break-keep text-balance">
            전문가와 상담하고 AIMGUARD 데모를 통해 직접 경험해 보세요.
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 sm:gap-5 mt-7 w-full sm:w-auto">
            <Link
              to="/contact"
              onClick={() => window.scrollTo(0, 0)}
              className="flex h-[48px] w-full sm:h-[54px] sm:w-[232px] items-center justify-center rounded-[8px] text-[#000028] text-[16px] sm:text-[18px] font-bold hover:shadow-[0_0_30px_rgba(0,230,219,0.5)] transition-all"
              style={{ background: "linear-gradient(90deg, #00feb9 0%, #00e6db 100%)" }}
            >
              데모 요청
            </Link>
            <Link
              to="/contact"
              onClick={() => window.scrollTo(0, 0)}
              className="flex h-[48px] w-full sm:h-[54px] sm:w-[232px] items-center justify-center rounded-[8px] border border-[#2fd4c4] bg-white/20 text-white text-[16px] sm:text-[18px] font-bold hover:bg-white/30 transition-all"
            >
              문의하기
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default function AimGuard() {
  return (
    <div className="pt-[80px] min-h-screen text-white bg-[#020617] font-sans overflow-hidden">
      <Hero />
      <Problem />
      <Features />
      <Banner />
      <Solutions />
      <TechResult />
      <ImpactResult />
      <CTA />
    </div>
  );
}
