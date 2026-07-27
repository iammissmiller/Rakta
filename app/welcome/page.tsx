"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BowSVG, LipstickMark } from "@/components/Decorations";

export default function Welcome() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("rakta_profile");
    if (!stored) {
      router.replace("/onboarding");
      return;
    }
    const profile = JSON.parse(stored);
    setName(profile.name || "");

    const t1 = setTimeout(() => setVisible(true), 150);
    const t2 = setTimeout(() => setHintVisible(true), 900);
    const t3 = setTimeout(() => setHintVisible(false), 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [router]);

  const enter = () => {
    setLeaving(true);
    setTimeout(() => router.push("/dashboard"), 350);
  };

  return (
    <div
      onClick={enter}
      className="relative flex min-h-screen cursor-pointer flex-col items-center justify-center overflow-hidden"
      style={{
        background: "#FEF9F2",
        opacity: leaving ? 0 : 1,
        transition: "opacity 0.35s ease",
      }}
    >
      <style>{`
        @keyframes breathe { 0%,100%{box-shadow:0 4px 28px rgba(184,0,10,0.06)} 50%{box-shadow:0 8px 44px rgba(184,0,10,0.14)} }
        @keyframes drift { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-6px) rotate(3deg)} }
      `}</style>

      {/* Paper lines */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, transparent 0px, transparent 26px, rgba(184,0,10,0.025) 26px, rgba(184,0,10,0.025) 27px)",
        }}
      />

      {/* Decorative scatter — richer, matching dashboard density */}
      <BowSVG style={{ position: "absolute", top: 40, right: 60, width: 50, height: 31, opacity: 0.55, zIndex: 2, pointerEvents: "none", animation: "drift 5s ease-in-out infinite" }} />
      <BowSVG style={{ position: "absolute", bottom: 70, left: 50, width: 38, height: 24, opacity: 0.35, transform: "rotate(-14deg)", zIndex: 2, pointerEvents: "none", animation: "drift 6s ease-in-out infinite 0.5s" }} />
      <BowSVG style={{ position: "absolute", top: "50%", left: 40, width: 26, height: 16, opacity: 0.25, zIndex: 2, pointerEvents: "none" }} />
      <LipstickMark style={{ position: "absolute", top: 120, left: "20%", width: 24, height: 14, opacity: 0.18, zIndex: 2, pointerEvents: "none", transform: "rotate(-18deg)" }} />
      <LipstickMark style={{ position: "absolute", bottom: 140, right: "18%", width: 22, height: 13, opacity: 0.15, zIndex: 2, pointerEvents: "none", transform: "rotate(12deg)" }} />
      <div style={{ position: "absolute", top: 90, left: "35%", fontSize: 16, color: "#B8000A", opacity: 0.22, transform: "rotate(-20deg)", zIndex: 2, pointerEvents: "none" }}>♥</div>
      <div style={{ position: "absolute", bottom: 200, right: 70, fontSize: 13, color: "#B8000A", opacity: 0.2, zIndex: 2, pointerEvents: "none" }}>♥</div>
      <div style={{ position: "absolute", top: 160, right: "22%", fontSize: 24, opacity: 0.2, transform: "rotate(15deg)", zIndex: 2, pointerEvents: "none" }}>🌹</div>
      <div style={{ position: "absolute", bottom: 100, left: "25%", fontSize: 18, opacity: 0.16, zIndex: 2, pointerEvents: "none" }}>🌹</div>
      <div style={{ position: "absolute", top: 220, left: 80, fontSize: 16, opacity: 0.22, transform: "rotate(-10deg)", zIndex: 2, pointerEvents: "none" }}>🍓</div>
      <div style={{ position: "absolute", bottom: 240, right: 100, fontSize: 15, opacity: 0.18, zIndex: 2, pointerEvents: "none" }}>🌸</div>

      {/* Central card */}
      <div
        className="relative z-[3] flex flex-col items-center rounded-[28px] px-14 py-12 text-center"
        style={{
          background: "rgba(255,255,255,0.55)",
          border: "1px solid rgba(184,0,10,0.08)",
          backdropFilter: "blur(6px)",
          animation: "breathe 4s ease-in-out infinite",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(14px) scale(0.97)",
          transition: "opacity 0.8s cubic-bezier(0.4,0,0.2,1), transform 0.8s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <BowSVG style={{ width: 56, height: 34, opacity: 0.7, marginBottom: 20 }} />

        <h1 className="font-serif text-[42px] italic font-bold leading-none text-crimson">
          {name} ♥
        </h1>
        <div className="my-4 h-px w-16" style={{ background: "rgba(184,0,10,0.25)" }} />
        <p className="text-base text-ink-light">Your space is ready.</p>
        <p className="mt-1 text-sm text-muted">
          Track, learn, and be gentle with yourself here.
        </p>
      </div>

      <p
        className="absolute bottom-12 text-xs text-muted"
        style={{
          opacity: hintVisible ? 0.65 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        tap anywhere to enter ♥
      </p>
    </div>
  );
}