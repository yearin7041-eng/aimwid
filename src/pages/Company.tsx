import { motion } from "motion/react";
import type { ReactNode } from "react";
import Breadcrumb from "../components/Breadcrumb";

// Heading system, same spec the whole site uses: label 20px #0cc → 16px gap → title Bold 50px
// leading-1.5. Matches BizHeading / CenterHeading / AimGuard's SectionHeading — all four were
// unified on 2026-07-16.
const CoHeading = ({ label, title, align = "left" }: { label: string; title: ReactNode; align?: "left" | "center" }) => (
  <div className={`flex flex-col gap-4 ${align === "center" ? "items-center text-center" : "items-start"}`}>
    <p className="text-[#00cccc] text-[20px] font-normal leading-[1.2]">{label}</p>
    <h2 className="text-[32px] md:text-[50px] font-bold text-white leading-[1.5] break-keep">{title}</h2>
  </div>
);

// --- 1. Hero ---
// Structure only, matching the other pages so the section is in place: min-h-[820px] on #040813 like
// Solution and Business (AIMNIS / AIM GUARD run 900px), h1 40/64px, 18px body, the 96px header bridge,
// and the left→right darkening a visual would sit behind. No eyebrow — all four heroes dropped theirs
// (see the hero-eyebrow memory), so a teal label on this site means "a section starts here".
//
// TWO THINGS ARE PROVISIONAL AND NEED THE CLIENT:
//   1. The copy below is DERIVED from the 소개 section's own text, not supplied. It is a placeholder.
//   2. There is no visual. The other four heroes all carry one (Business/Solution a raster pinned
//      right, AIMNIS a video). The gradients here already assume that shape, so dropping an image in
//      later means adding one <img> — nothing else moves.
const Hero = () => (
  <section className="relative min-h-[820px] overflow-hidden bg-[#040813]">
    <div className="absolute inset-0 pointer-events-none">
      <div
        className="absolute right-[-10%] top-[4%] h-[820px] w-[980px] rounded-[50%]"
        style={{ background: "radial-gradient(closest-side, rgba(0,204,204,0.20), rgba(0,204,204,0) 70%)" }}
      />
      <div
        className="absolute right-[14%] bottom-[-16%] h-[700px] w-[860px] rounded-[50%]"
        style={{ background: "radial-gradient(closest-side, rgba(54,132,247,0.18), rgba(54,132,247,0) 70%)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#040813] from-6% via-[#040813]/55 via-[36%] to-transparent to-[62%]" />
      <div className="absolute inset-x-0 bottom-0 h-[180px] bg-gradient-to-b from-transparent to-[#020617]" />
    </div>

    {/* Header → hero color bridge — darkens the navbar strip only */}
    <div className="absolute top-0 inset-x-0 h-[96px] bg-gradient-to-b from-[#020617] via-[#020617]/55 to-transparent pointer-events-none z-[1]" />

    <Breadcrumb />

    {/* pt matches Business */}
    <div className="container-custom relative z-10 pt-[227px] pb-[120px]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-[760px] flex flex-col"
      >
        <p className="text-[#90a1b9] text-[20px] font-bold leading-[1.4] mb-[27px]">에임위드를 움직이는 기술</p>
        <h1 className="text-[40px] md:text-[64px] font-bold text-white leading-[1.2]">
          기술로 앞서가는<br />
          AI 기술 중심 기업
        </h1>
        <p className="text-white text-[18px] font-normal leading-[1.4] mt-6">
          AI 기술과 스마트 모니터링 솔루션으로<br />
          고객의 비즈니스 환경을 더 효율적이고 지능적으로 바꿉니다.
        </p>
      </motion.div>
    </div>
  </section>
);

// --- 2. 소개 ---
// Title and body verbatim from the client, 2026-07-16. ONE block, as the source has it. It was briefly
// split into four <p>s for readability at 1223px; the user undid that on 2026-07-20, so the sentences
// run together and wrap on width rather than on sentence boundaries. No word is changed. The closing
// 감사합니다 is part of the same run — it used to be its own lighter-coloured <p>, and folding it in
// (user, same day) means it now takes the body colour and simply trails the last sentence.
//
// JSX, not a string, so line breaks can be placed by hand: put <br /> at the end of any line below and
// the text breaks there. A plain string could not do this — React escapes markup inside strings, so a
// literal "<br />" would print as those six characters. Source line breaks alone do nothing: JSX joins
// adjacent lines with a single space, which is why the sentences flow as one paragraph as written.
const intro = (
  <>
    에임위드는 AI 기술과 스마트 모니터링 솔루션 개발을 통해 고객의 비즈니스 환경을 더욱 효율적이고 지능적으로 변화시키는 기술 중심 기업입니다.<br />
    빠르게 변화하는 디지털 시대에 발맞춰 저희는 끊임없는 연구개발을 통해 독자적인 기술력을 확보하고 있으며, 다양한 산업군에 최적화된 AI 솔루션과 <br /> 실시간 모니터링 시스템을 제공합니다.
    데이터 기반의 정밀한 분석과 직관적인 인터페이스를 통해 고객의 문제를 정확히 진단하고, <br /> 한발 앞선 대응이 가능하도록 지원합니다.
    앞으로도 고객의 신뢰를 최우선 가치로 삼아, 더욱 정교하고 강력한 기술력으로 산업의 미래를 선도해 나가겠습니다.
    감사합니다.
  </>
);

// This one section owns BOTH section gaps on the page: History below has no pt of its own, so Intro's
// pb is the Intro→History gap, and Hero has no mb, so Intro's pt is the Hero→Intro gap. Both are 320px
// (user, 2026-07-20) — change them together or the rhythm goes uneven. Note Hero also carries its own
// pb-[120px] INSIDE its container, so the distance from the hero's last line to Intro's label reads as
// 440px, not 320; the 320 is measured from the section boundary, as it is between Intro and History.
const Intro = () => (
  <section className="relative bg-[#020617] pt-[320px] pb-[320px] overflow-hidden">
    <div className="pointer-events-none absolute -left-[420px] top-[-120px] h-[900px] w-[1000px] rounded-[50%]" style={{ background: "radial-gradient(closest-side, rgba(0,204,204,0.16), rgba(0,204,204,0) 72%)" }} />
    <div className="container-custom relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-6"
      >
        <CoHeading
          label="About"
          title={
            <>
              끊임없는 연구개발로<br />
              기술경쟁력에서 앞서갑니다.
            </>
          }
          align="center"
        />
        <div className="max-w-[1223px] text-center">
          <p className="text-[#b3b4b9] text-[17px] md:text-[19px] font-normal leading-[1.75] break-keep">
            {intro}
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

// --- 3. 연혁 ---
// Verbatim from the client's 성장 slide, 2026-07-16. NOTE this section names clients and projects
// outright (한국서부발전, 한전KDN, 부산시, KETI …), which the client had ruled out for the Business
// page — "areas only" there. Company is treated as the exception, since a 연혁 cannot exist without
// them, but that is an assumption worth re-confirming.
//
// Order runs newest-first, left to right, exactly as the slide does. `patent` marks the two entries
// the slide badges as [특허]; it stays brand-cyan rather than the slide's gold, because the site has
// exactly one non-teal accent so far (Business card 05's hazard red) and it is unconfirmed.
type Milestone = { year: string; items: { text: string; patent?: boolean }[] };

const milestones: Milestone[] = [
  {
    year: "2026",
    items: [
      { text: "한국전력연구원 가스복합발전 운영 최적화 솔루션 고도화 사업" },
      { text: "한양대[에리카] EmerGREEN SW 개발 사업" },
      { text: "OPC UA 규격 적합성 검증 장치, 방법 및 이를 이용한 프로그램", patent: true },
      { text: "광명시 스마트시티 데이터플랫폼 개발 사업" },
      { text: "부여군 스마트 빌리지 사업" },
      { text: "화성시 맞춤형 대장관리시스템 유지보수 사업" },
    ],
  },
  {
    year: "2025",
    items: [
      { text: "인공지능 기반 발전데이터 통합관리 및 예측유지보수 시스템", patent: true },
      { text: "부여군 스마트 빌리지 통합 연계 구축" },
      { text: "서부발전 동반상생 통합관리 플랫폼 구축" },
      { text: "한전 KDN GPT 위험성평가 플랫폼 POC사업" },
      { text: "부산시 디지털트윈 대국민 포털서비스 구축" },
      { text: "한국전자기술연구원(KETI) AI발전모니터링 시스템 구축" },
      { text: "한국서부발전 발전소 통합환경감지시스템 구축" },
    ],
  },
  {
    year: "2024",
    items: [
      { text: "한국서부발전 발전데이터활용 창업벤처기업 선정" },
      { text: "한국외국어대학교 MOU 체결 (LLM)" },
      { text: "㈜이든TNS 생성형AI사업 파트너사 계약" },
      { text: "한국서부발전 발전데이터 비즈니스 플랫폼 사업" },
      { text: "한국전력연구원 IDPP포털 고도화 사업" },
    ],
  },
  {
    year: "2023",
    items: [
      { text: "김포복합화력(KDN) 데이터연계사업 진행" },
      { text: "한국서부발전 스마트대기환경 관리시스템 구축사업 수주" },
      { text: "한국외국어대학교 중소기업지원사업 선정 (생성형 AI시범사업)" },
      { text: "한국서부발전 발전데이터 활용 창업벤처기업 선정" },
      { text: "㈜에임위드 설립" },
    ],
  },
];

const History = () => (
  <section className="relative bg-[#020617] pb-[160px] overflow-hidden">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_44%_at_50%_38%,rgba(0,204,204,0.07),transparent_70%)]" />
    <div className="container-custom relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-6"
      >
        <CoHeading label="History" title="AIMWID의 성장" align="center" />
        <p className="max-w-[1000px] text-center text-[#b3b4b9] text-[17px] md:text-[19px] font-normal leading-[1.7] break-keep">
          에임위드는 2023년 설립 이후 빠른 속도로 성장하며 주요 공공기관 및 에너지 기업과의 협력을 확대해 왔습니다.
        </p>
      </motion.div>

      {/* Vertical and alternating. It started as four columns across, which split 23 uneven entries
          (2025 has seven, 2024 five) into a ragged row of narrow measures that wrapped most lines in
          two. Stacking fixed the wrapping but ran everything down one left rail, which read flat and
          left the years crowding each other.
          Zigzag does three jobs at once: it uses the full width instead of leaving a dead right half,
          it gives each year its own side so the eye groups the entries without needing a divider, and
          the side flip is itself the separation the years were missing.

          Left-hand years are right-aligned INCLUDING their bullets (`items-end` + `flex-row-reverse`),
          so both sides read toward the rail. Reversing the row without `items-end` would leave the
          bullets floating at the block's right edge instead of beside their text.

          Below md the whole thing collapses to one left rail — a zigzag at phone width is two
          half-width columns of two-word fragments. */}
      <div className="relative mx-auto mt-20 max-w-[1120px]">
        {/* one rail for the whole run: centred on md+, hard left below it */}
        <div className="absolute top-2 bottom-2 left-[6px] md:left-1/2 md:-translate-x-1/2 w-px bg-gradient-to-b from-[#00cccc]/10 via-[#00cccc]/45 to-[#00cccc]/10" />

        {milestones.map((m, i) => {
          const right = i % 2 === 1;
          return (
            <motion.div
              key={m.year}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-90px" }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="relative grid md:grid-cols-2 pl-9 md:pl-0 pb-16 md:pb-24 last:pb-0"
            >
              <span className="absolute left-[6px] md:left-1/2 top-[10px] -translate-x-1/2 h-[13px] w-[13px] rounded-full bg-[#00f5ff] ring-4 ring-[#020617] shadow-[0_0_16px_4px_rgba(0,245,255,0.5)]" />

              <div className={right ? "md:col-start-2 md:pl-14" : "md:col-start-1 md:pr-14"}>
                <p className={`text-[30px] md:text-[42px] font-bold text-white leading-none ${right ? "" : "md:text-right"}`}>{m.year}</p>

                <ul className={`mt-5 flex flex-col gap-3 ${right ? "" : "md:items-end"}`}>
                  {m.items.map((it, k) => (
                    <li key={k} className={`flex gap-2.5 text-[15px] md:text-[16px] leading-[1.65] break-keep ${right ? "" : "md:flex-row-reverse"}`}>
                      <span className="mt-[9px] h-[3px] w-[3px] shrink-0 rounded-full bg-white/45" />
                      <span className={`text-white/75 ${right ? "" : "md:text-right"}`}>
                        {it.patent && <span className="text-[#00f5ff] font-semibold">[특허] </span>}
                        {it.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

// pt-[80px] clears the fixed 80px navbar — without it the hero starts at y=0 and the breadcrumb,
// which sits 60px into the hero, lands underneath the menu. Same wrapper as the other four pages.
const Company = () => (
  <div className="pt-[80px] min-h-screen text-white bg-[#020617] font-sans overflow-hidden">
    <Hero />
    <Intro />
    <History />
  </div>
);

export default Company;
