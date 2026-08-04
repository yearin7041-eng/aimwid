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
        <div className="flex justify-end z-10">
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
            className="fixed inset-0 top-[80px] z-40 bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}
        {mobileMenuOpen && (
          <motion.div
            key="nav-panel"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 z-50 bg-bg-dark border-b border-white/10 p-6 flex flex-col gap-4 md:hidden"
          >
            {["Solution", "Business", "Company", "Contact"].map((item) => (
              <div key={item} className="flex flex-col">
                {ROUTED[item] || item === "Company" || item === "Solution" ? (
                  <Link
                    to={item === "Company" ? "/company" : item === "Solution" ? "/solution" : ROUTED[item]}
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
    <section className="relative min-h-[70vh] md:min-h-screen flex items-center overflow-hidden">
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
          {/* 500x500 Orbit Wrapper */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] z-0">
            {/* Rotating: Dashed Circle + Arrows together (clockwise) */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              {/* Dashed Circle Border */}
              <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full">
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
            <div className="absolute top-[14.6%] left-[14.6%] -translate-x-1/2 -translate-y-1/2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center relative transition-all duration-500"
                style={{
                  backgroundColor: activeIcon === 0 ? '#00CCCC' : '#3b82f6',
                  boxShadow: activeIcon === 0 ? '0 0 20px rgba(47,212,196,0.7)' : '0 0 15px rgba(59,130,246,0.6)'
                }}
              >
                <img src={asset("icon_01.png")} alt="Icon 01" className="w-6 h-6" />
                <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 md:bottom-auto md:mb-0 md:left-auto md:translate-x-0 md:right-full md:mr-5 md:top-1/2 md:-translate-y-1/2 text-[15px] md:text-xl font-bold text-white whitespace-nowrap">구상 및 정의</span>
              </div>
            </div>

            {/* Top Right - icon 1 */}
            <div className="absolute top-[14.6%] right-[14.6%] translate-x-1/2 -translate-y-1/2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center relative transition-all duration-500"
                style={{
                  backgroundColor: activeIcon === 1 ? '#00CCCC' : '#3b82f6',
                  boxShadow: activeIcon === 1 ? '0 0 20px rgba(47,212,196,0.7)' : '0 0 15px rgba(59,130,246,0.6)'
                }}
              >
                <img src={asset("icon_02.png")} alt="Icon 02" className="w-6 h-6" />
                <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 md:bottom-auto md:mb-0 md:translate-x-0 md:left-full md:ml-5 md:top-1/2 md:-translate-y-1/2 text-[15px] md:text-xl font-bold text-white whitespace-nowrap">지능형 조립</span>
              </div>
            </div>

            {/* Bottom Left - icon 2 */}
            <div className="absolute bottom-[14.6%] left-[14.6%] -translate-x-1/2 translate-y-1/2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center relative transition-all duration-500"
                style={{
                  backgroundColor: activeIcon === 2 ? '#00CCCC' : '#3b82f6',
                  boxShadow: activeIcon === 2 ? '0 0 20px rgba(47,212,196,0.7)' : '0 0 15px rgba(59,130,246,0.6)'
                }}
              >
                <img src={asset("icon_03.png")} alt="Icon 03" className="w-6 h-6" />
                <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 md:top-1/2 md:mt-0 md:left-auto md:translate-x-0 md:right-full md:mr-5 md:-translate-y-1/2 text-[15px] md:text-xl font-bold text-white whitespace-nowrap">코드 검증</span>
              </div>
            </div>

            {/* Bottom Right - icon 3 */}
            <div className="absolute bottom-[14.6%] right-[14.6%] translate-x-1/2 translate-y-1/2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center relative transition-all duration-500"
                style={{
                  backgroundColor: activeIcon === 3 ? '#00CCCC' : '#3b82f6',
                  boxShadow: activeIcon === 3 ? '0 0 20px rgba(47,212,196,0.7)' : '0 0 15px rgba(59,130,246,0.6)'
                }}
              >
                <img src={asset("icon_04.png")} alt="Icon 04" className="w-6 h-6" />
                <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 md:top-1/2 md:mt-0 md:translate-x-0 md:left-full md:ml-5 md:-translate-y-1/2 text-[15px] md:text-xl font-bold text-white whitespace-nowrap">화이트라벨 배포</span>
              </div>
            </div>
          </div>

          {/* Center core (no image) — more transparent so the background shows through; a soft dark halo
              + blur + text-shadow keep the text readable at the center while the rim stays see-through. */}
          <div className="relative z-10 w-[210px] h-[210px] md:w-[380px] md:h-[380px] rounded-full overflow-hidden border-2 border-brand-blue/30 shadow-[0_0_50px_rgba(59,130,246,0.3)] bg-[#050d1c]/10 backdrop-blur-md flex flex-col items-center justify-center text-center">
            <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle at 50% 50%, rgba(5,13,28,0.4) 0%, rgba(5,13,28,0) 55%)" }} />
            <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle at 50% 42%, rgba(47,212,196,0.14), transparent 65%)" }} />
            <h3 className="relative text-white text-lg md:text-3xl font-bold tracking-tight [text-shadow:0_2px_14px_rgba(2,6,23,0.9)]">AI-Native Master</h3>
            <p className="relative text-white/80 text-sm md:text-lg font-medium mt-1 [text-shadow:0_2px_10px_rgba(2,6,23,0.9)]">Workflow</p>
          </div>
        </div>

        {/* Right: Text Content */}
        <div className="md:pl-20">
          <h2 className="text-[26px] sm:text-4xl md:text-[44px] font-bold leading-[1.3] mb-8 md:mb-10 text-white break-keep">
            복잡한 시스템 구축의 한계,<br />
            AI 통합 워크플로우로 혁신합니다.
          </h2>
          <p className="text-white/60 text-[16px] md:text-[17px] leading-relaxed font-normal break-keep">
            AI 에이전트가 요구사항을 구조화하고, AI 위젯 시스템이<br className="hidden md:block" />
            최적의 아키텍처를 즉시 조립합니다. 보안 검증을 거쳐<br className="hidden md:block" />
            브랜드가 반영된 완성형 플랫폼을 배포합니다.
          </p>
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
    { tag: "에너지 운영", title: "발전·에너지 운영 최적화 솔루션", img: "solution_card_energy_v.webp" },
    { tag: "통합환경 감시", title: "통합환경 감시시스템", img: "solution_card_tms_v.webp" },
    { tag: "전력 데이터", title: "발전 데이터 비즈니스 연계 플랫폼", img: "solution_card_power_v6.webp" },
    { tag: "스마트시티", title: "스마트시티 데이터 통합 플랫폼", img: "solution_card_city_v.webp" },
    { tag: "스마트빌리지", title: "지역 맞춤형 스마트 시설 통합 운영 플랫폼", img: "solution_card_village_v.webp" },
    { tag: "작업자 안전", title: "작업자 안전·위험성 평가 AI 솔루션", img: "solution_card_safety_v.webp" },
  ];

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
            <span className="mb-2 inline-block rounded bg-[#1493DE] px-2 py-1 text-[12px] font-medium text-white">{c.tag}</span>
            <h3 className="text-[15px] font-bold leading-snug break-keep transition-colors group-hover:text-brand-cyan">{c.title}</h3>
          </Link>
        ))}
      </div>

      <div className="hidden md:block w-full overflow-hidden md:pl-[40px]">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 40, repeat: Infinity }}
          className="flex gap-6 w-max"
        >
          {[...cases, ...cases].map((c, i) => (
            <Link key={i} to="/solution" onClick={() => window.scrollTo(0, 0)} className="group w-[300px] md:w-[410px] block">
              <div className="relative w-full h-[200px] md:h-[280px] rounded-2xl overflow-hidden mb-6 border border-white/10 bg-[#0a1420] group-hover:border-brand-cyan/40 transition-colors">
                <img src={asset(c.img)} alt={c.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 via-transparent to-transparent" />
              </div>
              <div className="flex gap-2 mb-3">
                <span className="text-[14px] font-medium bg-[#1493DE] text-white px-[8px] py-[4px] rounded">{c.tag}</span>
              </div>
              <h3 className="font-bold text-lg group-hover:text-brand-cyan transition-colors">{c.title}</h3>
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

// COMPARISON candidate: LG CNS-style hero layout — left headline + right 2x2 bento cards (one per step).
// No background particle graphic. Sits under WorkflowDetails to compare.
const WorkflowBento = () => {
  const steps = [
    { icon: "icon_01.png", label: "구상 및 정의", desc: "일상의 언어로 요구사항 정의", n: "STEP 01" },
    { icon: "icon_02.png", label: "지능형 조립", desc: "AI 위젯으로 최적 아키텍처 조립", n: "STEP 02" },
    { icon: "icon_03.png", label: "코드 검증", desc: "AI-SDLC 기반 보안·품질 검증", n: "STEP 03" },
    { icon: "icon_04.png", label: "화이트라벨 배포", desc: "브랜드 반영 완성형 배포", n: "STEP 04" },
  ];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive((p) => (p + 1) % 4), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[#040813]">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
            maskImage: "radial-gradient(ellipse 85% 75% at 50% 45%, #000 45%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 85% 75% at 50% 45%, #000 45%, transparent 100%)",
          }}
        />
      </div>

      <div className="container-custom relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* left: headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          <span className="mb-4 inline-block rounded-full border border-brand-cyan/40 px-3 py-1 font-mono text-[11px] tracking-widest text-brand-cyan">비교안 · BENTO</span>
          <span className="block text-[17px] md:text-[20px] font-semibold tracking-wide text-[#2fd4c4] mb-3">AI-NATIVE WORKFLOW</span>
          <h2 className="text-[26px] sm:text-4xl md:text-[44px] font-bold leading-[1.3] text-white break-keep">
            복잡한 시스템 구축의 한계,<br />
            AI 통합 워크플로우로 혁신합니다.
          </h2>
          <p className="mt-6 text-white/60 text-[16px] md:text-[17px] leading-relaxed break-keep">
            AI 에이전트로 요구사항을 정의하면, AI 위젯 시스템이 최적의 아키텍처를 즉시 조립하고,
            AI-SDLC 기반 보안 검증을 거쳐 완성형 플랫폼을 가장 빠르게 배포합니다.
          </p>
          <div className="mt-9 flex items-center gap-4">
            <span className="font-mono text-[13px] tabular-nums text-brand-cyan">{`0${active + 1}`}</span>
            <div className="h-[2px] w-full max-w-[180px] overflow-hidden rounded-full bg-white/10">
              <motion.div className="h-full bg-brand-cyan" animate={{ width: `${((active + 1) / 4) * 100}%` }} transition={{ duration: 0.5, ease: "easeInOut" }} />
            </div>
            <span className="font-mono text-[13px] tabular-nums text-white/35">04</span>
          </div>
        </motion.div>

        {/* right: 2x2 bento */}
        <div className="grid grid-cols-2 gap-5">
          {steps.map((s, i) => {
            const on = i === active;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className={`group relative flex min-h-[210px] flex-col justify-between overflow-hidden rounded-2xl border p-6 transition-[border-color,box-shadow,background-color] duration-500 ${on ? "border-brand-cyan/60 bg-[#0b1a2e] shadow-[0_0_44px_rgba(47,212,196,0.18)]" : "border-white/10 bg-[#0a1526] hover:border-brand-cyan/40"}`}
              >
                <span
                  className="pointer-events-none absolute -bottom-5 right-2 select-none font-mono font-black leading-none transition-colors duration-500"
                  style={{ fontSize: "96px", color: on ? "rgba(47,212,196,0.13)" : "rgba(255,255,255,0.04)" }}
                >
                  {`0${i + 1}`}
                </span>
                <div className={`pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-brand-cyan/10 blur-[60px] transition-opacity duration-500 ${on ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                <div className="relative z-10 flex items-start justify-between">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-500"
                    style={{
                      backgroundColor: on ? "#00CCCC" : "rgba(255,255,255,0.04)",
                      borderColor: on ? "rgba(47,212,196,0.8)" : "rgba(255,255,255,0.10)",
                      boxShadow: on ? "0 0 22px rgba(47,212,196,0.5)" : "none",
                    }}
                  >
                    <img src={asset(s.icon)} alt="" className="h-6 w-6" />
                  </div>
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-500 ${on ? "border-brand-cyan/50 text-brand-cyan" : "border-white/10 text-white/50 group-hover:border-brand-cyan/40 group-hover:text-brand-cyan"}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                  </span>
                </div>
                <div className="relative z-10">
                  <div className="flex items-end justify-between gap-3">
                    <h3 className="text-[19px] font-bold leading-snug text-white break-keep">{s.label}</h3>
                    <span className={`shrink-0 font-mono text-[11px] tracking-widest transition-colors duration-500 ${on ? "text-brand-cyan" : "text-white/35"}`}>{s.n}</span>
                  </div>
                  <p className="mt-2 text-[13px] text-white/50 break-keep">{s.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// COMPARISON candidate: editorial vertical timeline — giant step numbers on a lit spine, no cards.
// A deliberately non-card layout to break the page's card rhythm. Sits under WorkflowBento to compare.
const WorkflowTimeline = () => {
  const steps = [
    { icon: "icon_01.png", label: "구상 및 정의", desc: "일상의 언어로 요구사항을 정의하면 AI 에이전트가 즉시 구조화합니다.", points: ["자연어 요구사항 입력", "즉시 구조화", "아키텍처 초안 생성"] },
    { icon: "icon_02.png", label: "지능형 조립", desc: "규격화된 AI 위젯을 조합해 최적의 아키텍처를 즉시 조립합니다.", points: ["그리드 위젯 조립", "구축 시간 60%↓", "최적 아키텍처"] },
    { icon: "icon_03.png", label: "코드 검증", desc: "AI-SDLC 기반의 철저한 보안·품질 검증을 자동으로 수행합니다.", points: ["AI-SDLC 자동 검증", "보안 취약점 차단", "품질 게이트 통과"] },
    { icon: "icon_04.png", label: "화이트라벨 배포", desc: "기업 고유의 브랜드 정체성을 완벽히 반영해 완성형으로 배포합니다.", points: ["헤드리스 SDK", "브랜드 주권 유지", "빠른 배포"] },
  ];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive((p) => (p + 1) % 4), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[#040813]">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
            maskImage: "radial-gradient(ellipse 85% 75% at 50% 40%, #000 45%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 85% 75% at 50% 40%, #000 45%, transparent 100%)",
          }}
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mb-14 md:mb-16">
          <span className="mb-4 inline-block rounded-full border border-brand-cyan/40 px-3 py-1 font-mono text-[11px] tracking-widest text-brand-cyan">비교안 · FLOW</span>
          <span className="block text-[17px] md:text-[20px] font-semibold tracking-wide text-[#2fd4c4] mb-3">AI-NATIVE WORKFLOW</span>
          <h2 className="text-[26px] sm:text-4xl md:text-[44px] font-bold leading-[1.3] text-white break-keep">
            복잡한 시스템 구축의 한계,<br />
            AI 통합 워크플로우로 혁신합니다.
          </h2>
        </div>

        {/* Full-width horizontal flow — fills the whole width (no right-side gap) */}
        <div className="relative">
          {/* giant numbers */}
          <div className="grid grid-cols-4 gap-4 md:gap-8">
            {steps.map((s, i) => {
              const on = i === active;
              return (
                <div key={i} className="text-center">
                  <span className="font-display font-bold leading-none transition-colors duration-500" style={{ fontSize: "clamp(36px,6vw,88px)", color: on ? "#2fd4c4" : "rgba(255,255,255,0.08)" }}>{`0${i + 1}`}</span>
                </div>
              );
            })}
          </div>

          {/* spine + nodes */}
          <div className="relative grid grid-cols-4 my-7">
            <div className="absolute left-[12.5%] right-[12.5%] top-1/2 -translate-y-1/2 h-[2px] overflow-hidden rounded-full bg-white/10">
              <motion.div className="h-full bg-brand-cyan" animate={{ width: `${(active / 3) * 100}%` }} transition={{ duration: 0.5, ease: "easeInOut" }} />
            </div>
            {steps.map((s, i) => {
              const on = i === active;
              const done = i < active;
              return (
                <div key={i} className="flex justify-center">
                  <div className="relative w-4 h-4 rounded-full border-2 transition-all duration-500" style={{ backgroundColor: on ? "#00CCCC" : "#0b1220", borderColor: on ? "rgba(47,212,196,0.9)" : done ? "rgba(47,212,196,0.5)" : "rgba(255,255,255,0.2)", boxShadow: on ? "0 0 18px rgba(47,212,196,0.7)" : "none" }} />
                </div>
              );
            })}
          </div>

          {/* content */}
          <div className="grid grid-cols-4 gap-4 md:gap-8">
            {steps.map((s, i) => {
              const on = i === active;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex flex-col items-center text-center transition-opacity duration-500 ${on ? "opacity-100" : "opacity-55"}`}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-500" style={{ backgroundColor: on ? "#00CCCC" : "rgba(255,255,255,0.04)", borderColor: on ? "rgba(47,212,196,0.8)" : "rgba(255,255,255,0.10)", boxShadow: on ? "0 0 18px rgba(47,212,196,0.5)" : "none" }}>
                    <img src={asset(s.icon)} alt="" className="w-6 h-6" />
                  </div>
                  <span className="mt-3 font-mono text-[11px] tracking-widest text-brand-cyan">{`STEP 0${i + 1}`}</span>
                  <h3 className="mt-1 text-[17px] md:text-[20px] font-bold text-white break-keep">{s.label}</h3>
                  <p className="mt-2 max-w-[240px] text-[13px] md:text-[14px] leading-relaxed text-white/60 break-keep">{s.desc}</p>
                  <ul className="mt-3 flex flex-col items-center gap-1.5">
                    {s.points.map((pt, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-[12px] md:text-[13px] text-white/65">
                        <span className="text-brand-cyan">✓</span>{pt}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

// COMPARISON candidate: step selector (left) + detail panel (right). Restored alongside BENTO / FLOW.
const WorkflowSteps = () => {
  const steps = [
    {
      icon: "icon_01.png",
      label: "구상 및 정의",
      desc: "일상의 언어로 요구사항을 정의하면 AI 에이전트가 즉시 구조화합니다.",
      points: ["자연어 요구사항 입력", "AI 에이전트가 즉시 구조화", "아키텍처 초안 자동 생성"],
    },
    {
      icon: "icon_02.png",
      label: "지능형 조립",
      desc: "규격화된 AI 위젯을 조합해 최적의 아키텍처를 즉시 조립합니다.",
      points: ["그리드 기반 위젯 조립", "최적 아키텍처 자동 구성", "구축 시간 60% 이상 단축"],
    },
    {
      icon: "icon_03.png",
      label: "코드 검증",
      desc: "AI-SDLC 기반의 철저한 보안·품질 검증을 자동으로 수행합니다.",
      points: ["AI-SDLC 자동 검증", "보안 취약점 사전 차단", "품질 게이트 통과"],
    },
    {
      icon: "icon_04.png",
      label: "화이트라벨 배포",
      desc: "기업 고유의 브랜드 정체성을 완벽히 반영해 완성형으로 배포합니다.",
      points: ["헤드리스 SDK 화이트라벨", "브랜드 디자인 주권 유지", "빠르고 안정적인 배포"],
    },
  ];
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[#040813]">
        <div
          className="absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
            maskImage: "radial-gradient(ellipse 85% 75% at 50% 45%, #000 45%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 85% 75% at 50% 45%, #000 45%, transparent 100%)",
          }}
        />
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[1000px] h-[520px] bg-brand-cyan/10 blur-[170px] rounded-full pointer-events-none" />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mb-16 md:mb-20">
          <span className="mb-4 inline-block rounded-full border border-brand-cyan/40 px-3 py-1 font-mono text-[11px] tracking-widest text-brand-cyan">비교안 · STEPS</span>
          <span className="block text-[17px] md:text-[20px] font-semibold tracking-wide text-[#2fd4c4] mb-3">AI-NATIVE WORKFLOW</span>
          <h2 className="text-[26px] sm:text-4xl md:text-[44px] font-bold leading-[1.3] text-white break-keep">
            복잡한 시스템 구축의 한계,<br />
            AI 통합 워크플로우로 혁신합니다.
          </h2>
          <p className="mt-6 text-white/60 text-[16px] md:text-[17px] leading-relaxed break-keep">
            AI 에이전트로 요구사항을 정의하면, AI 위젯 시스템이 최적의 아키텍처를 즉시 조립하고,
            AI-SDLC 기반 보안 검증을 거쳐 기업 고유의 브랜드가 완벽히 반영된 완성형 플랫폼을 가장 빠르게 배포합니다.
          </p>
        </div>

        {/* Desktop: step selector (left) + rich detail panel (right) */}
        <div className="hidden md:grid grid-cols-[280px_1fr] gap-8 lg:gap-12 items-stretch">
          <div className="flex flex-col justify-between gap-3">
            {steps.map((step, i) => {
              const active = i === activeStep;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveStep(i)}
                  className={`flex flex-1 items-center gap-4 rounded-xl border p-4 text-left transition-all duration-300 ${
                    active ? "border-brand-cyan/60 bg-[#0a1526]" : "border-white/10 hover:border-white/25"
                  }`}
                >
                  <div
                    className="w-11 h-11 shrink-0 rounded-lg flex items-center justify-center border transition-all duration-300"
                    style={{
                      backgroundColor: active ? "#00CCCC" : "#0b1220",
                      borderColor: active ? "rgba(47,212,196,0.7)" : "rgba(59,130,246,0.4)",
                      boxShadow: active ? "0 0 20px rgba(47,212,196,0.5)" : "none",
                    }}
                  >
                    <img src={asset(step.icon)} alt="" className="w-6 h-6" />
                  </div>
                  <div>
                    <span className={`font-mono text-[11px] tracking-widest ${active ? "text-brand-cyan" : "text-white/40"}`}>{`STEP 0${i + 1}`}</span>
                    <div className={`font-bold transition-colors ${active ? "text-white text-[17px]" : "text-white/70 text-[16px]"}`}>{step.label}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-brand-cyan/30 bg-[#0a1526] p-10 min-h-[400px]">
            <div className="absolute -top-16 -right-10 w-[360px] h-[360px] bg-brand-cyan/10 blur-[120px] rounded-full pointer-events-none" />
            <span className="absolute top-6 right-8 font-mono font-bold text-[130px] leading-none text-brand-cyan/10 pointer-events-none select-none">{`0${activeStep + 1}`}</span>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className="relative z-10"
              >
                <span className="font-mono text-[13px] tracking-widest text-brand-cyan">{`STEP 0${activeStep + 1}`}</span>
                <h3 className="mt-2 text-[30px] font-bold text-white break-keep">{steps[activeStep].label}</h3>
                <p className="mt-4 max-w-[560px] text-[17px] leading-relaxed text-white/65 break-keep">{steps[activeStep].desc}</p>
                <ul className="mt-8 flex flex-col gap-4">
                  {steps[activeStep].points.map((pt, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-[16px] text-white/80">
                      <span className="flex w-6 h-6 shrink-0 items-center justify-center rounded-full bg-brand-cyan/15 text-brand-cyan text-[12px] font-bold">✓</span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile: accordion */}
        <div className="md:hidden flex flex-col gap-3">
          {steps.map((step, i) => {
            const active = i === activeStep;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveStep(i)}
                className={`w-full text-left rounded-xl border p-5 transition-all duration-300 ${
                  active ? "border-brand-cyan/60 bg-[#0a1526]" : "border-white/10 bg-[#070c16]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center border transition-all duration-300"
                    style={{
                      backgroundColor: active ? "#00CCCC" : "#0b1220",
                      borderColor: active ? "rgba(47,212,196,0.7)" : "rgba(59,130,246,0.4)",
                      boxShadow: active ? "0 0 18px rgba(47,212,196,0.5)" : "none",
                    }}
                  >
                    <img src={asset(step.icon)} alt="" className="w-5 h-5" />
                  </div>
                  <div>
                    <span className={`font-mono text-[11px] tracking-widest ${active ? "text-brand-cyan" : "text-white/40"}`}>{`STEP 0${i + 1}`}</span>
                    <div className="font-bold text-white text-[16px]">{step.label}</div>
                  </div>
                </div>
                <AnimatePresence initial={false}>
                  {active && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 text-[14px] leading-relaxed text-white/60 break-keep">{step.desc}</p>
                      <ul className="mt-4 flex flex-col gap-2.5">
                        {step.points.map((pt, idx) => (
                          <li key={idx} className="flex items-center gap-2.5 text-[14px] text-white/80">
                            <span className="flex w-5 h-5 shrink-0 items-center justify-center rounded-full bg-brand-cyan/15 text-brand-cyan text-[11px] font-bold">✓</span>
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  return (
    <>
      <Hero />
      <WorkflowDetails />
      <WorkflowSteps />
      <WorkflowBento />
      <WorkflowTimeline />
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
