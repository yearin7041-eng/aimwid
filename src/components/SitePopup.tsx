/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

// Site-entry banner popup (user, 2026-07-22): three banners on an auto-advancing slider. Mounted once at
// the app root so it fires on arrival whatever the landing route is, and is not re-triggered by navigation.
// Styling follows the site's own vocabulary rather than a generic modal — dark navy glass panel, cyan
// label + hairline over the title, the brand's rounded CTA.
//
// TO CHANGE THE CONTENT: edit SLIDES below — everything else is chrome. Add/remove entries freely; the
// dots, arrows and auto-advance all derive from the array length.
const SLIDES = [
  {
    label: "NOTICE",
    title: (
      <>
        에임위드 홈페이지가<br />
        새롭게 열렸습니다
      </>
    ),
    body: (
      <>
        AI 기술과 스마트 모니터링 솔루션을 한눈에 볼 수 있도록<br className="hidden sm:block" />
        새로운 모습으로 단장했습니다.
      </>
    ),
    cta: { label: "회사 소개 보기", to: "/company" },
  },
  {
    label: "SOLUTION",
    title: (
      <>
        현장의 위험을 먼저 찾는<br />
        AI 영상 분석, AIM GUARD
      </>
    ),
    body: (
      <>
        실시간 영상 분석과 지능형 알림으로<br className="hidden sm:block" />
        사고를 사전에 예측하고 대응합니다.
      </>
    ),
    cta: { label: "AIM GUARD 알아보기", to: "/aimguard" },
  },
  {
    label: "CONTACT",
    title: (
      <>
        도입을 검토 중이신가요?<br />
        편하게 문의해 주세요
      </>
    ),
    body: (
      <>
        현장과 과제를 알려주시면<br className="hidden sm:block" />
        확인 후 담당자가 연락드리겠습니다.
      </>
    ),
    cta: { label: "문의하기", to: "/contact" },
  },
];

const AUTO_MS = 4500;

// "오늘 하루 보지 않기" stores the next midnight; the popup stays away until that passes.
const STORAGE_KEY = "aimwid_popup_hidden_until";

const SitePopup = () => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    let hiddenUntil = 0;
    try {
      hiddenUntil = Number(localStorage.getItem(STORAGE_KEY) || 0);
    } catch {
      // private mode / storage blocked — just show the popup
    }
    if (Date.now() < hiddenUntil) return;
    // Small delay so the landing page paints first and the popup reads as arriving, not blocking.
    const t = setTimeout(() => setOpen(true), 700);
    return () => clearTimeout(t);
  }, []);

  // Auto-advance. Paused on hover/focus so a banner being read never slides away, and disabled entirely
  // under reduced-motion — there the dots/arrows are the only way through.
  useEffect(() => {
    if (!open || paused || reduce) return;
    const id = setInterval(() => {
      setDir(1);
      setIndex((v) => (v + 1) % SLIDES.length);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [open, paused, reduce]);

  // While open: lock page scroll, Escape closes, arrow keys move between banners.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (step: number) => {
    setDir(step);
    setIndex((v) => (v + step + SLIDES.length) % SLIDES.length);
  };

  const close = (hideForToday = false) => {
    if (hideForToday) {
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0); // start of tomorrow
      try {
        localStorage.setItem(STORAGE_KEY, String(midnight.getTime()));
      } catch {
        // ignore — closing still works for this visit
      }
    }
    setOpen(false);
  };

  const slide = SLIDES[index];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label="공지 배너"
        >
          {/* Backdrop — click to dismiss */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[3px]" onClick={() => close()} />

          <motion.div
            className="relative w-full max-w-[540px] overflow-hidden rounded-[20px] border border-white/10 bg-gradient-to-br from-[#0b1a2e] to-[#050b16] shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            {/* Cyan corner glow, contained so it never clips into a seam */}
            <div
              className="pointer-events-none absolute -right-[18%] -top-[30%] h-[320px] w-[380px] rounded-[50%]"
              style={{ background: "radial-gradient(closest-side, rgba(0,204,204,0.22), rgba(0,204,204,0) 72%)" }}
            />

            <button
              type="button"
              onClick={() => close()}
              aria-label="닫기"
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={20} />
            </button>

            {/* Banner area. min-h keeps the panel from jumping as banners of different length swap. */}
            <div className="relative min-h-[300px] px-8 pt-11 pb-6 md:px-10">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={index}
                  custom={dir}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 28 }}
                  animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -28 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <p className="text-[#00cccc] text-[14px] font-medium uppercase tracking-[0.2em]">{slide.label}</p>
                  <div className="mt-4 h-px w-[44px] bg-[#00cccc]/60" />
                  <h2 className="mt-6 text-[24px] md:text-[28px] font-bold leading-[1.45] text-white break-keep">
                    {slide.title}
                  </h2>
                  <p className="mt-4 text-[15px] md:text-[16px] font-normal leading-[1.8] text-[#b3b4b9] break-keep">
                    {slide.body}
                  </p>

                  <Link
                    to={slide.cta.to}
                    onClick={() => {
                      close();
                      window.scrollTo(0, 0);
                    }}
                    className="mt-7 inline-flex h-[48px] items-center justify-center rounded-[50px] bg-brand-cyan px-7 text-[15px] font-bold tracking-wide text-bg-dark transition-all hover:shadow-[0_0_24px_rgba(0,245,255,0.45)]"
                  >
                    {slide.cta.label}
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider controls: dots (current banner) + prev/next */}
            <div className="relative flex items-center justify-between px-8 pb-5 md:px-10">
              <div className="flex items-center gap-2">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`${i + 1}번 배너 보기`}
                    aria-current={i === index}
                    onClick={() => {
                      setDir(i > index ? 1 : -1);
                      setIndex(i);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      i === index ? "w-6 bg-brand-cyan" : "w-2 bg-white/25 hover:bg-white/45"
                    }`}
                  />
                ))}
                <span className="ml-2 text-[13px] tabular-nums text-white/40">
                  {index + 1} / {SLIDES.length}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="이전 배너"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="다음 배너"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Footer bar — the 오늘 하루 보지 않기 / 닫기 pair Korean sites expect */}
            <div className="relative flex items-center justify-between border-t border-white/10 bg-white/[0.02] px-8 py-4 md:px-10">
              <label className="flex cursor-pointer select-none items-center gap-2.5 text-[14px] text-white/55 transition-colors hover:text-white/80">
                <input
                  type="checkbox"
                  onChange={(e) => e.target.checked && close(true)}
                  className="h-4 w-4 cursor-pointer rounded-sm accent-brand-cyan"
                />
                오늘 하루 보지 않기
              </label>
              <button
                type="button"
                onClick={() => close()}
                className="text-[14px] font-medium text-white/70 transition-colors hover:text-white"
              >
                닫기
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SitePopup;
