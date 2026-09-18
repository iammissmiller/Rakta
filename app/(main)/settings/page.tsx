"use client";

import { useState, useEffect } from "react";
import { BowSVG } from "@/components/Decorations";

interface Profile {
  name: string;
  lifeStage: "teenager" | "young_woman" | "pregnant" | "menopausal";
  pmosStatus: "yes" | "no" | "unsure";
  cycleLength: number;
  periodLength: number;
  lastPeriodDate?: string;
}

const LIFE_STAGE_OPTIONS = [
  { value: "teenager", label: "Teenager" },
  { value: "young_woman", label: "Young Woman" },
  { value: "pregnant", label: "Pregnant" },
  { value: "menopausal", label: "40+ / Menopausal" },
];

const PMOS_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Not sure" },
];

const card: React.CSSProperties = {
  borderRadius: 20,
  border: "1px solid rgba(184,0,10,0.07)",
  boxShadow: "0 2px 24px rgba(0,0,0,0.06)",
  background: "#FFFAF4",
};

export default function Settings() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loaded, setLoaded] = useState(false);

  const [pendingLifeStage, setPendingLifeStage] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((p) => {
        if (p?.id) {
          setProfile({
            name: p.name,
            lifeStage: p.lifeStage,
            pmosStatus: p.pmosStatus,
            cycleLength: p.cycleLength,
            periodLength: p.periodLength,
            lastPeriodDate: p.lastPeriodDate ? p.lastPeriodDate.split("T")[0] : "",
          });
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const updateField = <K extends keyof Profile>(field: K, value: Profile[K]) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleLifeStageSelect = (value: string) => {
    if (!profile) return;
    if (value === profile.lifeStage) return;
    // Changing life stage changes what the Tracker shows (cycle tracking vs
    // pregnancy weeks vs menopause symptoms), so it gets a confirm step
    // instead of saving silently like the other fields.
    setPendingLifeStage(value);
  };

  const confirmLifeStage = () => {
    if (!profile || !pendingLifeStage) return;
    updateField("lifeStage", pendingLifeStage as Profile["lifeStage"]);
    setPendingLifeStage(null);
  };

  const saveProfile = async () => {
    if (!profile) return;
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        setProfileMsg({ type: "ok", text: "Saved ♥" });
      } else {
        setProfileMsg({ type: "err", text: "Something went wrong saving your profile. Please try again." });
      }
    } catch {
      setProfileMsg({ type: "err", text: "Couldn't reach the server. Check your connection and try again." });
    } finally {
      setSavingProfile(false);
      setTimeout(() => setProfileMsg(null), 3000);
    }
  };

  const changePassword = async () => {
    setPasswordMsg(null);
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "err", text: "New passwords don't match." });
      return;
    }
    setSavingPassword(true);
    try {
      const res = await fetch("/api/settings/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMsg({ type: "ok", text: "Password updated ♥" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMsg({ type: "err", text: data.error || "Failed to change password." });
      }
    } catch {
      setPasswordMsg({ type: "err", text: "Couldn't reach the server. Check your connection and try again." });
    } finally {
      setSavingPassword(false);
    }
  };

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="pulse font-serif text-sm italic text-crimson">Loading…</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <p className="text-sm text-muted">Couldn&apos;t load your profile. Try refreshing.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-6 sm:px-8">
      <div className="mb-6 flex items-center gap-3">
        <BowSVG style={{ width: 30, height: 19, opacity: 0.5 }} />
        <div className="font-serif text-xl italic font-bold text-ink">Settings</div>
      </div>

      {/* PROFILE */}
      <div style={{ ...card, padding: 22 }} className="mb-6">
        <div className="mb-4 font-serif text-base italic font-semibold text-ink">Your profile</div>

        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Name</label>
        <input
          value={profile.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="input mb-4"
        />

        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Life stage</label>
        <div className="mb-1 grid grid-cols-2 gap-2">
          {LIFE_STAGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleLifeStageSelect(opt.value)}
              className="rounded-xl border py-2 text-xs"
              style={{
                borderColor: profile.lifeStage === opt.value ? "#B8000A" : "rgba(184,0,10,0.12)",
                background: profile.lifeStage === opt.value ? "rgba(184,0,10,0.08)" : "#fff",
                color: profile.lifeStage === opt.value ? "#B8000A" : "var(--color-ink-light)",
                fontWeight: profile.lifeStage === opt.value ? 700 : 400,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {pendingLifeStage && (
          <div
            className="mb-4 mt-2 rounded-xl px-4 py-3 text-xs"
            style={{ background: "rgba(230,140,0,0.08)", border: "1px solid rgba(230,140,0,0.25)", color: "#A66200" }}
          >
            Changing your life stage will change what your Tracker shows (cycle
            days vs. pregnancy weeks vs. menopause symptoms). Sure about this?
            <div className="mt-2 flex gap-2">
              <button onClick={confirmLifeStage} className="rounded-full bg-[#A66200] px-4 py-1 text-white">
                Yes, change it
              </button>
              <button onClick={() => setPendingLifeStage(null)} className="rounded-full border border-[#A66200]/40 px-4 py-1 text-[#A66200]">
                Cancel
              </button>
            </div>
          </div>
        )}
        {!pendingLifeStage && <div className="mb-4" />}

        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">PCOS / PMOS status</label>
        <div className="mb-4 grid grid-cols-3 gap-2">
          {PMOS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateField("pmosStatus", opt.value as Profile["pmosStatus"])}
              className="rounded-xl border py-2 text-xs"
              style={{
                borderColor: profile.pmosStatus === opt.value ? "#B8000A" : "rgba(184,0,10,0.12)",
                background: profile.pmosStatus === opt.value ? "rgba(184,0,10,0.08)" : "#fff",
                color: profile.pmosStatus === opt.value ? "#B8000A" : "var(--color-ink-light)",
                fontWeight: profile.pmosStatus === opt.value ? 700 : 400,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Cycle length (days)</label>
            <input
              type="number"
              value={profile.cycleLength}
              onChange={(e) => updateField("cycleLength", Number(e.target.value))}
              className="input"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Period length (days)</label>
            <input
              type="number"
              value={profile.periodLength}
              onChange={(e) => updateField("periodLength", Number(e.target.value))}
              className="input"
            />
          </div>
        </div>

        {profile.lifeStage !== "pregnant" && (
          <div className="mb-5">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Last period start date</label>
            <input
              type="date"
              value={profile.lastPeriodDate || ""}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => updateField("lastPeriodDate", e.target.value)}
              className="input"
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          <button onClick={saveProfile} disabled={savingProfile} className="btn-primary" style={{ width: "auto", padding: "10px 28px" }}>
            {savingProfile ? "Saving..." : "Save changes"}
          </button>
          {profileMsg && (
            <span className="text-xs" style={{ color: profileMsg.type === "ok" ? "#B8000A" : "#B8000A" }}>
              {profileMsg.text}
            </span>
          )}
        </div>
      </div>

      {/* PASSWORD */}
      <div style={{ ...card, padding: 22 }}>
        <div className="mb-4 font-serif text-base italic font-semibold text-ink">Change password</div>

        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Current password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="input mb-4"
        />

        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">New password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="input mb-4"
        />

        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Confirm new password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input mb-5"
        />

        <div className="flex items-center gap-3">
          <button
            onClick={changePassword}
            disabled={savingPassword || !currentPassword || !newPassword}
            className="btn-primary"
            style={{ width: "auto", padding: "10px 28px" }}
          >
            {savingPassword ? "Updating..." : "Update password"}
          </button>
          {passwordMsg && (
            <span className="text-xs" style={{ color: passwordMsg.type === "ok" ? "#B8000A" : "#B8000A" }}>
              {passwordMsg.text}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
