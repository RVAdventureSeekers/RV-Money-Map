import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Nav from "@/components/Nav";
import GoalForm from "@/components/GoalForm";

export default async function EditGoalPage({
  params,
}: {
  params: { goalId: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: goal } = await supabase
    .from("goals")
    .select("*")
    .eq("id", params.goalId)
    .eq("user_id", user!.id)
    .maybeSingle();

  if (!goal) {
    notFound();
  }

  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-xl font-medium text-ink-900 mb-4">Edit goal</h1>
        <GoalForm goal={goal} />
      </main>
    </>
  );
}
