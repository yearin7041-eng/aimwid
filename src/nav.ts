/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Single source of truth for the GNB's shape. Lives outside App.tsx because the breadcrumb needs the
// same mapping and importing it from App would be circular (App imports the pages, the pages render
// the breadcrumb). Add a Solution sub-page here and the navbar, its active state, and every
// breadcrumb trail pick it up together.

export const SOLUTION_SUBS = ["AIMNIS", "AIM GUARD", "SOLUTION"] as const;

export const subRoute = (sub: string) =>
  sub === "AIM GUARD" ? "/aimguard" : sub === "AIMNIS" ? "/aimnis" : "/solution";

// Company's dropdown. Unlike Solution's, the labels are Korean and the OVERVIEW route is the section's
// own /company page — 회사개요 is not a separate child, it IS Company, so it points back at /company.
// Added 2026-07-20; 오시는길 is a new page.
export const COMPANY_SUBS = ["회사개요", "오시는길"] as const;

export const companySubRoute = (sub: string) => (sub === "오시는길" ? "/company/location" : "/company");

// Top-level items that own a page directly (no dropdown). Anything absent (Contact) is still a #anchor
// on Home, so it gets an <a> and has no active state. Solution and Company are deliberately NOT here:
// each is a dropdown parent whose active state spans the routes beneath it (see isActive in App).
export const ROUTED: Record<string, string> = {
  Business: "/business",
};

export type Crumb = { label: string; to?: string };

// The trail after Home, derived from the nav config above rather than restated — a `to` means the crumb
// links, its absence means it is the current page. Returns [] for Home, Contact and anything unrouted,
// which is the breadcrumb's signal to render nothing at all.
export const crumbsFor = (pathname: string): Crumb[] => {
  const sub = SOLUTION_SUBS.find((s) => subRoute(s) === pathname);
  if (sub) {
    // "SOLUTION" is the section's own overview page, so it is the leaf — not a child of itself.
    return sub === "SOLUTION"
      ? [{ label: "Solution" }]
      : [{ label: "Solution", to: "/solution" }, { label: sub }];
  }
  const csub = COMPANY_SUBS.find((s) => companySubRoute(s) === pathname);
  if (csub) {
    // Same shape as Solution's: 회사개요 IS Company, so /company is the leaf; 오시는길 sits under it.
    return csub === "회사개요"
      ? [{ label: "Company" }]
      : [{ label: "Company", to: "/company" }, { label: csub }];
  }
  const top = Object.keys(ROUTED).find((k) => ROUTED[k] === pathname);
  return top ? [{ label: top }] : [];
};
