"use client";

import { useAuth } from "@/context/auth-provider";
import { useLanguage } from "@/context/language-provider";
import { getTranslation } from "@/lib/translations";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getPlansByRole } from "@/lib/subscription-plans";
import { Check } from "lucide-react";

export default function PackagesPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);

  const t = (key: keyof typeof getTranslation.en) =>
    getTranslation(language, key as any);

  useEffect(() => {
    if (!loading) {
      setPageLoading(false);
    }
  }, [loading]);

  const plans = isAuthenticated && user ? getPlansByRole(user.role) : [];
  const currentSubscription = user?.subscription || "free";

  const handleSelectPlan = (planId: string) => {
    router.push(`/checkout?plan=${planId}`);
  };

  if (pageLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-foreground">Loading plans...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground">
            Unlock powerful features tailored for {user?.role}s
          </p>
        </div>

        {!isAuthenticated ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-foreground mb-4">
              Please log in to view subscription plans
            </p>
            <button
              onClick={() => router.push("/login")}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Sign In
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const isCurrentPlan =
                plan.name.toLowerCase() === currentSubscription.toLowerCase();
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-lg border transition-all ${
                    plan.highlighted
                      ? "border-primary bg-primary/5 ring-2 ring-primary ring-offset-2 ring-offset-background scale-105"
                      : "border-border"
                  } overflow-hidden`}
                >
                  {plan.highlighted && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold">
                      Most Popular
                    </div>
                  )}

                  <div className="p-8 space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-foreground">
                          Ksh.{plan.price}
                        </span>
                        <span className="text-muted-foreground">
                          {plan.period}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-foreground text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSelectPlan(plan.id)}
                      disabled={isCurrentPlan}
                      className={`w-full py-3 rounded-lg font-semibold transition-all ${
                        isCurrentPlan
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : plan.highlighted
                          ? "bg-primary text-primary-foreground hover:opacity-90"
                          : "border border-border text-foreground hover:bg-muted"
                      }`}
                    >
                      {isCurrentPlan ? "Current Plan" : t("selectPlan")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
