import { useRef, useState } from "react";
import type { RefObject } from "react";
import { motion } from "motion/react";
import { Check, ChevronRight, Copy, Download, FileText, Package, Tag } from "lucide-react";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

// The AIM GUARD hero's single CTA lands here (Figma 486:118). That frame ships as three full-page
// rasters with no layer data — there is nothing to read spacing or colour tokens off, so everything
// below is measured off the render at 1920 and rebuilt in markup. The one piece kept as an image is
// the hero's dashboard/shield illustration, which is genuine artwork rather than layout.
//
// NOTE this is UI only: nothing is submitted, and the licence key is the render's own sample string.
// Wiring it up needs an endpoint that issues a key and a real installer URL — see LICENCE_KEY and
// handleSubmit below, which are the two seams that change.
//
// This is also the only page whose content section opens with no label/title heading, where every other
// section on the site uses the shared 20px-label + 50px-title block. That is intentional: adding one
// would mean inventing copy the render does not have, and the user declined on 2026-07-20. The card
// titles below are plain 24px — deliberately not that component, and there is no site-wide card-title
// spec to follow (other pages run 20/22/24/26px ad hoc).

const FIELDS = [
  { name: "company", label: "회사명 / 기관명", placeholder: "회사명 또는 기관명을 입력하세요" },
  { name: "manager", label: "담당자명", placeholder: "담당자명을 입력하세요" },
  { name: "email", label: "이메일", placeholder: "이메일 주소를 입력하세요", type: "email" },
  { name: "phone", label: "연락처", placeholder: "연락처를 입력하세요 (예: 010-1234-5678)" },
  { name: "site", label: "설치 현장명", placeholder: "설치 현장명을 입력하세요" },
] as const;

const AGREEMENTS = [
  { id: "privacy", label: "[필수] 개인정보 수집 및 이용에 동의합니다." },
  { id: "license", label: "[필수] AIM GUARD 라이선스 이용 조건에 동의합니다." },
] as const;

// Shown in the key slot BEFORE issuance. Deliberately masked: the render's own sample string looked
// like a usable key, and with a live copy button beside it the page read as though a licence had
// already been granted. The hero artwork was re-lettered to AG-XXXX-XXXX-XXXX for the same reason.
const MASKED_KEY = "AG-XXXX-XXXX-XXXX";

// Stands in for the real issue call. Replace this with the request to whatever endpoint grants a key —
// it is the only place the page decides what the key is. Assumes ISSUE-ON-SUBMIT; if issuance actually
// goes through a human review step, this whole card should become a "신청이 접수되었습니다" notice
// instead, and the key/installer pair should not live on this page at all. Unconfirmed as of 2026-07-20.
const issueLicense = async (_values: Record<string, string>) => "AG-TRIAL-4X7B-2M9C-N8P2";

// The four panels, the inputs and the buttons all copy Home's Contact form rather than the Figma
// render. The render used its own form language — labels beside the field, transparent inputs, square
// gradient buttons, #2fd4c4 focus — which would have made this the only page on the site not sharing
// the form system, and hardcoded a cyan that is NOT the brand token (#2fd4c4). The user chose the site
// system on 2026-07-20, so the render's form styling is deliberately not followed. Layout and copy
// still come from the render; only the component skin is the site's.
const PANEL = "rounded-2xl border border-white/10";
const INPUT =
  "w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-[16px] font-medium placeholder:font-medium focus:border-brand-cyan outline-none transition-colors";
// The site's primary button, verbatim from AIM GUARD / AIMNIS / Business / Solution — 54×232, 8px
// radius, mint gradient. NOT Home's pill (rounded-[50px] + bg-brand-cyan): that shape exists twice and
// only on Home, while this one repeats across every sub-page, so it is the shared component and this
// page is a sub-page. An earlier pass here matched the pill by mistake.
const CTA =
  "flex h-[48px] w-full sm:h-[54px] sm:w-[232px] items-center justify-center gap-2 rounded-[8px] text-[#000028] text-[16px] sm:text-[18px] font-bold transition-all hover:shadow-[0_0_30px_rgba(0,230,219,0.5)]";
const CTA_BG = { background: "linear-gradient(90deg, #00feb9 0%, #00e6db 100%)" };

