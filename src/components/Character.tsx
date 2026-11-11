import { useId } from "react";
import type { Look } from "@/game/looks";

export type Expression = "delight" | "happy" | "neutral" | "angry";

const LINE = "#3a2230";

const BACK_HAIR: Record<Look["style"], string> = {
  long: "M46 96 Q40 36 100 32 Q160 36 154 96 Q160 170 168 252 Q148 262 132 246 Q118 258 100 250 Q82 258 68 246 Q52 262 32 252 Q40 170 46 96Z",
  bob: "M44 98 Q40 34 100 30 Q160 34 156 98 Q160 140 162 172 Q140 182 120 174 L100 178 L80 174 Q60 182 38 172 Q40 140 44 98Z",
  twin: "M48 96 Q44 36 100 32 Q156 36 152 96 L150 150 L50 150Z",
  spiky: "M48 98 Q44 36 100 32 Q156 36 152 98 L150 150 L50 150Z",
  messy: "M48 98 Q44 36 100 32 Q156 36 152 98 L150 150 L50 150Z",
};

const TOP_SPIKES: Partial<Record<Look["style"], string>> = {
  spiky: "M58 74 L40 50 L68 58 L70 30 L92 50 L104 20 L118 48 L140 30 L138 60 L164 54 L148 80 Q100 40 58 74Z",
  messy: "M54 80 L34 66 L58 62 L50 38 L76 50 L84 24 L100 44 L122 22 L124 48 L152 40 L144 62 L168 70 L146 82 Q100 44 54 80Z",
};

const BANGS =
  "M52 112 Q46 50 100 42 Q154 50 148 112 Q144 96 136 88 L132 106 Q124 88 114 80 L110 100 Q102 84 92 80 L86 102 Q78 86 68 88 L64 106 Q58 98 52 112Z";

const LONG_LOCKS =
  "M52 96 Q40 132 48 182 Q56 162 60 140 Q62 118 62 100Z M148 96 Q160 132 152 182 Q144 162 140 140 Q138 118 138 100Z";
const SHORT_LOCKS =
  "M52 100 Q46 122 54 142 L61 118Z M148 100 Q154 122 146 142 L139 118Z";

