"use client";

import { useAuth } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { api } from "@/lib/api";
import { showToast } from "@/lib/toast";
import { Activity, TrendingUp, AlertTriangle, Zap } from "lucide-react";

export default function BiomechanicsPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [biomechanicsData, setBiomechanicsData] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [latestData, setLatestData] = useState<any>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await api.biomechanics.getAll();
        const data = response.data.biomechanics || [];
        setBiomechanicsData(data);
        if (data.length > 0) {
          setLatestData(data[0]);
        }
      } catch (error) {
        console.error("Error loading biomechanics data:", error);
        showToast("Failed to load biomechanics data", "error");
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
            Biomechanics Analysis
          </h1>
          <p className="text-muted-foreground">
            Track your movement patterns, gait cycle, and form quality
          </p>
        </div>

        {latestData ? (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-2 border-blue-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-8 h-8 text-blue-500" />
                  <h3 className="font-semibold text-foreground">
                    Stride Length
                  </h3>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {latestData.stride_length || "N/A"}m
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Average stride
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-2 border-green-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-8 h-8 text-green-500" />
                  <h3 className="font-semibold text-foreground">Cadence</h3>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {latestData.cadence || "N/A"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Steps per minute
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-2 border-orange-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                  <h3 className="font-semibold text-foreground">Form Score</h3>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {latestData.form_quality_score || "N/A"}/10
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Quality rating
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-2 border-red-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                  <h3 className="font-semibold text-foreground">
                    Impact Force
                  </h3>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {latestData.impact_force || "N/A"}N
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Ground force
                </p>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="bg-card border-2 border-border rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Latest Analysis
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Gait Analysis
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Foot Strike:
                        </span>
                        <span className="font-medium text-foreground capitalize">
                          {latestData.foot_strike_pattern || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Pronation:
                        </span>
                        <span className="font-medium text-foreground capitalize">
                          {latestData.pronation_type || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Ground Contact:
                        </span>
                        <span className="font-medium text-foreground">
                          {latestData.ground_contact_time || "N/A"}ms
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Vertical Oscillation:
                        </span>
                        <span className="font-medium text-foreground">
                          {latestData.vertical_oscillation || "N/A"}cm
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Joint Load
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Ankle Load:
                        </span>
                        <span className="font-medium text-foreground">
                          {latestData.ankle_load || "N/A"}N
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Knee Load:
                        </span>
                        <span className="font-medium text-foreground">
                          {latestData.knee_load || "N/A"}N
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Hip Load:</span>
                        <span className="font-medium text-foreground">
                          {latestData.hip_load || "N/A"}N
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Asymmetry:
                        </span>
                        <span className="font-medium text-foreground">
                          {latestData.asymmetry_percentage || "N/A"}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {latestData.notes && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground">
                    {latestData.notes}
                  </p>
                </div>
              )}
            </div>

            {/* History */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Recent Sessions
              </h2>
              <div className="space-y-4">
                {biomechanicsData.slice(0, 5).map((session: any) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {session.activity_type || "Training Session"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.recorded_at).toLocaleDateString()} -{" "}
                        {session.distance_km}km
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        Form: {session.form_quality_score}/10
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.duration_minutes}min
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Biomechanics Data Yet
            </h3>
            <p className="text-muted-foreground">
              Connect your wearable device or smart shoes to start tracking your
              biomechanics data.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
