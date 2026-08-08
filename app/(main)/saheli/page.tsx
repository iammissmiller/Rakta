"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { BowSVG } from "@/components/Decorations";

const SUGGESTED = [
  "PCOS symptoms kya hain?",
  "Heavy flow kyu hota hai?",
  "Mood swings kaise control karein?",
  "Ovulation kab hota hai?",
];

export default function Saheli() {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/saheli" }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const send = (text?: string) => {
    const userText = text || input.trim();
    if (!userText || isLoading) return;
    setInput("");
    sendMessage({ text: userText });
  };

  return (
    <div className="flex h-screen flex-col" style={{ background: "var(--background)" }}>
      {/* Header */}
      <div className="flex flex-shrink-0 items-center gap-3 border-b border-crimson/10 px-5 py-4">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
          style={{ background: "linear-gradient(135deg, #B8000A, #880008)" }}
        >
          🌸
        </div>
        <div>
          <div className="font-serif text-base font-bold italic text-ink">Saheli</div>
          <div className="text-[11px] text-muted">Your bilingual health companion</div>
        </div>
        <div className="ml-auto h-2 w-2 rounded-full bg-green-500" />
        <BowSVG style={{ width: 26, height: 16, opacity: 0.4 }} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pt-4">
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          {messages.length === 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <div
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm"
                  style={{ background: "linear-gradient(135deg, #B8000A, #880008)" }}
                >
                  🌸
                </div>
                <div className="max-w-[75%] rounded-2xl rounded-tl-md border border-crimson/10 bg-surface px-4 py-3 text-sm leading-relaxed text-ink">
                  Namaste! Main Saheli hoon 🌸 Aapki menstrual health ke baare mein koi bhi sawaal poochh sakti hain — Hindi ya English mein.
                </div>
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <div
                  className="mr-2 mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm"
                  style={{ background: "linear-gradient(135deg, #B8000A, #880008)" }}
                >
                  🌸
                </div>
              )}
              <div
                className="max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
                style={{
                  borderRadius:
                    m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background:
                    m.role === "user"
                      ? "linear-gradient(135deg, #B8000A, #880008)"
                      : "var(--color-surface)",
                  border: m.role === "user" ? "none" : "1px solid rgba(184,0,10,0.1)",
                  color: m.role === "user" ? "#fff" : "var(--color-ink)",
                }}
              >
                {m.parts.map((part, i) =>
                  part.type === "text" ? <span key={i}>{part.text}</span> : null
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full text-sm"
                style={{ background: "linear-gradient(135deg, #B8000A, #880008)" }}
              >
                🌸
              </div>
              <div className="pulse rounded-2xl rounded-tl-md border border-crimson/10 bg-surface px-4 py-3 text-sm text-muted">
                Soch rahi hoon...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Suggested questions */}
      {messages.length === 0 && (
        <div className="mx-auto flex w-full max-w-2xl gap-2 overflow-x-auto px-4 pb-2">
          {SUGGESTED.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="flex-shrink-0 rounded-2xl border border-crimson/10 bg-surface px-3 py-1.5 text-xs text-crimson"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="mx-auto flex w-full max-w-2xl flex-shrink-0 gap-2 px-4 py-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Kuch bhi poochho..."
          disabled={isLoading}
          className="input flex-1"
        />
        <button
          onClick={() => send()}
          disabled={isLoading || !input.trim()}
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-lg text-white"
          style={{
            background:
              isLoading || !input.trim()
                ? "rgba(184,0,10,0.15)"
                : "linear-gradient(135deg, #B8000A, #880008)",
          }}
        >
          →
        </button>
      </div>
    </div>
  );
}