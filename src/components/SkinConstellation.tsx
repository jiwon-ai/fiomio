"use client";

/* Abstract "data-on-skin" constellation — the brand's core visual:
   the platform reading a face as a field of weighted data points.
   Pure SVG, deterministic coordinates, CSS-animated. */

type Node = { x: number; y: number; key?: boolean };

// Nodes traced along an abstract 3/4 face contour + interior reading points.
const NODES: Node[] = [
  { x: 150, y: 60 },
  { x: 198, y: 48, key: true },
  { x: 250, y: 64 },
  { x: 286, y: 104 },
  { x: 304, y: 158 },
  { x: 312, y: 214, key: true },
  { x: 306, y: 270 },
  { x: 286, y: 322 },
  { x: 252, y: 364 },
  { x: 206, y: 388, key: true },
  { x: 158, y: 380 },
  { x: 126, y: 344 },
  { x: 112, y: 290 },
  { x: 112, y: 232 },
  { x: 122, y: 176 },
  { x: 132, y: 118 },
  // interior reading points
  { x: 196, y: 150, key: true },
  { x: 240, y: 196 },
  { x: 178, y: 232 },
  { x: 224, y: 270 },
  { x: 196, y: 314 },
];

const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8],
  [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 0],
  [16, 1], [16, 17], [17, 5], [16, 18], [18, 12], [18, 19], [19, 8],
  [19, 20], [20, 9], [17, 19], [14, 16],
];

const LABELS = [
  { x: 322, y: 196, t: "UV ▴" },
  { x: 96, y: 300, t: "HR 34%" },
  { x: 230, y: 410, t: "pH 5.4" },
];

export function SkinConstellation({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 460"
      className={className}
      role="img"
      aria-label="Visualisation : données cartographiées sur la peau"
    >
      <defs>
        <radialGradient id="fio-glow" cx="55%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#cbef4d" stopOpacity="0.22" />
          <stop offset="55%" stopColor="#cbef4d" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#cbef4d" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fio-scan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cbef4d" stopOpacity="0" />
          <stop offset="50%" stopColor="#cbef4d" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#cbef4d" stopOpacity="0" />
        </linearGradient>
        <filter id="fio-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* ambient glow */}
      <circle cx="210" cy="200" r="190" fill="url(#fio-glow)" />

      {/* edges */}
      <g stroke="#cbef4d" strokeOpacity="0.28" strokeWidth="0.9">
        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
          />
        ))}
      </g>

      {/* scanning line */}
      <rect x="80" y="40" width="260" height="2" fill="url(#fio-scan)">
        <animate
          attributeName="y"
          values="60;380;60"
          dur="7s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
          keyTimes="0;0.5;1"
        />
      </rect>

      {/* nodes */}
      <g>
        {NODES.map((n, i) => (
          <g key={i}>
            {n.key && (
              <circle
                cx={n.x}
                cy={n.y}
                r="9"
                fill="#cbef4d"
                fillOpacity="0.16"
                filter="url(#fio-soft)"
              />
            )}
            <circle
              cx={n.x}
              cy={n.y}
              r={n.key ? 2.8 : 1.8}
              fill={n.key ? "#cbef4d" : "#8fb39e"}
              style={{
                animation: `node-pulse ${2.6 + (i % 5) * 0.5}s ease-in-out ${
                  (i % 7) * 0.32
                }s infinite`,
              }}
            />
          </g>
        ))}
      </g>

      {/* data labels */}
      <g
        fontFamily="var(--font-mono)"
        fontSize="9"
        fill="#8fb39e"
        fillOpacity="0.85"
        letterSpacing="0.08em"
      >
        {LABELS.map((l, i) => (
          <text key={i} x={l.x} y={l.y}>
            {l.t}
          </text>
        ))}
      </g>
    </svg>
  );
}
