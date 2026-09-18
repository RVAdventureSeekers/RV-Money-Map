// Free accounts get a 7-day trial of unlimited goals from the moment they
// sign up. After that, free accounts are limited to 1 goal; Pro accounts
// always have unlimited goals.
export const TRIAL_DAYS = 7;

export function trialDaysLeft(userCreatedAt: string): number {
  const created = new Date(userCreatedAt).getTime();
  const elapsedDays = (Date.now() - created) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.ceil(TRIAL_DAYS - elapsedDays));
}

export function isInTrial(userCreatedAt: string): boolean {
  return trialDaysLeft(userCreatedAt) > 0;
}

export function canUseMultipleGoals(
  userCreatedAt: string,
  isPro: boolean
): boolean {
  return isPro || isInTrial(userCreatedAt);
}
