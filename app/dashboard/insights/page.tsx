"use client";

import { useAuth } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { api } from "@/lib/api";
import { showToast } from "@/lib/toast";
import {
  Brain,
  TrendingUp,
  Heart,
  AlertTriangle,
  CheckCircle,
  Target,
} from "lucide-react";

export default function InsightsPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [insightsData, setInsightsData] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await api.behavioral.getLatest();
        setInsightsData(response.data);
      } catch (error: any) {
        if (error.response?.status !== 404) {
          console.error("Error loading insights:", error);
          showToast("Failed to load insights", "error");
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
            Behavioral Insights
          </h1>
          <p className="text-muted-foreground">
            Understand your training patterns and psychological wellbeing
          </p>
        </div>

        {insightsData ? (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-2 border-purple-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Brain className="w-8 h-8 text-purple-500" />
                  <h3 className="font-semibold text-foreground">Motivation</h3>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {insightsData.motivation_score || 0}/10
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Current level
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-2 border-green-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <h3 className="font-semibold text-foreground">Consistency</h3>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {insightsData.training_consistency_percentage || 0}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Training adherence
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-2 border-blue-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-8 h-8 text-blue-500" />
                  <h3 className="font-semibold text-foreground">
                    Goal Adherence
                  </h3>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {insightsData.goal_adherence_percentage || 0}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">On track</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-2 border-orange-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="w-8 h-8 text-orange-500" />
                  <h3 className="font-semibold text-foreground">
                    Stress Level
                  </h3>
                </div>
                <p className="text-2xl font-bold text-foreground capitalize">
                  {insightsData.stress_level || "N/A"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Current state
                </p>
              </div>
            </div>

            {/* Mental Wellbeing */}
            <div className="bg-card border-2 border-border rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Mental Wellbeing
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    Competition Anxiety
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-muted rounded-full h-4">
                      <div
                        className={`h-4 rounded-full transition-all ${
                          (insightsData.competition_anxiety_score || 0) > 7
                            ? "bg-red-500"
                            : (insightsData.competition_anxiety_score || 0) > 4
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${
                            (insightsData.competition_anxiety_score || 0) * 10
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-lg font-bold text-foreground">
                      {insightsData.competition_anxiety_score || 0}/10
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    Burnout Risk
                  </h3>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold flex-1 text-center ${
                        insightsData.burnout_risk === "high"
                          ? "bg-red-100 text-red-700 dark:bg-red-950"
                          : insightsData.burnout_risk === "moderate"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950"
                          : "bg-green-100 text-green-700 dark:bg-green-950"
                      }`}
                    >
                      {insightsData.burnout_risk === "high"
                        ? "⚠️ High Risk"
                        : insightsData.burnout_risk === "moderate"
                        ? "⚡ Moderate Risk"
                        : "✅ Low Risk"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Training Patterns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {insightsData.positive_patterns &&
                insightsData.positive_patterns.length > 0 && (
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      Positive Patterns
                    </h3>
                    <ul className="space-y-3">
                      {insightsData.positive_patterns.map(
                        (pattern: string, idx: number) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg"
                          >
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-foreground">
                              {pattern}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

              {insightsData.risky_behaviors &&
                insightsData.risky_behaviors.length > 0 && (
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-6 h-6 text-orange-500" />
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-3">
                      {insightsData.risky_behaviors.map(
                        (behavior: string, idx: number) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 p-3 bg-orange-500/10 rounded-lg"
                          >
                            <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-foreground">
                              {behavior}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
            </div>

            {/* Recommendations */}
            {insightsData.psychological_support_recommendations &&
              insightsData.psychological_support_recommendations.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Recommendations
                  </h2>
                  <div className="space-y-3">
                    {insightsData.psychological_support_recommendations.map(
                      (rec: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-4 bg-primary/10 rounded-lg"
                        >
                          <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{rec}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Training Stats */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Training Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Period</p>
                  <p className="text-lg font-semibold text-foreground">
                    {insightsData.period_start &&
                      new Date(
                        insightsData.period_start
                      ).toLocaleDateString()}{" "}
                    -{" "}
                    {insightsData.period_end &&
                      new Date(insightsData.period_end).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    Missed Sessions
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {insightsData.missed_sessions_count || 0}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    Communication
                  </p>
                  <p className="text-lg font-semibold text-foreground capitalize">
                    {insightsData.communication_frequency || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Insights Available Yet
            </h3>
            <p className="text-muted-foreground">
              Continue training and logging your sessions to receive behavioral
              insights.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
