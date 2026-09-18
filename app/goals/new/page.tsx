import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Nav from "@/components/Nav";
import GoalForm from "@/components/GoalForm";
import { canUseMultipleGoals } from "@/lib/goals";

export default async function NewGoalPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_pro")
    .eq("id", user!.id)
    .maybeSingle();

  const { count } = await supabase
    .from("goals")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id);

  const isPro = profile?.is_pro ?? false;
  const alreadyHasGoal = (count ?? 0) > 0;
  const allowed =
    !alreadyHasGoal || canUseMultipleGoals(user!.created_at!, isPro);

  if (!allowed) {
    redirect("/settings?upgrade=goals");
  }

  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-xl font-medium text-ink-900 mb-4">New goal</h1>
        <GoalForm goal={null} />
      </main>
    </>
  );
}
