"use client";

import { useState } from "react";
import { useLanguage } from "@/context/language-provider";
import { getTranslation } from "@/lib/translations";
import { aiService } from "@/lib/ai-service";
import { Calculator } from "lucide-react";

export function NutritionCalculatorForm() {
  const { language } = useLanguage();
  const t = (key: keyof typeof getTranslation.en) =>
    getTranslation(language, key as any);

  const [age, setAge] = useState("25");
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activityLevel, setActivityLevel] = useState<"moderate">("moderate");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    setTimeout(() => {
      const nutrition = aiService.calculateNutrition(
        parseInt(age),
        parseInt(weight),
        parseInt(height),
        gender,
        activityLevel
      );
      setResult(nutrition);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-bold text-foreground">
          AI Nutrition Calculator
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Age
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-foreground"
            min="10"
            max="100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Weight (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-foreground"
            min="30"
            max="200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Height (cm)
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-foreground"
            min="120"
            max="220"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as "male" | "female")}
            className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-foreground"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleCalculate}
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
      >
        {loading ? "Calculating..." : "Calculate Nutrition Plan"}
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <p className="text-xs text-muted-foreground">BMR (kcal/day)</p>
              <p className="text-2xl font-bold text-foreground">{result.bmr}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
              <p className="text-xs text-muted-foreground">TDEE (kcal/day)</p>
              <p className="text-2xl font-bold text-foreground">
                {result.tdee}
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
              <p className="text-xs text-muted-foreground">Protein (g)</p>
              <p className="text-2xl font-bold text-foreground">
                {result.protein}g
              </p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
              <p className="text-xs text-muted-foreground">Carbs (g)</p>
              <p className="text-2xl font-bold text-foreground">
                {result.carbs}g
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
              <p className="text-xs text-muted-foreground">Fat (g)</p>
              <p className="text-2xl font-bold text-foreground">
                {result.fat}g
              </p>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold text-foreground mb-3">
              Recommendations
            </h3>
            <ul className="space-y-2">
              {result.recommendations.map((rec: string, i: number) => (
                <li
                  key={i}
                  className="text-sm text-foreground flex items-start"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
