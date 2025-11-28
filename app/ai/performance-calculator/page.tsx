"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { TrendingUp, Target, Award, BarChart3, Zap } from "lucide-react";

export default function PerformanceCalculatorPage() {
  const [formData, setFormData] = useState({
    sport: "running",
    currentPerformance: "",
    trainingHours: "",
    experience: "intermediate",
    age: "",
    goal: "improve",
  });
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const calculatePerformance = () => {
    setLoading(true);
    setTimeout(() => {
      const currentPerf = Number.parseFloat(formData.currentPerformance);
      const trainingHours = Number.parseFloat(formData.trainingHours);
      const age = Number.parseFloat(formData.age);

      const experienceMultipliers: Record<string, number> = {
        beginner: 1.15,
        intermediate: 1.08,
        advanced: 1.03,
        elite: 1.01,
      };

      const improvementRate = experienceMultipliers[formData.experience];
      const weeklyImprovement =
        ((currentPerf * (improvementRate - 1)) / 12) * (trainingHours / 10);

      setResults({
        current: currentPerf,
        oneMonth: Math.round(currentPerf * (1 + (improvementRate - 1) / 3)),
        threeMonths: Math.round(currentPerf * improvementRate),
        sixMonths: Math.round(currentPerf * Math.pow(improvementRate, 2)),
        weeklyImprovement: weeklyImprovement.toFixed(2),
        peakAge: getPeakAge(formData.sport),
        recommendations: generatePerformanceRecommendations(formData, age),
      });
      setLoading(false);
    }, 800);
  };

  const getPeakAge = (sport: string) => {
    const peakAges: Record<string, string> = {
      running: "25-35 years",
      swimming: "22-28 years",
      cycling: "27-35 years",
      weightlifting: "25-32 years",
      general: "25-30 years",
    };
    return peakAges[sport] || peakAges.general;
  };

  const generatePerformanceRecommendations = (data: any, age: number) => {
    const recommendations = [];

    if (data.experience === "beginner") {
      recommendations.push(
        "Focus on building a consistent training routine (3-4 days/week minimum)"
      );
      recommendations.push(
        "Prioritize proper form and technique over intensity"
      );
    }

    if (data.trainingHours < 5) {
      recommendations.push(
        "Consider increasing training volume gradually to 8-10 hours/week"
      );
    }

    recommendations.push(
      "Incorporate periodization: alternate between high and low intensity weeks"
    );
    recommendations.push(
      "Track your progress weekly to identify patterns and plateaus"
    );
    recommendations.push(
      "Add strength training 2x per week to improve overall performance"
    );

    if (age > 35) {
      recommendations.push(
        "Prioritize recovery days and consider adding mobility work daily"
      );
    }

    return recommendations;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-10 h-10 text-purple-500" />
            <h1 className="text-4xl font-bold text-foreground">
              AI Performance Analysis
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Predict your athletic performance trajectory and get AI-powered
            training insights.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Performance Profile
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Sport/Activity
                </label>
                <select
                  value={formData.sport}
                  onChange={(e) =>
                    setFormData({ ...formData, sport: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="running">Running</option>
                  <option value="swimming">Swimming</option>
                  <option value="cycling">Cycling</option>
                  <option value="weightlifting">Weightlifting</option>
                  <option value="general">General Athletics</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Current Performance Score (0-100)
                </label>
                <input
                  type="number"
                  value={formData.currentPerformance}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentPerformance: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                  placeholder="75"
                  min="0"
                  max="100"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Rate your current ability level
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Weekly Training Hours
                </label>
                <input
                  type="number"
                  value={formData.trainingHours}
                  onChange={(e) =>
                    setFormData({ ...formData, trainingHours: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                  placeholder="10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Experience Level
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="beginner">Beginner (0-1 year)</option>
                  <option value="intermediate">Intermediate (1-3 years)</option>
                  <option value="advanced">Advanced (3-5 years)</option>
                  <option value="elite">Elite (5+ years)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                  placeholder="25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Primary Goal
                </label>
                <select
                  value={formData.goal}
                  onChange={(e) =>
                    setFormData({ ...formData, goal: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="improve">Improve Performance</option>
                  <option value="maintain">Maintain Current Level</option>
                  <option value="compete">Compete at Higher Level</option>
                </select>
              </div>

              <button
                onClick={calculatePerformance}
                disabled={
                  loading ||
                  !formData.currentPerformance ||
                  !formData.trainingHours ||
                  !formData.age
                }
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity font-semibold"
              >
                {loading ? "Analyzing..." : "Analyze with AI"}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {results ? (
              <>
                <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Target className="w-6 h-6 text-purple-600" />
                    Performance Projection
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-background rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">
                        Current Score
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {results.current}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-blue-100 dark:bg-blue-950 rounded-lg">
                        <p className="text-xs text-muted-foreground">1 Month</p>
                        <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          {results.oneMonth}
                        </p>
                      </div>
                      <div className="p-3 bg-green-100 dark:bg-green-950 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          3 Months
                        </p>
                        <p className="text-xl font-bold text-green-600 dark:text-green-400">
                          {results.threeMonths}
                        </p>
                      </div>
                      <div className="p-3 bg-purple-100 dark:bg-purple-950 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          6 Months
                        </p>
                        <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                          {results.sixMonths}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Performance Metrics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                      <span className="text-foreground font-medium">
                        Weekly Improvement Rate
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        +{results.weeklyImprovement}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                      <span className="text-foreground font-medium">
                        Peak Performance Age
                      </span>
                      <span className="text-lg font-bold text-foreground">
                        {results.peakAge}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                      <span className="text-foreground font-medium">
                        Training Consistency
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        Optimal
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    AI Training Recommendations
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

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Performance Optimization Roadmap
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          Week 1-4: Foundation Phase
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Build base fitness and establish routine
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                        2
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          Week 5-8: Build Phase
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Increase volume and intensity gradually
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
                        3
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          Week 9-12: Peak Phase
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Reach maximum performance capacity
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Fill in your performance profile to get AI-powered predictions
                  and training recommendations.
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