export function Character({
  look,
  expression,
}: {
  look: Look;
  expression: Expression;
}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const irisId = `iris${id}`;
  const hairId = `hair${id}`;
  const L = look;
  const angry = expression === "angry";
  const longLocks = L.style === "long" || L.style === "bob" || L.style === "twin";

  const eye = (cx: number, side: -1 | 1) => {
    const cy = 122;
    if (expression === "delight") {
      return (
        <path
          d={`M${cx - 11} ${cy + 3} Q${cx} ${cy - 10} ${cx + 11} ${cy + 3}`}
          stroke={LINE}
          strokeWidth={3.6}
          fill="none"
          strokeLinecap="round"
        />
      );
    }
    const outer = cx + side * 13;
    const inner = cx - side * 12;
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={11} ry={13} fill="#fff" />
        <ellipse cx={cx} cy={cy + 1.5} rx={9} ry={11.5} fill={`url(#${irisId})`} />
        <ellipse cx={cx} cy={cy + 2.5} rx={4.2} ry={5.8} fill="#1a0f1f" />
        <ellipse cx={cx} cy={cy + 8} rx={6} ry={3} fill="#fff" opacity={0.28} />
        <circle cx={cx - 3.5} cy={cy - 4} r={3.4} fill="#fff" />
        <circle cx={cx + 3.5} cy={cy + 5} r={1.6} fill="#fff" />
        <path
          d={`M${outer} ${cy - 6} Q${cx + side * 3} ${cy - (angry ? 13 : 18)} ${inner} ${cy - (angry ? 7 : 11)}`}
          stroke={LINE}
          strokeWidth={3.6}
          fill="none"
          strokeLinecap="round"
        />
        <path d={`M${outer} ${cy - 6} l${side * 4} -2.5`} stroke={LINE} strokeWidth={2.4} strokeLinecap="round" />
      </g>
    );
  };

  const mouth =
    expression === "delight" || expression === "happy" ? (
      <path d="M90 149 Q100 162 110 149 Q100 154 90 149Z" fill="#C2405A" stroke={LINE} strokeWidth={1.2} strokeLinejoin="round" />
    ) : expression === "neutral" ? (
      <path d="M94 152 Q100 155 106 152" stroke={LINE} strokeWidth={2} fill="none" strokeLinecap="round" />
    ) : (
      <path d="M91 156 Q100 147 109 156" stroke={LINE} strokeWidth={2.4} fill="none" strokeLinecap="round" />
    );

  const brows = angry ? (
    <g stroke={L.hairShade} strokeWidth={3.4} strokeLinecap="round">
      <path d="M68 97 L89 106" />
      <path d="M111 106 L132 97" />
    </g>
  ) : (
    <g stroke={L.hairShade} strokeWidth={3} strokeLinecap="round" fill="none">
      <path d="M68 102 Q78 96 88 100" />
      <path d="M112 100 Q122 96 132 102" />
    </g>
  );

  return (
    <svg viewBox="0 0 200 320" width={200} height={320} overflow="visible" aria-hidden>
      <defs>
        <linearGradient id={irisId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b1022" />
          <stop offset="45%" stopColor={L.eyes} />
          <stop offset="100%" stopColor={L.eyes} />
        </linearGradient>
        <linearGradient id={hairId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={L.hair} />
          <stop offset="100%" stopColor={L.hairShade} />
        </linearGradient>
      </defs>

      {/* back hair */}
      <path d={BACK_HAIR[L.style]} fill={`url(#${hairId})`} />
      {L.style === "twin" && (
        <path
          d="M52 78 Q12 96 16 160 Q20 214 42 240 Q36 198 46 168 Q58 132 60 96Z M148 78 Q188 96 184 160 Q180 214 158 240 Q164 198 154 168 Q142 132 140 96Z"
          fill={`url(#${hairId})`}
        />
      )}

      {/* neck & body */}
      <path d="M88 158 L88 198 Q100 206 112 198 L112 158Z" fill={L.skin} />
      <ellipse cx={100} cy={170} rx={13} ry={6} fill="rgba(120,60,60,.12)" />
      <path d="M28 320 Q30 224 64 204 Q82 196 100 196 Q118 196 136 204 Q170 224 172 320Z" fill={L.outfit} />
      <path d="M28 320 Q30 224 64 204 Q70 202 74 201 Q50 236 52 320Z" fill="rgba(0,0,0,.07)" />
      <path d="M80 200 L100 238 L120 200 Q110 196 100 196 Q90 196 80 200Z" fill={L.outfit2} />
      <path d="M80 200 L94 232 M120 200 L106 232" stroke="rgba(0,0,0,.22)" strokeWidth={2} />
      <path d="M100 238 L100 320" stroke="rgba(0,0,0,.12)" strokeWidth={2} />
      {L.acc === "ribbon" && (
        <g>
          <path d="M100 206 L78 194 L80 218Z M100 206 L122 194 L120 218Z" fill="#D9384E" />
          <path d="M100 206 L92 228 M100 206 L108 228" stroke="#D9384E" strokeWidth={5} strokeLinecap="round" />
          <circle cx={100} cy={206} r={5.5} fill="#B52438" />
        </g>
      )}

      {/* head */}
      <ellipse cx={54} cy={116} rx={6} ry={10} fill={L.skin} />
      <ellipse cx={146} cy={116} rx={6} ry={10} fill={L.skin} />
      <path d="M56 100 Q54 148 80 170 Q100 184 120 170 Q146 148 144 100 Q144 50 100 48 Q56 50 56 100Z" fill={L.skin} />
      <ellipse cx={73} cy={141} rx={9} ry={4.5} fill="#FF8FA3" opacity={0.45} />
      <ellipse cx={127} cy={141} rx={9} ry={4.5} fill="#FF8FA3" opacity={0.45} />
      <path d="M100 135 L98.5 140" stroke="rgba(150,80,80,.45)" strokeWidth={1.6} strokeLinecap="round" />
      {mouth}

      {/* front hair */}
      {TOP_SPIKES[L.style] && <path d={TOP_SPIKES[L.style]} fill={L.hair} />}
      {L.acc === "catears" && (
        <g>
          <path d="M58 66 L52 22 L88 46Z M142 66 L148 22 L112 46Z" fill={L.hair} />
          <path d="M62 58 L59 34 L78 47Z M138 58 L141 34 L122 47Z" fill="#F9B7C8" />
        </g>
      )}
      <path d={BANGS} fill={`url(#${hairId})`} />
      <path d={longLocks ? LONG_LOCKS : SHORT_LOCKS} fill={L.hair} />
      <path d="M72 62 Q100 50 130 62" stroke="#fff" strokeWidth={4} opacity={0.35} fill="none" strokeLinecap="round" />
      {L.style === "twin" && (
        <g fill={L.outfit2} stroke="rgba(0,0,0,.2)">
          <circle cx={54} cy={84} r={6} />
          <circle cx={146} cy={84} r={6} />
        </g>
      )}

      {/* face features over hair, anime style */}
      <g className="blink" style={{ transformOrigin: "100px 122px" }}>
        {eye(78, -1)}
        {eye(122, 1)}
      </g>
      {brows}

      {/* accessories */}
      {L.acc === "headphones" && (
        <g>
          <path d="M50 112 Q42 24 100 22 Q158 24 150 112" fill="none" stroke="#2d2a33" strokeWidth={8} />
          <rect x={35} y={98} width={20} height={32} rx={9} fill="#2d2a33" />
          <rect x={38} y={102} width={11} height={24} rx={5} fill={L.outfit2} />
          <rect x={145} y={98} width={20} height={32} rx={9} fill="#2d2a33" />
          <rect x={151} y={102} width={11} height={24} rx={5} fill={L.outfit2} />
        </g>
      )}
      {L.acc === "beret" && (
        <g transform="rotate(-12 100 40)">
          <ellipse cx={104} cy={40} rx={60} ry={21} fill={L.outfit2} />
          <ellipse cx={104} cy={50} rx={52} ry={7} fill="rgba(0,0,0,.18)" />
          <circle cx={104} cy={19} r={4.5} fill={L.outfit2} />
          <ellipse cx={86} cy={33} rx={18} ry={5} fill="#fff" opacity={0.2} />
        </g>
      )}
      {L.acc === "shades" && (
        <g>
          <ellipse cx={80} cy={50} rx={16} ry={10} fill="#1e1b24" />
          <ellipse cx={120} cy={50} rx={16} ry={10} fill="#1e1b24" />
          <path d="M95 49 Q100 45 105 49" stroke="#1e1b24" strokeWidth={3} fill="none" />
          <ellipse cx={74} cy={46} rx={5} ry={2.5} fill="#fff" opacity={0.45} />
          <ellipse cx={114} cy={46} rx={5} ry={2.5} fill="#fff" opacity={0.45} />
        </g>
      )}
      {angry && (
        <g transform="translate(152 60)" stroke="#E53950" strokeWidth={3.2} fill="none" strokeLinecap="round">
          <path d="M-9 -3 Q-3 -3 -3 -9" />
          <path d="M3 -9 Q3 -3 9 -3" />
          <path d="M9 3 Q3 3 3 9" />
          <path d="M-3 9 Q-3 3 -9 3" />
        </g>
      )}
    </svg>
  );
}
