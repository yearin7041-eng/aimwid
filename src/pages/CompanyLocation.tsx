import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { MapPin, Phone, Mail, Printer, Navigation } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";

// 오시는 길, the second Company sub-page (nav.ts COMPANY_SUBS / route /company/location, added 2026-07-20).
// Hero mirrors Company's exactly so the two sit together; body is a live Kakao map plus the contact
// block. Address/phone are the ones already in the Home footer.

const ADDRESS = "경기 안양시 동안구 벌말로 66";
const ADDRESS_FULL = "경기도 안양시 동안구 벌말로 66, B동 805호 (평촌역 하이필드지식산업센터)";
const KAKAO_MAP_URL = "https://kko.to/HdfL3oDfR6"; // the client's own share link, → the address above

// Kakao JavaScript key. Public by design (it ships to the browser); what protects it is the domain
// allow-list registered in the Kakao dashboard, NOT secrecy — so localhost:3000 and the GitHub Pages
// origin must both be listed there or the SDK refuses to load. The REST/Native keys from the same app
// are NOT public and must never appear here.
const KAKAO_JS_KEY = "13d7537802e86396b7b47530be026ac7";

const INFO = [
  { icon: MapPin, label: "주소", value: ADDRESS_FULL },
  { icon: Phone, label: "Tel", value: "031-596-2524" },
  { icon: Printer, label: "Fax", value: "031-596-2529" },
  { icon: Mail, label: "E-mail", value: "aimwid@aimwid.ai" },
];

