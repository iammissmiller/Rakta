"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BowSVG } from "@/components/Decorations";

interface StepOption {
  value: string;
  label: string;
  emoji: string;
  desc: string;
}

interface Step {
  id: "name" | "who" | "pcos" | "last_period";
  question: string;
  type?: "text" | "date";
  placeholder?: string;
  emoji?: string;
  options?: StepOption[];
}

const steps: Step[] = [
  {
    id: "name",
    question: "What's your name?",
    type: "text",
    placeholder: "Enter your name...",
    emoji: "🌹",
  },
  {
    id: "who",
    question: "Who are you?",
    options: [
      { value: "teenager", label: "Teenager", emoji: "🌸", desc: "13–18 years" },
      { value: "young_woman", label: "Young Woman", emoji: "✨", desc: "18–39 years" },
      { value: "pregnant", label: "Pregnant", emoji: "🤱", desc: "Currently pregnant" },
      { value: "menopausal", label: "40+", emoji: "🌙", desc: "Perimenopause / Menopause" },
    ],
  },
  {
    id: "pcos",
    question: "Do you have PCOS (PMOS)?",
    options: [
      { value: "yes", label: "Yes", emoji: "💊", desc: "I have PCOS / PMOS" },
      { value: "no", label: "No", emoji: "✓", desc: "I don't have it" },
      { value: "unsure", label: "Not Sure", emoji: "🤔", desc: "I'm not sure yet" },
    ],
  },
  {
    id: "last_period",
    question: "When did your last period start?",
    type: "date",
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState("");

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  const handleSelect = (value: string) => {
    const newAnswers = { ...answers, [step.id]: value };
    setAnswers(newAnswers);
    if (!isLast) setTimeout(() => setCurrentStep((p) => p + 1), 280);
  };

  const handleContinue = async () => {
    if (!inputValue.trim()) return;
    const newAnswers = { ...answers, [step.id]: inputValue.trim() };
    setAnswers(newAnswers);
    setInputValue("");

    if (isLast) {
  const res = await fetch("/api/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: newAnswers.name,
      lifeStage: newAnswers.who,
      pmosStatus: newAnswers.pcos,
      lastPeriodDate: newAnswers.last_period,
      cycleLength: 28,
      periodLength: 5,
    }),
  });

  if (res.ok) {
    router.push("/welcome");
  } else {
    console.error("Failed to save profile");
  }
} else {
      setCurrentStep((p) => p + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleContinue();
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10"
      style={{ background: "#FEF9F2" }}
    >
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, transparent 0px, transparent 26px, rgba(184,0,10,0.025) 26px, rgba(184,0,10,0.025) 27px)",
        }}
      />

      <BowSVG style={{ position: "absolute", top: 24, right: 32, width: 44, height: 28, opacity: 0.5, zIndex: 2, pointerEvents: "none" }} />
      <BowSVG style={{ position: "absolute", bottom: 30, left: 24, width: 36, height: 22, opacity: 0.32, transform: "rotate(-14deg)", zIndex: 2, pointerEvents: "none" }} />

      <div
        className="relative z-[3] w-full max-w-[440px] rounded-3xl bg-white/70 p-8 backdrop-blur-sm"
        style={{
          border: "1px solid rgba(184,0,10,0.08)",
          boxShadow: "0 8px 40px rgba(184,0,10,0.08)",
        }}
      >
        {/* Back + step dots */}
        <div className="mb-6 flex items-center gap-3">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep((p) => p - 1)}
              aria-label="Go back"
              className="text-lg leading-none text-muted"
            >
              ←
            </button>
          )}
          <div className="flex flex-1 justify-center gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === currentStep ? 20 : 6,
                  background:
                    i <= currentStep ? "#B8000A" : "rgba(184,0,10,0.15)",
                }}
              />
            ))}
          </div>
          <div className="w-4" />
        </div>

        {/* Wordmark */}
        <div className="mb-6 text-center">
          <div className="font-serif text-xs italic tracking-[0.3em] text-crimson opacity-60">
            ♥ rakta ♥
          </div>
        </div>

        {/* Question */}
        <div className="mb-7 text-center">
          <div className="font-serif text-[26px] italic font-bold leading-[1.2] text-ink">
            {step.emoji && <span className="mr-2">{step.emoji}</span>}
            {step.question}
          </div>
        </div>

        {/* Text input */}
        {step.type === "text" && (
          <>
            <input
              autoFocus
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={step.placeholder}
              className="input mb-4 text-center font-serif text-lg italic"
            />
            <button
              onClick={handleContinue}
              disabled={!inputValue.trim()}
              className="btn-primary"
              style={{ opacity: inputValue.trim() ? 1 : 0.4 }}
            >
              Continue →
            </button>
          </>
        )}

        {/* Date input */}
        {step.type === "date" && (
          <>
            <input
              type="date"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="input mb-4 text-center text-base"
            />
            <button
              onClick={handleContinue}
              disabled={!inputValue}
              className="btn-primary"
              style={{ opacity: inputValue ? 1 : 0.4 }}
            >
              Continue →
            </button>
          </>
        )}

        {/* Option cards */}
        {!step.type && step.options && (
          <div className="flex flex-col gap-2.5">
            {step.options.map((opt) => {
              const isSelected = answers[step.id] === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className="flex items-center gap-4 rounded-2xl px-5 py-3.5 text-left transition-all"
                  style={{
                    background: isSelected ? "rgba(184,0,10,0.07)" : "#FFFFFF",
                    border: `1.5px solid ${isSelected ? "#B8000A" : "rgba(184,0,10,0.1)"}`,
                    boxShadow: isSelected
                      ? "0 2px 16px rgba(184,0,10,0.12)"
                      : "0 1px 6px rgba(0,0,0,0.04)",
                  }}
                >
                  <div className="text-2xl">{opt.emoji}</div>
                  <div>
                    <div className="font-serif text-[15px] italic font-semibold text-ink">
                      {opt.label}
                    </div>
                    <div className="mt-0.5 text-xs text-muted">{opt.desc}</div>
                  </div>
                  {isSelected && <div className="ml-auto text-lg text-crimson">♥</div>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}