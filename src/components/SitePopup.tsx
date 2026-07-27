/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import popup from "../content/popup.json";
import { nl2br } from "../lib/text";

// Site-entry notice popup. Mounted once at the app root so it fires on arrival whatever the landing route
// is, and is not re-triggered by navigation between pages. Styling follows the site's own vocabulary
// rather than a generic modal — dark navy glass panel, cyan label + hairline over the title, the brand's
// rounded CTA, the same radial glow the sections use.
//
// ONE banner only (user, 2026-07-23): this started as a 3-banner auto-advancing slider; the rolling —
// auto-advance, dots, arrows, ←/→ keys, pause-on-hover — was removed because notices go up one at a time.
//
// TO CHANGE THE CONTENT: edit src/content/popup.json — NOT this file. The copy lives there as plain text
// (line breaks written as "\n") so it can be edited without touching JSX, and so a Git-based CMS can own it.
// "오늘 하루 보지 않기" stores the next midnight here; the popup stays away until that time passes.
// The key is VERSIONED on purpose: bump the suffix whenever the notice changes, and everyone who had
// dismissed the previous one sees the new one instead of staying suppressed by a stale flag.
const STORAGE_KEY = "aimwid_popup_hidden_until_v2";

const SitePopup = () => {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  // Home only (user, 2026-07-27): the notice is a landing greeting, so it must not fire on /aimnis,
  // /solution, etc. Mounted once at the app root, this component does not remount on navigation, so the
  // effect below re-runs on pathname change and only opens when the home route ("/") is active.
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== "/") return;
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
  }, [pathname]);

  // While open: lock page scroll and let Escape close it.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

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
          aria-label="공지사항"
        >
          {/* Backdrop — click to dismiss */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[3px]" onClick={() => close()} />

          <motion.div
            className="relative w-full max-w-[540px] overflow-hidden rounded-[20px] border border-white/10 bg-gradient-to-br from-[#0b1a2e] to-[#050b16] shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {/* Cyan corner glow, contained so it never clips into a seam */}
            <div
              className="pointer-events-none absolute -right-[18%] -top-[30%] h-[320px] w-[380px] rounded-[50%]"
              style={{ background: "radial-gradient(closest-side, rgba(47,212,196,0.22), rgba(47,212,196,0) 72%)" }}
            />

            <button
              type="button"
              onClick={() => close()}
              aria-label="닫기"
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="relative px-8 pt-11 pb-8 md:px-10">
              <p className="text-[#2fd4c4] text-[13px] md:text-[14px] font-medium uppercase tracking-[0.2em]">
                {popup.label}
              </p>
              <div className="mt-4 h-px w-[44px] bg-[#2fd4c4]/60" />
              <h2 className="mt-5 text-[24px] md:text-[28px] font-bold leading-[1.45] text-white break-keep">
                {nl2br(popup.title)}
              </h2>
              <p className="mt-4 text-[15px] md:text-[16px] font-normal leading-[1.8] text-[#9fb0c4] break-keep">
                {nl2br(popup.body, "hidden sm:block")}
              </p>

              <Link
                to={popup.ctaTo}
                onClick={() => {
                  close();
                  window.scrollTo(0, 0);
                }}
                className="mt-7 inline-flex h-[48px] items-center justify-center rounded-[50px] bg-brand-cyan px-7 text-[15px] font-bold tracking-wide text-bg-dark transition-all hover:shadow-[0_0_24px_rgba(47,212,196,0.45)]"
              >
                {popup.ctaLabel}
              </Link>
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
