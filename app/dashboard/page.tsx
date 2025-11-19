"use client";

import { useAuth } from "@/context/auth-provider";
import { useLanguage } from "@/context/language-provider";
import { getTranslation } from "@/lib/translations";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DashboardCard } from "@/components/dashboard-card";
import { AlertList } from "@/components/alert-list";
import { AIActionModal } from "@/components/ai-action-modal";
import { NutritionCalculatorForm } from "@/components/nutrition-calculator-form";
import { CoachDashboardSection } from "@/components/coach-dashboard-section";
import { MedicDashboardSection } from "@/components/medic-dashboard-section";
import { NutritionistDashboardSection } from "@/components/nutritionist-dashboard-section";
import { mockStorage } from "@/lib/mock-storage";
import { showToast } from "@/lib/toast";
import {
  hasFeatureAccess,
  shouldRedirectToPackages,
  Subscription,
} from "@/lib/subscription-utils";
import {
  Activity,
  Pill,
  Apple,
  Zap,
  TrendingUp,
  AlertCircle,
  Lock,
} from "lucide-react";

type FeatureKey =
  | "calorieCalculator"
  | "dopingRisks"
  | "medicationTracker"
  | "nutritionPlanner"
  | "recoveryGuide"
  | "performanceAnalysis";

export default function DashboardPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [athletes, setAthletes] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<
    | "calories"
    | "doping"
    | "medication"
    | "nutrition"
    | "recovery"
    | "performance"
  >("calories");

  const t = (key: keyof typeof getTranslation.en) =>
    getTranslation(language, key as any);
  const subscription = (user?.subscription || "free") as Subscription;

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedAlerts = mockStorage.getAlerts(user?.id);
        setAlerts(storedAlerts);

        // Mock athletes data
        const storedAthletes = mockStorage.getAthletes();
        if (storedAthletes.length === 0) {
          mockStorage.addAthlete({
            name: "John Athlete",
            age: 25,
            weight: 70,
            height: 175,
            sport: "Running",
            level: "Professional",
            subscriptionTier: "free",
          });
          mockStorage.addAthlete({
            name: "Jane Pro",
            age: 28,
            weight: 65,
            height: 172,
            sport: "Swimming",
            level: "Olympic",
            subscriptionTier: "pro",
          });
          setAthletes(mockStorage.getAthletes());
        } else {
          setAthletes(storedAthletes);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        showToast("Failed to load dashboard data", "error");
      } finally {
        setPageLoading(false);
      }
    };

    if (isAuthenticated && !loading) {
      loadData();
    }
  }, [isAuthenticated, loading, user?.id]);

  const handleActionClick = (
    actionType:
      | "calories"
      | "doping"
      | "medication"
      | "nutrition"
      | "recovery"
      | "performance"
  ) => {
    const featureMap: Record<string, FeatureKey> = {
      calories: "calorieCalculator",
      doping: "dopingRisks",
      medication: "medicationTracker",
      nutrition: "nutritionPlanner",
      recovery: "recoveryGuide",
      performance: "performanceAnalysis",
    };

    const featureKey = featureMap[actionType] as FeatureKey;

    if (shouldRedirectToPackages(subscription, featureKey)) {
      showToast(
        `This feature requires ${
          featureMap[actionType] === "nutritionPlanner" ? "Premium" : "Pro"
        } subscription`,
        "info"
      );
      router.push("/packages");
      return;
    }

    setSelectedAction(actionType);
    setModalOpen(true);
  };

  if (loading || pageLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t("welcome")}, {user?.firstName || user?.email?.split("@")[0]}
          </h1>
          <p className="text-muted-foreground">
            {t("role")}:{" "}
            <span className="font-medium capitalize">{user?.role}</span>
            {subscription !== "free" && (
              <span className="ml-4 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-100">
                {subscription.toUpperCase()}
              </span>
            )}
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title={t("totalAlerts")}
            value={alerts.length}
            description={t("activeNotifications")}
          />
          <DashboardCard
            title={t("totalAthletes")}
            value={athletes.length}
            description={t("registeredAthletes")}
          />
          <DashboardCard
            title={t("pendingSubmissions")}
            value="0"
            description={t("awaitingVerification")}
          />
        </div>

        {/* Athlete Dashboard */}
        {user?.role === "athlete" && (
          <div className="space-y-8">
            {/* AI Actions */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {t("aiActions")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: t("calorieCalculator"),
                    description: t("calculateDailyCalories"),
                    icon: <Apple className="w-8 h-8 text-orange-500" />,
                    color: "bg-orange-50 dark:bg-orange-950",
                    action: "calories" as const,
                    feature: "calorieCalculator" as FeatureKey,
                    requiredTier: "pro",
                  },
                  {
                    title: t("dopingRisks"),
                    description: t("viewDopingRisks"),
                    icon: <AlertCircle className="w-8 h-8 text-red-500" />,
                    color: "bg-red-50 dark:bg-red-950",
                    action: "doping" as const,
                    feature: "dopingRisks" as FeatureKey,
                    requiredTier: "pro",
                  },
                  {
                    title: t("medicationTracker"),
                    description: t("trackMedications"),
                    icon: <Pill className="w-8 h-8 text-blue-500" />,
                    color: "bg-blue-50 dark:bg-blue-950",
                    action: "medication" as const,
                    feature: "medicationTracker" as FeatureKey,
                    requiredTier: "pro",
                  },
                  {
                    title: t("nutritionPlanner"),
                    description: t("getPlanMeals"),
                    icon: <Activity className="w-8 h-8 text-green-500" />,
                    color: "bg-green-50 dark:bg-green-950",
                    action: "nutrition" as const,
                    feature: "nutritionPlanner" as FeatureKey,
                    requiredTier: "premium",
                  },
                  {
                    title: t("recoveryGuide"),
                    description: t("optimizeRecovery"),
                    icon: <Zap className="w-8 h-8 text-yellow-500" />,
                    color: "bg-yellow-50 dark:bg-yellow-950",
                    action: "recovery" as const,
                    feature: "recoveryGuide" as FeatureKey,
                    requiredTier: "premium",
                  },
                  {
                    title: t("performanceAnalysis"),
                    description: t("analyzePerformance"),
                    icon: <TrendingUp className="w-8 h-8 text-purple-500" />,
                    color: "bg-purple-50 dark:bg-purple-950",
                    action: "performance" as const,
                    feature: "performanceAnalysis" as FeatureKey,
                    requiredTier: "premium",
                  },
                ].map((action, idx) => {
                  const hasAccess = hasFeatureAccess(
                    subscription,
                    action.feature
                  );

                  return (
                    <div key={idx} className="relative">
                      <button
                        onClick={() => handleActionClick(action.action)}
                        disabled={!hasAccess}
                        className={`${
                          action.color
                        } border border-border rounded-lg p-6 hover:border-primary transition-all cursor-pointer group w-full h-full ${
                          !hasAccess ? "opacity-60" : ""
                        }`}
                      >
                        <div className="mb-4 group-hover:scale-110 transition-transform">
                          {action.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2 text-left">
                          {action.title}
                        </h3>
                        <p className="text-muted-foreground text-sm text-left">
                          {action.description}
                        </p>
                      </button>

                      {!hasAccess && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 dark:bg-black/30 rounded-lg backdrop-blur-sm">
                          <div className="flex flex-col items-center gap-2">
                            <Lock className="w-8 h-8 text-foreground" />
                            <span className="text-xs font-semibold text-foreground bg-background px-2 py-1 rounded">
                              {action.requiredTier.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Alerts and Nutrition Calculator */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">
                  {t("alertManagement")}
                </h2>
                <AlertList alerts={alerts} />
              </div>

              <div>
                {/* Nutrition Calculator Form */}
                <NutritionCalculatorForm />
              </div>
            </div>
          </div>
        )}

        {/* Coach Dashboard */}
        {user?.role === "coach" && (
          <div className="space-y-8">
            <CoachDashboardSection />
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">
                {t("alertManagement")}
              </h2>
              <AlertList alerts={alerts} />
            </div>
          </div>
        )}

        {/* Medic Dashboard */}
        {user?.role === "medic" && (
          <div className="space-y-8">
            <MedicDashboardSection />
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">
                {t("alertManagement")}
              </h2>
              <AlertList alerts={alerts} />
            </div>
          </div>
        )}

        {/* Nutritionist Dashboard */}
        {user?.role === "nutritionist" && (
          <div className="space-y-8">
            <NutritionistDashboardSection />
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">
                {t("alertManagement")}
              </h2>
              <AlertList alerts={alerts} />
            </div>
          </div>
        )}

        {/* Admin Dashboard */}
        {user?.role === "admin" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">
                  System Overview
                </h2>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-left">
                    Manage Users
                  </button>
                  <button className="w-full px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors text-left">
                    View Reports
                  </button>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">
                  {t("alertManagement")}
                </h2>
                <AlertList alerts={alerts.slice(0, 3)} />
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      <AIActionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        actionType={selectedAction}
        isPro={subscription === "pro" || subscription === "premium"}
      />
    </div>
  );
}
