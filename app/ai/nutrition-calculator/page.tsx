"use client";

import { useAuth } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Apple, ArrowLeft, ChefHat, Droplets } from "lucide-react";

export default function NutritionCalculatorPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [preferences, setPreferences] = useState({
    dietType: "balanced",
    mealsPerDay: "3",
    allergies: [] as string[],
    goals: "maintenance",
    calories: "2500",
  });
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  const generateMealPlan = () => {
    setGenerating(true);

    // Simulate AI generation
    setTimeout(() => {
      const plan = {
        totalCalories: Number.parseInt(preferences.calories),
        protein: Math.round((Number.parseInt(preferences.calories) * 0.3) / 4),
        carbs: Math.round((Number.parseInt(preferences.calories) * 0.4) / 4),
        fats: Math.round((Number.parseInt(preferences.calories) * 0.3) / 9),
        meals: generateMeals(
          preferences.dietType,
          Number.parseInt(preferences.mealsPerDay)
        ),
      };
      setMealPlan(plan);
      setGenerating(false);
    }, 2000);
  };

  const generateMeals = (dietType: string, mealsCount: number) => {
    const mealTemplates = {
      balanced: [
        {
          name: "Breakfast",
          time: "7:00 AM",
          items: [
            "3 whole eggs scrambled",
            "2 slices whole wheat toast",
            "1 avocado",
            "Orange juice",
          ],
          calories: 580,
          protein: 28,
          carbs: 52,
          fats: 28,
        },
        {
          name: "Lunch",
          time: "12:30 PM",
          items: [
            "Grilled chicken breast (200g)",
            "Brown rice (1 cup)",
            "Steamed broccoli",
            "Olive oil dressing",
          ],
          calories: 620,
          protein: 52,
          carbs: 58,
          fats: 18,
        },
        {
          name: "Dinner",
          time: "7:00 PM",
          items: [
            "Salmon fillet (180g)",
            "Sweet potato (medium)",
            "Mixed green salad",
            "Quinoa (1/2 cup)",
          ],
          calories: 680,
          protein: 48,
          carbs: 62,
          fats: 22,
        },
        {
          name: "Snack",
          time: "3:00 PM",
          items: ["Greek yogurt (200g)", "Handful of almonds", "Banana"],
          calories: 380,
          protein: 22,
          carbs: 42,
          fats: 14,
        },
      ],
      highProtein: [
        {
          name: "Breakfast",
          time: "7:00 AM",
          items: [
            "Protein shake (40g whey)",
            "Oatmeal with berries",
            "2 whole eggs",
          ],
          calories: 550,
          protein: 58,
          carbs: 48,
          fats: 12,
        },
        {
          name: "Lunch",
          time: "12:30 PM",
          items: [
            "Turkey breast (250g)",
            "Quinoa (1 cup)",
            "Grilled vegetables",
          ],
          calories: 580,
          protein: 62,
          carbs: 44,
          fats: 10,
        },
        {
          name: "Dinner",
          time: "7:00 PM",
          items: [
            "Lean beef steak (200g)",
            "Brown rice",
            "Asparagus",
            "Side salad",
          ],
          calories: 620,
          protein: 58,
          carbs: 48,
          fats: 18,
        },
      ],
      vegetarian: [
        {
          name: "Breakfast",
          time: "7:00 AM",
          items: [
            "Tofu scramble",
            "Whole wheat toast",
            "Avocado",
            "Fresh fruit bowl",
          ],
          calories: 520,
          protein: 24,
          carbs: 62,
          fats: 20,
        },
        {
          name: "Lunch",
          time: "12:30 PM",
          items: [
            "Chickpea curry",
            "Brown rice",
            "Naan bread",
            "Mixed vegetable salad",
          ],
          calories: 640,
          protein: 22,
          carbs: 88,
          fats: 18,
        },
        {
          name: "Dinner",
          time: "7:00 PM",
          items: [
            "Lentil pasta",
            "Marinara sauce",
            "Nutritional yeast",
            "Roasted vegetables",
          ],
          calories: 580,
          protein: 28,
          carbs: 82,
          fats: 14,
        },
      ],
    };

    return (
      mealTemplates[dietType as keyof typeof mealTemplates]?.slice(
        0,
        mealsCount
      ) || []
    );
  };

  const hydrationGuide = {
    baseHydration: 3.7, // liters for males
    exerciseExtra: 0.5, // extra per hour of exercise
    tips: [
      "Drink 500ml water 2 hours before exercise",
      "Consume 150-250ml every 15-20 minutes during exercise",
      "Rehydrate with 150% of fluid lost after exercise",
      "Monitor urine color - should be pale yellow",
      "Include electrolytes for sessions over 60 minutes",
    ],
  };

  if (loading) {
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
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            AI Nutrition Planner
          </h1>
          <p className="text-lg text-muted-foreground">
            Generate personalized meal plans tailored to your goals,
            preferences, and dietary requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Preferences Form */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <ChefHat className="w-5 h-5" />
                Meal Plan Preferences
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Diet Type
                  </label>
                  <select
                    value={preferences.dietType}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        dietType: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="balanced">Balanced</option>
                    <option value="highProtein">High Protein</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="keto">Ketogenic</option>
                    <option value="paleo">Paleo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Daily Calories
                  </label>
                  <input
                    type="number"
                    value={preferences.calories}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        calories: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Meals Per Day
                  </label>
                  <select
                    value={preferences.mealsPerDay}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        mealsPerDay: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="3">3 Meals</option>
                    <option value="4">4 Meals + Snack</option>
                    <option value="5">5 Small Meals</option>
                    <option value="6">6 Meals (Bodybuilding)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Goal
                  </label>
                  <select
                    value={preferences.goals}
                    onChange={(e) =>
                      setPreferences({ ...preferences, goals: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="weight-loss">Weight Loss</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="muscle-gain">Muscle Gain</option>
                    <option value="endurance">Endurance</option>
                  </select>
                </div>

                <button
                  onClick={generateMealPlan}
                  disabled={generating}
                  className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50"
                >
                  {generating ? "Generating..." : "Generate Meal Plan"}
                </button>
              </div>
            </div>
          </div>

          {/* Generated Meal Plan */}
          <div className="lg:col-span-2">
            {mealPlan ? (
              <div className="space-y-6">
                {/* Macros Summary */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Daily Macronutrient Targets
                  </h2>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-background rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {mealPlan.totalCalories}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Calories
                      </div>
                    </div>
                    <div className="bg-background rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {mealPlan.protein}g
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Protein
                      </div>
                    </div>
                    <div className="bg-background rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {mealPlan.carbs}g
                      </div>
                      <div className="text-sm text-muted-foreground">Carbs</div>
                    </div>
                    <div className="bg-background rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-1">
                        {mealPlan.fats}g
                      </div>
                      <div className="text-sm text-muted-foreground">Fats</div>
                    </div>
                  </div>
                </div>

                {/* Meal Cards */}
                {mealPlan.meals.map((meal: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-card border border-border rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">
                          {meal.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {meal.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {meal.calories} kcal
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-foreground mb-2">
                        Foods:
                      </h4>
                      <ul className="space-y-2">
                        {meal.items.map((item: string, i: number) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <Apple className="w-4 h-4 text-green-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-4 text-sm">
                      <div className="px-3 py-1 bg-blue-50 dark:bg-blue-950/30 rounded">
                        <span className="font-semibold text-blue-900 dark:text-blue-100">
                          P: {meal.protein}g
                        </span>
                      </div>
                      <div className="px-3 py-1 bg-green-50 dark:bg-green-950/30 rounded">
                        <span className="font-semibold text-green-900 dark:text-green-100">
                          C: {meal.carbs}g
                        </span>
                      </div>
                      <div className="px-3 py-1 bg-orange-50 dark:bg-orange-950/30 rounded">
                        <span className="font-semibold text-orange-900 dark:text-orange-100">
                          F: {meal.fats}g
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <ChefHat className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No Meal Plan Generated Yet
                </h3>
                <p className="text-muted-foreground">
                  Configure your preferences and click "Generate Meal Plan" to
                  get started.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Hydration Guide */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-border rounded-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Droplets className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-foreground">
              Hydration Guide for Athletes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">
                Daily Hydration Targets
              </h3>
              <div className="space-y-3">
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {hydrationGuide.baseHydration}L
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Base daily intake
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    +{hydrationGuide.exerciseExtra}L
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Per hour of exercise
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">
                Hydration Tips
              </h3>
              <ul className="space-y-2">
                {hydrationGuide.tips.map((tip, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Droplets className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
