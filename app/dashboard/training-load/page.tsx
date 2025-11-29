"use client";

import { useAuth } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { api } from "@/lib/api";
import { showToast } from "@/lib/toast";
import {
  Activity,
  Heart,
  Moon,
  Droplet,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

export default function TrainingLoadPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [trainingLoadData, setTrainingLoadData] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await api.trainingLoad.getAll();
        setTrainingLoadData(response.data.trainingLoad || []);
      } catch (error) {
        console.error("Error loading training load:", error);
        showToast("Failed to load training load", "error");
      } finally {
        setPageLoading(false);
      }
    };

    if (isAuthenticated && !loading) {
      loadData();
    }
  }, [isAuthenticated, loading]);

  const latestWeek = trainingLoadData[0];

  if (loading || pageLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Training Load & Recovery
          </h1>
          <p className="text-muted-foreground">
            Monitor your training intensity and recovery status
          </p>
        </div>

        {latestWeek ? (
          <div className="space-y-6">
            {/* Overtraining Risk Alert */}
            {latestWeek.overtraining_risk === "high" ||
            latestWeek.overtraining_risk === "critical" ? (
              <div className="bg-red-500/10 border-2 border-red-500 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-red-600 dark:text-red-400">
                      Overtraining Risk: {latestWeek.overtraining_risk}
                    </h3>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      Your training load is too high. Consider reducing
                      intensity and increasing recovery time.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-2 border-blue-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-8 h-8 text-blue-500" />
                  <h3 className="font-semibold text-foreground">Weekly Load</h3>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {latestWeek.weekly_training_load || 0}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Arbitrary units
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-2 border-purple-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                  <h3 className="font-semibold text-foreground">AC Ratio</h3>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {latestWeek.acute_chronic_ratio || 0}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Acute/Chronic
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-2 border-green-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="w-8 h-8 text-green-500" />
                  <h3 className="font-semibold text-foreground">Recovery</h3>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {latestWeek.recovery_score || 0}/10
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Recovery score
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-2 border-orange-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <AlertCircle className="w-8 h-8 text-orange-500" />
                  <h3 className="font-semibold text-foreground">Fatigue</h3>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {latestWeek.cumulative_fatigue_score || 0}/10
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Fatigue level
                </p>
              </div>
            </div>

            {/* Physiological Data */}
            <div className="bg-card border-2 border-border rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Physiological Metrics
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Heart className="w-6 h-6 text-red-500" />
                      <span className="font-medium text-foreground">
                        Heart Rate Variability
                      </span>
                    </div>
                    <span className="text-lg font-bold text-foreground">
                      {latestWeek.avg_hrv || 0} ms
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Heart className="w-6 h-6 text-pink-500" />
                      <span className="font-medium text-foreground">
                        Resting Heart Rate
                      </span>
                    </div>
                    <span className="text-lg font-bold text-foreground">
                      {latestWeek.resting_hr || 0} bpm
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Activity className="w-6 h-6 text-orange-500" />
                      <span className="font-medium text-foreground">
                        Energy Expenditure
                      </span>
                    </div>
                    <span className="text-lg font-bold text-foreground">
                      {latestWeek.energy_expenditure || 0} kcal
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Moon className="w-6 h-6 text-indigo-500" />
                      <span className="font-medium text-foreground">
                        Sleep Duration
                      </span>
                    </div>
                    <span className="text-lg font-bold text-foreground">
                      {latestWeek.avg_sleep_hours || 0}h
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Moon className="w-6 h-6 text-purple-500" />
                      <span className="font-medium text-foreground">
                        Sleep Quality
                      </span>
                    </div>
                    <span className="text-lg font-bold text-foreground">
                      {latestWeek.sleep_quality_score || 0}/10
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Droplet className="w-6 h-6 text-blue-500" />
                      <span className="font-medium text-foreground">
                        Hydration Level
                      </span>
                    </div>
                    <span className="text-lg font-bold text-foreground capitalize">
                      {latestWeek.hydration_level || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Trend */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Recent Weeks
              </h2>
              <div className="space-y-3">
                {trainingLoadData.slice(0, 8).map((week: any) => (
                  <div
                    key={week.id}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        Week of{" "}
                        {new Date(week.week_start_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Load: {week.weekly_training_load} • AC Ratio:{" "}
                        {week.acute_chronic_ratio}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        week.overtraining_risk === "critical"
                          ? "bg-red-100 text-red-700 dark:bg-red-950"
                          : week.overtraining_risk === "high"
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-950"
                          : week.overtraining_risk === "moderate"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950"
                          : "bg-green-100 text-green-700 dark:bg-green-950"
                      }`}
                    >
                      {week.overtraining_risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Training Load Data Yet
            </h3>
            <p className="text-muted-foreground">
              Start logging your training sessions to see your weekly load and
              recovery metrics.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
