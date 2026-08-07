"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CycleRing from "@/components/CycleRing";
import MiniCalendar from "@/components/MiniCalendar";
import WeekStrip from "@/components/WeekStrip";
import { BowSVG, LipstickMark, PhaseIcon } from "@/components/Decorations";
import { getCycleInfo, PHASES, formatDate, type CycleInfo, type CyclePhase } from "@/lib/cycle";

interface Profile {
  name?: string;
  who?: string;
  pcos?: string;
  cycle_length?: number;
  period_length?: number;
  last_period?: string;
}

interface DayLog {
  date: string;
  flow?: string;
  mood?: string;
  symptoms?: string[];
  notes?: string;
}

const QUOTE_POOL = [
  "She is\nher own kind of magic.",
  "Soft girl era,\nstrong heart always.",
  "Bloom at your\nown pace, love.",
  "Rest is a\nform of resistance.",
  "You are the\nmain character today.",
  "Be a voice,\nnot an echo.",
  "Romanticize\nyour own life.",
  "Slow mornings\nand soft feelings.",
  "Your softness\nis your superpower.",
  "Self care isn't\nselfish, darling.",
  "Flowers grow\nback every spring.",
  "She believed\nshe could, so she rested.",
  "Healing is not\nlinear, and that's okay.",
  "Choose yourself\ntoday, gently.",
  "You are allowed\nto outgrow old chapters.",
  "Some days are\nfor blooming, some for rooting.",
  "Be soft.\nDo not let the world make you hard.",
  "Trust the\ntiming of your life.",
  "You don't owe\nanyone your energy today.",
  "Glow from\nwithin, always.",
  "Pretty things\ntake time to grow.",
  "Take it one\nsoft step at a time.",
  "Your peace\nis non-negotiable.",
  "Even the moon\ngoes through phases ♥",
];

const PHASE_WORD: Record<CyclePhase, string> = {
  menstrual: "Rest",
  follicular: "Rise",
  ovulation: "Bloom",
  luteal: "Wind Down",
};

const MOOD_OPTIONS = [
  { symbol: "♥", label: "Loved" },
  { symbol: "✦", label: "Glowing" },
  { symbol: "~", label: "Meh" },
  { symbol: "↯", label: "Irritable" },
  { symbol: "◌", label: "Tired" },
  { symbol: "✿", label: "Soft" },
];

const card: React.CSSProperties = {
  borderRadius: 20,
  border: "1px solid rgba(184,0,10,0.07)",
  boxShadow: "0 2px 24px rgba(0,0,0,0.06)",
};

/** Small hook: tracks whether viewport is below the md breakpoint (768px) */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

