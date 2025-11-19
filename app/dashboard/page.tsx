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
import { api } from "@/lib/api";
import { showToast } from "@/lib/toast";
import {
  Activity,
  Pill,
  Apple,
  Zap,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

export default function DashboardPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [athletes, setAthletes] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  const t = (key: keyof typeof getTranslation.en) =>
    getTranslation(language, key as any);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [alertsRes, athletesRes] = await Promise.all([
          api.alerts.getAll(),
          api.athletes.getAll(),
        ]);
        setAlerts(alertsRes.data.alerts || []);
        setAthletes(athletesRes.data.athletes || []);
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
  }, [isAuthenticated, loading]);

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

        {/* Athlete Dashboard with AI Actions */}
        {user?.role === "athlete" && (
          <div className="space-y-8">
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
                  },
                  {
                    title: t("dopingRisks"),
                    description: t("viewDopingRisks"),
                    icon: <AlertCircle className="w-8 h-8 text-red-500" />,
                    color: "bg-red-50 dark:bg-red-950",
                  },
                  {
                    title: t("medicationTracker"),
                    description: t("trackMedications"),
                    icon: <Pill className="w-8 h-8 text-blue-500" />,
                    color: "bg-blue-50 dark:bg-blue-950",
                  },
                  {
                    title: t("nutritionPlanner"),
                    description: t("getPlanMeals"),
                    icon: <Activity className="w-8 h-8 text-green-500" />,
                    color: "bg-green-50 dark:bg-green-950",
                  },
                  {
                    title: t("recoveryGuide"),
                    description: t("optimizeRecovery"),
                    icon: <Zap className="w-8 h-8 text-yellow-500" />,
                    color: "bg-yellow-50 dark:bg-yellow-950",
                  },
                  {
                    title: t("performanceAnalysis"),
                    description: t("analyzePerformance"),
                    icon: <TrendingUp className="w-8 h-8 text-purple-500" />,
                    color: "bg-purple-50 dark:bg-purple-950",
                  },
                ].map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      showToast(`Opening ${action.title}...`, "info")
                    }
                    className={`${action.color} border border-border rounded-lg p-6 hover:border-primary transition-all cursor-pointer group`}
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
                ))}
              </div>
            </div>

            {/* Athlete Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">
                  {t("dashboard")}
                </h2>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-left">
                    {t("startFreeTrial")}
                  </button>
                  <button className="w-full px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors text-left">
                    {t("viewDopingRisks")}
                  </button>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">
                  {t("dashboard")}
                </h2>
                <AlertList alerts={alerts} />
              </div>
            </div>
          </div>
        )}

        {/* Admin Dashboard */}
        {user?.role === "admin" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">
                  {t("dashboard")}
                </h2>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-left">
                    {t("startFreeTrial")}
                  </button>
                  <button className="w-full px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors text-left">
                    {t("athletes")}
                  </button>
                  <button className="w-full px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors text-left">
                    {t("verifications")}
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

        {/* Coach Dashboard */}
        {user?.role === "coach" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">
                  {t("dashboard")}
                </h2>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors text-left">
                    {t("athletes")}
                  </button>
                  <button className="w-full px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors text-left">
                    {t("whereabouts")}
                  </button>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">
                  {t("alertManagement")}
                </h2>
                <AlertList alerts={alerts} />
              </div>
            </div>
          </div>
        )}

        {/* Medical Staff Dashboard */}
        {user?.role === "medic" && (
          <div className="space-y-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">
                {t("alertManagement")}
              </h2>
              <AlertList alerts={alerts.filter((a) => a.type === "medical")} />
            </div>
          </div>
        )}

        {/* Nutritionist Dashboard */}
        {user?.role === "nutritionist" && (
          <div className="space-y-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">
                {t("nutritionPlanner")}
              </h2>
              <p className="text-muted-foreground">
                {t("awaitingVerification")}
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
