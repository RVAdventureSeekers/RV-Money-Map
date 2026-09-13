"use client";

import { useState } from "react";

export default function SubscriptionCard({ isPro }: { isPro: boolean }) {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (data.url) window.location.href = data.url;
  }

  async function handleManage() {
    setLoading(true);
    const res = await fetch("/api/portal", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (data.url) window.location.href = data.url;
  }

  return (
    <div className="bg-white border border-sand-200 rounded-card p-5">
      <p className="text-sm font-medium text-ink-900 mb-1">Subscription</p>
      <p className="text-sm text-ink-700 mb-4">
        {isPro
          ? "You're on RV Money Map Pro. Multiple goals, CSV export, and custom share cards are unlocked."
          : "Free plan: one goal and the core dashboard. Upgrade for $4/month to unlock CSV export and more."}
      </p>
      {isPro ? (
        <button
          className="btn-secondary"
          onClick={handleManage}
          disabled={loading}
        >
          {loading ? "Loading…" : "Manage billing"}
        </button>
      ) : (
        <button
          className="btn-primary"
          onClick={handleUpgrade}
          disabled={loading}
        >
          {loading ? "Loading…" : "Upgrade to Pro — $4/month"}
        </button>
      )}
    </div>
  );
}