export default function Dashboard() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [cycleInfo, setCycleInfo] = useState<CycleInfo | null>(null);
  const [greeting, setGreeting] = useState("Good morning");
  const [logs, setLogs] = useState<Record<string, DayLog>>({});
  const [mounted, setMounted] = useState(false);
  const [saheliInput, setSaheliInput] = useState("");
  const [quickMood, setQuickMood] = useState<string | null>(null);
  const [moodSaved, setMoodSaved] = useState(false);
  const [saheliFocus, setSaheliFocus] = useState(false);
  const [dailyQuote, setDailyQuote] = useState(QUOTE_POOL[0]);
  const [quoteHover, setQuoteHover] = useState(false);
  const [saheliHover, setSaheliHover] = useState(false);
  const [moodHover, setMoodHover] = useState(false);

  useEffect(() => {
  fetch("/api/profile")
    .then((res) => res.json())
    .then((dbProfile) => {
      if (!dbProfile || !dbProfile.id) {
        router.replace("/onboarding");
        return;
      }

      const p: Profile = {
        name: dbProfile.name,
        who: dbProfile.lifeStage,
        pcos: dbProfile.pmosStatus,
        cycle_length: dbProfile.cycleLength,
        period_length: dbProfile.periodLength,
        last_period: dbProfile.lastPeriodDate
          ? dbProfile.lastPeriodDate.split("T")[0]
          : undefined,
      };
      setProfile(p);

      if (p.last_period) {
        setCycleInfo(getCycleInfo(p.last_period, p.cycle_length || 28, p.period_length || 5));
      }

      const hr = new Date().getHours();
      setGreeting(hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening");

      const sl: Record<string, DayLog> = JSON.parse(localStorage.getItem("rakta_logs") || "{}");
      setLogs(sl);
      const today = new Date().toISOString().split("T")[0];
      if (sl[today]?.mood) setQuickMood(sl[today].mood);

      setDailyQuote(QUOTE_POOL[Math.floor(Math.random() * QUOTE_POOL.length)]);
      setTimeout(() => setMounted(true), 80);
    });
}, [router]);

  const handleQuickMood = (label: string) => {
    setQuickMood(label);
    const today = new Date().toISOString().split("T")[0];
    const ex: Record<string, DayLog> = JSON.parse(localStorage.getItem("rakta_logs") || "{}");
    ex[today] = { ...(ex[today] || { date: today }), mood: label };
    localStorage.setItem("rakta_logs", JSON.stringify(ex));
    setLogs({ ...ex });
    setMoodSaved(true);
    setTimeout(() => setMoodSaved(false), 2200);
  };

  const handleSaheliSend = () => {
    if (!saheliInput.trim()) return;
    router.push(`/saheli?q=${encodeURIComponent(saheliInput)}`);
  };

  const rerollQuote = () => {
    let next = QUOTE_POOL[Math.floor(Math.random() * QUOTE_POOL.length)];
    if (next === dailyQuote && QUOTE_POOL.length > 1) {
      next = QUOTE_POOL[(QUOTE_POOL.indexOf(next) + 1) % QUOTE_POOL.length];
    }
    setDailyQuote(next);
  };

  if (!profile || !cycleInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="pulse font-serif text-sm italic text-crimson">Loading…</div>
      </div>
    );
  }

  const phase = PHASES[cycleInfo.phase];
  const recentLogs = Object.entries(logs)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 8);
  const cycleProgress = (cycleInfo.dayInCycle / (profile.cycle_length || 28)) * 100;
  const phaseWord = PHASE_WORD[cycleInfo.phase];
  const totalLogged = Object.keys(logs).length;

  const liftStyle = (hovered: boolean): React.CSSProperties => ({
    transform: hovered && !isMobile ? "translateY(-4px)" : "translateY(0)",
    boxShadow: hovered && !isMobile ? "0 10px 32px rgba(184,0,10,0.14)" : "0 2px 24px rgba(0,0,0,0.06)",
    transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease",
    cursor: "pointer",
  });

  return (
    <div
      className="relative flex flex-col"
      style={{
        background: "var(--background)",
        height: isMobile ? "auto" : "100vh",
        minHeight: "100vh",
        overflow: isMobile ? "visible" : "hidden",
      }}
    >
      <style>{`
        @keyframes drift { 0%,100%{transform:translateX(0) translateY(0)} 33%{transform:translateX(5px) translateY(-4px)} 66%{transform:translateX(-4px) translateY(3px)} }
        @keyframes shimmer { 0%{background-position:-300% center} 100%{background-position:300% center} }
        @keyframes breathe { 0%,100%{box-shadow:0 4px 28px rgba(0,0,0,0.07)} 50%{box-shadow:0 6px 36px rgba(184,0,10,0.13)} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Page decorations — hidden on mobile to avoid clutter/overlap */}
      {!isMobile && (
        <>
          <BowSVG style={{ position: "absolute", top: 10, right: 270, width: 52, height: 32, opacity: 0.65, zIndex: 3, pointerEvents: "none" }} />
          <BowSVG style={{ position: "absolute", top: 12, right: 228, width: 34, height: 21, opacity: 0.42, zIndex: 3, pointerEvents: "none" }} />
          <BowSVG style={{ position: "absolute", bottom: 120, left: 75, width: 40, height: 25, opacity: 0.32, transform: "rotate(-14deg)", zIndex: 3, pointerEvents: "none" }} />
          <LipstickMark style={{ position: "absolute", top: 62, left: 168, width: 26, height: 15, opacity: 0.18, zIndex: 3, pointerEvents: "none", transform: "rotate(-20deg)" }} />
          <LipstickMark style={{ position: "absolute", bottom: 205, right: 285, width: 22, height: 13, opacity: 0.14, zIndex: 3, pointerEvents: "none", transform: "rotate(14deg)" }} />
          <div style={{ position: "absolute", top: 15, left: 94, fontSize: 16, color: "#B8000A", opacity: 0.28, transform: "rotate(-22deg)", zIndex: 3, pointerEvents: "none" }}>♥</div>
          <div style={{ position: "absolute", top: 13, left: 265, fontSize: 11, color: "#B8000A", opacity: 0.2, transform: "rotate(8deg)", zIndex: 3, pointerEvents: "none" }}>♥</div>
          <div style={{ position: "absolute", bottom: 170, left: 425, fontSize: 14, color: "#B8000A", opacity: 0.18, zIndex: 3, pointerEvents: "none" }}>♥</div>
          <div style={{ position: "absolute", top: 262, left: 68, fontSize: 23, opacity: 0.18, transform: "rotate(18deg)", zIndex: 3, pointerEvents: "none" }}>🌹</div>
          <div style={{ position: "absolute", bottom: 162, left: 202, fontSize: 16, opacity: 0.14, zIndex: 3, pointerEvents: "none" }}>🌹</div>
          <div style={{ position: "absolute", top: 15, right: 298, fontSize: 18, opacity: 0.26, transform: "rotate(-12deg)", zIndex: 3, pointerEvents: "none" }}>🍓</div>
          <div style={{ position: "absolute", bottom: 282, left: 312, fontSize: 14, opacity: 0.17, zIndex: 3, pointerEvents: "none" }}>🌸</div>
        </>
      )}

      <div
        className="relative flex flex-1"
        style={{ zIndex: 2, minHeight: 0, flexDirection: isMobile ? "column" : "row" }}
      >
        {/* LEFT — 70% on desktop, full width on mobile */}
        <div
          className="flex flex-col gap-2.5"
          style={{
            flex: isMobile ? "1 1 auto" : "0 0 70%",
            padding: isMobile ? "16px 14px" : "18px 22px",
            minWidth: 0,
            height: isMobile ? "auto" : "100%",
            minHeight: 0,
            boxSizing: "border-box",
          }}
        >
          {/* BANNER */}
          <div
            style={{
              ...card,
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "stretch",
              overflow: "hidden",
              flexShrink: 0,
              animation: "breathe 4s ease-in-out infinite",
            }}
          >
            <div style={{ flex: 1, padding: "18px 24px", background: "#FFFAF4", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(184,0,10,0.03) 1px,transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: 10, color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: 5, fontFamily: "sans-serif" }}>
                  {greeting}
                </div>
                <div style={{ fontSize: isMobile ? 24 : 30, fontWeight: 700, color: "var(--color-ink)", fontFamily: "var(--font-serif)", fontStyle: "italic", marginBottom: 12, lineHeight: 1 }}>
                  {profile.name} ♥
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: "var(--color-crimson)", fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
                      {phase.name} phase · Day {cycleInfo.dayInCycle}
                    </span>
                    <span style={{ fontSize: 10, color: "var(--color-muted)", fontFamily: "sans-serif" }}>
                      {profile.cycle_length || 28} days
                    </span>
                  </div>
                  <div style={{ height: 5, background: "rgba(184,0,10,0.08)", borderRadius: 3, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        borderRadius: 3,
                        background: "linear-gradient(90deg,#B8000A,#E86080)",
                        width: mounted ? `${cycleProgress}%` : "0%",
                        transition: "width 1.4s cubic-bezier(0.4,0,0.2,1)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                width: isMobile ? "100%" : 185,
                background: "linear-gradient(160deg,#B8000A,#7A0006)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                padding: "14px 16px",
                flexShrink: 0,
                position: "relative",
              }}
            >
              <div style={{ position: "absolute", top: -28, right: -28, width: 110, height: 110, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
              <div style={{ textAlign: "center", zIndex: 1 }}>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: "#FFFFFF",
                    fontFamily: "var(--font-serif)",
                    lineHeight: 1,
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "scale(1)" : "scale(0.8)",
                    transition: "all 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.3s",
                  }}
                >
                  {cycleInfo.daysUntilNextPeriod}
                </div>
                <div style={{ fontSize: 8, color: "rgba(255,220,210,0.65)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 3, fontFamily: "sans-serif" }}>
                  days to
                  <br />
                  period
                </div>
              </div>
              <div style={{ width: 1, height: 36, background: "rgba(255,200,190,0.15)", zIndex: 1 }} />
              <div style={{ zIndex: 1 }}>
                <CycleRing phase={cycleInfo.phase} dayInCycle={cycleInfo.dayInCycle} size={88} />
              </div>
            </div>
          </div>

          {/* STAT CARDS */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 9, flexShrink: 0 }}>
            {[
              { val: profile.cycle_length || 28, label: "Cycle length", sub: "days", deco: "♥" },
              { val: profile.period_length || 5, label: "Period days", sub: "avg flow", deco: "🎀" },
              { val: cycleInfo.daysUntilNextPeriod, label: "Next period", sub: formatDate(cycleInfo.nextPeriodDate), deco: "🍓" },
              {
                val: profile.pcos === "yes" ? "On" : "Off",
                label: "PCOS mode",
                sub: profile.pcos === "yes" ? "active" : "off",
                deco: "🌸",
                red: profile.pcos === "yes",
              },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  ...card,
                  padding: "12px 14px",
                  position: "relative",
                  background: "#FFFAF4",
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateY(0)" : "translateY(10px)",
                  transition: `all 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.08}s`,
                }}
              >
                <div style={{ position: "absolute", right: 10, top: 8, fontSize: 14, opacity: 0.12 }}>{s.deco}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: s.red ? "var(--color-crimson)" : "var(--color-ink)", fontFamily: "var(--font-serif)", lineHeight: 1 }}>
                  {s.val}
                </div>
                <div style={{ fontSize: 9, color: "var(--color-muted)", marginTop: 3, fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {s.label}
                </div>
                <div style={{ fontSize: 11, color: "var(--color-crimson)", marginTop: 1, fontStyle: "italic", fontFamily: "var(--font-body)" }}>
                  {s.sub}
                </div>
              </div>
            ))}
          </div>

          {/* BENTO GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.55fr 0.55fr",
              gridTemplateRows: isMobile ? "auto" : "1fr 1fr",
              gap: 10,
              flex: 1,
              minHeight: 0,
            }}
          >
            {/* Phase card */}
            <div
              style={{
                ...card,
                gridRow: isMobile ? "auto" : "1 / 3",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: "none",
                opacity: mounted ? 1 : 0,
                animation: mounted ? "fadeSlideUp 0.7s cubic-bezier(0.4,0,0.2,1) 0.15s both" : "none",
                minHeight: isMobile ? 280 : undefined,
              }}
            >
              <div style={{ position: "absolute", inset: 0, background: "#FFFAF4", zIndex: 0 }} />
              <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(184,0,10,0.04) 1px,transparent 1px)", backgroundSize: "20px 20px", zIndex: 1, pointerEvents: "none" }} />
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }} viewBox="0 0 300 500" preserveAspectRatio="xMidYMid slice">
                <circle cx={260} cy={60} r={100} fill="rgba(184,0,10,0.04)" />
                <circle cx={30} cy={420} r={80} fill="rgba(184,0,10,0.03)" />
              </svg>
              {!isMobile && (
                <div style={{ position: "absolute", top: 0, left: "-200%", right: "-200%", height: "100%", background: "linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.05) 50%,transparent 60%)", animation: "shimmer 5s linear infinite", pointerEvents: "none", zIndex: 2 }} />
              )}
              <BowSVG style={{ position: "absolute", top: 12, right: 12, width: 28, height: 18, opacity: 0.55, zIndex: 4, pointerEvents: "none" }} />

              <div style={{ position: "relative", zIndex: 3, padding: "20px 18px" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(184,0,10,0.06)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, animation: "drift 6s ease-in-out infinite" }}>
                  <PhaseIcon phase={cycleInfo.phase} size={22} color="#B8000A" />
                </div>
                <div style={{ fontSize: 9, color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: "0.2em", fontFamily: "sans-serif", marginBottom: 10 }}>
                  {phase.name} phase
                </div>
                <div style={{ fontSize: 42, fontWeight: 900, color: "var(--color-crimson)", fontFamily: "var(--font-serif)", fontStyle: "italic", lineHeight: 1, letterSpacing: "-0.02em" }}>
                  {phaseWord}
                </div>
                <div style={{ width: 28, height: 2, background: "var(--color-crimson)", borderRadius: 2, marginTop: 10, marginBottom: 10, opacity: 0.4 }} />
                <div style={{ fontSize: 11, color: "var(--color-muted)", fontFamily: "var(--font-body)", lineHeight: 1.7 }}>
                  Day {cycleInfo.dayInCycle} of your cycle
                </div>
                <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
                  {["♥", "♥", "♥"].map((h, i) => (
                    <span key={i} style={{ fontSize: 10, color: "var(--color-crimson)", opacity: 0.4 + i * 0.15 }}>
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ position: "relative", zIndex: 3, padding: "0 18px 18px" }}>
                <div style={{ fontSize: 9, color: "var(--color-muted)", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
                  This week
                </div>
                <WeekStrip logs={logs} accent="#B8000A" />
              </div>
            </div>

            {/* Mood log card */}
            <div
              onClick={() => router.push("/tracker")}
              onMouseEnter={() => setMoodHover(true)}
              onMouseLeave={() => setMoodHover(false)}
              style={{
                ...card,
                padding: "14px 13px",
                cursor: "pointer",
                background: "#FFFAF4",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                animation: mounted ? "fadeSlideUp 0.6s cubic-bezier(0.4,0,0.2,1) 0.28s both" : "none",
                transform: moodHover && !isMobile ? "translateY(-3px)" : "translateY(0)",
                boxShadow: moodHover && !isMobile ? "0 8px 26px rgba(184,0,10,0.12)" : "0 2px 24px rgba(0,0,0,0.06)",
                transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease",
              }}
            >
              <div style={{ position: "absolute", bottom: -8, right: -4, fontSize: 52, opacity: 0.04, pointerEvents: "none", transform: "rotate(15deg)" }}>🌹</div>
              <BowSVG style={{ position: "absolute", top: 8, right: 10, width: 20, height: 13, opacity: 0.28, pointerEvents: "none" }} />

              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-ink)", fontFamily: "var(--font-serif)", fontStyle: "italic", marginBottom: 10 }}>
                  {moodSaved ? "Saved ♥" : "How are you?"}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5 }} onClick={(e) => e.stopPropagation()}>
                  {MOOD_OPTIONS.map(({ symbol, label }) => (
                    <button
                      key={label}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickMood(label);
                      }}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 3,
                        padding: "9px 4px",
                        borderRadius: 12,
                        border: "none",
                        cursor: "pointer",
                        background: quickMood === label ? "rgba(184,0,10,0.1)" : "rgba(184,0,10,0.04)",
                        outline: quickMood === label ? "1.5px solid rgba(184,0,10,0.35)" : "1px solid rgba(184,0,10,0.08)",
                        transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                        transform: quickMood === label ? "scale(1.07)" : "scale(1)",
                      }}
                    >
                      <span style={{ fontSize: 15, color: quickMood === label ? "#B8000A" : "rgba(184,0,10,0.45)", fontWeight: 700, lineHeight: 1, fontFamily: "serif" }}>
                        {symbol}
                      </span>
                      <span style={{ fontSize: 7.5, color: quickMood === label ? "#B8000A" : "var(--color-muted)", fontFamily: "sans-serif", letterSpacing: "0.02em" }}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(184,0,10,0.08)", position: "relative" }}>
                <div style={{ fontSize: 8, color: "var(--color-crimson)", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5, opacity: 0.6 }}>
                  streak
                </div>
                <div style={{ display: "flex", gap: 3 }}>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <span key={i} style={{ fontSize: 13, color: i < totalLogged ? "#B8000A" : "rgba(184,0,10,0.15)" }}>
                      ♥
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quote card */}
            <div
              onClick={rerollQuote}
              onMouseEnter={() => setQuoteHover(true)}
              onMouseLeave={() => setQuoteHover(false)}
              title="Tap for another quote"
              style={{
                ...card,
                border: "none",
                position: "relative",
                overflow: "hidden",
                animation: mounted ? "fadeSlideUp 0.6s cubic-bezier(0.4,0,0.2,1) 0.38s both" : "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                ...liftStyle(quoteHover),
              }}
            >
              <div style={{ position: "absolute", inset: 0, background: "#FFFAF4", zIndex: 0 }} />
              <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(184,0,10,0.035) 1px,transparent 1px)", backgroundSize: "18px 18px", zIndex: 1, pointerEvents: "none" }} />
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }} viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
                <circle cx={170} cy={30} r={70} fill="rgba(184,0,10,0.03)" />
                <circle cx={20} cy={170} r={55} fill="rgba(184,0,10,0.025)" />
              </svg>

              <div style={{ position: "relative", zIndex: 3, padding: "14px 13px" }}>
                <div style={{ fontSize: 32, color: "rgba(184,0,10,0.18)", fontFamily: "var(--font-serif)", fontStyle: "italic", lineHeight: 0.6, marginBottom: 8 }}>
                  &ldquo;
                </div>
                <div style={{ fontSize: 8, color: "var(--color-muted)", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 10 }}>
                  a little reminder
                </div>
                <div style={{ fontSize: 11.5, color: "var(--color-crimson)", fontFamily: "var(--font-serif)", fontStyle: "italic", lineHeight: 1.75, whiteSpace: "pre-line", opacity: 0.9 }}>
                  {dailyQuote}
                </div>
              </div>
              <div style={{ position: "relative", zIndex: 3, padding: "0 13px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <BowSVG style={{ width: 18, height: 11, opacity: 0.4 }} />
                <div style={{ fontSize: 9, color: "var(--color-muted)", fontFamily: "sans-serif", opacity: 0.5 }}>
                  tap for more ♥
                </div>
              </div>
            </div>

            {/* Saheli card */}
            <div
              onClick={() => router.push("/saheli")}
              onMouseEnter={() => setSaheliHover(true)}
              onMouseLeave={() => setSaheliHover(false)}
              style={{
                gridColumn: isMobile ? "1" : "2 / 4",
                borderRadius: 20,
                border: "1px solid rgba(184,0,10,0.15)",
                background: "linear-gradient(145deg,#FFF5F0 0%,#FFF0EC 50%,#FFF5F0 100%)",
                position: "relative",
                overflow: "hidden",
                padding: "16px 16px",
                animation: mounted ? "fadeSlideUp 0.6s cubic-bezier(0.4,0,0.2,1) 0.48s both" : "none",
                transform: saheliHover && !isMobile ? "translateY(-4px)" : "translateY(0)",
                boxShadow: saheliHover && !isMobile ? "0 10px 30px rgba(184,0,10,0.16)" : "0 4px 24px rgba(184,0,10,0.08)",
                transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease",
                cursor: "pointer",
              }}
            >
              <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(180deg,transparent 0px,transparent 22px,rgba(184,0,10,0.04) 22px,rgba(184,0,10,0.04) 23px)", pointerEvents: "none", zIndex: 0 }} />
              <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle,rgba(184,0,10,0.08) 0%,transparent 70%)", zIndex: 0 }} />
              <div style={{ position: "absolute", bottom: -20, left: -20, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle,rgba(184,0,10,0.05) 0%,transparent 70%)", zIndex: 0 }} />

              <BowSVG style={{ position: "absolute", top: 10, right: 14, width: 24, height: 15, opacity: 0.35, zIndex: 1, pointerEvents: "none" }} />

              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, position: "relative", zIndex: 2 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#B8000A,#880008)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 12px rgba(184,0,10,0.25)" }}>
                  <span style={{ fontSize: 16 }}>🌸</span>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)", fontFamily: "var(--font-serif)", fontStyle: "italic", lineHeight: 1 }}>
                    Saheli
                  </div>
                  <div style={{ fontSize: 9, color: "var(--color-muted)", fontFamily: "sans-serif", marginTop: 2, letterSpacing: "0.04em" }}>
                    your AI companion · always here ♥
                  </div>
                </div>
                <div style={{ marginLeft: "auto", fontSize: 8, color: "var(--color-crimson)", fontFamily: "sans-serif", background: "rgba(184,0,10,0.07)", padding: "3px 9px", borderRadius: 10, border: "1px solid rgba(184,0,10,0.15)", letterSpacing: "0.06em" }}>
                  ● online
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center", position: "relative", zIndex: 2 }} onClick={(e) => e.stopPropagation()}>
                <input
                  value={saheliInput}
                  onChange={(e) => setSaheliInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaheliSend()}
                  onFocus={() => setSaheliFocus(true)}
                  onBlur={() => setSaheliFocus(false)}
                  placeholder="Ask anything… periods, mood, PCOS, health ♥"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    padding: "11px 16px",
                    borderRadius: 50,
                    border: `1.5px solid ${saheliFocus ? "rgba(184,0,10,0.4)" : "rgba(184,0,10,0.15)"}`,
                    background: saheliFocus ? "rgba(184,0,10,0.04)" : "rgba(255,255,255,0.8)",
                    fontSize: 12,
                    fontFamily: "var(--font-body)",
                    color: "var(--color-ink)",
                    outline: "none",
                    transition: "all 0.25s",
                  }}
                />
                <button
                  onClick={handleSaheliSend}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "none",
                    flexShrink: 0,
                    background: "linear-gradient(135deg,#B8000A,#880008)",
                    color: "#FFF0EC",
                    fontSize: 15,
                    cursor: "pointer",
                    boxShadow: "0 3px 14px rgba(184,0,10,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ♥
                </button>
              </div>

              <div style={{ display: "flex", gap: 5, marginTop: 10, flexWrap: "wrap", position: "relative", zIndex: 2 }} onClick={(e) => e.stopPropagation()}>
                {["Why am I so tired?", "What to eat now?", "PCOS & mood", "Is this normal?"].map((q) => (
                  <button
                    key={q}
                    onClick={() => setSaheliInput(q)}
                    style={{
                      fontSize: 10,
                      padding: "4px 12px",
                      borderRadius: 50,
                      border: "1px solid rgba(184,0,10,0.15)",
                      background: "rgba(184,0,10,0.04)",
                      color: "var(--color-muted)",
                      cursor: "pointer",
                      fontFamily: "sans-serif",
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — 30%, desktop only (Tailwind hidden/md:flex handles the breakpoint) */}
        <div className="hidden md:flex" style={{ flex: "0 0 30%", padding: "18px 20px", flexDirection: "column", gap: 16, overflowY: "auto", position: "relative", borderLeft: "1px solid rgba(184,0,10,0.05)", height: "100%", boxSizing: "border-box" }}>
          <BowSVG style={{ position: "absolute", top: 14, right: 18, width: 30, height: 19, opacity: 0.4, pointerEvents: "none" }} />
          <BowSVG style={{ position: "absolute", top: 230, left: 6, width: 24, height: 15, opacity: 0.28, transform: "rotate(-12deg)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 200, right: 30, fontSize: 12, color: "#B8000A", opacity: 0.22, transform: "rotate(10deg)", pointerEvents: "none" }}>♥</div>
          <div style={{ position: "absolute", bottom: 260, left: 14, fontSize: 11, color: "#B8000A", opacity: 0.2, transform: "rotate(-15deg)", pointerEvents: "none" }}>♥</div>
          <div style={{ position: "absolute", bottom: 180, right: 24, fontSize: 18, opacity: 0.18, pointerEvents: "none" }}>🌹</div>
          <div style={{ position: "absolute", top: 340, right: 10, fontSize: 14, opacity: 0.18, transform: "rotate(8deg)", pointerEvents: "none" }}>🍓</div>

          <div style={{ background: "rgba(255,250,244,0.92)", backdropFilter: "blur(12px)", borderRadius: 18, padding: "16px", border: "1px solid rgba(184,0,10,0.07)", boxShadow: "0 2px 14px rgba(0,0,0,0.04)", position: "relative" }}>
            <BowSVG style={{ position: "absolute", top: -9, right: -5, width: 24, height: 15, opacity: 0.4, pointerEvents: "none" }} />
            <MiniCalendar cycleInfo={cycleInfo} logs={logs} />
          </div>
          <div style={{ height: 1, background: "rgba(184,0,10,0.05)" }} />

          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)", fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
                Recent logs
              </div>
              <BowSVG style={{ width: 22, height: 14, opacity: 0.4 }} />
            </div>

            {recentLogs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 32, opacity: 0.2, marginBottom: 10 }}>🌹</div>
                <div style={{ fontSize: 13, color: "var(--color-muted)", fontStyle: "italic", fontFamily: "var(--font-body)", opacity: 0.7 }}>
                  No logs yet ♥
                </div>
                <div style={{ fontSize: 11, color: "var(--color-muted-light)", fontFamily: "sans-serif", marginTop: 4 }}>
                  Start tracking today
                </div>
              </div>
            ) : (
              <>
                {recentLogs.map(([date, log], idx) => (
                  <div
                    key={date}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: "12px 4px",
                      borderBottom: idx < recentLogs.length - 1 ? "1px solid rgba(184,0,10,0.05)" : "none",
                      position: "relative",
                    }}
                  >
                    <div style={{ fontSize: 11, color: "#B8000A", opacity: 0.5, marginTop: 2, flexShrink: 0 }}>♥</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: "var(--color-muted)", fontFamily: "sans-serif", marginBottom: 4, fontWeight: 600 }}>
                        {new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", weekday: "short" })}
                      </div>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {log.mood && (
                          <span style={{ fontSize: 10, background: "rgba(184,0,10,0.08)", color: "var(--color-crimson)", padding: "3px 9px", borderRadius: 10, fontFamily: "sans-serif", fontWeight: 600 }}>
                            {log.mood}
                          </span>
                        )}
                        {log.flow && log.flow !== "none" && (
                          <span style={{ fontSize: 10, background: "rgba(184,0,10,0.05)", color: "var(--color-ink-light)", padding: "3px 9px", borderRadius: 10, fontFamily: "sans-serif" }}>
                            {log.flow}
                          </span>
                        )}
                        {log.symptoms?.slice(0, 3).map((s) => (
                          <span key={s} style={{ fontSize: 10, background: "rgba(184,0,10,0.05)", color: "var(--color-ink-light)", padding: "3px 9px", borderRadius: 10, fontFamily: "sans-serif" }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: 18, padding: "14px 16px", background: "rgba(184,0,10,0.04)", borderRadius: 14, borderLeft: "3px solid rgba(184,0,10,0.18)", position: "relative" }}>
                  <div style={{ position: "absolute", top: 8, right: 10, fontSize: 14, opacity: 0.25 }}>🌸</div>
                  <div style={{ fontSize: 11, color: "var(--color-crimson)", fontFamily: "var(--font-serif)", fontStyle: "italic", lineHeight: 1.6 }}>
                    {totalLogged} {totalLogged === 1 ? "day" : "days"} logged so far — every entry is a small act of self-love ♥
                  </div>
                </div>
              </>
            )}
          </div>

          <div style={{ marginTop: "auto", textAlign: "center", fontSize: 14, opacity: 0.16, letterSpacing: 10, paddingTop: 16 }}>
            🌹 🍓 🌸 🎀 ♥
          </div>
        </div>
      </div>
    </div>
  );
}