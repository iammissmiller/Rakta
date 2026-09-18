"use client";

import { useState, useEffect } from "react";
import { BowSVG } from "@/components/Decorations";

interface Contact {
  id: string;
  name: string;
  phone: string | null;
  sharing: boolean;
  inviteToken: string;
  connected: boolean;
  viewerEmail: string | null;
}

const card: React.CSSProperties = {
  borderRadius: 20,
  border: "1px solid rgba(184,0,10,0.07)",
  boxShadow: "0 2px 24px rgba(0,0,0,0.06)",
  background: "#FFFAF4",
};

export default function Family() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/family")
      .then((r) => r.json())
      .then((data) => {
        setContacts(Array.isArray(data) ? data : []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const addContact = async () => {
    if (!name.trim()) return;
    const res = await fetch("/api/family", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), phone: phone.trim() || undefined }),
    });
    if (res.ok) {
      const created = await res.json();
      setContacts((prev) => [...prev, created]);
      setName("");
      setPhone("");
    }
  };

  const removeContact = async (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    await fetch(`/api/family?id=${id}`, { method: "DELETE" });
  };

  const toggleSharing = async (contact: Contact) => {
    const next = !contact.sharing;
    setContacts((prev) => prev.map((c) => (c.id === contact.id ? { ...c, sharing: next } : c)));
    await fetch("/api/family", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: contact.id, sharing: next }),
    });
  };

  const revoke = async (id: string) => {
    const res = await fetch("/api/family/revoke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      const { inviteToken } = await res.json();
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, connected: false, viewerEmail: null, inviteToken } : c))
      );
    }
  };

  const copyLink = (contact: Contact) => {
    const url = `${window.location.origin}/invite/${contact.inviteToken}`;
    navigator.clipboard.writeText(url);
    setCopiedId(contact.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="pulse font-serif text-sm italic text-crimson">Loading…</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-6 sm:px-8">
      <div className="mb-2 flex items-center gap-3">
        <BowSVG style={{ width: 30, height: 19, opacity: 0.5 }} />
        <div className="font-serif text-xl italic font-bold text-ink">Family</div>
      </div>
      <p className="mb-6 text-sm text-muted">
        Share a read-only view of your cycle status — just phase, day, and next
        predicted date, never your logs or notes — with someone you trust.
      </p>

      {/* Add contact */}
      <div style={{ ...card, padding: 20 }} className="mb-6">
        <div className="mb-3 font-serif text-base italic font-semibold text-ink">Add a trusted contact</div>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="input" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (optional)" className="input" />
        </div>
        <button onClick={addContact} disabled={!name.trim()} className="btn-primary" style={{ width: "auto", padding: "8px 22px", fontSize: 13 }}>
          Add
        </button>
      </div>

      {/* Contact list */}
      {contacts.length === 0 ? (
        <div style={{ ...card, padding: 24 }} className="text-center text-sm text-muted">
          No trusted contacts yet.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {contacts.map((c) => (
            <div key={c.id} style={{ ...card, padding: 18 }}>
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <div className="font-serif text-base italic font-semibold text-ink">{c.name}</div>
                  {c.phone && <div className="text-xs text-muted">{c.phone}</div>}
                </div>
                <span
                  className="rounded-full px-3 py-1 text-[11px] font-semibold"
                  style={{
                    background: c.connected ? "rgba(184,0,10,0.08)" : "rgba(230,140,0,0.1)",
                    color: c.connected ? "#B8000A" : "#A66200",
                  }}
                >
                  {c.connected ? "Connected" : "Waiting to join"}
                </span>
              </div>

              {c.connected && c.viewerEmail && (
                <p className="mb-2 text-xs text-muted">Linked to {c.viewerEmail}</p>
              )}

              <div className="mb-3 flex items-center gap-2">
                <span className="text-xs text-muted">Sharing</span>
                <button
                  onClick={() => toggleSharing(c)}
                  className="relative h-5 w-9 rounded-full transition-colors"
                  style={{ background: c.sharing ? "#B8000A" : "rgba(184,0,10,0.15)" }}
                >
                  <span
                    className="absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all"
                    style={{ left: c.sharing ? 18 : 2 }}
                  />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => copyLink(c)}
                  className="rounded-full border border-crimson/20 px-3 py-1.5 text-xs text-crimson"
                >
                  {copiedId === c.id ? "Copied ♥" : c.connected ? "Copy link again" : "Copy invite link"}
                </button>
                {c.connected && (
                  <button
                    onClick={() => revoke(c.id)}
                    className="rounded-full border border-[#A66200]/30 px-3 py-1.5 text-xs text-[#A66200]"
                  >
                    Revoke access
                  </button>
                )}
                <button
                  onClick={() => removeContact(c.id)}
                  className="rounded-full border border-transparent px-3 py-1.5 text-xs text-muted hover:text-crimson"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
