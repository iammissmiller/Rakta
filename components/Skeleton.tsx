"use client";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

/** A single shimmering placeholder block. Compose these to match any page's real layout. */
export default function Skeleton({ className = "", style }: SkeletonProps) {
  return (
    <>
      <style>{`
        @keyframes rakta-shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
      `}</style>
      <div
        className={`rounded-[20px] ${className}`}
        style={{
          background:
            "linear-gradient(90deg, rgba(184,0,10,0.05) 0%, rgba(184,0,10,0.1) 50%, rgba(184,0,10,0.05) 100%)",
          backgroundSize: "800px 100%",
          animation: "rakta-shimmer 1.6s ease-in-out infinite",
          ...style,
        }}
      />
    </>
  );
}