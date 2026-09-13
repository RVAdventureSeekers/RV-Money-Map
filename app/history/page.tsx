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
    .select("id, entry_type, label, amount, entry_date")
    .eq("user_id", user!.id)
    .order("entry_date", { ascending: false });

  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-xl font-medium text-ink-900 mb-4">History</h1>
        <HistoryList entries={entries ?? []} isPro={profile?.is_pro ?? false} />
      </main>
    </>
  );
}
