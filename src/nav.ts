/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Single source of truth for the GNB's shape. Lives outside App.tsx because the breadcrumb needs the
// same mapping and importing it from App would be circular (App imports the pages, the pages render
// the breadcrumb). Add a Solution sub-page here and the navbar, its active state, and every
// breadcrumb trail pick it up together.

// "Industries" is the /solution overview page — renamed from the redundant "SOLUTION" (user, 2026-07-24)
// so "Solution ▸ Solution" is gone. The page is the industry-domain solution lineup (its own eyebrow reads
// "Industry AI Solutions"), distinct from the two branded products AIMNIS / AIM GUARD.
export const SOLUTION_SUBS = ["AIMNIS", "AIM GUARD", "Industries"] as const;

export const subRoute = (sub: string) =>
  sub === "AIM GUARD" ? "/aimguard" : sub === "AIMNIS" ? "/aimnis" : "/solution";

// Company's dropdown. Unlike Solution's, the labels are Korean and the OVERVIEW route is the section's
// own /company page — 회사개요 is not a separate child, it IS Company, so it points back at /company.
// Added 2026-07-20; 오시는 길 is a new page.
export const COMPANY_SUBS = ["회사개요", "오시는 길"] as const;

export const companySubRoute = (sub: string) => (sub === "오시는 길" ? "/company/location" : "/company");

// Top-level items that own a page directly (no dropdown). Contact became its own /contact page
// (2026-07-20 → routed 2026-07-22); it used to be a #anchor on Home, now it links here and lights up like
// Business. Solution and Company are deliberately NOT here: each is a dropdown parent whose active state
// spans the routes beneath it (see isActive in App).
export const ROUTED: Record<string, string> = {
  Business: "/business",
  Contact: "/contact",
};

export type Crumb = { label: string; to?: string };

// The trail after Home, derived from the nav config above rather than restated — a `to` means the crumb
// links, its absence means it is the current page. Returns [] only for Home and genuinely unrouted paths
// (Contact is routed now, so it gets a "Contact" crumb); [] is the breadcrumb's signal to render nothing.
export const crumbsFor = (pathname: string): Crumb[] => {
  const sub = SOLUTION_SUBS.find((s) => subRoute(s) === pathname);
  if (sub) {
    // Two depths for every Solution sub-page, matching Company below: the section (links to the overview)
    // then the sub-page. On /solution that reads "Solution › Industries" (the overview linked as parent AND
    // named as the leaf, same as Company's "Company › 회사개요").
    return [{ label: "Solution", to: "/solution" }, { label: sub }];
  }
  const csub = COMPANY_SUBS.find((s) => companySubRoute(s) === pathname);
  if (csub) {
    // Company always shows two depths (user, 2026-07-21): the section, then the sub-page. The Company
    // crumb always LINKS to /company (even on 회사개요, whose page that is) — the breadcrumb marks the
    // one crumb WITHOUT a `to` as the current page and colours it white, so the parent needs a `to` to
    // render as a muted, distinct upper level rather than a second white current-page label.
    return [{ label: "Company", to: "/company" }, { label: csub }];
  }
  const top = Object.keys(ROUTED).find((k) => ROUTED[k] === pathname);
  return top ? [{ label: top }] : [];
};
