"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { BowSVG } from "@/components/Decorations";

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Something went wrong");
          setLoading(false);
          return;
        }
      }

      const result = await signIn("credentials", {
  email,
  password,
  redirect: false,
});

if (result?.error) {
  setError("Invalid email or password");
  setLoading(false);
  return;
}

const profileRes = await fetch("/api/profile");
const profile = await profileRes.json();

if (profile && profile.id) {
  router.push("/dashboard");
} else {
  router.push("/onboarding");
}
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
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
        className="relative z-[3] w-full max-w-[400px] rounded-3xl bg-white/70 p-8 backdrop-blur-sm"
        style={{
          border: "1px solid rgba(184,0,10,0.08)",
          boxShadow: "0 8px 40px rgba(184,0,10,0.08)",
        }}
      >
        <div className="mb-8 text-center">
          <div className="font-serif text-xs italic tracking-[0.3em] text-crimson opacity-60">
            ♥ rakta ♥
          </div>
          <h1 className="mt-3 font-serif text-2xl italic font-bold text-ink">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            minLength={8}
            className="input"
          />

          {error && (
            <p className="text-center text-sm text-crimson">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Log in →"
              : "Sign up →"}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError("");
          }}
          className="mt-5 w-full text-center text-sm text-muted"
        >
          {mode === "login"
            ? "New here? Create an account"
            : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );
}