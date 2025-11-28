"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Apple, TrendingUp, Activity } from "lucide-react";

export default function CalorieCalculatorPage() {
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    gender: "male",
    activityLevel: "moderate",
  });
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const calculateCalories = () => {
    setLoading(true);
    setTimeout(() => {
      const weight = Number.parseFloat(formData.weight);
      const height = Number.parseFloat(formData.height);
      const age = Number.parseFloat(formData.age);

      // Harris-Benedict Equation
      let bmr;
      if (formData.gender === "male") {
        bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
      } else {
        bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
      }

      const activityMultipliers: Record<string, number> = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        veryActive: 1.9,
      };

      const tdee = bmr * activityMultipliers[formData.activityLevel];

      setResults({
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        maintenance: Math.round(tdee),
        cutting: Math.round(tdee - 500),
        bulking: Math.round(tdee + 300),
        macros: {
          protein: Math.round((tdee * 0.3) / 4),
          carbs: Math.round((tdee * 0.4) / 4),
          fats: Math.round((tdee * 0.3) / 9),
        },
      });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Apple className="w-10 h-10 text-orange-500" />
            <h1 className="text-4xl font-bold text-foreground">
              AI Calorie Calculator
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Get personalized caloric needs and macronutrient breakdown based on
            your profile and activity level.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Your Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Age (years)
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
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                  placeholder="70"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({ ...formData, height: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                  placeholder="175"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Activity Level
                </label>
                <select
                  value={formData.activityLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, activityLevel: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="sedentary">
                    Sedentary (little or no exercise)
                  </option>
                  <option value="light">Light (exercise 1-3 days/week)</option>
                  <option value="moderate">
                    Moderate (exercise 3-5 days/week)
                  </option>
                  <option value="active">
                    Active (exercise 6-7 days/week)
                  </option>
                  <option value="veryActive">
                    Very Active (intense exercise daily)
                  </option>
                </select>
              </div>

              <button
                onClick={calculateCalories}
                disabled={
                  loading ||
                  !formData.age ||
                  !formData.weight ||
                  !formData.height
                }
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity font-semibold"
              >
                {loading ? "Calculating..." : "Calculate with AI"}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {results ? (
              <>
                <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    Your Results
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Basal Metabolic Rate
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {results.bmr}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        calories/day
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Daily Energy Expenditure
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {results.tdee}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        calories/day
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Goal-Based Recommendations
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <p className="font-semibold text-foreground">
                        Maintain Weight
                      </p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {results.maintenance} cal/day
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <p className="font-semibold text-foreground">
                        Cut (Lose Fat)
                      </p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {results.cutting} cal/day
                      </p>
                      <p className="text-xs text-muted-foreground">
                        500 cal deficit
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <p className="font-semibold text-foreground">
                        Bulk (Gain Muscle)
                      </p>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {results.bulking} cal/day
                      </p>
                      <p className="text-xs text-muted-foreground">
                        300 cal surplus
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Macronutrient Breakdown
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-foreground font-medium">
                        Protein (30%)
                      </span>
                      <span className="text-xl font-bold text-foreground">
                        {results.macros.protein}g
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-foreground font-medium">
                        Carbohydrates (40%)
                      </span>
                      <span className="text-xl font-bold text-foreground">
                        {results.macros.carbs}g
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-foreground font-medium">
                        Fats (30%)
                      </span>
                      <span className="text-xl font-bold text-foreground">
                        {results.macros.fats}g
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-foreground mb-3">
                    AI Recommendations
                  </h3>
                  <ul className="space-y-2 text-sm text-foreground">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></span>
                      <span>
                        Eat protein-rich foods within 2 hours post-workout for
                        optimal recovery
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></span>
                      <span>
                        Hydrate with 3-4 liters of water daily, more on training
                        days
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></span>
                      <span>
                        Consider timing carbs around workouts for better
                        performance
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></span>
                      <span>
                        Track your intake for 2 weeks to establish baseline
                        habits
                      </span>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <Apple className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Fill in your information to get AI-powered calorie
                  calculations and personalized recommendations.
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
