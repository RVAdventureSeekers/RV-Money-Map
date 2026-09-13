import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Nav from "@/components/Nav";
import ProgressCard from "@/components/ProgressCard";
import EntryForm from "@/components/EntryForm";
import ShareButton from "@/components/ShareButton";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: goal } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!goal) {
    return (
      <>
        <Nav />
        <main className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-xl font-medium text-ink-900 mb-2">
            Set up your first goal
          </h1>
          <p className="text-sm text-ink-700 mb-6">
            Tell us what you're paying off and by when, and we'll track your
            progress every day.
          </p>
          <Link href="/settings">
            <button className="btn-primary">Create a goal</button>
          </Link>
        </main>
      </>
    );
  }

  const { data: entries } = await supabase
    .from("entries")
    .select("*")
    .eq("goal_id", goal.id);

  const today = new Date().toISOString().slice(0, 10);
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

  const income = (entries ?? []).filter((e) => e.entry_type === "income");
  const expenses = (entries ?? []).filter((e) => e.entry_type === "expense");

  const totalIncome = income.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const netSoFar = totalIncome - totalExpenses;

  const todaysIncome = income
    .filter((e) => e.entry_date === today)
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const todaysExpenses = expenses
    .filter((e) => e.entry_date === today)
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const money = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <ProgressCard
          goalName={goal.name}
          dayNumber={dayNumber}
          totalDays={totalDays}
          netSoFar={netSoFar}
          targetAmount={Number(goal.target_amount)}
        />

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-sand-100 rounded-card p-4">
            <p className="text-xs text-ink-700 mb-1">Today's income</p>
            <p className="text-lg font-medium text-ink-900">
              {money(todaysIncome)}
            </p>
          </div>
          <div className="bg-sand-100 rounded-card p-4">
            <p className="text-xs text-ink-700 mb-1">Today's expenses</p>
            <p className="text-lg font-medium text-ink-900">
              {money(todaysExpenses)}
            </p>
          </div>
        </div>

        <EntryForm goalId={goal.id} />

        <div className="mt-4">
          <ShareButton
            goalName={goal.name}
            dayNumber={dayNumber}
            totalDays={totalDays}
            netSoFar={netSoFar}
          />
        </div>
      </main>
    </>
  );
}
