/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Breadcrumb from "../components/Breadcrumb";
import ContactSection from "../components/ContactSection";

// Dedicated /contact page (user, 2026-07-22). The GNB's Contact used to be a #anchor that scrolled to the
// section at the bottom of Home; it now routes here instead (nav.ts ROUTED). The page reuses the exact
// same ContactSection component that still sits at the bottom of Home, so the two never drift apart. The
// section's own "YOUR AI PLATFORM PARTNER" title acts as the page's hero, so no separate hero is added;
// pt-[80px] clears the fixed navbar and the breadcrumb rides over the top like the other sub-pages.
const Contact = () => (
  <div className="pt-[80px] min-h-screen text-white bg-[#020617] font-sans overflow-hidden">
    {/* relative wrapper so the absolutely-positioned Breadcrumb anchors here (at y=80, below the navbar)
        rather than to the app root, where top-[60px] would tuck it behind the fixed menu. */}
    <div className="relative">
      <Breadcrumb />
      <ContactSection showHero={false} />
    </div>
  </div>
);

export default Contact;
