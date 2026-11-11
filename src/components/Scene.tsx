const PETALS = Array.from({ length: 18 }, (_, i) => ({
  left: 190 + ((i * 167) % 960),
  delay: (i * 1.37) % 9,
  dur: 7 + ((i * 2.3) % 5),
  size: 8 + ((i * 5) % 7),
}));

const BLOSSOMS: [number, number, number][] = [
  [200, 80, 46], [250, 70, 40], [300, 92, 36], [230, 120, 34], [345, 72, 30], [180, 150, 30],
  [1140, 80, 46], [1090, 72, 40], [1040, 90, 36], [1110, 122, 34], [995, 74, 30], [1150, 160, 30],
  [560, 70, 28], [610, 66, 24], [740, 68, 26], [790, 74, 22],
];

/** Wall, sakura windows, lanterns, chalkboard and plants — everything behind customers. */
export function SceneBack({ served, lost }: { served: number; lost: number }) {
  return (
    <div className="absolute inset-0">
      <svg width={1280} height={360} viewBox="0 0 1280 360" className="absolute left-0 top-0" aria-hidden>
        <defs>
          <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F6DCD9" />
            <stop offset="100%" stopColor="#EBC9C9" />
          </linearGradient>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF4F7" />
            <stop offset="60%" stopColor="#FBDDE8" />
            <stop offset="100%" stopColor="#F4C9DA" />
          </linearGradient>
          <radialGradient id="lantern" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#FFF4D6" />
            <stop offset="70%" stopColor="#FFC97A" />
            <stop offset="100%" stopColor="#F39A55" />
          </radialGradient>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE6A8" stopOpacity={0.7} />
            <stop offset="100%" stopColor="#FFE6A8" stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect width={1280} height={360} fill="url(#wall)" />
        {/* wainscot stripes */}
        {Array.from({ length: 33 }, (_, i) => (
          <rect key={i} x={i * 40} y={0} width={2} height={360} fill="#fff" opacity={0.18} />
        ))}
        {/* window */}
        <rect x={186} y={60} width={968} height={284} rx={14} fill="#7A5240" />
        <rect x={198} y={72} width={944} height={272} rx={6} fill="url(#sky)" />
        {/* distant town */}
        <g fill="#F1C6D6" opacity={0.9}>
          <rect x={220} y={250} width={70} height={100} rx={4} />
          <rect x={300} y={226} width={54} height={124} rx={4} />
          <rect x={470} y={240} width={90} height={110} rx={4} />
          <rect x={700} y={232} width={60} height={118} rx={4} />
          <rect x={860} y={246} width={80} height={104} rx={4} />
          <rect x={980} y={222} width={64} height={128} rx={4} />
          <path d="M580 350 L580 260 L620 230 L660 260 L660 350Z" />
        </g>
        <g fill="#E9B3C7" opacity={0.7}>
          <rect x={380} y={270} width={70} height={80} rx={4} />
          <rect x={780} y={262} width={60} height={88} rx={4} />
          <rect x={1060} y={258} width={70} height={92} rx={4} />
        </g>
        {/* branches */}
        <g stroke="#6E4637" strokeLinecap="round" fill="none">
          <path d="M198 160 Q260 120 330 96 Q380 82 420 88" strokeWidth={9} />
          <path d="M260 126 Q280 90 270 70" strokeWidth={5} />
          <path d="M1142 170 Q1080 126 1010 100 Q960 84 920 90" strokeWidth={9} />
          <path d="M1080 128 Q1060 92 1072 72" strokeWidth={5} />
          <path d="M520 72 Q580 96 640 84 Q700 72 820 90" strokeWidth={4} />
        </g>
        {BLOSSOMS.map(([x, y, r], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={r} fill="#F7A8C2" opacity={0.85} />
            <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.6} fill="#FBC6D8" />
            <circle cx={x + r * 0.35} cy={y + r * 0.1} r={r * 0.45} fill="#F48FB1" opacity={0.7} />
          </g>
        ))}
        {/* mullions */}
        <g fill="#7A5240">
          <rect x={426} y={72} width={10} height={272} />
          <rect x={665} y={72} width={10} height={272} />
          <rect x={904} y={72} width={10} height={272} />
          <rect x={198} y={196} width={944} height={8} />
        </g>
        <rect x={198} y={72} width={944} height={272} rx={6} fill="#fff" opacity={0.08} />
        {/* lanterns */}
        {[150, 1210].map((x) => (
          <g key={x}>
            <circle cx={x} cy={118} r={70} fill="url(#glow)" />
            <line x1={x} y1={0} x2={x} y2={84} stroke="#5B3A2E" strokeWidth={3} />
            <rect x={x - 12} y={82} width={24} height={8} rx={2} fill="#5B3A2E" />
            <ellipse cx={x} cy={118} rx={30} ry={30} fill="url(#lantern)" />
            <path d={`M${x - 26} 108 Q${x} 104 ${x + 26} 108 M${x - 28} 120 Q${x} 116 ${x + 28} 120 M${x - 26} 132 Q${x} 128 ${x + 26} 132`} stroke="#E08A4A" strokeWidth={1.5} fill="none" opacity={0.6} />
            <rect x={x - 10} y={146} width={20} height={8} rx={2} fill="#5B3A2E" />
          </g>
        ))}
        {/* plants on right shelf */}
        <rect x={1168} y={276} width={104} height={10} rx={3} fill="#9C6B50" />
        <g>
          <path d="M1190 276 L1186 246 L1214 246 L1210 276Z" fill="#E8D7C9" />
          <circle cx={1200} cy={236} r={18} fill="#6DAA6A" />
          <circle cx={1188} cy={226} r={12} fill="#82BE7C" />
          <circle cx={1212} cy={222} r={11} fill="#5E9A5C" />
          <path d="M1240 276 L1236 252 L1262 252 L1258 276Z" fill="#F2B5C5" />
          <circle cx={1249} cy={240} r={14} fill="#7BB673" />
          <circle cx={1243} cy={228} r={6} fill="#F7A8C2" />
          <circle cx={1256} cy={232} r={5} fill="#FBC6D8" />
        </g>
      </svg>

      {/* falling petals */}
      <div className="pointer-events-none absolute left-0 top-0 h-[360px] w-[1280px] overflow-hidden">
        {PETALS.map((p, i) => (
          <span
            key={i}
            className="petal"
            style={{
              left: p.left,
              width: p.size,
              height: p.size * 0.75,
              animationDelay: `-${p.delay}s`,
              animationDuration: `${p.dur}s`,
            }}
          />
        ))}
      </div>

      {/* chalkboard */}
      <div className="absolute left-[16px] top-[84px] h-[220px] w-[160px] rotate-[-2deg]">
        <div className="absolute left-[30px] top-[200px] h-[70px] w-[8px] rotate-[10deg] rounded bg-[#7A5240]" />
        <div className="absolute right-[30px] top-[200px] h-[70px] w-[8px] rotate-[-10deg] rounded bg-[#7A5240]" />
        <div className="relative h-full w-full rounded-[10px] border-[8px] border-[#8B5E3C] bg-[#2F3B36] p-2 text-[#F4F1E8] shadow-[0_6px_14px_rgba(60,30,40,.35)]">
          <div className="chalk text-center text-[17px] leading-tight">Today&apos;s Orders</div>
          <div className="mx-auto mt-1 h-[2px] w-[110px] rounded bg-white/40" />
          <div className="chalk mt-3 space-y-1 text-[15px]">
            <div>♥ Served: {served}</div>
            <div className="opacity-80">✕ Missed: {lost}</div>
          </div>
          <svg viewBox="0 0 120 60" className="mt-3 w-full" aria-hidden>
            <g stroke="#F4F1E8" strokeWidth={2} fill="none" opacity={0.85} strokeLinecap="round">
              <ellipse cx={34} cy={44} rx={26} ry={6} />
              <ellipse cx={34} cy={36} rx={22} ry={5} />
              <ellipse cx={34} cy={28} rx={22} ry={5} />
              <path d="M26 22 Q34 10 42 22" />
              <path d="M82 14 L104 14 L100 54 L86 54Z" />
              <path d="M96 14 L102 2" />
              <path d="M85 28 L101 28" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

/** The wooden counter and its face — stations sit on top of this. */
export function CounterBack() {
  return (
    <svg width={1280} height={230} viewBox="0 0 1280 230" className="absolute left-0 top-[332px]" aria-hidden>
      <defs>
        <linearGradient id="countertop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D9A483" />
          <stop offset="100%" stopColor="#B57B5A" />
        </linearGradient>
        <linearGradient id="counterface" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F3E3E6" />
          <stop offset="100%" stopColor="#E1C8D6" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1280} height={22} fill="url(#countertop)" />
      <rect x={0} y={0} width={1280} height={4} fill="#F0C7AA" />
      <rect x={0} y={22} width={1280} height={208} fill="url(#counterface)" />
      <rect x={0} y={22} width={1280} height={6} fill="rgba(90,40,60,.12)" />
    </svg>
  );
}
