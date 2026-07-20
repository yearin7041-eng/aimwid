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

// Top-level items that own a page. Anything absent (Contact) is still a #anchor on Home, so it gets an
// <a> and has no active state to be in. Solution is deliberately NOT here: it is a dropdown parent
// whose own click target is an anchor, and its active state spans the three routes beneath it.
export const ROUTED: Record<string, string> = {
  Business: "/business",
  Company: "/company",
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
  const top = Object.keys(ROUTED).find((k) => ROUTED[k] === pathname);
  return top ? [{ label: top }] : [];
};