const Hero = ({ onStart }: { onStart: () => void }) => (
  <section className="relative lg:min-h-[620px] overflow-hidden bg-[#040813]">
    {/* Faint tech grid, drawn rather than shipped as the render's background bitmap */}
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.28]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(47,212,196,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(47,212,196,0.07) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
      }}
    />
    <div
      className="pointer-events-none absolute -right-[6%] top-[6%] h-[720px] w-[900px] rounded-[50%]"
      style={{ background: "radial-gradient(closest-side, rgba(47,212,196,0.16), rgba(47,212,196,0) 70%)" }}
    />

    {/* Header → hero bridge, same device the other four heroes use */}
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[160px] bg-gradient-to-b from-[#040813] via-[#040813]/60 to-transparent" />

    {/* Two columns whose split is FIXED, not proportional: the copy column is pinned at 560px — the
        width its longest line (본문 1행) actually needs — and the visual takes every remaining pixel via
        flex-1. Sizing the image as a percentage left the right side looking empty at 1600, because the
        text never grew to meet it. At the 1600 column that lands the visual near 984px, and since it is
        16:9 it is also the tallest thing here, so it — not the copy — sets the hero's height. */}
    <div className="container-custom relative z-10 flex flex-col items-center gap-12 pt-[120px] pb-[64px] lg:flex-row lg:items-center lg:gap-14 lg:pt-[140px] lg:pb-[100px]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="order-2 lg:order-1 flex w-full flex-col lg:w-[560px] lg:shrink-0"
      >
        {/* Gray, not the render's cyan. Every hero on the site puts its eyebrow in #90a1b9 and reserves
            teal for "a section starts here" — see the hero-eyebrow convention. */}
        <p className="mb-2 md:mb-4 text-[14px] md:text-[20px] font-bold leading-[1.4] text-[#90a1b9]">AI 영상분석 통합관제 솔루션</p>
        {/* Explicit break, not reflow: left to itself the line wrapped mid-word, splitting 발급 across
            two lines. break-keep is the belt to that braces at other widths. */}
        <h1 className="text-[30px] sm:text-[40px] md:text-[56px] font-bold leading-[1.2] text-white break-keep">
          AIM GUARD<br />
          <span className="text-brand-cyan">라이선스 발급</span>
        </h1>
        <p className="mt-7 text-[16px] md:text-[18px] font-normal leading-[1.6] text-white/80">
          고객 정보를 입력하시면 AIM GUARD 라이선스를 발급하고,<br className="hidden lg:block" />
          설치 파일을 다운로드할 수 있습니다.
        </p>
        <button onClick={onStart} className={`${CTA} mt-10 shrink-0`} style={CTA_BG}>
          라이선스 발급 시작
        </button>
      </motion.div>

      {/* The art is a rectangle of near-black that is NOT quite #040813, so its edge read as a visible
          box on the section. It cannot be hidden by painting the section colour over the edges — the
          cyan glow sits behind it, and a solid overlay would show up as a rectangle of its own (the
          same trap the partner logo wall's fade strips fell into). So both axes are masked instead,
          split across two elements: the wrapper fades top/bottom, the image fades left/right. One
          element per axis avoids mask-composite, whose cross-browser syntax is inconsistent.
          The stops clear the artwork — content starts ~10% in horizontally and ~14% vertically. */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="order-1 lg:order-2 w-full min-w-0 lg:flex-1"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, #000 8%, #000 92%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 8%, #000 92%, transparent 100%)",
        }}
      >
        <img
          // Two separate things were making this look soft, so a re-encode alone does not fix it:
          //   1. Chroma. Encoded q95 with smartSubsample (4:4:4). The webp default 4:2:0 halves colour
          //      resolution, and this image is thin cyan type on near-black — almost pure chroma detail.
          //      Raising quality did nothing for it (q90→q100 = 0.7dB); 4:4:4 alone = +4.1dB.
          //   2. Scale. The art is 1672px wide but this slot is 984 CSS px, which a DPR2 screen renders
          //      at 1968 device px — an 18% upscale done by the browser's cheap filter. The file is
          //      pre-scaled to exactly 1968 with lanczos3 so the browser resamples by nothing.
          // The 1672px master is still the ceiling: (1) recovers real detail, (2) only stops it being
          // thrown away. A ≥1968px master would make (2) unnecessary — regenerate rather than upscale.
          src={asset("aimguard_license_hero.webp")}
          alt="AIM GUARD 대시보드와 발급된 라이선스 키"
          className="block h-auto w-full"
          style={{
            maskImage: "linear-gradient(to right, transparent 0%, #000 7%, #000 93%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 7%, #000 93%, transparent 100%)",
          }}
        />
      </motion.div>
    </div>
  </section>
);

type Values = Record<string, string>;

