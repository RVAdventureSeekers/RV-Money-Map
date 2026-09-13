type ProgressCardProps = {
  goalName: string;
  dayNumber: number;
  totalDays: number;
  netSoFar: number;
  targetAmount: number;
};

export default function ProgressCard({
  goalName,
  dayNumber,
  totalDays,
  netSoFar,
  targetAmount,
}: ProgressCardProps) {
  const dayPct = Math.min(100, Math.max(0, (dayNumber / totalDays) * 100));
  const remaining = targetAmount - netSoFar;
  const money = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <div
      id="progress-card"
      className="bg-white border border-sand-200 rounded-card p-6"
    >
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-sm text-ink-700">{goalName}</span>
        <span className="text-sm font-medium text-route-600">
          Day {dayNumber} of {totalDays}
        </span>
      </div>

      <div className="w-full h-2.5 bg-sand-100 rounded-full overflow-hidden mb-5">
        <div
          className="h-full bg-route-600 rounded-full transition-all"
          style={{ width: `${dayPct}%` }}
        />
      </div>

      <div className="flex justify-between">
        <div>
          <p className="text-2xl font-medium text-ink-900">{money(netSoFar)}</p>
          <p className="text-xs text-ink-700 mt-0.5">Net so far</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-medium text-ink-900">
            {money(Math.max(0, remaining))}
          </p>
          <p className="text-xs text-ink-700 mt-0.5">Left to goal</p>
        </div>
      </div>
    </div>
  );
}
