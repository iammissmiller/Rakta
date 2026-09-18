"use client";

import { useState, useEffect, use } from "react";
import { BowSVG } from "@/components/Decorations";
import { PHASES, formatDate, type CyclePhase } from "@/lib/cycle";

interface InviteData {
  ownerName: string;
  status: "cycle" | "pregnancy" | "menopause" | "no_data" | "not_set_up";
  phase?: CyclePhase;
  dayInCycle?: number;
  isOverdue?: boolean;
  daysOverdue?: number;
  nextPeriodDate?: string;
  week?: number;
  trimester?: number;
}

export default function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [data, setData] = useState<InviteData | null>(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/invite/${token}`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) {
          setError(body.error || "Something went wrong.");
        } else {
          setData(body);
        }
        setLoaded(true);
      })
      .catch(() => {
        setError("Couldn't reach the server. Try refreshing.");
        setLoaded(true);
      });
  }, [token]);

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center px-4 py-10"
      style={{ background: "#FEF9F2" }}
    >
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, transparent 0px, transparent 26px, rgba(184,0,10,0.025) 26px, rgba(184,0,10,0.025) 27px)",
        }}
      />

      <div className="relative z-10 mb-6 font-serif text-xs italic tracking-[0.3em] text-crimson opacity-70">
        ♥ rakta ♥
      </div>

      <div
        className="relative z-10 w-full max-w-sm rounded-3xl bg-white/80 p-8 text-center backdrop-blur-sm"
        style={{ border: "1px solid rgba(184,0,10,0.08)", boxShadow: "0 8px 40px rgba(184,0,10,0.08)" }}
      >
        {!loaded && <div className="pulse font-serif text-sm italic text-crimson">Loading…</div>}

        {loaded && error && (
          <>
            <BowSVG style={{ width: 36, height: 22, opacity: 0.5, margin: "0 auto 14px" }} />
            <p className="text-sm text-ink-light">{error}</p>
          </>
        )}

        {loaded && data && (
          <>
            <p className="text-xs text-muted">Shared with you by</p>
            <h1 className="mt-1 font-serif text-2xl italic font-bold text-ink">{data.ownerName}</h1>

            {data.status === "cycle" && data.phase && (
              <div className="mt-6">
                <div className="text-4xl">{PHASES[data.phase].emoji}</div>
                <div className="mt-2 font-serif text-xl italic font-bold" style={{ color: PHASES[data.phase].color }}>
                  {data.isOverdue ? "Period overdue" : `${PHASES[data.phase].name} phase`}
                </div>
                <p className="mt-1 text-sm text-muted">
                  {data.isOverdue
                    ? `${data.daysOverdue} day${data.daysOverdue === 1 ? "" : "s"} past expected`
                    : `Day ${data.dayInCycle} of her cycle`}
                </p>
                {!data.isOverdue && data.nextPeriodDate && (
                  <p className="mt-1 text-xs text-muted">
                    Next period expected around {formatDate(data.nextPeriodDate)}
                  </p>
                )}
              </div>
            )}

            {data.status === "pregnancy" && (
              <div className="mt-6">
                <div className="text-4xl">🤰</div>
                <div className="mt-2 font-serif text-xl italic font-bold text-crimson">
                  Week {data.week}
                </div>
                <p className="mt-1 text-sm text-muted">Trimester {data.trimester}</p>
              </div>
            )}

            {data.status === "menopause" && (
              <div className="mt-6">
                <div className="text-4xl">🌙</div>
                <p className="mt-2 text-sm text-muted">
                  Not tracking period days — she&apos;s logging how she feels day to day.
                </p>
              </div>
            )}

            {(data.status === "no_data" || data.status === "not_set_up") && (
              <p className="mt-6 text-sm text-muted">No cycle data logged yet.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