const CustomerForm = ({
  innerRef,
  values,
  setValues,
  locked,
}: {
  innerRef: RefObject<HTMLDivElement | null>;
  values: Values;
  setValues: (fn: (v: Values) => Values) => void;
  locked: boolean;
}) => (
  <div ref={innerRef} className={`${PANEL} p-6 md:p-10 ${locked ? "opacity-60" : ""}`}>
      <h2 className="text-[20px] font-bold text-white">고객 정보 입력</h2>
      {/* Label ABOVE the field, not beside it — Contact's arrangement. The render put labels in a
          200px left column, which is the one layout choice dropped in favour of the site system. */}
      <div className="mt-8 space-y-6">
        {FIELDS.map((f) => (
          <div key={f.name} className="space-y-2">
            {/* 16px. Home's Contact labels were moved 18px → 16px at the same time (user, 2026-07-20),
                so this still matches the form system — change both together or they drift. */}
            <label htmlFor={f.name} className="flex items-center gap-1 text-[14px] font-medium text-white">
              {f.label} <span className="text-brand-cyan">*</span>
            </label>
            <input
              id={f.name}
              type={"type" in f ? f.type : "text"}
              placeholder={f.placeholder}
              value={values[f.name] ?? ""}
              disabled={locked}
              onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
              className={INPUT}
            />
          </div>
        ))}
      </div>
  </div>
);

const Agreements = ({
  checked,
  setChecked,
  canSubmit,
  locked,
  onSubmit,
}: {
  checked: Record<string, boolean>;
  setChecked: (fn: (c: Record<string, boolean>) => Record<string, boolean>) => void;
  canSubmit: boolean;
  locked: boolean;
  onSubmit: () => void;
}) => (
    <div className={`${PANEL} p-6 md:p-10 ${locked ? "opacity-60" : ""}`}>
      {/* 동의 was accented in the render; it reads as one heading now, matching the other three cards */}
      <h2 className="text-[20px] font-bold text-white break-keep">개인정보 및 라이선스 약관 동의</h2>
      <div className="mt-4">
        {AGREEMENTS.map((a, i) => (
          <div
            key={a.id}
            className={`flex items-center justify-between py-6 ${i > 0 ? "border-t border-white/10" : ""}`}
          >
            {/* Native checkbox with accent-color, exactly as Contact does it. The render drew a custom
                26px outlined box; that is dropped so both forms behave and look identical. */}
            <label className="flex min-w-0 cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                className="h-5 w-5 shrink-0 cursor-pointer rounded-sm accent-brand-cyan"
                checked={checked[a.id] ?? false}
                disabled={locked}
                onChange={(e) => setChecked((c) => ({ ...c, [a.id]: e.target.checked }))}
              />
              <span className="select-none text-[15px] font-normal text-[#9fb0c4] break-keep">{a.label}</span>
            </label>
            <button className="flex shrink-0 items-center gap-1.5 text-[14px] whitespace-nowrap text-brand-cyan transition-opacity hover:opacity-70">
              자세히 보기
              <ChevronRight size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* The submit the render never had. Its comp drew the filled-in end state of every card at once,
          so implementing it literally produced a page that showed an issued key before anything was
          submitted. The action lives here, under the consents, because those gate it. */}
      <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 border-t border-white/10 pt-8">
        <button
          onClick={onSubmit}
          disabled={!canSubmit || locked}
          className={`${CTA} disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-none`}
          style={CTA_BG}
        >
          {locked ? "발급 완료" : "라이선스 발급 신청"}
        </button>
        {!locked && !canSubmit && (
          <p className="text-[15px] text-white/45">모든 항목을 입력하고 필수 약관에 동의해 주세요.</p>
        )}
      </div>
    </div>
);

const LicenseKey = ({ issuedKey }: { issuedKey: string | null }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!issuedKey) return;
    await navigator.clipboard.writeText(issuedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`${PANEL} flex-1 p-6 md:p-10`}>
      <h2 className="text-[20px] font-bold text-white">라이선스 키 확인</h2>
      <p className="mt-4 text-[16px] text-white/65">
        {issuedKey ? "라이선스 키를 확인하고 복사할 수 있습니다." : "신청이 완료되면 이곳에 라이선스 키가 표시됩니다."}
      </p>
      {/* Before issuance the key slot shows a MASKED string, never a realistic one: a plausible-looking
          key sitting here with a working copy button reads as already issued. Only once issuedKey
          exists does the box light up in the brand colour and the copy button work. */}
      <div
        className={`mt-7 flex items-center justify-between rounded-lg px-6 py-5 ${
          issuedKey ? "border border-brand-cyan/60 bg-brand-cyan/[0.04]" : "border border-white/10 bg-white/5"
        }`}
      >
        <code
          className={`font-mono text-[16px] md:text-[22px] tracking-[0.06em] min-w-0 break-all ${issuedKey ? "text-brand-cyan" : "text-white/30"}`}
        >
          {issuedKey ?? MASKED_KEY}
        </code>
        <button
          onClick={copy}
          disabled={!issuedKey}
          aria-label="라이선스 키 복사"
          className="shrink-0 text-white/55 transition-colors hover:text-brand-cyan disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-white/55"
        >
          {copied ? <Check size={24} className="text-brand-cyan" /> : <Copy size={24} />}
        </button>
      </div>
    </div>
  );
};

