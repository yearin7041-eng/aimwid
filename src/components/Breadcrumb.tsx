/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { crumbsFor } from "../nav";

// Roof, walls, a door and an eave line. Kept hand-drawn rather than swapped for lucide's Home so the
// door stays narrow — lucide's reads closer to a filled block at this size.
const HomeMark = () => (
  <svg
    viewBox="0 0 16 16"
    className="w-[16px] h-[16px]"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M2 6.6 8 2l6 4.6V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6.6Z" />
    <path d="M6.3 14V9.7a.4.4 0 0 1 .4-.4h2.6a.4.4 0 0 1 .4.4V14" />
    <path d="M1 7.5 8 2.1l7 5.4" className="opacity-45" />
  </svg>
);

// Absolute over the hero, not a band above it. Every hero here is full-bleed with the navbar already
// floating on top, so a band would slice the image; absolute also leaves each hero's pt — tuned to
// Figma's h1 position — untouched. top is the navbar's 80px height less the 20px the user pulled it up,
// which tucks the row just under the menu rather than clearing it.
const Breadcrumb = () => {
  const crumbs = crumbsFor(useLocation().pathname);
  if (!crumbs.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="absolute top-[32px] md:top-[60px] inset-x-0 z-20">
      <div className="container-custom">
        {/* White is the row's base, so the current page — the one crumb without a `to` — inherits it
            and is the only white thing here. Everything that links (home, and every crumb above the
            current one) is the lighter grey, which puts the colour back to work telling them apart. */}
        <ol className="flex items-center gap-2 h-[20px] md:h-[44px] text-[14px] md:text-[16px] font-light text-white">
          <li className="flex items-center">
            <Link
              to="/"
              aria-label="Home"
              onClick={() => window.scrollTo(0, 0)}
              className="flex items-center text-[#cbd5e1] hover:text-white transition-colors"
            >
              <HomeMark />
            </Link>
          </li>
          {crumbs.map((crumb) => (
            <li key={crumb.label} className="flex items-center gap-2">
              <ChevronRight size={14} className="opacity-40" aria-hidden />
              {crumb.to ? (
                <Link
                  to={crumb.to}
                  onClick={() => window.scrollTo(0, 0)}
                  className="text-[#cbd5e1] hover:text-white transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current="page">{crumb.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;
