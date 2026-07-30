/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import ConstellationField from "../pages/ConstellationField";

// The 문의 form. Extracted from App.tsx (2026-07-22) so the /contact page and Home can share it.
//
// Submission goes through Web3Forms (user, 2026-07-22): this is a static GitHub Pages site with no
// backend, so the form POSTs to Web3Forms' API which then emails the entry to aimwid@aimwid.ai. Set the
// access key below — get it free (no signup) at https://web3forms.com by entering aimwid@aimwid.ai. The
// key is public by design (it only authorises sending to the ONE email it was issued for), so it is safe
// to ship in client code. Korean field `name`s become the labels in the received email; `email` is the
// special field Web3Forms uses as the reply-to; `botcheck` is its honeypot.
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const WEB3FORMS_ACCESS_KEY = "63314580-f017-4c4d-b632-4af1fda92647"; // public key (safe to ship); delivers to the address it was issued for

const ContactSection = ({ showHero = true }: { showHero?: boolean }) => {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: { preventDefault: () => void; currentTarget: HTMLFormElement }) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    const fields = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `[AIMWID 홈페이지 문의] ${fields["기업명"] || fields["이름"] || ""}`,
          from_name: "AIMWID 홈페이지",
          // Second recipient (yhwoo@aimwid.ai) is handled by a mail-side forwarding/group rule on the
          // account inbox, NOT by Web3Forms CC — CC (`ccemail`) is a Pro-only feature (user, 2026-07-22).
          ...fields,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputCls =
    "w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-[16px] font-medium placeholder:font-medium focus:border-brand-cyan outline-none transition-colors";

  return (
    <section id="contact" className={`pb-20 lg:pb-32 relative overflow-hidden ${showHero ? "pt-0" : "pt-[120px] lg:pt-[160px]"}`}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-brand-cyan/5 rounded-full blur-[140px] -z-10" />

      {/* Dedicated /contact page only (showHero=false): the standalone page has no big hero graphic, so
          the area under the title read empty next to the tall form (user, 2026-07-23). The drifting
          dot/line field — the same ambient the Company About uses — fills it and suits a "연결·파트너"
          page. A right-side veil keeps it calm behind the form; the content sits above via z-10. */}
      {!showHero && (
        <>
          <ConstellationField className="pointer-events-none absolute inset-0 h-full w-full select-none" />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(to right, transparent 0%, transparent 38%, rgba(2,6,23,0.72) 72%)" }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(70% 60% at 28% 42%, transparent 0%, rgba(2,6,23,0.55) 100%)" }}
          />
        </>
      )}

      {showHero && (
        <div className="relative flex justify-center items-center mb-0 mt-[80px] h-[380px] md:mt-[200px] md:h-[730px] w-full">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -ml-7 md:ml-0 w-[680px] h-[601px] md:w-[1400px] md:h-[1237px] bg-center bg-no-repeat bg-contain pointer-events-none" style={{ backgroundImage: `url(${asset("main_partner_bg.png")})` }}></div>
          <h1 className="relative z-10 text-[28px] sm:text-[48px] md:text-[110px] font-bold font-display text-center leading-[1.1] tracking-[0.16em] text-white drop-shadow-xl pl-[0.16em] -translate-y-[75px] md:-translate-y-[150px]">
            YOUR<br />AI PLATFORM<br />PARTNER
          </h1>
        </div>
      )}

      <div className="container-custom relative z-10 flex flex-col lg:flex-row justify-between gap-10">
        <div className="flex-1">
          <h2 className="text-[24px] md:text-[50px] font-bold text-white mb-3 md:mb-8 md:whitespace-nowrap leading-[1.5] break-keep">
            기업의 AI 전환<br /> <span className="text-brand-cyan">에임위드</span>와 시작하세요
          </h2>
          <p className="text-[#9fb0c4] text-[16px] md:text-[20px] leading-[1.5] break-keep">문의사항을 남겨주시면 확인 후 연락드리겠습니다.</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full lg:w-[800px] flex-shrink-0 p-6 md:p-10 border border-white/10 rounded-2xl space-y-6">
          {/* Honeypot — bots fill hidden fields; a filled botcheck makes Web3Forms drop the submission. */}
          <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[14px] font-medium text-white flex items-center gap-1">이름 <span className="text-brand-cyan">*</span></label>
              <input name="이름" type="text" required placeholder="이름" className={inputCls} />
            </div>
            <div className="space-y-2">
              <label className="text-[14px] font-medium text-white flex items-center gap-1">연락처</label>
              <input name="연락처" type="text" placeholder="000-0000-0000" className={inputCls} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[14px] font-medium text-white flex items-center gap-1">기업명 <span className="text-brand-cyan">*</span></label>
              <input name="기업명" type="text" required placeholder="기업명" className={inputCls} />
            </div>
            <div className="space-y-2">
              <label className="text-[14px] font-medium text-white flex items-center gap-1">직책</label>
              <input name="직책" type="text" placeholder="직책" className={inputCls} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[14px] font-medium text-white flex items-center gap-1">이메일 <span className="text-brand-cyan">*</span></label>
            <input name="email" type="email" required placeholder="이메일" className={inputCls} />
          </div>

          <div className="space-y-2">
            <label className="text-[14px] font-medium text-white flex items-center gap-1">제목 <span className="text-brand-cyan">*</span></label>
            <input name="제목" type="text" required placeholder="제목" className={inputCls} />
          </div>

          <div className="space-y-2">
            <label className="text-[14px] font-medium text-white flex items-center gap-1">내용 <span className="text-brand-cyan">*</span></label>
            <textarea name="내용" required placeholder="내용을 입력하세요." rows={4} className={`${inputCls} resize-none`} />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-0">
            <div className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" id="terms" required className="accent-brand-cyan w-5 h-5 cursor-pointer rounded-sm" />
              <label htmlFor="terms" className="text-[16px] font-normal text-[#9fb0c4] cursor-pointer select-none">개인정보 수집 및 이용에 동의합니다.</label>
            </div>

            <button type="submit" disabled={status === "sending"} style={{ background: "linear-gradient(90deg, #00feb9 0%, #00e6db 100%)" }} className="flex items-center justify-center w-full sm:w-[200px] h-[48px] sm:h-[54px] text-[#000028] text-[18px] font-bold rounded-[8px] hover:shadow-[0_0_30px_rgba(0,230,219,0.5)] transition-all tracking-widest flex-shrink-0 disabled:opacity-60 disabled:cursor-not-allowed">
              {status === "sending" ? "전송 중..." : "문의하기"}
            </button>
          </div>

          {/* Submission feedback */}
          {status === "success" && (
            <p className="text-[15px] text-brand-cyan text-right">문의가 정상적으로 접수되었습니다. 확인 후 연락드리겠습니다.</p>
          )}
          {status === "error" && (
            <p className="text-[15px] text-red-400 text-right">전송에 실패했습니다. 잠시 후 다시 시도해 주세요.</p>
          )}
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
