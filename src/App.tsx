/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Monitor,
  Cpu,
  Zap,
  Layout,
  Search,
  CircleDot,
  Activity,
  ArrowUp,
  Mail,
  Phone,
  Building,
  User,
  ShieldAlert,
  Flame,
  CloudLightning,
  Settings
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, animate } from "motion/react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import AimGuard from "./pages/AimGuard";
import AimGuardLicense from "./pages/AimGuardLicense";
import AimNis from "./pages/AimNis";
import Solution from "./pages/Solution";
import Business from "./pages/Business";
import Company from "./pages/Company";
import { SOLUTION_SUBS, subRoute, ROUTED } from "./nav";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

// --- Components ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // "Solution" is a parent, not a page — it lights up on any of the three routes under it, or landing
  // on /aimnis would leave the whole bar looking inert.
  const isActive = (item: string) =>
    item === "Solution" ? SOLUTION_SUBS.some((s) => subRoute(s) === pathname) : ROUTED[item] === pathname;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`absolute top-0 left-0 right-0 z-50 transition-all duration-300 flex items-center h-[80px] ${scrolled ? "bg-bg-dark/80 backdrop-blur-md" : "bg-transparent"}`}>
      <div className="w-full flex items-center justify-between container-custom relative">
        {/* Logo (Left) */}
        <div className="flex items-center z-10">
          <Link to="/">
            <img src={asset("logo_horizontal.png")} alt="AIMWID" className="w-[164px] h-auto" />
          </Link>
        </div>

        {/* Menu (Center) */}
        <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2" style={{ gap: '100px' }}>
          {["Solution", "Business", "Company", "Contact"].map((item) => {
            if (item === "Solution") {
              return (
                <div key={item} className="relative group flex items-center h-[80px]">
                  <a href={`#${item.toLowerCase()}`} className={`text-[18px] font-semibold group-hover:text-brand-cyan transition-colors flex items-center gap-1 cursor-pointer ${isActive(item) ? "text-brand-cyan" : "text-white"}`}>
                    {item} <ChevronDown size={16} className="mt-0.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </a>
                  {/* Dropdown Menu */}
                  <div className="absolute top-[65px] left-1/2 -translate-x-1/2 pt-2 w-[160px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="bg-bg-dark/95 backdrop-blur-md border border-brand-cyan/20 rounded-xl overflow-hidden shadow-2xl flex flex-col py-2">
                      {SOLUTION_SUBS.map((subItem) => (
                        <Link
                          key={subItem}
                          to={subRoute(subItem)}
                          className={`px-5 py-3 text-[15px] font-medium hover:text-brand-cyan hover:bg-brand-cyan/10 transition-colors text-center ${pathname === subRoute(subItem) ? "text-brand-cyan bg-brand-cyan/10" : "text-white/80"}`}
                          onClick={() => {
                            if (subItem !== "AIM GUARD") {
                              window.scrollTo(0, 0);
                            }
                          }}
                        >
                          {subItem}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            const cls = `text-[18px] font-semibold hover:text-brand-cyan transition-colors ${isActive(item) ? "text-brand-cyan" : "text-white"}`;
            return (
              <div key={item} className="flex items-center h-[80px]">
                {ROUTED[item] ? (
                  <Link to={ROUTED[item]} className={cls} onClick={() => window.scrollTo(0, 0)}>
                    {item}
                  </Link>
                ) : (
                  <a href={`#${item.toLowerCase()}`} className={cls}>
                    {item}
                  </a>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Menu Button (Right) */}
        <div className="flex justify-end z-10">
          <button className="md:hidden text-white pr-6" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-bg-dark border-b border-white/10 p-6 flex flex-col gap-4 md:hidden"
          >
            {["Solution", "Business", "Company", "Contact"].map((item) => (
              <div key={item} className="flex flex-col">
                {ROUTED[item] ? (
                  <Link
                    to={ROUTED[item]}
                    className={`text-lg font-medium py-2 flex items-center justify-between transition-colors ${isActive(item) ? "text-brand-cyan" : "text-white"}`}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      window.scrollTo(0, 0);
                    }}
                  >
                    {item}
                  </Link>
                ) : (
                  <a
                    href={`#${item.toLowerCase()}`}
                    className={`text-lg font-medium py-2 flex items-center justify-between transition-colors ${isActive(item) ? "text-brand-cyan" : "text-white"}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                )}
                {item === "Solution" && (
                  <div className="flex flex-col pl-4 border-l-2 border-brand-cyan/30 ml-2 mt-1 mb-2 gap-3 py-2">
                    {SOLUTION_SUBS.map((subItem) => (
                      <Link
                        key={subItem}
                        to={subRoute(subItem)}
                        className={`text-base transition-colors hover:text-brand-cyan ${pathname === subRoute(subItem) ? "text-brand-cyan" : "text-white/70"}`}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          if (subItem !== "AIM GUARD") {
                            window.scrollTo(0, 0);
                          }
                        }}
                      >
                        {subItem}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative h-[920px] flex items-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={asset("main_video.mp4")} type="video/mp4" />
        </video>
        {/* Overlay to ensure text readability if needed, or just a dark tint */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container-custom relative z-10 text-center flex flex-col items-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl"
        >
          <h1 className="text-4xl md:text-7xl font-bold font-display leading-[1.2] mb-8 tracking-tight text-white text-center">
            데이터 연동부터 통합관제까지,<br />
            <span className="whitespace-nowrap">스스로 진화하는 엔터프라이즈 AI 플랫폼</span>
          </h1>
        </motion.div>
      </div>

    </section>
  );
};

const WorkflowDetails = () => {
  const clockwiseOrder = [0, 1, 3, 2]; // 구상및정의 → 지능형조립 → 화이트라벨배포 → 코드검증
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex(prev => (prev + 1) % 4);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const activeIcon = clockwiseOrder[stepIndex];

  return (
    <section id="solution" className="relative h-[900px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={asset("main_bg_01.png")}
          alt="Workflow Background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container-custom relative z-10 grid md:grid-cols-2 items-center gap-10">
        {/* Left: Visual Area */}
        <div className="relative flex items-center justify-center h-[600px]">
          {/* 500x500 Orbit Wrapper */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] z-0">
            {/* Rotating: Dashed Circle + Arrows together (clockwise) */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              {/* Dashed Circle Border */}
              <svg className="absolute inset-0 w-full h-full">
                <circle
                  cx="250"
                  cy="250"
                  r="249"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeDasharray="1 10"
                  strokeLinecap="round"
                />
              </svg>

              {/* Top (12 o'clock) → points right */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <img src={asset("arrow.png")} alt="arrow" style={{ width: 20, height: 20, transform: 'rotate(0deg)' }} />
              </div>
              {/* Right (3 o'clock) → points down */}
              <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2">
                <img src={asset("arrow.png")} alt="arrow" style={{ width: 20, height: 20, transform: 'rotate(90deg)' }} />
              </div>
              {/* Bottom (6 o'clock) → points left */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                <img src={asset("arrow.png")} alt="arrow" style={{ width: 20, height: 20, transform: 'rotate(180deg)' }} />
              </div>
              {/* Left (9 o'clock) → points up */}
              <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <img src={asset("arrow.png")} alt="arrow" style={{ width: 20, height: 20, transform: 'rotate(270deg)' }} />
              </div>
            </motion.div>

            {/* Orbiting Icons with Active Cycling */}
            {/* Top Left - icon 0 */}
            <div className="absolute top-[73px] left-[73px] -translate-x-1/2 -translate-y-1/2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center relative transition-all duration-500"
                style={{
                  backgroundColor: activeIcon === 0 ? '#00CCCC' : '#3b82f6',
                  boxShadow: activeIcon === 0 ? '0 0 20px rgba(0,204,204,0.7)' : '0 0 15px rgba(59,130,246,0.6)'
                }}
              >
                <img src={asset("icon_01.png")} alt="Icon 01" className="w-6 h-6" />
                <span className="absolute right-full mr-5 top-1/2 -translate-y-1/2 text-lg font-bold text-white whitespace-nowrap">구상 및 정의</span>
              </div>
            </div>

            {/* Top Right - icon 1 */}
            <div className="absolute top-[73px] right-[73px] translate-x-1/2 -translate-y-1/2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center relative transition-all duration-500"
                style={{
                  backgroundColor: activeIcon === 1 ? '#00CCCC' : '#3b82f6',
                  boxShadow: activeIcon === 1 ? '0 0 20px rgba(0,204,204,0.7)' : '0 0 15px rgba(59,130,246,0.6)'
                }}
              >
                <img src={asset("icon_02.png")} alt="Icon 02" className="w-6 h-6" />
                <span className="absolute left-full ml-5 top-1/2 -translate-y-1/2 text-lg font-bold text-white whitespace-nowrap">지능형 조립</span>
              </div>
            </div>

            {/* Bottom Left - icon 2 */}
            <div className="absolute bottom-[73px] left-[73px] -translate-x-1/2 translate-y-1/2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center relative transition-all duration-500"
                style={{
                  backgroundColor: activeIcon === 2 ? '#00CCCC' : '#3b82f6',
                  boxShadow: activeIcon === 2 ? '0 0 20px rgba(0,204,204,0.7)' : '0 0 15px rgba(59,130,246,0.6)'
                }}
              >
                <img src={asset("icon_03.png")} alt="Icon 03" className="w-6 h-6" />
                <span className="absolute right-full mr-5 top-1/2 -translate-y-1/2 text-lg font-bold text-white whitespace-nowrap">코드 검증</span>
              </div>
            </div>

            {/* Bottom Right - icon 3 */}
            <div className="absolute bottom-[73px] right-[73px] translate-x-1/2 translate-y-1/2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center relative transition-all duration-500"
                style={{
                  backgroundColor: activeIcon === 3 ? '#00CCCC' : '#3b82f6',
                  boxShadow: activeIcon === 3 ? '0 0 20px rgba(0,204,204,0.7)' : '0 0 15px rgba(59,130,246,0.6)'
                }}
              >
                <img src={asset("icon_04.png")} alt="Icon 04" className="w-6 h-6" />
                <span className="absolute left-full ml-5 top-1/2 -translate-y-1/2 text-lg font-bold text-white whitespace-nowrap">화이트라벨 배포</span>
              </div>
            </div>
          </div>

          {/* Center Image & Overlay */}
          <div className="relative z-10 w-[380px] h-[380px] rounded-full overflow-hidden border-2 border-brand-blue/30 shadow-[0_0_50px_rgba(59,130,246,0.3)] flex items-center justify-center">
            <img src={asset("img_01.png")} alt="AI-Native Master Workflow" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center">
              <h3 className="text-white text-3xl font-bold tracking-tight">AI-Native Master</h3>
              <p className="text-white/80 text-lg font-medium mt-1">Workflow</p>
            </div>
          </div>
        </div>

        {/* Right: Text Content */}
        <div className="pl-10 md:pl-20">
          <h2 className="text-4xl md:text-[44px] font-bold leading-[1.3] mb-12 text-white">
            복잡한 시스템 구축의 한계,<br />
            AI 통합 워크플로우로 혁신합니다.
          </h2>
          <div className="space-y-6">
            <p className="text-white/60 text-[17px] leading-relaxed font-normal">
              AI 에이전트를 통해 일상의 언어로 요구사항을 정의하면<br />
              AI 위젯 시스템이 최적의 아키텍처를 즉시 조립합니다.<br />
              AI-SDLC 기반의 철저한 보안 검증을 거쳐,<br />
              기업 고유의 브랜드 정체성이 완벽히 반영된 완성형 플랫폼을<br />
              가장 빠르고 안정적으로 배포합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const SolutionShowcase = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isAutoScrolling = useRef(false);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  // Smoothing the scroll progress for horizontal movement - Ultra Fast & Precise
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 50,
    mass: 0.1,
    restDelta: 0.0001
  });

  // Mapping progress (0.2 to 0.9) to horizontal translation
  const x = useTransform(springProgress, [0.2, 0.9], ["0px", "-4656px"]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!targetRef.current || isAutoScrolling.current) return;

      const rect = targetRef.current.getBoundingClientRect();
      const isSticky = rect.top <= 0 && rect.bottom >= window.innerHeight;

      if (isSticky) {
        const atStart = activeIndex === 0 && e.deltaY < 0;
        const atEnd = activeIndex === 3 && e.deltaY > 0;
        
        if (atStart || atEnd) return;

        if (Math.abs(e.deltaY) > 1) { // Ultra-sensitive
          e.preventDefault();
          const direction = e.deltaY > 0 ? 1 : -1;
          const nextIndex = Math.min(Math.max(activeIndex + direction, 0), 3);

          if (nextIndex !== activeIndex) {
            isAutoScrolling.current = true;
            setActiveIndex(nextIndex);

            const snapPoints = [0.2, 0.4333, 0.6666, 0.9];
            const targetP = snapPoints[nextIndex];
            const maxScroll = rect.height - window.innerHeight;
            const targetScrollY = window.scrollY + rect.top + (targetP * maxScroll);

            // High-speed spring for powerful magnet feel
            animate(window.scrollY, targetScrollY, {
              type: "spring",
              stiffness: 350,
              damping: 40,
              mass: 1,
              onUpdate: (latest) => window.scrollTo(0, latest),
              onComplete: () => {
                isAutoScrolling.current = false;
              }
            });
          }
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [activeIndex]);

  // Sync activeIndex with scroll position (for manual scroll/touch)
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (isAutoScrolling.current) return;
      const snapPoints = [0.2, 0.4333, 0.6666, 0.9];
      const closest = snapPoints.reduce((prev, curr, idx) => 
        Math.abs(curr - latest) < Math.abs(snapPoints[prev] - latest) ? idx : prev, 0
      );
      if (closest !== activeIndex) {
        setActiveIndex(closest);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, activeIndex]);

  const solutions = [
    { logo: "aimnis_logo_horizontal.png" },
    { logo: "aimguard_logo_horizontal.png" },
    { logo: "aimnis_logo_horizontal.png" },
    { logo: "aimnis_logo_horizontal.png" },
  ];

  return (
    <section ref={targetRef} className="relative h-[450vh] bg-bg-dark">
      {/* Title is now outside the sticky container so it scrolls away first */}
      <div className="container-custom text-center pt-32 mb-[72px]">
        <h2 className="text-[40px] font-bold mb-2">AIM Solutions</h2>
        <p className="text-[20px] font-normal text-[#C2C2C2]">당신의 비즈니스에 꼭 맞는 AI 솔루션을 찾아보세요.</p>
      </div>

      <div className="sticky top-0 h-screen flex items-center overflow-hidden pt-[160px] pb-20">
        <div className="flex items-center px-[calc((100vw-1472px)/2)]">
          <motion.div style={{ x }} className="flex gap-20">
            {solutions.map((item, i) => (
              <motion.div 
                key={i} 
                animate={{
                  boxShadow: i === activeIndex 
                    ? "0 0 18px 12px rgba(31,94,255,0.4)" 
                    : "0 0 0px 0px rgba(0,0,0,0)",
                  borderColor: i === activeIndex
                    ? "rgba(59,130,246,0.3)"
                    : "#020617"
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-[1472px] h-[780px] flex-shrink-0 bg-[#050810] rounded-[30px] border-2 flex items-center p-20 gap-16 relative overflow-hidden"
              >
                {/* Glowing Backdrop */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-blue/5 blur-[120px] rounded-full pointer-events-none" />
                
                {/* Content (Left) */}
                <div className="flex-1 z-10 flex flex-col gap-10">
                  <img src={asset(item.logo)} alt="Logo" className="w-[280px] h-auto" />
                  <div className="space-y-6">
                    <h3 className="text-[34px] font-bold leading-tight">엔터프라이즈를 위한<br />지능형 마스터 빌더</h3>
                    <p className="text-white/60 text-[18px] leading-relaxed max-w-xl">
                      AI 에이전트는 사용자의 의도를 실시간으로 반영하여, 변화하는 비즈니스 환경에 맞춰 아키텍처를 유연하게 수정하고 발전시킵니다.
                      검증된 위젯 시스템과 AI-SDLC 공정으로 보안과 품질을 견고하게 유지하며, 귀하의 브랜드 DNA가 100% 투영된 독자적인 플랫폼을
                      직접 운영하고 진화시키십시오.
                    </p>
                  </div>
                  <button className="w-[200px] h-[50px] bg-brand-cyan text-bg-dark font-bold rounded-full text-[18px] hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] transition-all mt-4 flex items-center justify-center">
                    자세히 보기
                  </button>
                </div>

                {/* Image (Right) */}
                <div className="flex-1 z-10 flex items-center justify-center">
                  <div className="relative w-full max-w-[650px]">
                    <img 
                      src={asset("img_02.png")} 
                      alt="Solution Visual" 
                      className="w-full h-auto object-contain drop-shadow-[0_0_50px_rgba(59,130,246,0.3)]" 
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const VisionSection = () => {
  const visions = [
    {
      title: "그리드 기반의 고속 조립",
      desc: <>규격화된 위젯과 AI 검증 공정으로<br />구축 시간을 60% 이상 단축</>,
      img: "our vision_01.png"
    },
    {
      title: "완벽한 화이트라벨링",
      desc: <>헤드리스 SDK를 통해 기술은 공유하되,<br />디자인 주권은 완벽히 고객에게 드립니다</>,
      img: "our vision_02.png"
    },
    {
      title: "AI 에이전트와의 협업",
      desc: <>AI 에이전트를 통해 누구나 쉽고 자유롭게<br />시스템을 수정하고 발전시킵니다</>,
      img: "our vision_03.png"
    }
  ];

  return (
    <section id="company" style={{ height: '880px' }} className="flex flex-col justify-center my-[100px]">
      <div className="container-custom text-center mb-16">
        <h2 className="text-[40px] font-bold font-display mb-2">Our Vision</h2>
        <p className="text-[20px] font-normal text-[#C2C2C2]">SI를 넘어, 스스로 진화하는 B2B SaaS의 미래로</p>
      </div>

      <div className="container-custom grid md:grid-cols-3 gap-8">
        {visions.map((v, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group cursor-pointer text-center"
          >
            <div className="relative w-[500px] h-[330px] rounded-2xl overflow-hidden mb-6 mx-auto">
              <img src={asset(v.img)} alt={v.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-bg-dark/40 group-hover:bg-bg-dark/10 transition-colors" />
            </div>
            <h3 className="text-[24px] font-bold text-white mb-2">{v.title}</h3>
            <p className="text-[17px] font-normal text-[#90A1B9] leading-relaxed">{v.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const NewsSection = () => {
  const news = [
    {
      date: "2026-04-27",
      title: "에임위드, MWC 2026서 '에이전트 기반 AI 빌더' AIMNIS 공개... 'SI 시장 판도 바꾼다'",
      category: "NEWS"
    },
    {
      date: "2026-04-20",
      title: "\"말 한마디로 시스템 진화까지\" 에임위드, 엔터프라이즈 전용 '지능형 SaaS' 생태계 구축 가속화",
      category: "NEWS"
    }
  ];

  return (
    <section id="business" className="py-32 bg-cover bg-center" style={{ backgroundImage: `url(${asset("main_news_bg.png")})` }}>
      <div className="container-custom grid md:grid-cols-[350px_1fr] gap-20">
        <div>
          <h2 className="text-[40px] font-bold font-display mb-2">AIMWID News</h2>
          <p className="text-[20px] font-normal text-[#C2C2C2] whitespace-nowrap">에임위드의 새로운 소식을 전해드립니다.</p>
        </div>

        <div className="space-y-6 flex flex-col items-end">
          {news.map((item, i) => (
            <motion.div
              key={i}
              className="glass w-[1000px] h-[240px] p-[40px] rounded-2xl hover:!border-[#00CCCC] hover:shadow-[0_0_50px_rgba(31,94,255,0.5)] transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="mb-1">
                  <span className="text-[14px] font-bold text-brand-blue uppercase">{item.category}</span>
                </div>
                <h3 className="text-[20px] font-medium leading-relaxed text-white">{item.title}</h3>
              </div>
              
              <div className="flex justify-between items-end mt-auto">
                <span className="text-[14px] font-normal text-[#90A1B9]">{item.date}</span>
                <div className="flex items-center gap-2 text-brand-cyan font-bold text-[14px] opacity-0 group-hover:opacity-100 transition-opacity">
                  Read More <ArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const UseCases = () => {
  const cases = [
    {
      tag: "AIM GUARD",
      sub: "일반기업",
      title: "TMS 대기환경 모니터링 시스템",
      img: "use_case_01.png"
    },
    {
      tag: "AIM ECO",
      sub: "일반기업",
      title: "배터리 화재 모니터링 시스템",
      img: "use_case_02.png"
    },
    {
      tag: "AIM GUARD",
      sub: "일반기업",
      title: "도시형 에너지 모니터링 시스템",
      img: "use_case_03.png"
    },
    {
      tag: "AIM TOOLS",
      sub: "일반기업",
      title: "실내공기질 모니터링 시스템",
      img: "use_case_04.png"
    },
    {
      tag: "AIM GUARD",
      sub: "일반기업",
      title: "스마트 팩토리 모니터링 시스템",
      img: "use_case_05.png"
    },
    {
      tag: "AIM TOOLS",
      sub: "일반기업",
      title: "스마트 물류 관제 시스템",
      img: "use_case_01.png"
    }
  ];

  return (
    <section className="py-32">
      <div className="container-custom text-center mb-16">
        <h2 className="text-[40px] font-bold font-display mb-2">Use case</h2>
        <p className="text-[20px] font-normal text-[#C2C2C2]">에임위드의 AI플랫폼을 통한 성공사례를 소개합니다.</p>
      </div>

      <div className="w-full overflow-hidden pl-[40px]">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 40, repeat: Infinity }}
          className="flex gap-6 w-max"
        >
          {[...cases, ...cases].map((c, i) => (
            <div key={i} className="group w-[410px]">
              <div className="relative w-[410px] h-[280px] rounded-2xl overflow-hidden mb-6">
                <img src={asset(c.img)} alt={c.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 via-transparent to-transparent" />
              </div>
              <div className="flex gap-2 mb-3">
                <span className="text-[14px] font-medium bg-[#1493DE] text-white px-[8px] py-[4px] rounded">{c.tag}</span>
                <span className="text-[14px] font-medium bg-white/10 text-white/60 px-[8px] py-[4px] rounded">{c.sub}</span>
              </div>
              <h3 className="font-bold text-lg">{c.title}</h3>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  return (
    <section id="contact" className="pb-32 pt-0 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-brand-cyan/5 rounded-full blur-[140px] -z-10" />

      <div className="relative flex justify-center items-center mb-0 mt-[200px] h-[730px] w-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1237px] bg-center bg-no-repeat bg-contain pointer-events-none" style={{ backgroundImage: `url(${asset("main_partner_bg.png")})` }}></div>
        <h1 className="relative z-10 text-[110px] font-bold font-display text-center leading-[1.1] tracking-[0.16em] text-white drop-shadow-xl pl-[0.16em] -translate-y-[150px]">
          YOUR<br />AI PLATFORM<br />PARTNER
        </h1>
      </div>

      <div className="container-custom flex flex-col lg:flex-row justify-between gap-10">
        <div className="flex-1">
          <h2 className="text-4xl md:text-5xl lg:text-[54px] font-bold font-display mb-8 whitespace-nowrap leading-tight">
            <span className="text-brand-cyan">에임위드</span>와 미래를<br />함께할 파트너
          </h2>
          <p className="text-gray-400 text-lg break-keep">문의사항을 남겨주시면 확인 후 연락드리겠습니다.</p>
        </div>

        <form className="w-full lg:w-[800px] flex-shrink-0 p-10 border border-white/10 rounded-2xl space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[16px] font-medium text-white flex items-center gap-1">이름 <span className="text-brand-cyan">*</span></label>
              <input type="text" placeholder="이름" className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-[16px] font-medium placeholder:font-medium focus:border-brand-cyan outline-none transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-[16px] font-medium text-white flex items-center gap-1">연락처 <span className="text-brand-cyan">*</span></label>
              <input type="text" placeholder="000-0000-0000" className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-[16px] font-medium placeholder:font-medium focus:border-brand-cyan outline-none transition-colors" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[16px] font-medium text-white flex items-center gap-1">기업명 <span className="text-brand-cyan">*</span></label>
              <input type="text" placeholder="기업명" className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-[16px] font-medium placeholder:font-medium focus:border-brand-cyan outline-none transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-[16px] font-medium text-white flex items-center gap-1">직책 <span className="text-brand-cyan">*</span></label>
              <input type="text" placeholder="직책" className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-[16px] font-medium placeholder:font-medium focus:border-brand-cyan outline-none transition-colors" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[16px] font-medium text-white flex items-center gap-1">이메일 <span className="text-brand-cyan">*</span></label>
            <input type="email" placeholder="이메일" className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-[16px] font-medium placeholder:font-medium focus:border-brand-cyan outline-none transition-colors" />
          </div>

          <div className="space-y-2">
            <label className="text-[16px] font-medium text-white">제목</label>
            <input type="text" placeholder="제목" className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-[16px] font-medium placeholder:font-medium focus:border-brand-cyan outline-none transition-colors" />
          </div>

          <div className="space-y-2">
            <label className="text-[16px] font-medium text-white">내용</label>
            <textarea placeholder="내용을 입력하세요." rows={4} className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-[16px] font-medium placeholder:font-medium focus:border-brand-cyan outline-none resize-none transition-colors" />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-0">
            <div className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" id="terms" className="accent-brand-cyan w-5 h-5 cursor-pointer rounded-sm" />
              <label htmlFor="terms" className="text-[16px] font-normal text-gray-400 cursor-pointer select-none">개인정보 수집 및 이용에 동의합니다.</label>
            </div>

            <button type="button" className="flex items-center justify-center w-[200px] h-[50px] bg-brand-cyan text-bg-dark text-[18px] font-bold rounded-[50px] hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all tracking-widest flex-shrink-0">
              문의하기
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-20 border-t border-white/5 bg-[#020617]">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-start gap-16 md:gap-32">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img src={asset("logo_horizontal.png")} alt="AIMWID" className="w-[164px] h-auto" />
          </div>

          {/* Right Content */}
          <div className="flex-1 flex flex-col justify-between w-full">
            {/* Info Text */}
            <div className="text-[16px] text-[#c7c7c7] leading-relaxed font-normal mb-24">
              <div className="flex flex-wrap gap-x-6 mb-1">
                <span>대표이사 : 정해련</span>
                <span>사업자 등록번호 : 733-86-03061</span>
              </div>
              <div className="mb-1">
                주소 : 경기도 안양시 동안구 벌말로 66, B동 805호 (평촌역 하이필드지식산업센터)
              </div>
              <div className="flex flex-wrap gap-x-6">
                <span>Tel : 031-596-2524</span>
                <span>Fax : 031-596-2529</span>
                <span>E-mail : aimwid@aimwid.ai</span>
              </div>
            </div>

            {/* Bottom Links & Copyright */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[16px] text-[#c7c7c7] font-normal">
              <p>© 2023. AIMWID All rights reserved.</p>
              <div className="flex items-center gap-6 mt-4 sm:mt-0">
                <a href="#" className="font-semibold text-[#c7c7c7]">개인정보처리방침</a>
                <a href="#" className="font-normal hover:text-white transition-colors">이용약관</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Toggle visibility
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Check if at the bottom of the page
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      if (scrollTop + windowHeight >= documentHeight - 100) { // Detection threshold
        setIsAtBottom(true);
      } else {
        setIsAtBottom(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      className={`fixed right-12 z-[60] transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      style={{ bottom: isAtBottom ? '230px' : '32px' }}
    >
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-[64px] h-[64px] bg-[#020617]/60 border border-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[#0C4B8B] transition-all shadow-lg hover:shadow-[0_0_20px_rgba(12,75,139,0.5)]"
      >
        <ArrowUp size={28} />
      </button>
    </div>
  );
};

const Home = () => {
  return (
    <>
      <Hero />
      <WorkflowDetails />
      <SolutionShowcase />
      <VisionSection />
      <NewsSection />
      <UseCases />
      <ContactSection />
    </>
  );
};

// Helper component to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <div className="min-h-screen bg-bg-dark selection:bg-brand-cyan/20 relative">
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aimguard" element={<AimGuard />} />
        <Route path="/aimguard/license" element={<AimGuardLicense />} />
        <Route path="/aimnis" element={<AimNis />} />
        <Route path="/solution" element={<Solution />} />
        <Route path="/business" element={<Business />} />
        <Route path="/company" element={<Company />} />
      </Routes>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
