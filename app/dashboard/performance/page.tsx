"use client";

import { useAuth } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { api } from "@/lib/api";
import { showToast } from "@/lib/toast";
import {
  TrendingUp,
  Target,
  Zap,
  Activity,
  Award,
  ChevronRight,
} from "lucide-react";

export default function PerformancePage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await api.performance.getLatest();
        setPerformanceData(response.data);
      } catch (error: any) {
        if (error.response?.status !== 404) {
          console.error("Error loading performance data:", error);
          showToast("Failed to load performance data", "error");
        }
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
            Performance Optimization
          </h1>
          <p className="text-muted-foreground">
            Track your progress and optimize your athletic performance
          </p>
        </div>

        {performanceData ? (
          <div className="space-y-6">
            {/* Performance Scores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-2 border-blue-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-8 h-8 text-blue-500" />
                  <h3 className="font-semibold text-foreground">Performance</h3>
                </div>
                <p className="text-4xl font-bold text-foreground">
                  {performanceData.performance_score || 0}/100
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Overall score
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-2 border-green-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-8 h-8 text-green-500" />
                  <h3 className="font-semibold text-foreground">Efficiency</h3>
                </div>
                <p className="text-4xl font-bold text-foreground">
                  {performanceData.efficiency_score || 0}/100
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Energy efficiency
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-2 border-purple-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-8 h-8 text-purple-500" />
                  <h3 className="font-semibold text-foreground">Technique</h3>
                </div>
                <p className="text-4xl font-bold text-foreground">
                  {performanceData.technique_score || 0}/10
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Form quality
                </p>
              </div>
            </div>

            {/* Performance Trend */}
            <div className="bg-card border-2 border-border rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Performance Trend
                </h2>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    performanceData.performance_trend === "improving"
                      ? "bg-green-100 text-green-700 dark:bg-green-950"
                      : performanceData.performance_trend === "stable"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-950"
                      : "bg-orange-100 text-orange-700 dark:bg-orange-950"
                  }`}
                >
                  {performanceData.performance_trend === "improving"
                    ? "📈 Improving"
                    : performanceData.performance_trend === "stable"
                    ? "➡️ Stable"
                    : "📉 Declining"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    Improvement Potential
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-muted rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all"
                        style={{
                          width: `${
                            performanceData.improvement_potential_percentage ||
                            0
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-lg font-bold text-foreground">
                      {performanceData.improvement_potential_percentage || 0}%
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    Energy Efficiency
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-muted rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all"
                        style={{
                          width: `${
                            (performanceData.energy_efficiency_score || 0) * 10
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-lg font-bold text-foreground">
                      {performanceData.energy_efficiency_score || 0}/10
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Race Predictions */}
            {performanceData.predicted_race_time && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Race Time Predictions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(performanceData.predicted_race_time).map(
                    ([distance, time]: any) => (
                      <div
                        key={distance}
                        className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <p className="text-sm text-muted-foreground mb-1">
                          {distance}
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                          {time}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {performanceData.strength_training_recommendations && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Target className="w-6 h-6 text-primary" />
                    Strength Training
                  </h3>
                  <ul className="space-y-3">
                    {performanceData.strength_training_recommendations.map(
                      (rec: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{rec}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {performanceData.technique_corrections && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Activity className="w-6 h-6 text-primary" />
                    Technique Corrections
                  </h3>
                  <ul className="space-y-3">
                    {performanceData.technique_corrections.map(
                      (correction: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">
                            {correction}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Performance Data Yet
            </h3>
            <p className="text-muted-foreground">
              Complete training sessions and assessments to see your performance
              analysis.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
