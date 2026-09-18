import Link from "next/link";

type Goal = {
  id: string;
  name: string;
  target_amount: number;
  start_date: string;
  end_date: string;
};

export default function GoalSummaryCard({
  goal,
  netSoFar,
}: {
  goal: Goal;
  netSoFar: number;
}) {
  const startDate = new Date(goal.start_date);
  const endDate = new Date(goal.end_date);
  const now = new Date();

  const totalDays = Math.max(
    1,
    Math.round((endDate.getTime() - startDate.getTime()) / 86400000)
  );
  const dayNumber = Math.min(
    totalDays,
    Math.max(1, Math.round((now.getTime() - startDate.getTime()) / 86400000))
  );

  const target = Number(goal.target_amount);
  const pct = Math.min(100, Math.max(0, (netSoFar / target) * 100));

  const money = (n: number) =>
    n.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  return (
    <Link href={`/dashboard/${goal.id}`}>
      <div className="bg-white border border-sand-200 rounded-card p-5 hover:border-route-600 transition-colors cursor-pointer h-full">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-sm font-medium text-ink-900">
            {goal.name}
          </span>
          <span className="text-xs text-ink-700">
            Day {dayNumber} of {totalDays}
          </span>
        </div>

        <div className="w-full h-2 bg-sand-100 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-route-600 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-ink-900 font-medium">{money(netSoFar)}</span>
          <span className="text-ink-700">of {money(target)}</span>
        </div>
      </div>
    </Link>
  );
}
