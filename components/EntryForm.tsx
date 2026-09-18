"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ExpenseRow = {
  id: string;
  category: string;
  amount: string;
};

function newRow(): ExpenseRow {
  return {
    id: crypto.randomUUID(),
    category: "",
    amount: "",
  };
}

export default function EntryForm({ goalId }: { goalId: string }) {
  const [incomeSource, setIncomeSource] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeError, setIncomeError] = useState<string | null>(null);
  const [incomeSubmitting, setIncomeSubmitting] = useState(false);

  const [expenseRows, setExpenseRows] = useState<ExpenseRow[]>([newRow()]);
  const [expenseError, setExpenseError] = useState<string | null>(null);
  const [expenseSubmitting, setExpenseSubmitting] = useState(false);

  const router = useRouter();

  async function addIncome() {
    const amount = parseFloat(incomeAmount);
    if (!incomeSource.trim()) {
      setIncomeError("Enter an income source.");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      setIncomeError("Enter an amount greater than 0.");
      return;
    }

    setIncomeError(null);
    setIncomeSubmitting(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: insertError } = await supabase.from("entries").insert({
      user_id: user?.id,
      goal_id: goalId,
      entry_type: "income",
      label: incomeSource.trim(),
      amount,
      entry_date: new Date().toISOString().slice(0, 10),
    });

    setIncomeSubmitting(false);

    if (insertError) {
      setIncomeError("Couldn't save that entry. Try again.");
      return;
    }

    setIncomeSource("");
    setIncomeAmount("");
    router.refresh();
  }

  function updateRow(id: string, field: "category" | "amount", value: string) {
    setExpenseRows((rows) =>
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  }

  function addRow() {
    setExpenseRows((rows) => [...rows, newRow()]);
  }

  function removeRow(id: string) {
    setExpenseRows((rows) =>
      rows.length > 1 ? rows.filter((row) => row.id !== id) : rows
    );
  }

  async function saveExpenses() {
    // Ignore rows the user left completely empty (e.g. an unused extra row).
    const rowsToSave = expenseRows.filter(
      (row) => row.category.trim() !== "" || row.amount.trim() !== ""
    );

    if (rowsToSave.length === 0) {
      setExpenseError("Add at least one expense.");
      return;
    }

    for (const row of rowsToSave) {
      const amount = parseFloat(row.amount);
      if (!row.category.trim()) {
        setExpenseError("Every expense needs a category.");
        return;
      }
      if (isNaN(amount) || amount <= 0) {
        setExpenseError("Every expense needs an amount greater than 0.");
        return;
      }
    }

    setExpenseError(null);
    setExpenseSubmitting(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const today = new Date().toISOString().slice(0, 10);
    const payload = rowsToSave.map((row) => ({
      user_id: user?.id,
      goal_id: goalId,
      entry_type: "expense" as const,
      label: row.category.trim(),
      amount: parseFloat(row.amount),
      entry_date: today,
    }));

    const { error: insertError } = await supabase.from("entries").insert(payload);

    setExpenseSubmitting(false);

    if (insertError) {
      setExpenseError("Couldn't save those expenses. Try again.");
      return;
    }

    setExpenseRows([newRow()]);
    router.refresh();
  }

  return (
    <div className="bg-white border border-sand-200 rounded-card p-5 mt-4">
      <p className="text-sm font-medium text-ink-900 mb-3">
        Log today's entry
      </p>

      <div className="flex gap-2 mb-6">
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
          disabled={incomeSubmitting}
          onClick={addIncome}
        >
          Add income
        </button>
      </div>
      {incomeError && <p className="text-sm text-rust-500 -mt-4 mb-4">{incomeError}</p>}

      <div className="space-y-2">
        {expenseRows.map((row, index) => (
          <div key={row.id} className="flex gap-2">
            <input
              type="text"
              placeholder="Expense note"
              value={row.category}
              onChange={(e) => updateRow(row.id, "category", e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount"
              value={row.amount}
              onChange={(e) => updateRow(row.id, "amount", e.target.value)}
              className="w-28"
            />
            <button
              type="button"
              onClick={() => removeRow(row.id)}
              disabled={expenseRows.length === 1}
              aria-label="Remove expense row"
              className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-ink-700 hover:text-rust-500 hover:bg-sand-100 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-3">
        <button
          type="button"
          onClick={addRow}
          className="text-sm text-route-600 font-medium hover:text-route-700"
        >
          + Add another expense
        </button>
        <button
          className="btn-secondary shrink-0"
          disabled={expenseSubmitting}
          onClick={saveExpenses}
        >
          {expenseSubmitting
            ? "Saving…"
            : expenseRows.filter((r) => r.category.trim() || r.amount.trim()).length > 1
            ? "Save expenses"
            : "Add expense"}
        </button>
      </div>

      {expenseError && <p className="text-sm text-rust-500 mt-2">{expenseError}</p>}
    </div>
  );
}
