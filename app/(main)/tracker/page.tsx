"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import TrackerCalendar from "@/components/TrackerCalendar";
import { BowSVG } from "@/components/Decorations";
import { getCycleInfo, getPregnancyWeek, type CycleInfo } from "@/lib/cycle";

interface Profile {
  id: string;
  name: string;
  lifeStage: "teenager" | "young_woman" | "pregnant" | "menopausal";
  pmosStatus: "yes" | "no" | "unsure";
  cycleLength: number;
  periodLength: number;
  lastPeriodDate?: string;
  cycleRegularity: "regular" | "irregular" | "unsure";
}

interface DayLog {
  date: string;
  flow?: string;
  mood?: string;
  symptoms?: string[];
  notes?: string;
}

interface ImportantDate {
  id: string;
  date: string;
  label: string;
}

const MOOD_OPTIONS = [
  { symbol: "♥", label: "Loved" },
  { symbol: "✦", label: "Glowing" },
  { symbol: "~", label: "Meh" },
  { symbol: "↯", label: "Irritable" },
  { symbol: "◌", label: "Tired" },
  { symbol: "✿", label: "Soft" },
];

const FLOW_OPTIONS = [
  { value: "none", label: "None" },
  { value: "light", label: "Light" },
  { value: "medium", label: "Medium" },
  { value: "heavy", label: "Heavy" },
];

const BASE_SYMPTOMS = ["Cramps", "Headache", "Bloating", "Fatigue", "Back pain", "Breast tenderness", "Nausea"];
const PCOS_SYMPTOMS = ["Acne", "Hair growth", "Weight changes", "Sugar cravings"];
const PREGNANCY_SYMPTOMS = ["Nausea", "Fatigue", "Cravings", "Back pain", "Swelling", "Heartburn", "Mood swings", "Braxton Hicks"];
const MENOPAUSE_SYMPTOMS = ["Hot flash", "Night sweats", "Mood swings", "Sleep trouble", "Joint aches", "Brain fog", "Spotting"];

const card: React.CSSProperties = {
  borderRadius: 20,
  border: "1px solid rgba(184,0,10,0.07)",
  boxShadow: "0 2px 24px rgba(0,0,0,0.06)",
  background: "#FFFAF4",
};

function todayKey() {
  return new Date().toISOString().split("T")[0];
}

function getPeriodStartDates(logs: Record<string, DayLog>): string[] {
  const flowDates = Object.keys(logs)
    .filter((k) => logs[k].flow && logs[k].flow !== "none")
    .sort();
  const starts: string[] = [];
  let prev: string | null = null;
  for (const d of flowDates) {
    const gap = prev ? (new Date(d).getTime() - new Date(prev).getTime()) / 86400000 : Infinity;
    if (gap > 1) starts.push(d);
    prev = d;
  }
  return starts;
}

function getRecentCycleLengths(starts: string[]): number[] {
  const lengths: number[] = [];
  for (let i = 1; i < starts.length; i++) {
    lengths.push(
      Math.round((new Date(starts[i]).getTime() - new Date(starts[i - 1]).getTime()) / 86400000)
    );
  }
  return lengths.slice(-4);
}

