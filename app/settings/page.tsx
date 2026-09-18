import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Nav from "@/components/Nav";
import SubscriptionCard from "@/components/SubscriptionCard";
import { trialDaysLeft } from "@/lib/goals";

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_pro")
    .eq("id", user!.id)
    .maybeSingle();

  const isPro = profile?.is_pro ?? false;
  const daysLeft = trialDaysLeft(user!.created_at!);

  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h2 className="text-lg font-medium text-ink-900 mb-4">Goals</h2>
          <div className="bg-white border border-sand-200 rounded-card p-5 flex items-center justify-between">
            <p className="text-sm text-ink-700">
              Create, edit, and track your goals from the dashboard.
            </p>
            <Link href="/dashboard">
              <button className="btn-secondary">Go to goals</button>
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium text-ink-900 mb-4">Billing</h2>
          <SubscriptionCard isPro={isPro} trialDaysLeft={daysLeft} />
        </div>
      </main>
    </>
  );
}