// Load the SDK once and hand back the global. Shared across mounts (React StrictMode double-invokes
// effects in dev) via a single promise cached on window, so the <script> is never added twice.
const loadKakao = (): Promise<any> => {
  const w = window as any;
  if (w.__kakaoMapPromise) return w.__kakaoMapPromise;
  w.__kakaoMapPromise = new Promise((resolve, reject) => {
    if (w.kakao?.maps) return resolve(w.kakao);
    const s = document.createElement("script");
    // autoload=false → the SDK does not self-init; we call kakao.maps.load ourselves. services library
    // is what provides the geocoder that turns the road address into coordinates.
    s.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&autoload=false&libraries=services`;
    s.async = true;
    s.onload = () => w.kakao.maps.load(() => resolve(w.kakao));
    s.onerror = () => reject(new Error("kakao sdk load failed"));
    document.head.appendChild(s);
  });
  return w.__kakaoMapPromise;
};

const KakaoMap = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadKakao()
      .then((kakao) => {
        if (cancelled || !boxRef.current) return;
        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.addressSearch(ADDRESS, (results: any[], status: string) => {
          if (cancelled || !boxRef.current) return;
          if (status !== kakao.maps.services.Status.OK || !results[0]) return setFailed(true);
          const pos = new kakao.maps.LatLng(Number(results[0].y), Number(results[0].x));
          const map = new kakao.maps.Map(boxRef.current, { center: pos, level: 3 });
          new kakao.maps.Marker({ map, position: pos });
          // Keep the pin centred when the container resizes (e.g. mobile ↔ desktop)
          const recenter = () => {
            map.relayout();
            map.setCenter(pos);
          };
          window.addEventListener("resize", recenter);
          (boxRef.current as any).__cleanup = () => window.removeEventListener("resize", recenter);
        });
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
      (boxRef.current as any)?.__cleanup?.();
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10">
      <div ref={boxRef} className="h-full w-full bg-white/[0.03]" />
      {/* Fallback if the SDK never loads — usually a domain not on the Kakao allow-list. The address is
          still reachable via the share link, so the page is never a dead end. */}
      {failed && (
        <a
          href={KAKAO_MAP_URL}
          target="_blank"
          rel="noreferrer"
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0a1420] text-white/50 transition-colors hover:text-brand-cyan"
        >
          <MapPin size={40} strokeWidth={1.5} />
          <p className="text-[15px]">카카오맵에서 위치 보기 →</p>
        </a>
      )}
    </div>
  );
};

// Hero visual for 오시는 길 (user, 2026-07-22). Code-drawn rather than a raster: the page is about a
// place, so a stylised night navigation-map — city blocks, a road grid with avenues + a diagonal, a
// river, and a glowing route threading to the destination pin (with radar pings) — reads the subject at
// a glance and stays crisp as vector. Palette is the site's cyan #2fd4c4 → blue #3684f7. First pass was
// a plain slanted grid; the block fills + river + turning route are what make it read as a map, not
// graph paper (user feedback, 2026-07-22). Pinned right, behind the copy; the hero's left→right
// darkening keeps the text legible.
// Columns run well past the left of the 0-origin so the street mesh spreads across the empty left side
// of the hero and fades out into the section (user, 2026-07-22). The pin/route/pings stay anchored on the
// right; only the map layer extends. Skips are by cell CENTRE now (not index) so the pin plaza stays clear
// regardless of how many columns are added, plus a deterministic scatter for irregular block gaps.
const MAP_COLS = [-306, -234, -162, -90, -18, 54, 126, 198, 270, 342, 414, 486, 558];
const MAP_ROWS = [40, 104, 168, 232, 296, 360, 424, 488, 552];
const MAP_VIEW_LEFT = -340; // viewBox left edge — a touch beyond the first column so it doesn't cut flush
const inPinPlaza = (cx: number, cy: number) => cx > 250 && cx < 432 && cy > 208 && cy < 374;
const MAP_BLOCKS: { x: number; y: number; w: number; h: number; op: number }[] = [];
for (let i = 0; i < MAP_COLS.length - 1; i++) {
  for (let j = 0; j < MAP_ROWS.length - 1; j++) {
    const x = MAP_COLS[i];
    const y = MAP_ROWS[j];
    const w = MAP_COLS[i + 1] - x;
    const h = MAP_ROWS[j + 1] - y;
    if (inPinPlaza(x + w / 2, y + h / 2)) continue; // clear the ground around the pin
    if ((i * 7 + j * 5) % 13 === 0) continue; // irregular gaps so it isn't a perfect grid
    MAP_BLOCKS.push({
      x: x + 7,
      y: y + 7,
      w: w - 14,
      h: h - 14,
      op: (i + j) % 3 === 0 ? 0.055 : (i + j) % 3 === 1 ? 0.035 : 0.045,
    });
  }
}
const PIN_X = 300;
const PIN_TIP_Y = 316; // where the pin meets the ground — pings and the route radiate from here
const AVE_Y = MAP_ROWS[5]; // 360 — the horizontal avenue the route runs along
const AVE_X = MAP_COLS[4]; // 342 — the vertical avenue it turns up
// nav route: start bottom-left, up to the avenue, along it, up a street, across to the pin
const MAP_ROUTE = `M70 540 L70 ${AVE_Y} L${AVE_X} ${AVE_Y} L${AVE_X} ${MAP_ROWS[3]} L${PIN_X} ${MAP_ROWS[3]} L${PIN_X} ${PIN_TIP_Y}`;
// Mobile crop is tighter (x 40–560, y 170–470), so the desktop route's far-left (x=-18) and bottom
// (y=540) legs fall outside and read as a clipped line. This compact route keeps every leg inside the
// mobile frame, still emerging from the bottom into the pin. Desktop keeps MAP_ROUTE untouched.
const MAP_ROUTE_MOBILE = `M110 452 L110 ${AVE_Y} L200 ${AVE_Y} L200 ${MAP_ROWS[3]} L${PIN_X} ${MAP_ROWS[3]} L${PIN_X} ${PIN_TIP_Y}`;

const MapGraphic = ({
  viewBox,
  fx = 1,
  route = MAP_ROUTE,
  routeStart = { x: 70, y: 540 },
}: {
  viewBox?: string;
  fx?: number;
  route?: string;
  routeStart?: { x: number; y: number };
}) => {
  const reduce = useReducedMotion();
  // Unique per instance — desktop and mobile both render MapGraphic, so a hard-coded id collides and the
  // pin's url(#…) fill resolves to the first (display:none desktop) gradient, leaving the pin unpainted.
  const gradId = useId();

  return (
    <svg viewBox={viewBox ?? `${MAP_VIEW_LEFT} 0 ${572 - MAP_VIEW_LEFT} 572`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4fe3e0" />
          <stop offset="100%" stopColor="#2f7ec9" />
        </linearGradient>
      </defs>

      {/* Street layer — rotated a touch so it reads as a map rather than axis-aligned graph paper. Spans
          from MAP_VIEW_LEFT across to the right; the wrapper's left-fade mask dissolves the far-left end. */}
      <g transform="rotate(-7 286 286)">
        {/* river band, entering from the far left */}
        <path
          d="M-340 130 C -160 90, -40 150, 90 330 S 200 500, 420 560"
          fill="none"
          stroke="#2f7ec9"
          strokeOpacity="0.18"
          strokeWidth="22"
          strokeLinecap="round"
        />
        {/* city blocks */}
        {MAP_BLOCKS.map((b, i) => (
          <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="3" fill="#8fd0e6" fillOpacity={b.op} />
        ))}
        {/* minor street grid */}
        <g stroke="#6fb6d4" strokeOpacity="0.14" strokeWidth="1.3">
          {MAP_ROWS.map((y) => (
            <line key={`r${y}`} x1="-330" y1={y} x2="566" y2={y} />
          ))}
          {MAP_COLS.map((x) => (
            <line key={`c${x}`} x1={x} y1="28" x2={x} y2="560" />
          ))}
        </g>
        {/* major avenues + diagonal boulevards (one each side) */}
        <g stroke="#a7dcea" strokeOpacity="0.26" strokeWidth="3" strokeLinecap="round">
          <line x1="-330" y1={AVE_Y} x2="572" y2={AVE_Y} />
          <line x1={AVE_X} y1="22" x2={AVE_X} y2="566" />
          <path d="M60 40 L 540 560" fill="none" />
          <path d="M-300 150 L 190 560" fill="none" strokeOpacity="0.18" />
        </g>
      </g>

      {/* Radar pings emanating from the pin's ground point */}
      {!reduce &&
        [0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx={PIN_X}
            cy={PIN_TIP_Y}
            r={30 * fx}
            fill="none"
            stroke="#2fd4c4"
            strokeWidth={1.3}
            initial={{ opacity: 0 }}
            animate={{ r: [30 * fx, 150 * fx], opacity: [0.5, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, delay: i * 1.2, ease: "easeOut" }}
          />
        ))}

      {/* Highlighted navigation route to the pin */}
      <path
        d={route}
        fill="none"
        stroke="#00f0e0"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: "drop-shadow(0 0 6px rgba(0,240,224,0.6))" }}
      />
      <circle cx={routeStart.x} cy={routeStart.y} r="6" fill="#00f0e0" />

      {/* Ground disc + the pin, with a gentle bob for life */}
      <ellipse cx={PIN_X} cy={PIN_TIP_Y} rx="34" ry="11" fill="#2fd4c4" fillOpacity="0.14" />
      <motion.g
        animate={reduce ? undefined : { y: [0, -9, 0] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: "drop-shadow(0 6px 16px rgba(47,212,196,0.4))" }}
      >
        <path
          d={`M${PIN_X} ${PIN_TIP_Y} C ${PIN_X - 20} ${PIN_TIP_Y - 26} ${PIN_X - 34} ${PIN_TIP_Y - 42} ${PIN_X - 34} ${PIN_TIP_Y - 64} A 34 34 0 1 1 ${PIN_X + 34} ${PIN_TIP_Y - 64} C ${PIN_X + 34} ${PIN_TIP_Y - 42} ${PIN_X + 20} ${PIN_TIP_Y - 26} ${PIN_X} ${PIN_TIP_Y} Z`}
          fill={`url(#${gradId})`}
        />
        <circle cx={PIN_X} cy={PIN_TIP_Y - 64} r="12.5" fill="#040813" />
      </motion.g>
    </svg>
  );
};

const Hero = () => (
  <section className="relative lg:min-h-[820px] overflow-hidden bg-[#040813]">
    <div className="absolute inset-0 pointer-events-none">
      {/* Map/pin hero visual, right-anchored so the pin holds its place while the widened map mesh spreads
          left across the empty side of the hero. Three intersected fades dissolve the map's left, top and
          bottom into the section so it melts away toward the copy rather than ending on a hard edge (user,
          2026-07-22). Width tracks the now ~1.6× wider viewBox so the right/pin end keeps its on-screen size. */}
      <div
        className="hidden lg:block absolute right-[-2%] top-1/2 w-[80%] max-w-[1160px] -translate-y-1/2 select-none"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, #000 42%), linear-gradient(to bottom, transparent 0%, #000 16%), linear-gradient(to bottom, #000 74%, transparent 97%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, #000 42%), linear-gradient(to bottom, transparent 0%, #000 16%), linear-gradient(to bottom, #000 74%, transparent 97%)",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      >
        <MapGraphic />
      </div>
      <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#040813] from-6% via-[#040813]/55 via-[36%] to-transparent to-[62%]" />
      <div className="absolute inset-x-0 bottom-0 h-[180px] bg-gradient-to-b from-transparent to-[#020617]" />
    </div>

    <div className="absolute top-0 inset-x-0 h-[96px] bg-gradient-to-b from-[#020617] via-[#020617]/55 to-transparent pointer-events-none z-[1]" />

    <Breadcrumb />

    {/* Mobile: the map graphic stacks above the copy (like the other heroes); desktop keeps it as the
        right-side background above. pt-[92px] clears the absolute breadcrumb; bottom fade melts it into
        the copy. */}
    <div className="lg:hidden container-custom relative z-[2] pt-[92px] pointer-events-none">
      <div
        className="mx-auto w-[85%] max-w-[520px] overflow-hidden"
        style={{
          // Light 4-edge fade so the full map dissolves into the section; bottom fades into the copy.
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent), linear-gradient(to bottom, transparent, #000 14%, #000 76%, transparent)",
          WebkitMaskComposite: "source-in",
          maskImage:
            "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent), linear-gradient(to bottom, transparent, #000 14%, #000 76%, transparent)",
          maskComposite: "intersect",
        }}
      >
        {/* Crop to a ~400-wide window so the pin renders at its desktop on-screen size (the full 912-wide
            map shrinks the pin to ~14px on a phone). Framing keeps the route + rings, matching desktop. */}
        <MapGraphic viewBox="40 170 520 300" route={MAP_ROUTE_MOBILE} routeStart={{ x: 110, y: 452 }} />
      </div>
    </div>

    <div className="container-custom relative z-10 pt-8 lg:pt-[200px] pb-[40px] lg:pb-[120px]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-[760px] flex flex-col"
      >
        <p className="text-[#90a1b9] text-[14px] md:text-[20px] font-bold leading-[1.4] mb-2 md:mb-[27px]">Location</p>
        <h1 className="text-[30px] sm:text-[40px] md:text-[64px] font-bold text-white leading-[1.2] break-keep">오시는 길</h1>
      </motion.div>
    </div>
  </section>
);

const LocationBody = () => (
  <section className="relative bg-[#020617] pb-[86px] lg:pb-[200px] overflow-hidden">
    <div className="container-custom relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto grid max-w-[1600px] grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-stretch"
      >
        {/* Map — 560px on desktop sets the row height; the contact card stretches to match it */}
        <div className="h-[440px] lg:h-[560px]">
          <KakaoMap />
        </div>

        {/* Contact card, sat beside the map (user, 2026-07-22) instead of stacked beneath it. flex-col with
            the 길찾기 button on mt-auto so the card fills the map's height with the button pinned to the base. */}
        <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-8 lg:min-h-0 lg:p-10">
          <h3 className="text-[24px] md:text-[28px] font-bold text-white">AIMWID 본사</h3>

          <dl className="mt-8 lg:mt-12 flex flex-col gap-6">
            {INFO.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4">
                <Icon size={20} className="mt-1 shrink-0 text-brand-cyan" />
                <div>
                  <dt className="text-[14px] font-bold text-white">{label}</dt>
                  <dd className="mt-1 text-[15px] leading-[1.6] text-[#9fb0c4] break-keep">{value}</dd>
                </div>
              </div>
            ))}
          </dl>

          <a
            href={KAKAO_MAP_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-8 lg:mt-auto flex h-[48px] sm:h-[54px] items-center justify-center gap-2.5 rounded-[10px] border border-white/15 bg-white/[0.04] text-[15px] font-medium text-white transition-colors hover:border-[#2fd4c4]/50 hover:bg-white/[0.07]"
          >
            <Navigation size={17} className="text-[#2fd4c4]" />
            카카오맵 길찾기
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

const CompanyLocation = () => (
  <div className="pt-[80px] min-h-screen text-white bg-[#020617] font-sans overflow-hidden">
    <Hero />
    <LocationBody />
  </div>
);

export default CompanyLocation;
