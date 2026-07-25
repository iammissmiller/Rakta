"use client";

export default function PaperTexture() {
  return (
    <>
      <svg
        width="0"
        height="0"
        style={{ position: "absolute", pointerEvents: "none" }}
        aria-hidden="true"
      >
        <defs>
          <filter
            id="paper-grain"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65 0.62"
              numOctaves={4}
              seed={7}
              stitchTiles="stitch"
              result="grain"
            />
            <feColorMatrix
              in="grain"
              type="matrix"
              values="0 0 0 0 0.94
                      0 0 0 0 0.87
                      0 0 0 0 0.76
                      0 0 0 0.22 0"
              result="tinted"
            />
            <feBlend in="SourceGraphic" in2="tinted" mode="multiply" />
          </filter>
          <radialGradient id="paper-vignette" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#FEF9F2" stopOpacity={0} />
            <stop offset="72%" stopColor="#F0E0C8" stopOpacity={0.28} />
            <stop offset="100%" stopColor="#C8A87A" stopOpacity={0.5} />
          </radialGradient>
          <filter
            id="wrinkle"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
          >
            <feTurbulence
              type="turbulence"
              baseFrequency="0.02 0.018"
              numOctaves={5}
              seed={3}
              stitchTiles="stitch"
              result="turb"
            />
            <feColorMatrix
              in="turb"
              type="matrix"
              values="0 0 0 0 0.68
                      0 0 0 0 0.55
                      0 0 0 0 0.38
                      0 0 0 0.85 0"
            />
          </filter>
        </defs>
      </svg>

      <svg
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 0,
        }}
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 900"
      >
        <rect width={1440} height={900} fill="#EDE4D4" />
        <rect
          width={1440}
          height={900}
          fill="transparent"
          filter="url(#paper-grain)"
          opacity={1}
        />
        <ellipse cx={180} cy={130} rx={360} ry={210} fill="#D4A870" opacity={0.08} />
        <ellipse cx={1320} cy={720} rx={300} ry={190} fill="#C89858" opacity={0.07} />
        <ellipse cx={750} cy={450} rx={480} ry={290} fill="#E8C88A" opacity={0.05} />
        <ellipse cx={80} cy={820} rx={190} ry={140} fill="#C89060" opacity={0.07} />
        <ellipse cx={1420} cy={80} rx={170} ry={120} fill="#D8B880" opacity={0.07} />
        <line x1={0} y1={299} x2={1440} y2={301} stroke="#A08060" strokeWidth={0.8} opacity={0.13} />
        <line x1={0} y1={599} x2={1440} y2={597} stroke="#A08060" strokeWidth={0.6} opacity={0.09} />
        {Array.from({ length: 36 }).map((_, i) => (
          <line
            key={i}
            x1={0}
            y1={27 + i * 27}
            x2={1440}
            y2={27 + i * 27}
            stroke="#B8000A"
            strokeWidth={0.5}
            opacity={0.032}
          />
        ))}
        <rect width={1440} height={900} fill="url(#paper-vignette)" />
        <ellipse cx={0} cy={0} rx={380} ry={260} fill="#E8C0A0" opacity={0.07} />
        <ellipse cx={1440} cy={900} rx={330} ry={240} fill="#D8A888" opacity={0.07} />
      </svg>

      <svg
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 0,
          mixBlendMode: "multiply",
          opacity: 0.18,
        }}
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 900"
      >
        <rect width={1440} height={900} filter="url(#wrinkle)" />
      </svg>
    </>
  );
}