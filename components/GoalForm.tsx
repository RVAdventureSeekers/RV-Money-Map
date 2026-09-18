"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Goal = {
  id: string;
  name: string;
  target_amount: number;
  start_date: string;
  end_date: string;
};

export default function GoalForm({ goal }: { goal: Goal | null }) {
  const [name, setName] = useState(goal?.name ?? "");
  const [targetAmount, setTargetAmount] = useState(
    goal ? String(goal.target_amount) : ""
  );
  const [startDate, setStartDate] = useState(
    goal?.start_date ?? new Date().toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(goal?.end_date ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const amount = parseFloat(targetAmount);
    if (!name.trim()) {
      setError("Give your goal a name.");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      setError("Enter a target amount greater than 0.");
      return;
    }
    if (!endDate) {
      setError("Choose a target end date.");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setError("End date must be after the start date.");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const payload = {
      user_id: user?.id,
      name: name.trim(),
      target_amount: amount,
      start_date: startDate,
      end_date: endDate,
    };

    const { data: savedGoal, error: saveError } = goal
      ? await supabase
          .from("goals")
          .update(payload)
          .eq("id", goal.id)
          .select()
          .single()
      : await supabase.from("goals").insert(payload).select().single();

    setSaving(false);

    if (saveError || !savedGoal) {
      setError("Couldn't save your goal. Try again.");
      return;
    }

    router.push(`/dashboard/${savedGoal.id}`);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSave}
      className="bg-white border border-sand-200 rounded-card p-5 space-y-3"
    >
      <div>
        <label className="text-sm text-ink-700 block mb-1">Goal name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Pay off credit card debt"
        />
      </div>
      <div>
        <label className="text-sm text-ink-700 block mb-1">
          Target amount
        </label>
        <input
          type="number"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          placeholder="15000"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-ink-700 block mb-1">
            Start date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm text-ink-700 block mb-1">
            Target end date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-sm text-rust-500">{error}</p>}

      <button type="submit" disabled={saving} className="btn-primary w-full">
        {saving ? "Saving…" : goal ? "Save changes" : "Create goal"}
      </button>
    </form>
  );
}
