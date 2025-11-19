"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/language-provider";
import { getTranslation } from "@/lib/translations";
import { mockStorage } from "@/lib/mock-storage";
import { Apple, BarChart3, CheckCircle } from "lucide-react";

export function NutritionistDashboardSection() {
  const { language } = useLanguage();
  const t = (key: keyof typeof getTranslation.en) =>
    getTranslation(language, key as any);
  const [nutritionPlans, setNutritionPlans] = useState<any[]>([]);

  useEffect(() => {
    const plans = mockStorage.getNutritionPlans();
    if (plans.length === 0) {
      // Create mock nutrition plans
      mockStorage.addNutritionPlan({
        athleteId: "2",
        goals: ["Muscle gain", "Strength"],
        dietType: "Balanced",
        restrictions: ["Gluten-free"],
      });
      mockStorage.addNutritionPlan({
        athleteId: "3",
        goals: ["Weight loss", "Endurance"],
        dietType: "Low-carb",
        restrictions: ["Dairy-free"],
      });
      setNutritionPlans(mockStorage.getNutritionPlans());
    } else {
      setNutritionPlans(plans);
    }
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Total Plans
            </h3>
            <Apple className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-foreground">
            {nutritionPlans.length}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Active nutrition plans
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Compliance
            </h3>
            <CheckCircle className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-foreground">92%</p>
          <p className="text-sm text-muted-foreground mt-2">
            Athletes following plans
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Goals Met</h3>
            <BarChart3 className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-foreground">78%</p>
          <p className="text-sm text-muted-foreground mt-2">
            Achieving nutrition targets
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Active Nutrition Plans
        </h3>
        <div className="space-y-4">
          {nutritionPlans.map((plan) => (
            <div
              key={plan.id}
              className="p-4 bg-muted rounded-lg border border-border"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-foreground">
                    Athlete {plan.athleteId}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {plan.dietType} diet
                  </p>
                </div>
                <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Goals:</span>
                  <p className="text-foreground">{plan.goals.join(", ")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Restrictions:</span>
                  <p className="text-foreground">
                    {plan.restrictions.join(", ") || "None"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