const InstallerDownload = ({ issued }: { issued: boolean }) => (
  <div className={`${PANEL} flex-1 p-6 md:p-10`}>
    <h2 className="text-[20px] font-bold text-white">설치파일 다운로드</h2>
    {/* Gated on issuance for the same reason as the key: the installer is what the licence entitles
        you to, so offering it before one exists invites the download without the key. */}
    <button
      disabled={!issued}
      className={`${CTA} mt-7 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-none`}
      style={CTA_BG}
    >
      <Download size={20} />
      설치파일 다운로드
    </button>
    <div className="mt-9 border-t border-white/10 pt-8">
      <dl className="flex flex-col gap-[18px]">
        {[
          { icon: Package, term: "제품명", desc: "AIM GUARD" },
          { icon: FileText, term: "파일명", desc: "AIMGUARD_Installer_v2.1.0.exe" },
          { icon: Tag, term: "버전", desc: "v2.1.0" },
        ].map(({ icon: Icon, term, desc }) => (
          <div key={term} className="flex items-center text-[16px]">
            <Icon size={20} className="mr-4 shrink-0 text-white/45" />
            <dt className="w-[110px] shrink-0 font-bold text-white/90">{term}</dt>
            <dd className="min-w-0 break-all text-white/70">{desc}</dd>
          </div>
        ))}
      </dl>
    </div>
  </div>
);

const AimGuardLicense = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Form state lives here, not in the cards, because the submit gate needs to see all of it at once.
  const [values, setValues] = useState<Values>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [issuedKey, setIssuedKey] = useState<string | null>(null);

  // Every field and both consents are required — the render marks all five fields and both agreements
  // [필수], so there is no optional case to model.
  const canSubmit =
    FIELDS.every((f) => (values[f.name] ?? "").trim() !== "") && AGREEMENTS.every((a) => checked[a.id]);

  const submit = async () => {
    if (!canSubmit || issuedKey) return;
    setIssuedKey(await issueLicense(values));
    // Send them to the result: the key card is below the fold from the submit button.
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 60);
  };

  // Hero on #040813 and the sections below on bg-dark, the same pairing Solution / Business /
  // AIM GUARD / Company use. The render had one flat #000613 throughout.
  return (
    <main className="bg-bg-dark">
      <Hero onStart={() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })} />

      <section className="relative overflow-hidden pb-[86px] lg:pb-[130px]">
        <div
          className="pointer-events-none absolute -left-[380px] top-[120px] h-[860px] w-[980px] rounded-[50%]"
          style={{ background: "radial-gradient(closest-side, rgba(54,132,247,0.13), rgba(54,132,247,0) 72%)" }}
        />
        {/* NOT container-custom. That column is 1600px and is the line the navbar logo, breadcrumb and
            every hero hang off, so the Hero above still uses it — but a 1600px form means a 1270px input
            for a single line of text. Only the card stack narrows (user, 2026-07-20), and it centres
            rather than hanging off the left line, so nothing above it is knocked out of alignment.
            1200 is set by the bottom pair: two cards plus the 46px gap land at 577 each. */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto flex w-full max-w-[1200px] flex-col gap-8 lg:gap-[46px] px-6"
        >
          {/* Locked after issuance so the inputs can't be edited out from under a key already granted */}
          <CustomerForm innerRef={formRef} values={values} setValues={setValues} locked={!!issuedKey} />
          <Agreements
            checked={checked}
            setChecked={setChecked}
            canSubmit={canSubmit}
            locked={!!issuedKey}
            onSubmit={submit}
          />
          {/* These two are a pair in the render — equal width, side by side, stacking on narrow */}
          <div ref={resultRef} className="flex flex-col gap-8 lg:gap-[46px] lg:flex-row">
            <LicenseKey issuedKey={issuedKey} />
            <InstallerDownload issued={!!issuedKey} />
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default AimGuardLicense;