export default function Tracker() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [logs, setLogs] = useState<Record<string, DayLog>>({});
  const [importantDates, setImportantDates] = useState<ImportantDate[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedDate, setSelectedDate] = useState(todayKey());

  // Form state for the selected day
  const [flow, setFlow] = useState("none");
  const [mood, setMood] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [newDateVal, setNewDateVal] = useState("");
  const [newDateLabel, setNewDateLabel] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/profile").then((r) => r.json()),
      fetch("/api/logs").then((r) => r.json()),
      fetch("/api/important-dates").then((r) => r.json()),
    ])
      .then(([p, l, d]) => {
        if (!p || !p.id) {
          router.replace("/onboarding");
          return;
        }
        setProfile(p);
        setLogs(l || {});
        setImportantDates(Array.isArray(d) ? d : []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [router]);

  // Load the form whenever the selected date or logs change
  useEffect(() => {
    const existing = logs[selectedDate];
    setFlow(existing?.flow || "none");
    setMood(existing?.mood || null);
    setSymptoms(existing?.symptoms || []);
    setNotes(existing?.notes || "");
  }, [selectedDate, logs]);

  const mode: "cycle" | "pregnancy" | "menopause" =
    profile?.lifeStage === "pregnant"
      ? "pregnancy"
      : profile?.lifeStage === "menopausal"
      ? "menopause"
      : "cycle";

  const isIrregular = profile?.pmosStatus === "yes" || profile?.cycleRegularity === "irregular";

  const cycleInfo: CycleInfo | null = useMemo(() => {
    if (!profile?.lastPeriodDate || mode !== "cycle") return null;
    return getCycleInfo(profile.lastPeriodDate, profile.cycleLength, profile.periodLength);
  }, [profile, mode]);

  const periodStarts = useMemo(() => getPeriodStartDates(logs), [logs]);
  const recentCycleLengths = useMemo(() => getRecentCycleLengths(periodStarts), [periodStarts]);

  const clashes = useMemo(() => {
    if (mode !== "cycle" || !cycleInfo) return [];
    const start = new Date(cycleInfo.nextPeriodDate);
    const end = new Date(start.getTime() + cycleInfo.periodLength * 86400000);
    return importantDates.filter((d) => {
      const dd = new Date(d.date);
      return dd >= start && dd < end;
    });
  }, [importantDates, cycleInfo, mode]);

  const symptomOptions =
    mode === "pregnancy"
      ? PREGNANCY_SYMPTOMS
      : mode === "menopause"
      ? MENOPAUSE_SYMPTOMS
      : profile?.pmosStatus === "yes"
      ? [...BASE_SYMPTOMS, ...PCOS_SYMPTOMS]
      : BASE_SYMPTOMS;

  const toggleSymptom = (s: string) => {
    setSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const saveLog = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate, flow, mood, symptoms, notes }),
      });
      if (res.ok) {
        setLogs((prev) => ({ ...prev, [selectedDate]: { date: selectedDate, flow, mood: mood || undefined, symptoms, notes } }));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  const addImportantDate = async () => {
    if (!newDateVal || !newDateLabel.trim()) return;
    const res = await fetch("/api/important-dates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: newDateVal, label: newDateLabel.trim() }),
    });
    if (res.ok) {
      const created = await res.json();
      setImportantDates((prev) => [...prev, created].sort((a, b) => a.date.localeCompare(b.date)));
      setNewDateVal("");
      setNewDateLabel("");
    }
  };

  const removeImportantDate = async (id: string) => {
    setImportantDates((prev) => prev.filter((d) => d.id !== id));
    await fetch(`/api/important-dates?id=${id}`, { method: "DELETE" });
  };

  const recentLogs = Object.values(logs)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="pulse font-serif text-sm italic text-crimson">Loading…</div>
      </div>
    );
  }

  const upcomingDates = importantDates.filter((d) => new Date(d.date) >= new Date(todayKey()));

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-6 sm:px-8">
      <div className="mb-6 flex items-center gap-3">
        <BowSVG style={{ width: 30, height: 19, opacity: 0.5 }} />
        <div>
          <div className="font-serif text-xl italic font-bold text-ink">Your Tracker</div>
          <div className="text-xs text-muted">
            {mode === "pregnancy" && profile?.lastPeriodDate
              ? `Week ${getPregnancyWeek(profile.lastPeriodDate).week} · Trimester ${getPregnancyWeek(profile.lastPeriodDate).trimester}`
              : mode === "menopause"
              ? "Tracking how you're feeling, day by day"
              : cycleInfo?.isOverdue
              ? `Period overdue · ${cycleInfo.daysOverdue}d`
              : cycleInfo
              ? `${cycleInfo.phase[0].toUpperCase()}${cycleInfo.phase.slice(1)} phase · Day ${cycleInfo.dayInCycle}`
              : "Log your day below"}
          </div>
        </div>
      </div>

      {clashes.length > 0 && (
        <div
          className="mb-6 rounded-2xl px-5 py-4 text-sm"
          style={{ background: "rgba(230,140,0,0.08)", border: "1px solid rgba(230,140,0,0.25)", color: "#A66200" }}
        >
          Heads up — your period is predicted to land near{" "}
          {clashes.map((c) => `${c.label} (${c.date})`).join(", ")}.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* LEFT: Calendar + log form */}
        <div className="flex flex-col gap-6">
          <div style={{ ...card, padding: 20 }}>
            <TrackerCalendar
              cycleInfo={cycleInfo}
              logs={logs}
              importantDates={importantDates}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              mode={mode === "cycle" ? "cycle" : "symptom"}
            />
          </div>

          {mode === "cycle" && isIrregular && (
            <div style={{ ...card, padding: 18 }}>
              <div className="font-serif text-sm italic font-semibold text-ink">Your cycle pattern</div>
              {recentCycleLengths.length >= 1 ? (
                <p className="mt-1 text-sm text-muted">
                  Recent cycle lengths from your logs: {recentCycleLengths.join(", ")} days.
                  Since these vary, we're not assuming a fixed date for your next period.
                </p>
              ) : (
                <p className="mt-1 text-sm text-muted">
                  Log a couple more periods and we&apos;ll start showing your actual pattern
                  here instead of a standard estimate.
                </p>
              )}
            </div>
          )}

          <div style={{ ...card, padding: 20 }}>
            <div className="mb-4 flex items-center justify-between">
              <div className="font-serif text-base italic font-semibold text-ink">
                Log for {selectedDate === todayKey() ? "today" : selectedDate}
              </div>
              {saved && <div className="text-xs text-crimson">Saved ♥</div>}
            </div>

            {mode !== "pregnancy" && (
              <div className="mb-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                  {mode === "menopause" ? "Spotting / flow (if any)" : "Flow"}
                </div>
                <div className="flex gap-2">
                  {FLOW_OPTIONS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFlow(f.value)}
                      className="flex-1 rounded-xl border py-2 text-xs"
                      style={{
                        borderColor: flow === f.value ? "#B8000A" : "rgba(184,0,10,0.12)",
                        background: flow === f.value ? "rgba(184,0,10,0.08)" : "#fff",
                        color: flow === f.value ? "#B8000A" : "var(--color-ink-light)",
                        fontWeight: flow === f.value ? 700 : 400,
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Mood</div>
              <div className="grid grid-cols-6 gap-2">
                {MOOD_OPTIONS.map(({ symbol, label }) => (
                  <button
                    key={label}
                    onClick={() => setMood(label)}
                    title={label}
                    className="flex flex-col items-center gap-1 rounded-xl py-2"
                    style={{
                      background: mood === label ? "rgba(184,0,10,0.1)" : "rgba(184,0,10,0.04)",
                      outline: mood === label ? "1.5px solid rgba(184,0,10,0.35)" : "1px solid rgba(184,0,10,0.08)",
                    }}
                  >
                    <span style={{ fontSize: 15, color: mood === label ? "#B8000A" : "rgba(184,0,10,0.45)" }}>
                      {symbol}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Symptoms</div>
              <div className="flex flex-wrap gap-2">
                {symptomOptions.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSymptom(s)}
                    className="rounded-full border px-3 py-1.5 text-xs"
                    style={{
                      borderColor: symptoms.includes(s) ? "#B8000A" : "rgba(184,0,10,0.12)",
                      background: symptoms.includes(s) ? "rgba(184,0,10,0.08)" : "#fff",
                      color: symptoms.includes(s) ? "#B8000A" : "var(--color-ink-light)",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Notes</div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything else worth remembering about today…"
                className="input"
                rows={3}
              />
            </div>

            <button onClick={saveLog} disabled={saving} className="btn-primary" style={{ width: "auto", padding: "10px 28px" }}>
              {saving ? "Saving..." : "Save entry"}
            </button>
          </div>
        </div>

        {/* RIGHT: important dates + recent logs */}
        <div className="flex flex-col gap-6">
          <div style={{ ...card, padding: 20 }}>
            <div className="mb-3 font-serif text-base italic font-semibold text-ink">Important dates</div>
            <p className="mb-3 text-xs text-muted">
              Meetings, travel, deadlines — anything you&apos;d want a heads-up about if your
              period might land on it.
            </p>
            <div className="mb-3 flex flex-col gap-2 sm:flex-row">
              <input
                type="date"
                value={newDateVal}
                onChange={(e) => setNewDateVal(e.target.value)}
                className="input"
              />
              <input
                type="text"
                value={newDateLabel}
                onChange={(e) => setNewDateLabel(e.target.value)}
                placeholder="e.g. Client presentation"
                className="input"
              />
            </div>
            <button
              onClick={addImportantDate}
              disabled={!newDateVal || !newDateLabel.trim()}
              className="btn-primary"
              style={{ width: "auto", padding: "8px 20px", fontSize: 13 }}
            >
              Add
            </button>

            {upcomingDates.length > 0 && (
              <div className="mt-4 flex flex-col gap-2">
                {upcomingDates.map((d) => (
                  <div key={d.id} className="flex items-center justify-between rounded-xl border border-crimson/10 bg-white px-3 py-2 text-xs">
                    <div>
                      <span className="font-semibold text-ink">{d.label}</span>
                      <span className="ml-2 text-muted">{d.date}</span>
                    </div>
                    <button onClick={() => removeImportantDate(d.id)} className="text-muted hover:text-crimson">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {mode === "menopause" && (
            <div style={{ ...card, padding: 18 }}>
              <div className="font-serif text-sm italic font-semibold text-ink">This month</div>
              <div className="mt-2 text-2xl font-bold text-crimson" style={{ fontFamily: "var(--font-serif)" }}>
                {Object.values(logs).filter((l) => l.date.startsWith(todayKey().slice(0, 7)) && l.symptoms?.includes("Hot flash")).length}
              </div>
              <div className="text-xs text-muted">days with a logged hot flash</div>
            </div>
          )}

          <div style={{ ...card, padding: 20 }}>
            <div className="mb-3 font-serif text-base italic font-semibold text-ink">Recent logs</div>
            {recentLogs.length === 0 ? (
              <p className="text-sm text-muted">No entries yet — your first log will show up here.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {recentLogs.map((log) => (
                  <div key={log.date} className="rounded-xl border border-crimson/10 bg-white px-3 py-2 text-xs">
                    <div className="font-semibold text-ink">
                      {new Date(log.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {log.mood && <span className="rounded-full bg-crimson/8 px-2 py-0.5 text-crimson">{log.mood}</span>}
                      {log.flow && log.flow !== "none" && (
                        <span className="rounded-full bg-crimson/5 px-2 py-0.5 text-ink-light">{log.flow}</span>
                      )}
                      {log.symptoms?.slice(0, 3).map((s) => (
                        <span key={s} className="rounded-full bg-crimson/5 px-2 py-0.5 text-ink-light">{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}