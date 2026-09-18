import { createClient } from "@/lib/supabase/server";
import Nav from "@/components/Nav";
import HistoryList from "@/components/HistoryList";

export default async function HistoryPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_pro")
    .eq("id", user!.id)
    .maybeSingle();

  const { data: entries } = await supabase
    .from("entries")
    .select("id, entry_type, label, amount, entry_date, goal_id, goals(name)")
    .eq("user_id", user!.id)
    .order("entry_date", { ascending: false });

  const formattedEntries = (entries ?? []).map((e: any) => ({
    id: e.id,
    entry_type: e.entry_type,
    label: e.label,
    amount: e.amount,
    entry_date: e.entry_date,
    goalName: e.goals?.name ?? null,
  }));

  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-xl font-medium text-ink-900 mb-4">History</h1>
        <HistoryList entries={formattedEntries} isPro={profile?.is_pro ?? false} />
      </main>
    </>
  );
}
