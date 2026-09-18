import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Nav from "@/components/Nav";
import GoalSummaryCard from "@/components/GoalSummaryCard";
import { canUseMultipleGoals, trialDaysLeft } from "@/lib/goals";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: goals } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: true });

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_pro")
    .eq("id", user!.id)
    .maybeSingle();

  const isPro = profile?.is_pro ?? false;
  const goalList = goals ?? [];
  const goalIds = goalList.map((g) => g.id);

  const { data: entries } = goalIds.length
    ? await supabase
        .from("entries")
        .select("goal_id, entry_type, amount")
        .in("goal_id", goalIds)
    : { data: [] as { goal_id: string; entry_type: string; amount: number }[] };

  function netFor(goalId: string) {
    const goalEntries = (entries ?? []).filter((e) => e.goal_id === goalId);
    const income = goalEntries
      .filter((e) => e.entry_type === "income")
      .reduce((sum, e) => sum + Number(e.amount), 0);
    const expenses = goalEntries
      .filter((e) => e.entry_type === "expense")
      .reduce((sum, e) => sum + Number(e.amount), 0);
    return income - expenses;
  }

  const daysLeft = trialDaysLeft(user!.created_at!);
  const multiGoalsUnlocked = canUseMultipleGoals(user!.created_at!, isPro);
  const canAddGoal = multiGoalsUnlocked || goalList.length === 0;

  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-medium text-ink-900">Your goals</h1>
          {canAddGoal ? (
            <Link href="/goals/new">
              <button className="btn-primary">+ New goal</button>
            </Link>
          ) : (
            <Link href="/settings">
              <button className="btn-secondary">Upgrade for more goals</button>
            </Link>
          )}
        </div>

        {!isPro && (
          <p className="text-sm text-ink-700 mb-6">
            {daysLeft > 0
              ? `Free trial: unlimited goals for ${daysLeft} more day${
                  daysLeft === 1 ? "" : "s"
                }.`
              : "Your free trial has ended — free accounts track 1 goal. Upgrade to Pro for unlimited goals."}
          </p>
        )}

        {goalList.length === 0 ? (
          <div className="bg-white border border-sand-200 rounded-card p-10 text-center mt-4">
            <p className="text-sm text-ink-700 mb-4">
              You don't have a goal yet. Create one to start tracking.
            </p>
            <Link href="/goals/new">
              <button className="btn-primary">Create your first goal</button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            {goalList.map((goal) => (
              <GoalSummaryCard
                key={goal.id}
                goal={goal}
                netSoFar={netFor(goal.id)}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
