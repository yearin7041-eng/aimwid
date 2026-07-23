/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Fragment } from "react";

// Content that lives in src/content/*.json is plain text so a non-developer (and any Git-based CMS) can
// edit it without touching JSX. Line breaks are written as "\n" there and turned into <br> here.
//
// brClass keeps the responsive-break trick the hand-written JSX used: pass "hidden sm:block" and the line
// only breaks from the sm breakpoint up, letting the text wrap naturally on narrow screens instead.
export const nl2br = (text: string, brClass?: string) =>
  text.split("\n").map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br className={brClass} />}
      {line}
    </Fragment>
  ));
