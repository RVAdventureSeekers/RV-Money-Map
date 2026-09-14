"use client";

import { useState } from "react";

export default function TrialLocked() {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (data.url) window.location.href = data.url;
  }

  return (
    <main className="max-w-md mx-auto px-6 py-20 text-center">
      <h1 className="text-xl font-medium text-ink-900 mb-2">
        Your free trial has ended
      </h1>
      <p className="text-sm text-ink-700 mb-6">
        Upgrade to RV Money Map Pro to keep tracking your progress toward
        debt-free.
      </p>
      <button
        className="btn-primary"
        onClick={handleUpgrade}
        disabled={loading}
      >
        {loading ? "Loading…" : "Upgrade to Pro — $4/month"}
      </button>
    </main>
  );
}
