import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { MapPin, Phone, Mail, Printer } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";

// 오시는길, the second Company sub-page (nav.ts COMPANY_SUBS / route /company/location, added 2026-07-20).
// Hero mirrors Company's exactly so the two sit together; body is a live Kakao map plus the contact
// block. Address/phone are the ones already in the Home footer.

const ADDRESS = "경기 안양시 동안구 벌말로 66";
const ADDRESS_FULL = "경기도 안양시 동안구 벌말로 66, 8동 805호 (평촌역 하이필드지식산업센터)";
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
    <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-white/10">
      <div ref={boxRef} className="h-full w-full bg-white/[0.03]" />
      {/* Fallback if the SDK never loads — usually a domain not on the Kakao allow-list. The address is
          still reachable via the share link, so the page is never a dead end. */}
      {failed && (
        <a
          href={KAKAO_MAP_URL}
          target="_blank"
          rel="noreferrer"
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0a1424] text-white/50 transition-colors hover:text-brand-cyan"
        >
          <MapPin size={40} strokeWidth={1.5} />
          <p className="text-[15px]">카카오맵에서 위치 보기 →</p>
        </a>
      )}
    </div>
  );
};

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

    <div className="absolute top-0 inset-x-0 h-[96px] bg-gradient-to-b from-[#020617] via-[#020617]/55 to-transparent pointer-events-none z-[1]" />

    <Breadcrumb />

    <div className="container-custom relative z-10 pt-[227px] pb-[120px]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-[760px] flex flex-col"
      >
        <p className="text-[#90a1b9] text-[20px] font-bold leading-[1.4] mb-[27px]">Location</p>
        <h1 className="text-[40px] md:text-[64px] font-bold text-white leading-[1.2]">오시는길</h1>
      </motion.div>
    </div>
  </section>
);

const LocationBody = () => (
  <section className="relative bg-[#020617] pb-[200px] overflow-hidden">
    <div className="container-custom relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-[1240px]"
      >
        <KakaoMap />

        <dl className="mt-12 grid grid-cols-1 gap-x-16 gap-y-7 md:grid-cols-2">
          {INFO.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-4">
              <Icon size={22} className="mt-1 shrink-0 text-brand-cyan" />
              <div>
                <dt className="text-[15px] font-bold text-white">{label}</dt>
                <dd className="mt-1 text-[16px] leading-[1.6] text-[#b3b4b9] break-keep">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
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
