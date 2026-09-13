import { createClient } from "@/lib/supabase/server";
import Nav from "@/components/Nav";
import GoalForm from "@/components/GoalForm";
import SubscriptionCard from "@/components/SubscriptionCard";

export default async function SettingsPage() {
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_pro")
    .eq("id", user!.id)
    .maybeSingle();

  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-xl font-medium text-ink-900 mb-4">
            Your goal
          </h1>
          <GoalForm goal={goal ?? null} />
        </div>

        <div>
          <h2 className="text-lg font-medium text-ink-900 mb-4">Billing</h2>
          <SubscriptionCard isPro={profile?.is_pro ?? false} />
        </div>
      </main>
    </>
  );
}
