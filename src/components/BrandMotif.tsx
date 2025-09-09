import React from "react";

type CircuitBackgroundProps = {
  className?: string;
  opacity?: number;
};

// Lightweight SVG motif echoing the logo: diagonal traces + node circles
export function CircuitBackground({ className = "", opacity = 0.08 }: CircuitBackgroundProps) {
  return (
    <svg
      aria-hidden
      className={"pointer-events-none absolute inset-0 -z-10 " + className}
      viewBox="0 0 1200 600"
      preserveAspectRatio="none"
    >
      <g fill="none" stroke="currentColor" strokeWidth={2} opacity={opacity} strokeLinecap="round">
        {/* Left cluster (↗) */}
        <path d="M40 80 L520 560" />
        <path d="M80 40 L560 520" />
        <path d="M60 220 L420 580" />
        <path d="M30 300 L330 600" />

        {/* Right cluster (↗) */}
        <path d="M700 60 L1080 440" />
        <path d="M760 20 L1140 400" />
        <path d="M820 120 L1180 480" />
        <path d="M900 260 L1160 520" />
      </g>

      {/* Nodes at line ends (echoing PCB pads) */}
      <g fill="currentColor" opacity={Math.min(opacity + 0.04, 0.16)}>
        {/* Left nodes */}
        <circle cx="40" cy="80" r="4" />
        <circle cx="80" cy="40" r="4" />
        <circle cx="60" cy="220" r="4" />
        <circle cx="30" cy="300" r="4" />
        {/* Right nodes */}
        <circle cx="700" cy="60" r="4" />
        <circle cx="760" cy="20" r="4" />
        <circle cx="820" cy="120" r="4" />
        <circle cx="900" cy="260" r="4" />
        {/* Interior terminal nodes */}
        <circle cx="520" cy="560" r="3" />
        <circle cx="560" cy="520" r="3" />
        <circle cx="420" cy="580" r="3" />
        <circle cx="330" cy="600" r="3" />
        <circle cx="1080" cy="440" r="3" />
        <circle cx="1140" cy="400" r="3" />
        <circle cx="1180" cy="480" r="3" />
        <circle cx="1160" cy="520" r="3" />
      </g>

      {/* Subtle rotated pill – references diagonal brand block */}
      <g opacity={Math.min(opacity, 0.08)}>
        <rect
          x={520}
          y={140}
          width={320}
          height={140}
          rx={48}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          transform="rotate(-28 680 210)"
        />
      </g>
    </svg>
  );
}

type DiagonalPillProps = {
  className?: string;
};

// Decorative diagonal pill backdrop for headings/CTAs
export function DiagonalPill({ className = "" }: DiagonalPillProps) {
  return (
    <div
      aria-hidden
      className={
        "absolute -z-10 rotate-[-18deg] rounded-3xl border border-primary/15 " +
        "bg-gradient-to-br from-primary/8 via-transparent to-transparent blur-[1px] " +
        className
      }
      style={{ boxShadow: "0 0 0 1px color-mix(in oklab, var(--primary) 8%, transparent) inset" }}
    />
  );
}

export default { CircuitBackground, DiagonalPill };

