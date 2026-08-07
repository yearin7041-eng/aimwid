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
  Settings,
  Lightbulb,
  SquareMousePointer,
  CheckCheck,
  UploadCloud
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, animate, useMotionValue, useAnimationFrame } from "motion/react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import AimGuard from "./pages/AimGuard";
import AimGuardLicense from "./pages/AimGuardLicense";
import AimNis from "./pages/AimNis";
import Solution from "./pages/Solution";
import Business from "./pages/Business";
import Company from "./pages/Company";
import CompanyLocation from "./pages/CompanyLocation";
import Contact from "./pages/Contact";
import ContactSection from "./components/ContactSection";
import SitePopup from "./components/SitePopup";
import newsContent from "./content/news.json";
import { SOLUTION_SUBS, subRoute, ROUTED, COMPANY_SUBS, companySubRoute } from "./nav";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

// --- Components ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // "Solution" is a parent, not a page — it lights up on any of the three routes under it, or landing
  // on /aimnis would leave the whole bar looking inert.
  const isActive = (item: string) =>
    item === "Solution"
      ? SOLUTION_SUBS.some((s) => subRoute(s) === pathname)
      : item === "Company"
        ? COMPANY_SUBS.some((s) => companySubRoute(s) === pathname)
        : ROUTED[item] === pathname;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`absolute top-0 left-0 right-0 z-50 transition-all duration-300 flex items-center h-[80px] ${mobileMenuOpen ? "bg-bg-dark" : scrolled ? "bg-bg-dark/80 backdrop-blur-md" : "bg-transparent"}`}>
      <div className="w-full flex items-center justify-between container-custom relative">
        {/* Logo (Left) */}
        <div className="flex items-center z-10">
          <Link to="/">
            <img src={asset("logo_horizontal.png")} alt="AIMWID" className="w-[120px] md:w-[164px] h-auto" />
          </Link>
        </div>

        {/* Menu (Center) */}
        <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2" style={{ gap: '100px' }}>
          {["Solution", "Business", "Company", "Contact"].map((item) => {
            if (item === "Solution") {
              return (
                <div key={item} className="relative group flex items-center h-[80px]">
                  {/* Parent links to /solution (the Industries overview), same as the Company parent →
                      /company. It used to be an <a href="#solution"> anchor that only worked on Home and
                      did nothing on every other page (user, 2026-07-24). */}
                  <Link to="/solution" onClick={() => window.scrollTo(0, 0)} className={`text-[18px] font-semibold group-hover:text-brand-cyan transition-colors flex items-center gap-1 cursor-pointer ${isActive(item) ? "text-brand-cyan" : "text-white"}`}>
                    {item} <ChevronDown size={16} className="mt-0.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </Link>
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
            if (item === "Company") {
              // Same dropdown as Solution, but the parent is a real Link (→ /company, the 회사개요
              // overview) rather than an anchor, because Company owns a page and Solution does not.
              return (
                <div key={item} className="relative group flex items-center h-[80px]">
                  <Link
                    to="/company"
                    onClick={() => window.scrollTo(0, 0)}
                    className={`text-[18px] font-semibold group-hover:text-brand-cyan transition-colors flex items-center gap-1 cursor-pointer ${isActive(item) ? "text-brand-cyan" : "text-white"}`}
                  >
                    {item} <ChevronDown size={16} className="mt-0.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <div className="absolute top-[65px] left-1/2 -translate-x-1/2 pt-2 w-[160px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="bg-bg-dark/95 backdrop-blur-md border border-brand-cyan/20 rounded-xl overflow-hidden shadow-2xl flex flex-col py-2">
                      {COMPANY_SUBS.map((subItem) => (
                        <Link
                          key={subItem}
                          to={companySubRoute(subItem)}
                          onClick={() => window.scrollTo(0, 0)}
                          className={`px-5 py-3 text-[15px] font-medium hover:text-brand-cyan hover:bg-brand-cyan/10 transition-colors text-center ${pathname === companySubRoute(subItem) ? "text-brand-cyan bg-brand-cyan/10" : "text-white/80"}`}
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
        <div className="flex justify-end z-50">
          <button className="md:hidden text-white relative w-6 h-6" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="메뉴 열기/닫기">
            <AnimatePresence mode="wait" initial={false}>
              {mobileMenuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <X size={24} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Menu size={24} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}
        {mobileMenuOpen && (
          <motion.div
            key="nav-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-40 h-[100dvh] w-[80%] max-w-[320px] overflow-y-auto bg-bg-dark border-l border-white/10 px-6 pt-24 pb-8 flex flex-col gap-4 md:hidden"
          >
            {["Solution", "Business", "Company", "Contact"].map((item) => (
              <div key={item} className="flex flex-col">
                {ROUTED[item] || item === "Company" || item === "Solution" ? (
                  <Link
                    to={item === "Company" ? "/company" : item === "Solution" ? "/solution" : ROUTED[item]}
                    className={`text-[20px] font-semibold py-2 flex items-center justify-between transition-colors ${isActive(item) ? "text-brand-cyan" : "text-white"}`}
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
                    className={`text-[20px] font-semibold py-2 flex items-center justify-between transition-colors ${isActive(item) ? "text-brand-cyan" : "text-white"}`}
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
                {item === "Company" && (
                  <div className="flex flex-col pl-4 border-l-2 border-brand-cyan/30 ml-2 mt-1 mb-2 gap-3 py-2">
                    {COMPANY_SUBS.map((subItem) => (
                      <Link
                        key={subItem}
                        to={companySubRoute(subItem)}
                        className={`text-base transition-colors hover:text-brand-cyan ${pathname === companySubRoute(subItem) ? "text-brand-cyan" : "text-white/70"}`}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          window.scrollTo(0, 0);
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
    <section className="relative min-h-[100dvh] md:min-h-screen flex items-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={asset("main_hero_video.mp4")} type="video/mp4" />
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
          <h1 className="text-[26px] sm:text-4xl md:text-7xl font-bold font-display leading-[1.3] md:leading-[1.2] mb-8 tracking-tight text-white text-center break-keep">
            데이터 연동부터 통합관제까지,<br />
            <span className="md:whitespace-nowrap">스스로 진화하는 엔터프라이즈 AI 플랫폼</span>
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
    <section id="process" className="relative py-20 md:py-0 md:h-[900px] flex items-center overflow-hidden">
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
        <div className="relative flex items-center justify-center w-full h-[360px] md:h-[600px]">
          {/* Dashed rounded frame (anchor). Per Figma 642-417: 456px, rounded-[120px], white dashed
              border. The image sits inset ~11% inside it; the 4 icons ride the frame's rounded corners. */}
          <div className="relative w-[250px] h-[250px] md:w-[456px] md:h-[456px] rounded-[64px] md:rounded-[120px] border-2 border-dashed border-white/40">
            {/* Inset graphic image (356 in 456 → ~11% gap), rounded-[90px] */}
            <div className="absolute inset-[11%] rounded-[48px] md:rounded-[90px] overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.25)]">
              <img src={asset("main_workflow_hands.png")} alt="AI-Native Master Workflow" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-center px-3">
                <h3 className="text-white text-[18px] md:text-[32px] font-bold tracking-tight leading-[1.3] drop-shadow-[0_0_3px_rgba(2,6,26,0.6)]">AI-Native Master</h3>
                <p className="text-white text-[12px] md:text-[24px] font-medium leading-[1.3] drop-shadow-[0_0_3px_rgba(2,6,26,0.6)]">Workflow</p>
              </div>
            </div>

            {/* Corner icons on the frame's rounded corners (active-cycling color) */}
            {/* Top Left - icon 0 */}
            <div className="absolute top-[7%] left-[7%] -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-[10px] flex items-center justify-center relative transition-all duration-500" style={{ backgroundColor: activeIcon === 0 ? '#00CCCC' : '#3b82f6', boxShadow: activeIcon === 0 ? '0 0 20px rgba(47,212,196,0.7)' : '0 0 15px rgba(59,130,246,0.6)' }}>
                <Lightbulb className="w-6 h-6 text-white" strokeWidth={2} />
                <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 md:bottom-auto md:mb-0 md:left-auto md:translate-x-0 md:right-full md:mr-3 md:top-1/2 md:-translate-y-1/2 text-[12px] md:text-xl font-medium md:font-bold text-white whitespace-nowrap">구상 및 정의</span>
              </div>
            </div>

            {/* Top Right - icon 1 */}
            <div className="absolute top-[7%] right-[7%] translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-[10px] flex items-center justify-center relative transition-all duration-500" style={{ backgroundColor: activeIcon === 1 ? '#00CCCC' : '#3b82f6', boxShadow: activeIcon === 1 ? '0 0 20px rgba(47,212,196,0.7)' : '0 0 15px rgba(59,130,246,0.6)' }}>
                <SquareMousePointer className="w-6 h-6 text-white" strokeWidth={2} />
                <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 md:bottom-auto md:mb-0 md:translate-x-0 md:left-full md:ml-3 md:top-1/2 md:-translate-y-1/2 text-[12px] md:text-xl font-medium md:font-bold text-white whitespace-nowrap">지능형 조립</span>
              </div>
            </div>

            {/* Bottom Left - icon 2 */}
            <div className="absolute bottom-[7%] left-[7%] -translate-x-1/2 translate-y-1/2 z-10">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-[10px] flex items-center justify-center relative transition-all duration-500" style={{ backgroundColor: activeIcon === 2 ? '#00CCCC' : '#3b82f6', boxShadow: activeIcon === 2 ? '0 0 20px rgba(47,212,196,0.7)' : '0 0 15px rgba(59,130,246,0.6)' }}>
                <CheckCheck className="w-6 h-6 text-white" strokeWidth={2} />
                <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 md:top-1/2 md:mt-0 md:left-auto md:translate-x-0 md:right-full md:mr-3 md:-translate-y-1/2 text-[12px] md:text-xl font-medium md:font-bold text-white whitespace-nowrap">코드 검증</span>
              </div>
            </div>

            {/* Bottom Right - icon 3 */}
            <div className="absolute bottom-[7%] right-[7%] translate-x-1/2 translate-y-1/2 z-10">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-[10px] flex items-center justify-center relative transition-all duration-500" style={{ backgroundColor: activeIcon === 3 ? '#00CCCC' : '#3b82f6', boxShadow: activeIcon === 3 ? '0 0 20px rgba(47,212,196,0.7)' : '0 0 15px rgba(59,130,246,0.6)' }}>
                <UploadCloud className="w-6 h-6 text-white" strokeWidth={2} />
                <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 md:top-1/2 md:mt-0 md:translate-x-0 md:left-full md:ml-3 md:-translate-y-1/2 text-[12px] md:text-xl font-medium md:font-bold text-white whitespace-nowrap break-keep">화이트라벨 배포</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Text Content */}
        <div className="md:pl-20">
          <h2 className="text-[26px] sm:text-4xl md:text-[44px] font-bold leading-[1.3] mb-4 md:mb-12 text-white break-keep">
            복잡한 시스템 구축의 한계,<br />
            AI 통합 워크플로우로 혁신합니다.
          </h2>
          <div className="space-y-6">
            <p className="text-white/60 text-[16px] md:text-[17px] leading-relaxed font-normal break-keep">
              AI 에이전트를 통해 일상의 언어로 요구사항을 정의하면<br className="hidden md:block" />
              AI 위젯 시스템이 최적의 아키텍처를 즉시 조립합니다.<br className="hidden md:block" />
              AI-SDLC 기반의 철저한 보안 검증을 거쳐,<br className="hidden md:block" />
              기업 고유의 브랜드 정체성이 완벽히 반영된 완성형 플랫폼을<br className="hidden md:block" />
              가장 빠르고 안정적으로 배포합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Feathers each showcase visual's edges into the card — an elliptical alpha fade, opaque core to
// transparent rim, so no image reads as a hard rectangle (user, 2026-07-28).
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
  // 3 slides: each card is 1472px + 80px gap = 1552px, so bringing the 3rd into view travels 2×1552.
  const x = useTransform(springProgress, [0.2, 0.9], ["0px", "-3104px"]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Desktop only — the mobile layout is a plain vertical stack (lg:hidden), so the scroll-jack /
      // horizontal parallax must not hijack touch/narrow-width scrolling.
      if (window.innerWidth < 1024) return;
      if (!targetRef.current || isAutoScrolling.current) return;

      const rect = targetRef.current.getBoundingClientRect();
      const isSticky = rect.top <= 0 && rect.bottom >= window.innerHeight;

      if (isSticky) {
        const atStart = activeIndex === 0 && e.deltaY < 0;
        const atEnd = activeIndex === 2 && e.deltaY > 0;

        if (atStart || atEnd) return;

        if (Math.abs(e.deltaY) > 1) { // Ultra-sensitive
          e.preventDefault();
          const direction = e.deltaY > 0 ? 1 : -1;
          const nextIndex = Math.min(Math.max(activeIndex + direction, 0), 2);

          if (nextIndex !== activeIndex) {
            isAutoScrolling.current = true;
            setActiveIndex(nextIndex);

            const snapPoints = [0.2, 0.55, 0.9];
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
      const snapPoints = [0.2, 0.55, 0.9];
      const closest = snapPoints.reduce((prev, curr, idx) => 
        Math.abs(curr - latest) < Math.abs(snapPoints[prev] - latest) ? idx : prev, 0
      );
      if (closest !== activeIndex) {
        setActiveIndex(closest);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, activeIndex]);

  // Three real solutions (user, 2026-07-28): the two branded products plus the industry-solution lineup.
  // The showcase used to carry four slides, but two were AIMNIS placeholders with the copy hard-coded —
  // AIM ECO/GRID/PULSE aren't productised yet, so 자세히 보기 now points only where a real page exists.
  const solutions = [
    {
      logo: "aimnis_logo_horizontal.png",
      // Built from img_02.png: padded on top/bottom only to a 1.2:1 frame — same aspect as cards 2 & 3, so
      // all three render at the same height (~625px) and the card/sticky overflow-hidden never clips it. The
      // infinity keeps its full width (not shrunk); the baked elliptical alpha fade lands on that vertical
      // margin + the side edges, so the loops stay whole and dissolve into the card.
      img: "aimnis_wide.webp",
      to: "/aimnis",
      title: <>엔터프라이즈를 위한<br />지능형 마스터 빌더</>,
      body: "AI 에이전트는 사용자의 의도를 실시간으로 반영하여, 변화하는 비즈니스 환경에 맞춰 아키텍처를 유연하게 수정하고 발전시킵니다. 검증된 위젯 시스템과 AI-SDLC 공정으로 보안과 품질을 견고하게 유지하며, 귀하의 브랜드 DNA가 100% 투영된 독자적인 플랫폼을 직접 운영하고 진화시키십시오.",
    },
    {
      logo: "aimguard_logo_horizontal.png",
      // From aimguard_hero_main.webp: cropped to drop the empty left ~40% (built for the hero's right side),
      // padded, then an alpha fade baked in so the dashboard floats and dissolves into the card like the rest.
      img: "aimguard_hub.webp",
      to: "/aimguard",
      title: <>산업 현장의 안전을 지키는<br />AI 영상 분석 솔루션</>,
      body: "실시간 영상 분석과 지능형 알림으로 위험을 감지하기 전에 대응합니다. 안전장비 착용, 위험 구역 접근, 낙상, 화재·연기까지 AI가 24시간 감지하여 사고를 사전에 예방하고 안전한 현장을 만듭니다.",
    },
    {
      label: <>Industry <span className="text-brand-cyan">Solutions</span></>,
      // From the Solution page's solution_card_city_v.webp: cropped to ~1.2:1 (empty left band removed) to
      // match the other cards' size, padded, then an alpha fade baked in so the edges dissolve into the card.
      img: "city_hub.webp",
      to: "/solution",
      title: <>현장에서 검증된<br />산업별 AI 솔루션</>,
      body: "에너지, 스마트시티, 안전 등 다양한 산업 현장의 요구에 맞춘 AI 솔루션 라인업입니다. 검증된 플랫폼을 기반으로 각 산업의 문제를 해결하고, 현장에 최적화된 가치를 제공합니다.",
    },
  ];

  return (
    <section ref={targetRef} className="relative lg:h-[350vh] bg-bg-dark">
      {/* Title is now outside the sticky container so it scrolls away first */}
      <div className="container-custom text-center pt-20 lg:pt-32 mb-10 lg:mb-[72px]">
        <h2 className="text-[28px] md:text-[40px] font-bold font-display mb-2">AIM Solutions</h2>
        <p className="text-[16px] md:text-[20px] font-normal text-[#C2C2C2] break-keep">산업의 문제를 푸는 AI, AIM 솔루션 시리즈</p>
      </div>

      {/* Mobile: the desktop scroll-jack (wheel-driven horizontal 1472px cards) can't work on touch, so
          the three solutions stack vertically as normal cards instead. */}
      <div className="lg:hidden container-custom flex flex-col gap-6 pb-16">
        {solutions.map((item, i) => (
          <div key={i} className="relative overflow-hidden rounded-[24px] border-2 border-brand-blue/20 bg-[#050810] p-6 flex flex-col gap-5">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] bg-brand-blue/5 blur-[100px] rounded-full pointer-events-none" />
            {item.logo ? (
              <img src={asset(item.logo)} alt="Logo" className="relative z-10 w-[170px] h-auto" />
            ) : (
              <span className="relative z-10 text-[26px] font-bold font-display tracking-tight text-white leading-none">{item.label}</span>
            )}
            <img src={asset(item.img)} alt="Solution Visual" className="relative z-10 w-full h-auto object-contain" />
            <h3 className="relative z-10 text-[22px] font-bold leading-tight break-keep">{item.title}</h3>
            <p className="relative z-10 text-white/60 text-[15px] leading-relaxed break-keep">{item.body}</p>
            <Link
              to={item.to}
              onClick={() => window.scrollTo(0, 0)}
              className="relative z-10 mt-1 flex h-[44px] w-full items-center justify-center rounded-full bg-brand-cyan text-[16px] font-bold text-bg-dark transition-all hover:shadow-[0_0_30px_rgba(47,212,196,0.4)]"
            >
              자세히 보기
            </Link>
          </div>
        ))}
      </div>

      <div className="hidden lg:flex sticky top-0 h-screen items-center overflow-hidden pt-[120px] pb-20">
        <div className="flex items-center px-[calc((100vw-1472px)/2)]">
          <motion.div style={{ x }} className="flex gap-20">
            {solutions.map((item, i) => (
              <motion.div 
                key={i} 
                animate={{
                  boxShadow: i === activeIndex 
                    ? "0 0 18px 12px rgba(47,212,196,0.4)"
                    : "0 0 0px 0px rgba(0,0,0,0)",
                  borderColor: i === activeIndex
                    ? "rgba(47,212,196,0.35)"
                    : "#020617"
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-[1472px] h-[min(760px,100vh_-_200px)] flex-shrink-0 bg-[#050810] rounded-[30px] border-2 flex items-center p-20 gap-16 relative overflow-hidden"
              >
                {/* Glowing Backdrop */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-blue/5 blur-[120px] rounded-full pointer-events-none" />
                
                {/* Content (Left) */}
                <div className="flex-1 z-10 flex flex-col gap-10">
                  {item.logo ? (
                    <img src={asset(item.logo)} alt="Logo" className="w-[280px] h-auto" />
                  ) : (
                    <span className="text-[40px] font-bold font-display tracking-tight text-white leading-none">{item.label}</span>
                  )}
                  <div className="space-y-6">
                    <h3 className="text-[34px] font-bold leading-tight break-keep">{item.title}</h3>
                    <p className="text-white/60 text-[18px] leading-relaxed max-w-xl break-keep">
                      {item.body}
                    </p>
                  </div>
                  <Link
                    to={item.to}
                    onClick={() => window.scrollTo(0, 0)}
                    className="w-[200px] h-[50px] bg-brand-cyan text-bg-dark font-bold rounded-full text-[18px] hover:shadow-[0_0_30px_rgba(47,212,196,0.4)] transition-all mt-4 flex items-center justify-center"
                  >
                    자세히 보기
                  </Link>
                </div>

                {/* Image (Right). Takes 1.5× the content column's width so the visual reads large. Each image
                    has its edge-fade baked in (a transparent feathered rim), so it dissolves into the card
                    with no rectangle — no CSS mask needed. */}
                <div className="flex-[1.5] z-10 flex items-center justify-center">
                  <div className="relative w-full max-w-[820px]">
                    <img
                      src={asset(item.img)}
                      alt="Solution Visual"
                      className="w-full h-auto object-contain"
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
    <section id="vision" className="flex flex-col justify-center py-16 my-0 md:h-[880px] md:py-0 md:my-[100px]">
      <div className="container-custom text-center mb-12 md:mb-16">
        <h2 className="text-[28px] md:text-[40px] font-bold font-display mb-2">Our Vision</h2>
        <p className="text-[16px] md:text-[20px] font-normal text-[#C2C2C2] break-keep">SI를 넘어, 스스로 진화하는 B2B SaaS의 미래로</p>
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
            <div className="relative w-full max-w-[500px] h-[220px] md:h-[330px] rounded-2xl overflow-hidden mb-6 mx-auto">
              <img src={asset(v.img)} alt={v.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-bg-dark/40 group-hover:bg-bg-dark/10 transition-colors" />
            </div>
            <h3 className="text-[20px] font-bold text-white mb-2">{v.title}</h3>
            <p className="text-[15px] md:text-[17px] font-normal text-[#90A1B9] leading-relaxed break-keep">{v.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// TO CHANGE THE NEWS: edit src/content/news.json — NOT this file. Kept as plain data there so it can be
// edited without touching code, and so a Git-based CMS can own it.
const NewsSection = () => {
  const news = newsContent.items;

  return (
    <section id="news" className="py-20 md:py-32 bg-cover bg-center" style={{ backgroundImage: `url(${asset("main_news_bg.png")})` }}>
      <div className="container-custom grid md:grid-cols-[350px_1fr] gap-10 md:gap-20">
        <div>
          <h2 className="text-[28px] md:text-[40px] font-bold font-display mb-2">AIMWID News</h2>
          <p className="text-[16px] md:text-[20px] font-normal text-[#C2C2C2] md:whitespace-nowrap break-keep">에임위드의 새로운 소식을 전해드립니다.</p>
        </div>

        <div className="space-y-6 flex flex-col items-end">
          {news.map((item, i) => (
            <motion.div
              key={i}
              className="glass w-full max-w-[1000px] h-auto md:h-[240px] p-6 md:p-[40px] rounded-2xl hover:!border-[#00CCCC] hover:shadow-[0_0_50px_rgba(31,94,255,0.5)] transition-all duration-300 cursor-pointer group flex flex-col justify-between gap-4 md:gap-0"
            >
              <div>
                <div className="mb-1">
                  <span className="text-[12px] md:text-[14px] font-bold text-brand-blue uppercase">{item.category}</span>
                </div>
                <h3 className="text-[16px] md:text-[20px] font-medium leading-relaxed text-white">{item.title}</h3>
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
  // The six industry solutions from the /solution (Industries) page (user, 2026-07-28) — keeps the home
  // use-cases consistent with that page and drops the old placeholder tags (AIM ECO/TOOLS aren't products).
  const cases = [
    { tag: "작업자 안전", title: "작업자 안전·위험성 평가 AI 솔루션", img: "usecase_safety.jpg" },
    { tag: "전력 데이터", title: "발전 데이터 비즈니스 연계 플랫폼", img: "usecase_power.jpg" },
    { tag: "스마트시티", title: "스마트시티 데이터 통합 플랫폼", img: "usecase_smartcity.jpg" },
    { tag: "스마트빌리지", title: "지역 맞춤형 스마트 시설 통합 운영 플랫폼", img: "usecase_village.jpg" },
    { tag: "에너지 운영", title: "발전·에너지 운영 최적화 솔루션", img: "usecase_energy.jpg" },
    { tag: "통합환경 감시", title: "통합환경 감시시스템", img: "usecase_env.jpg" },
  ];

  // Smooth marquee: advance the track each frame and EASE the speed (0..1) rather than hard-pausing —
  // hover glides it to a stop, leaving glides it back up to full speed. Loops seamlessly at -50% because
  // the card list is rendered twice.
  const trackX = useMotionValue(0);
  const speed = useMotionValue(1);
  const reduce = useRef(false);
  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce.current) speed.set(0);
  }, [speed]);
  useAnimationFrame((_, delta) => {
    const next = trackX.get() - (delta / 1000) * (50 / 40) * speed.get(); // 40s per -50% at full speed
    trackX.set(next <= -50 ? next + 50 : next);
  });
  const trackXPercent = useTransform(trackX, (v) => `${v}%`);

  return (
    <section className="py-20 md:py-32">
      <div className="container-custom text-center mb-12 md:mb-16">
        <h2 className="text-[28px] md:text-[40px] font-bold font-display mb-2">Use case</h2>
        <p className="text-[16px] md:text-[20px] font-normal text-[#C2C2C2] break-keep">산업 현장에 적용된 에임위드의 AI 솔루션을 소개합니다.</p>
      </div>

      {/* Mobile: static 2-col grid instead of the auto-marquee — moving content is hard to read/tap on
          a phone. Desktop keeps the marquee below. */}
      <div className="md:hidden container-custom grid grid-cols-2 gap-x-4 gap-y-8">
        {cases.map((c, i) => (
          <Link key={i} to="/solution" onClick={() => window.scrollTo(0, 0)} className="group block">
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl border border-white/10 bg-[#0a1420] mb-3">
              <img src={asset(c.img)} alt={c.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 via-transparent to-transparent" />
            </div>
            <span className="mb-2 inline-block rounded bg-[#1493DE] px-2 py-1 text-[13px] font-medium text-white">{c.tag}</span>
            <h3 className="text-[15px] font-bold leading-snug break-keep">{c.title}</h3>
          </Link>
        ))}
      </div>

      <div className="hidden md:block w-full overflow-hidden md:pl-[40px]">
        <motion.div
          style={{ x: trackXPercent, z: 0, willChange: "transform", backfaceVisibility: "hidden" }}
          onMouseEnter={() => { if (!reduce.current) animate(speed, 0, { duration: 0.35, ease: "easeOut" }); }}
          onMouseLeave={() => { if (!reduce.current) animate(speed, 1, { duration: 0.9, ease: "easeInOut" }); }}
          className="flex gap-6 w-max transform-gpu"
        >
          {[...cases, ...cases].map((c, i) => (
            <Link key={i} to="/solution" onClick={() => window.scrollTo(0, 0)} className="group w-[300px] md:w-[410px] block">
              <div className="relative w-full h-[200px] md:h-[280px] rounded-2xl overflow-hidden mb-6 border border-white/10 bg-[#0a1420]">
                <img src={asset(c.img)} alt={c.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 via-transparent to-transparent" />
              </div>
              <div className="flex gap-2 mb-3">
                <span className="text-[14px] font-medium bg-[#1493DE] text-white px-[8px] py-[4px] rounded">{c.tag}</span>
              </div>
              <h3 className="font-bold text-lg">{c.title}</h3>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ContactSection moved to src/components/ContactSection.tsx (2026-07-22) so the /contact page and Home
// can share it. It is imported at the top of this file.

const Footer = () => {
  // Legal pages (개인정보처리방침 / 이용약관) are not written yet, so the links show a transient
  // "준비 중입니다" notice instead of navigating to a dead href="#" (user, 2026-07-24). Swap the button
  // back to a <Link to="/privacy"> etc. once the documents exist.
  const [notice, setNotice] = useState(false);
  const showNotice = () => {
    setNotice(true);
    window.setTimeout(() => setNotice(false), 2000);
  };
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
            <div className="text-[15px] md:text-[16px] text-[#c7c7c7] leading-relaxed font-normal mb-12 md:mb-24">
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
                <button type="button" onClick={showNotice} className="font-semibold text-[#c7c7c7] hover:text-white transition-colors">개인정보처리방침</button>
                <button type="button" onClick={showNotice} className="font-normal hover:text-white transition-colors">이용약관</button>
                <span className={`text-[14px] text-brand-cyan transition-opacity duration-300 ${notice ? "opacity-100" : "opacity-0"}`}>준비 중입니다</span>
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
        <Route path="/company/location" element={<CompanyLocation />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
      <ScrollToTopButton />
      {/* Site-entry notice. Mounted at the root, not per-page, so it fires once on arrival whatever the
          landing route is — and is not re-triggered by navigation between pages. */}
      <SitePopup />
    </div>
  );
}
