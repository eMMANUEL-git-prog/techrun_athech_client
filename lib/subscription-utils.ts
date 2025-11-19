export type Subscription = "free" | "pro" | "premium";

export const proFeatures = {
  calorieCalculator: ["pro", "premium"] as Subscription[],
  dopingRisks: ["pro", "premium"],
  medicationTracker: ["pro", "premium"],
  nutritionPlanner: ["premium"],
  recoveryGuide: ["premium"],
  performanceAnalysis: ["premium"],
};

export const requiresSubscription = (
  feature: keyof typeof proFeatures
): boolean => {
  return proFeatures[feature].length > 0;
};

export const hasFeatureAccess = (
  currentSubscription: Subscription,
  feature: keyof typeof proFeatures
): boolean => {
  return proFeatures[feature].includes(currentSubscription);
};

export const shouldRedirectToPackages = (
  subscription: Subscription,
  feature: keyof typeof proFeatures
): boolean => {
  return !hasFeatureAccess(subscription, feature);
};
