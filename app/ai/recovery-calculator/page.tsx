"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Zap, Moon, Droplets, Activity, Clock, Heart } from "lucide-react";

export default function RecoveryCalculatorPage() {
  const [formData, setFormData] = useState({
    workoutIntensity: "moderate",
    workoutDuration: "",
    sleepQuality: "good",
    stressLevel: "moderate",
    hydration: "adequate",
    lastWorkoutHours: "",
  });
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const calculateRecovery = () => {
    setLoading(true);
    setTimeout(() => {
      const intensityScores: Record<string, number> = {
        low: 1,
        moderate: 2,
        high: 3,
        veryHigh: 4,
      };

      const sleepScores: Record<string, number> = {
        poor: 0.5,
        fair: 0.75,
        good: 1,
        excellent: 1.25,
      };

      const stressScores: Record<string, number> = {
        low: 1,
        moderate: 0.85,
        high: 0.7,
      };

      const baseRecoveryTime =
        Number.parseFloat(formData.workoutDuration) *
        intensityScores[formData.workoutIntensity];
      const adjustedRecovery =
        baseRecoveryTime /
        (sleepScores[formData.sleepQuality] *
          stressScores[formData.stressLevel]);

      const hoursElapsed = Number.parseFloat(formData.lastWorkoutHours);
      const recoveryPercentage = Math.min(
        100,
        Math.round((hoursElapsed / adjustedRecovery) * 100)
      );

      setResults({
        recoveryTime: Math.round(adjustedRecovery),
        currentRecovery: recoveryPercentage,
        readyForWorkout: recoveryPercentage >= 80,
        recommendations: generateRecommendations(formData, recoveryPercentage),
      });
      setLoading(false);
    }, 800);
  };

  const generateRecommendations = (data: any, recovery: number) => {
    const recommendations = [];

    if (data.sleepQuality === "poor" || data.sleepQuality === "fair") {
      recommendations.push(
        "Prioritize 7-9 hours of quality sleep tonight for optimal recovery"
      );
    }

    if (data.hydration !== "excellent") {
      recommendations.push(
        "Increase water intake to 3-4 liters per day to support recovery processes"
      );
    }

    if (data.stressLevel === "high") {
      recommendations.push(
        "Practice stress-reduction techniques like meditation or yoga"
      );
    }

    if (recovery < 80) {
      recommendations.push(
        "Consider a light active recovery session instead of intense training"
      );
    }

    recommendations.push(
      "Consume 20-30g of protein within 2 hours post-workout"
    );
    recommendations.push(
      "Consider ice baths or contrast therapy for enhanced recovery"
    );

    return recommendations;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-10 h-10 text-yellow-500" />
            <h1 className="text-4xl font-bold text-foreground">
              AI Recovery Guide
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Optimize your recovery with AI-powered insights based on your
            workout intensity, sleep quality, and stress levels.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Recovery Assessment
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Workout Intensity
                </label>
                <select
                  value={formData.workoutIntensity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      workoutIntensity: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="low">Low (Walking, Stretching)</option>
                  <option value="moderate">
                    Moderate (Jogging, Light Weights)
                  </option>
                  <option value="high">High (Running, Heavy Weights)</option>
                  <option value="veryHigh">
                    Very High (HIIT, Competition)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Workout Duration (minutes)
                </label>
                <input
                  type="number"
                  value={formData.workoutDuration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      workoutDuration: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                  placeholder="60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Sleep Quality Last Night
                </label>
                <select
                  value={formData.sleepQuality}
                  onChange={(e) =>
                    setFormData({ ...formData, sleepQuality: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="poor">Poor (Less than 5 hours)</option>
                  <option value="fair">Fair (5-6 hours)</option>
                  <option value="good">Good (7-8 hours)</option>
                  <option value="excellent">Excellent (8+ hours)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Current Stress Level
                </label>
                <select
                  value={formData.stressLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, stressLevel: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Hydration Status
                </label>
                <select
                  value={formData.hydration}
                  onChange={(e) =>
                    setFormData({ ...formData, hydration: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="poor">Poor (Less than 2L/day)</option>
                  <option value="adequate">Adequate (2-3L/day)</option>
                  <option value="excellent">Excellent (3-4L/day)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Hours Since Last Workout
                </label>
                <input
                  type="number"
                  value={formData.lastWorkoutHours}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lastWorkoutHours: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                  placeholder="24"
                />
              </div>

              <button
                onClick={calculateRecovery}
                disabled={
                  loading ||
                  !formData.workoutDuration ||
                  !formData.lastWorkoutHours
                }
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity font-semibold"
              >
                {loading ? "Analyzing..." : "Analyze Recovery with AI"}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {results ? (
              <>
                <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Heart className="w-6 h-6 text-yellow-600" />
                    Recovery Status
                  </h3>
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Recovery Progress
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        {results.currentRecovery}%
                      </span>
                    </div>
                    <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          results.currentRecovery >= 80
                            ? "bg-green-500"
                            : results.currentRecovery >= 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${results.currentRecovery}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Estimated Full Recovery
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {results.recoveryTime}h
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Training Status
                      </p>
                      <p
                        className={`text-xl font-bold ${
                          results.readyForWorkout
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {results.readyForWorkout ? "Ready" : "Rest"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Moon className="w-5 h-5" />
                    Recovery Recommendations
                  </h3>
                  <ul className="space-y-3">
                    {results.recommendations.map((rec: string, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-muted rounded-lg"
                      >
                        <span className="w-6 h-6 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-sm font-bold flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-foreground text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4">
                    Recovery Roadmap
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          0-6 Hours Post-Workout
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Nutrition focus: Protein & carbs replenishment
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                        <Moon className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          6-24 Hours
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Sleep optimization: 7-9 hours quality sleep
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                        <Activity className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          24-48 Hours
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Active recovery: Light movement & stretching
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-950 flex items-center justify-center">
                        <Droplets className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Ongoing</p>
                        <p className="text-sm text-muted-foreground">
                          Hydration: 3-4L water daily
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <Zap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Fill in your recovery information to get AI-powered analysis
                  and personalized recommendations.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
