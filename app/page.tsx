import Link from "next/link";
import { BowSVG, LipstickMark } from "@/components/Decorations";

const PILLS = [
  { label: "Track", top: "8%", left: "4%", rotate: -6 },
  { label: "Saheli", top: "62%", left: "78%", rotate: 4 },
  { label: "Private", top: "4%", left: "72%", rotate: 3 },
];

export default function Home() {
  return (
    <div style={{ background: "#FEF9F2", minHeight: "100vh" }}>
      <style>{`
        @keyframes settleIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .rakta-cta {
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease;
        }
        .rakta-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 26px rgba(184,0,10,0.32);
        }
      `}</style>

      {/* Paper lines, matching every other screen in the app */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, transparent 0px, transparent 26px, rgba(184,0,10,0.025) 26px, rgba(184,0,10,0.025) 27px)",
        }}
      />

      {/* NAV */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10">
        <span className="font-serif text-sm italic tracking-[0.25em] text-crimson">
          ♥ rakta ♥
        </span>
        <nav className="hidden items-center gap-8 text-sm text-ink-light sm:flex">
          <a href="#about" className="hover:text-crimson">About</a>
          <a href="#saheli" className="hover:text-crimson">Saheli</a>
          <a href="#private" className="hover:text-crimson">Privacy</a>
        </nav>
        <Link
          href="/login"
          className="rounded-full px-5 py-2 text-xs font-semibold text-white"
          style={{
            background: "linear-gradient(135deg, #B8000A, #880008)",
            boxShadow: "0 3px 12px rgba(184,0,10,0.25)",
          }}
        >
          Log in
        </Link>
      </header>

      {/* HERO — framed card, big headline, glossy centerpiece, floating tags */}
      <section
        className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-8 sm:pb-24"
        style={{ animation: "settleIn 0.9s cubic-bezier(0.4,0,0.2,1) both" }}
      >
        <div
          className="relative overflow-hidden rounded-[32px] px-6 py-14 sm:px-14 sm:py-20"
          style={{
            background: "#FFFAF4",
            border: "1px solid rgba(184,0,10,0.08)",
            boxShadow: "0 20px 60px rgba(184,0,10,0.08)",
          }}
        >
          {/* Floating tags — hidden on mobile, scattered on desktop */}
          {PILLS.map((p) => (
            <div
              key={p.label}
              className="absolute hidden items-center gap-1.5 rounded-full border border-crimson/15 bg-white px-3.5 py-1.5 text-xs text-crimson sm:flex"
              style={{
                top: p.top,
                left: p.left,
                transform: `rotate(${p.rotate}deg)`,
                boxShadow: "0 4px 14px rgba(184,0,10,0.1)",
              }}
            >
              <span style={{ fontSize: 10 }}>✦</span>
              {p.label}
            </div>
          ))}

          <div className="relative mx-auto max-w-lg text-center">
            <p className="font-serif text-sm italic text-muted">
              not an app. a diary.
            </p>
            <h1
              className="mt-3 font-serif italic font-bold text-ink"
              style={{
                fontSize: "clamp(2.4rem, 7vw, 4.2rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
              }}
            >
              A diary that
              <br />
              talks back.
            </h1>
          </div>

          {/* Wax seal centerpiece — matte, irregular edge, embossed heart */}
          <div className="relative mx-auto mt-10 flex justify-center">
            <svg
              viewBox="0 0 300 300"
              style={{ width: 180, height: 180, filter: "drop-shadow(0 10px 18px rgba(90,0,6,0.22))" }}
            >
              <defs>
                <radialGradient id="waxGrad" cx="35%" cy="30%" r="80%">
                  <stop offset="0%" stopColor="#C41A24" />
                  <stop offset="55%" stopColor="#920008" />
                  <stop offset="100%" stopColor="#5A0006" />
                </radialGradient>
                {/* Roughens the circle's edge so it reads as pressed wax, not a rendered sphere */}
                <filter id="waxEdge" x="-20%" y="-20%" width="140%" height="140%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
                </filter>
                <filter id="softEmboss" x="-40%" y="-40%" width="180%" height="180%">
                  <feDropShadow dx="-1" dy="-1" stdDeviation="0.6" floodColor="#FBE6DE" floodOpacity="0.55" />
                  <feDropShadow dx="1" dy="1.2" stdDeviation="0.7" floodColor="#4A0004" floodOpacity="0.55" />
                </filter>
              </defs>

              <g filter="url(#waxEdge)">
                <circle cx={150} cy={150} r={82} fill="url(#waxGrad)" />
              </g>

              {/* Faint pressed border ring, like a real seal stamp */}
              <circle
                cx={150}
                cy={150}
                r={64}
                fill="none"
                stroke="rgba(0,0,0,0.16)"
                strokeWidth={1}
              />

              {/* Embossed heart, pressed into the wax rather than sitting on top */}
              <g filter="url(#softEmboss)">
                <path
                  d="M150,178 C120,156 104,138 104,118 C104,102 116,92 130,92 C140,92 148,98 150,108 C152,98 160,92 170,92 C184,92 196,102 196,118 C196,138 180,156 150,178Z"
                  fill="#E8B5AC"
                  opacity={0.9}
                />
              </g>
            </svg>
          </div>

          {/* Blurb (left) + Saheli preview card (right) */}
          <div className="relative mt-10 grid gap-8 sm:mt-14 sm:grid-cols-2 sm:items-center sm:gap-10">
            <div className="text-center sm:text-left">
              <p className="text-[15px] leading-relaxed text-ink-light">
                Cramps you didn&apos;t mention. Moods you couldn&apos;t
                explain. Dates you kept forgetting. Rakta remembers all of
                it, gently — and puts Saheli right beside you for the rest.
              </p>
              <Link
                href="/login"
                className="rakta-cta mt-6 inline-block rounded-full px-8 py-3 text-sm font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, #B8000A, #880008)",
                  boxShadow: "0 4px 18px rgba(184,0,10,0.28)",
                }}
              >
                Enter ♥
              </Link>
            </div>

            <div
              className="mx-auto w-full max-w-xs rounded-2xl bg-white p-4 sm:mx-0 sm:ml-auto"
              style={{
                border: "1px solid rgba(184,0,10,0.1)",
                boxShadow: "0 10px 30px rgba(184,0,10,0.1)",
                transform: "rotate(1.5deg)",
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-base"
                  style={{ background: "linear-gradient(135deg, #B8000A, #880008)" }}
                >
                  🌸
                </div>
                <div>
                  <div className="font-serif text-sm italic font-semibold text-ink">
                    Saheli
                  </div>
                  <div className="text-[10px] text-muted">your companion</div>
                </div>
              </div>
              <div className="mt-3 rounded-xl rounded-tl-sm border border-crimson/10 bg-surface-alt px-3 py-2.5 text-left text-[13px] text-ink-light">
                &ldquo;Heavy flow kyu hota hai?&rdquo;
              </div>
              <div className="mt-1.5 text-right text-[11px] text-muted">
                ask her anything →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT — diary paragraph */}
      <section id="about" className="relative z-10 mx-auto max-w-xl px-6 pb-20 sm:pb-28">
        <p
          className="text-[17px] leading-[1.9] text-ink-light"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <span
            className="float-left mr-2 mt-1 font-serif italic font-bold text-crimson"
            style={{ fontSize: "3.4rem", lineHeight: "0.8" }}
          >
            Y
          </span>
          our body has been keeping a diary this whole time. Rakta puts all
          of that in one gentle place: a cycle ring that shows you exactly
          where you are, a companion who answers in Hindi or English
          without flinching, and a private page that stays entirely yours.
        </p>
      </section>

      {/* MARGIN NOTES */}
      <section id="saheli" className="relative z-10 mx-auto max-w-3xl px-6 pb-24 sm:pb-32">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          {[
            {
              title: "See your day at a glance",
              body: "One tap logs your mood or flow. Your phase, day count, and next expected date are always right there.",
              rotate: -2.5,
            },
            {
              title: "Talk it through with Saheli",
              body: "PCOS, cramps, mood swings, puberty, perimenopause — she answers in Hinglish, without judgment.",
              rotate: 1.5,
            },
            {
              title: "Written for no one else",
              body: "No feed, no followers, no performance. A page you keep for yourself, not for an audience.",
              rotate: -1,
              id: "private",
            },
          ].map((note) => (
            <div
              key={note.title}
              id={note.id}
              className="max-w-[230px] text-center sm:text-left"
              style={{ transform: `rotate(${note.rotate}deg)` }}
            >
              <LipstickMark
                style={{ width: 22, height: 13, opacity: 0.4, margin: "0 auto 10px" }}
              />
              <div className="font-serif text-base italic font-semibold text-ink">
                {note.title}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {note.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CLOSING */}
      <section className="relative z-10 mx-auto flex max-w-md flex-col items-center px-6 pb-24 text-center sm:pb-32">
        <BowSVG style={{ width: 40, height: 25, opacity: 0.55, marginBottom: 18 }} />
        <p className="font-serif text-lg italic text-ink-light">Turn the page.</p>
        <Link
          href="/login"
          className="rakta-cta mt-6 rounded-full px-9 py-3.5 text-[15px] font-semibold text-white"
          style={{
            background: "linear-gradient(135deg, #B8000A, #880008)",
            boxShadow: "0 4px 18px rgba(184,0,10,0.28)",
          }}
        >
          Enter ♥
        </Link>
      </section>

      <footer className="relative z-10 pb-10 text-center text-xs text-muted opacity-60">
        rakta — her strength. her cycle. her story.
      </footer>
    </div>
  );
}