import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="max-w-5xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <span className="font-medium text-ink-900">RV Money Map</span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-ink-700 hover:text-ink-900">
            Log in
          </Link>
          <Link href="/signup">
            <button className="btn-primary">Start tracking</button>
          </Link>
        </div>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-20 text-center">
        <p className="text-sm text-route-600 font-medium mb-4">
          For full-time RVers with gig income
        </p>
        <h1 className="text-4xl md:text-5xl font-medium text-ink-900 leading-tight mb-6">
          Watch your debt shrink,
          <br />
          one day on the road at a time.
        </h1>
        <p className="text-lg text-ink-700 mb-10 max-w-xl mx-auto">
          Log workamping, gate guarding, and seasonal income against your
          expenses. See exactly how many days are left until you're
          debt-free — and share the progress with your followers.
        </p>
        <Link href="/signup">
          <button className="btn-primary text-base px-6 py-3">
            Create your free account
          </button>
        </Link>
        <p className="text-sm text-ink-700 mt-4">
          Free to start. Upgrade any time for $4/month.
        </p>
      </div>
    </main>
  );
}
