# RV Money Map

A web-based subscription app for tracking debt-payoff progress against gig
income (gate guarding, workamping, etc.) on the road. Built with Next.js,
Supabase (auth + database), and Stripe (subscriptions).

This app is entirely yours to host — there's no platform fee beyond what
Supabase, Vercel, and Stripe charge you directly (all have free tiers to
start).

## What you're getting

- Email/password accounts
- A debt-payoff goal with a day-by-day countdown
- Daily income/expense logging
- A shareable progress image (generated in-browser, no extra service needed)
- A $4/month "Pro" subscription via Stripe, gating CSV export (easy to gate
  more features the same way — see "Adding more Pro features" below)

## One-time setup (about 30-45 minutes)



Project ID
afvwfzvkfoexpnitqxql

API URL
https://afvwfzvkfoexpnitqxql.supabase.co/rest/v1/

API KEY Publishable


API KEY Secret Key




### 1. Create a Supabase project
1. Go to [supabase.com](https://supabase.com) and create a free account and
   new project.
2. In your project, go to **SQL Editor > New query**, paste in the entire
   contents of `supabase/schema.sql`, and click **Run**. This creates your
   tables and security rules.
3. Go to **Settings > API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key (click "Reveal") → `SUPABASE_SERVICE_ROLE_KEY`
     (keep this one secret — never put it in client-side code)
4. Go to **Authentication > Providers** and confirm Email is enabled
   (it is by default). Under **Authentication > URL Configuration**, you'll
   add your live site URL once you've deployed (step 4 below).

### 2. Create a Stripe product
1. Go to [stripe.com](https://stripe.com) and create an account.
2. Go to **Product catalog > Add product**. Name it "RV Money Map Pro",
   set it to recurring, $4.00/month (or whatever you choose).
3. Copy the **Price ID** (starts with `price_...`) → `STRIPE_PRICE_ID`.
4. Go to **Developers > API keys** and copy the **Secret key**
   → `STRIPE_SECRET_KEY`. Start in test mode — you can switch to live mode
   later without changing any code.
5. You'll set up the webhook secret in step 4, after deploying, because
   Stripe needs your live URL first.


Product ID
prod_VFbp2wlumszeuv

Price ID
"price_1UF6bzBsxAqYLJ7sDd8IhoqO"
,



Secret Key



Publishable Key




### 3. Push this code to GitHub
1. Create a new, empty repository on GitHub.
2. From this project's folder, run:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

### 4. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com), sign up, and click
   **Add New > Project**, then import your GitHub repo.
2. Before deploying, add your environment variables (from `.env.example`)
   in the Vercel project settings — all of them except
   `NEXT_PUBLIC_SITE_URL` and `STRIPE_WEBHOOK_SECRET` for now.
3. Deploy. Vercel gives you a live URL like `your-app.vercel.app`.
4. Set `NEXT_PUBLIC_SITE_URL` in Vercel's environment variables to that
   live URL, then redeploy (Vercel > Deployments > ⋯ > Redeploy).
5. In Supabase, go to **Authentication > URL Configuration** and set your
   Site URL to the same live URL, so signup/login redirects work correctly.

### 5. Connect the Stripe webhook
1. In Stripe, go to **Developers > Webhooks > Add endpoint**.
2. Endpoint URL: `https://your-app.vercel.app/api/stripe/webhook`
3. Select these events: `checkout.session.completed`,
   `customer.subscription.updated`, `customer.subscription.deleted`.
4. Copy the **Signing secret** (starts with `whsec_...`) into Vercel's
   environment variables as `STRIPE_WEBHOOK_SECRET`, then redeploy.

### 6. Test it
1. Visit your live URL, sign up, create a goal, log a few entries.
2. On the Settings page, click **Upgrade to Pro** — Stripe's test mode lets
   you use card number `4242 4242 4242 4242` with any future expiry/CVC.
3. Confirm the Settings page now shows "Pro" and CSV export unlocks on the
   History page.
4. When you're ready for real customers, switch your Stripe API keys from
   test mode to live mode in Vercel's environment variables and redeploy.

## Running it locally (optional, for making changes)

```
npm install
cp .env.example .env.local   # then fill in your values
npm run dev
```

Visit `http://localhost:3000`.

## Adding more Pro features

The pattern used for CSV export works for anything else you want to gate:
check `profile.is_pro` (already fetched in `app/history/page.tsx` and
`app/settings/page.tsx`) and conditionally render the feature. For example,
to allow multiple goals for Pro users only, you'd remove the "one goal"
limit in `app/settings/page.tsx` and let Pro users create additional rows
in the `goals` table.

## Support

This is your codebase now — if something needs changing (new fields, a
different price, a redesigned dashboard), just describe the change and it
can be made directly in these files.




