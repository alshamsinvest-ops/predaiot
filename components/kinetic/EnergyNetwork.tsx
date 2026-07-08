"use client";

import { useMotion } from "./MotionProvider";

/**
 * The signature cross-sector hero visual — a living energy network.
 * A central PREDAIOT hub connected to nodes representing the whole energy
 * value chain (oil & gas, power, grid, wind, solar, storage, hydrogen, data
 * centers, water). Energy "flows" along the edges via GPU stroke-dashoffset.
 *
 * Deliberately NOT a solar/battery image — it reads as the entire ecosystem.
 * Pure SVG + CSS animation (no canvas/WebGL); honors the motion preference.
 */

// Positions on a 1200×620 viewBox. Hub center-left; nodes fan across.
const HUB = { x: 340, y: 310 };

const NODES = [
  { id: "oilgas", x: 120, y: 120, label: "Oil & Gas" },
  { id: "power", x: 150, y: 470, label: "Power" },
  { id: "grid", x: 560, y: 90, label: "Grid" },
  { id: "wind", x: 620, y: 250, label: "Wind" },
  { id: "solar", x: 700, y: 430, label: "Solar" },
  { id: "storage", x: 560, y: 560, label: "Storage" },
  { id: "hydrogen", x: 900, y: 160, label: "Hydrogen" },
  { id: "data", x: 980, y: 340, label: "Data Centers" },
  { id: "water", x: 900, y: 520, label: "Water" },
] as const;

// Curved edge from hub to a node (quadratic control offset for organic feel).
function edgePath(nx: number, ny: number) {
  const mx = (HUB.x + nx) / 2;
  const my = (HUB.y + ny) / 2 - 40;
  return `M${HUB.x},${HUB.y} Q${mx},${my} ${nx},${ny}`;
}

export default function EnergyNetwork({
  className = "",
}: {
  className?: string;
}) {
  const { shouldAnimate } = useMotion();

  return (
    <div className={`pointer-events-none ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1200 620"
        className={`h-full w-full ${shouldAnimate ? "en-animate" : ""}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="en-hub" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00CFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#00CFFF" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="en-edge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00CFFF" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#00CFFF" stopOpacity="0.12" />
          </linearGradient>
        </defs>

        {/* Edges */}
        <g fill="none" stroke="url(#en-edge)" strokeWidth={1.4}>
          {NODES.map((n) => (
            <path key={`e-${n.id}`} className="en-edge" d={edgePath(n.x, n.y)} />
          ))}
        </g>

        {/* Node glow + core + pulse ring */}
        {NODES.map((n, i) => (
          <g key={`n-${n.id}`}>
            <circle cx={n.x} cy={n.y} r={22} fill="url(#en-hub)" opacity={0.5} />
            <circle
              className="en-pulse"
              cx={n.x}
              cy={n.y}
              r={5}
              fill="none"
              stroke="#00CFFF"
              strokeWidth={1.2}
              style={{ animationDelay: `${(i % 5) * 0.5}s` }}
            />
            <circle cx={n.x} cy={n.y} r={3.2} fill="#00CFFF" />
            <text
              x={n.x}
              y={n.y - 16}
              fill="#6B7A99"
              fontSize="12"
              fontFamily="var(--font-mono)"
              textAnchor="middle"
              className="hidden sm:block"
            >
              {n.label}
            </text>
          </g>
        ))}

        {/* Central PREDAIOT hub */}
        <circle cx={HUB.x} cy={HUB.y} r={64} fill="url(#en-hub)" opacity={0.55} />
        <circle
          className="en-pulse"
          cx={HUB.x}
          cy={HUB.y}
          r={18}
          fill="none"
          stroke="#00CFFF"
          strokeWidth={1.6}
        />
        <circle cx={HUB.x} cy={HUB.y} r={7} fill="#00CFFF" />
        <text
          x={HUB.x}
          y={HUB.y + 44}
          fill="#F0F4FF"
          fontSize="15"
          fontFamily="var(--font-display)"
          fontWeight="800"
          letterSpacing="0.12em"
          textAnchor="middle"
        >
          PREDAIOT
        </text>
      </svg>
    </div>
  );
}
