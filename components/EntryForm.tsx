"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function EntryForm({ goalId }: { goalId: string }) {
  const [incomeSource, setIncomeSource] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function addEntry(
    entryType: "income" | "expense",
    label: string,
    amountRaw: string
  ) {
    const amount = parseFloat(amountRaw);
    if (!label.trim()) {
      setError(
        entryType === "income" ? "Enter an income source." : "Enter an expense category."
      );
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      setError("Enter an amount greater than 0.");
      return;
    }

    setError(null);
    setSubmitting(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: insertError } = await supabase.from("entries").insert({
      user_id: user?.id,
      goal_id: goalId,
      entry_type: entryType,
      label: label.trim(),
      amount,
      entry_date: new Date().toISOString().slice(0, 10),
    });

    setSubmitting(false);

    if (insertError) {
      setError("Couldn't save that entry. Try again.");
      return;
    }

    if (entryType === "income") {
      setIncomeSource("");
      setIncomeAmount("");
    } else {
      setExpenseCategory("");
      setExpenseAmount("");
    }

    router.refresh();
  }

  return (
    <div className="bg-white border border-sand-200 rounded-card p-5 mt-4">
      <p className="text-sm font-medium text-ink-900 mb-3">
        Log today's entry
      </p>

      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Income source"
          value={incomeSource}
          onChange={(e) => setIncomeSource(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={incomeAmount}
          onChange={(e) => setIncomeAmount(e.target.value)}
          className="w-28"
        />
        <button
          className="btn-secondary shrink-0"
          disabled={submitting}
          onClick={() => addEntry("income", incomeSource, incomeAmount)}
        >
          Add income
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Expense note"
          value={expenseCategory}
          onChange={(e) => setExpenseCategory(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
          className="w-28"
        />
        <button
          className="btn-secondary shrink-0"
          disabled={submitting}
          onClick={() => addEntry("expense", expenseCategory, expenseAmount)}
        >
          Add expense
        </button>
      </div>

      {error && <p className="text-sm text-rust-500 mt-2">{error}</p>}
    </div>
  );
}
