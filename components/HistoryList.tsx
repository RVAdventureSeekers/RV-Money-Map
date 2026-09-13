"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Entry = {
  id: string;
  entry_type: "income" | "expense";
  label: string;
  amount: number;
  entry_date: string;
};

export default function HistoryList({
  entries,
  isPro,
}: {
  entries: Entry[];
  isPro: boolean;
}) {
  const router = useRouter();

  async function handleDelete(id: string) {
    const supabase = createClient();
    await supabase.from("entries").delete().eq("id", id);
    router.refresh();
  }

  function exportCsv() {
    const header = "date,type,label,amount\n";
    const rows = entries
      .map((e) => `${e.entry_date},${e.entry_type},"${e.label}",${e.amount}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rv-money-map-entries.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  const money = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <div>
      <div className="flex justify-end mb-3">
        {isPro ? (
          <button className="btn-secondary text-sm" onClick={exportCsv}>
            Export CSV
          </button>
        ) : (
          <span className="text-sm text-ink-700">
            <span className="text-route-600 font-medium">Upgrade to Pro</span>{" "}
            to export CSV
          </span>
        )}
      </div>

      <div className="bg-white border border-sand-200 rounded-card divide-y divide-sand-200">
        {entries.length === 0 && (
          <p className="text-sm text-ink-700 p-5">
            No entries yet. Add your first one from the dashboard.
          </p>
        )}
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between px-5 py-3"
          >
            <div>
              <p className="text-sm text-ink-900">{entry.label}</p>
              <p className="text-xs text-ink-700">{entry.entry_date}</p>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`text-sm font-medium ${
                  entry.entry_type === "income"
                    ? "text-route-600"
                    : "text-rust-500"
                }`}
              >
                {entry.entry_type === "income" ? "+" : "-"}
                {money(Number(entry.amount))}
              </span>
              <button
                onClick={() => handleDelete(entry.id)}
                className="text-xs text-ink-700 hover:text-rust-500"
                aria-label="Delete entry"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
