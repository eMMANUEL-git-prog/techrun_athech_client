"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/context/language-provider";
import { getTranslation } from "@/lib/translations";

interface AIActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType:
    | "calories"
    | "doping"
    | "medication"
    | "nutrition"
    | "recovery"
    | "performance";
  isPro?: boolean;
}

export function AIActionModal({
  isOpen,
  onClose,
  actionType,
  isPro = false,
}: AIActionModalProps) {
  const { language } = useLanguage();
  const t = (key: keyof typeof getTranslation.en) =>
    getTranslation(language, key as any);
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // Simulate API call with mock data
      setTimeout(() => {
        const mockData = {
          calories: {
            title: t("calorieCalculator"),
            data: {
              dailyNeeds: 2500,
              basalMetabolicRate: 1600,
              activityLevel: "Moderate",
              recommendation:
                "You need approximately 2500 calories per day based on your profile.",
              breakdown: {
                carbs: "45-65%",
                protein: "10-35%",
                fat: "20-35%",
              },
            },
          },
          doping: {
            title: t("dopingRisks"),
            data: {
              bannedSubstances: [
                "Anabolic steroids",
                "EPO (Erythropoietin)",
                "Human growth hormone",
                "Testosterone",
              ],
              antiDopingTips: [
                "Only use approved medications",
                "Check with medical team before supplements",
                "Regular testing is mandatory",
                "Report any therapeutic use exemptions",
              ],
            },
          },
          medication: {
            title: t("medicationTracker"),
            data: {
              medications: [
                {
                  name: "Ibuprofen",
                  dosage: "200mg",
                  frequency: "As needed",
                  interactions: "None",
                },
                {
                  name: "Vitamin D",
                  dosage: "1000 IU",
                  frequency: "Daily",
                  interactions: "None",
                },
                {
                  name: "Protein Powder",
                  dosage: "25g",
                  frequency: "Post-workout",
                  interactions: "None",
                },
              ],
            },
          },
          nutrition: {
            title: t("nutritionPlanner"),
            data: {
              mealPlan: [
                "Breakfast: Oatmeal with berries and almonds (450 cal)",
                "Snack: Greek yogurt with honey (150 cal)",
                "Lunch: Grilled chicken with brown rice and vegetables (600 cal)",
                "Snack: Protein shake (200 cal)",
                "Dinner: Salmon with sweet potato and broccoli (550 cal)",
              ],
              totalCalories: 1950,
              hydration: "3-4 liters per day",
            },
          },
          recovery: {
            title: t("recoveryGuide"),
            data: {
              tips: [
                "Sleep 7-9 hours per night",
                "Foam roll for 10-15 minutes daily",
                "Cold therapy for 10-15 minutes post-workout",
                "Stretching routine (15-20 minutes)",
                "Hydration with electrolytes",
              ],
              recovery_time: "48-72 hours between intense workouts",
            },
          },
          performance: {
            title: t("performanceAnalysis"),
            data: {
              metrics: {
                strength: "Excellent",
                endurance: "Good",
                speed: "Very Good",
                agility: "Good",
              },
              trend: "Improving",
              recommendations: [
                "Focus on endurance training",
                "Increase speed work sessions",
                "Maintain current strength training",
              ],
            },
          },
        };
        setContent(mockData[actionType]);
        setLoading(false);
      }, 500);
    }
  }, [isOpen, actionType, t]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border flex items-center justify-between p-6">
          <h2 className="text-2xl font-bold text-foreground">
            {content?.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {isPro && (
          <div className="bg-blue-50 dark:bg-blue-950 border-b border-blue-200 dark:border-blue-800 p-4 m-4 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              This is a premium feature. Enhanced insights and personalized
              recommendations available for pro subscribers.
            </p>
          </div>
        )}

        <div className="p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {actionType === "calories" && content?.data && (
                <div className="space-y-4">
                  <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
                    <p className="font-semibold text-lg text-foreground">
                      {content.data.recommendation}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">BMR</p>
                      <p className="text-xl font-bold text-foreground">
                        {content.data.basalMetabolicRate}
                      </p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Daily Needs
                      </p>
                      <p className="text-xl font-bold text-foreground">
                        {content.data.dailyNeeds}
                      </p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Activity</p>
                      <p className="text-lg font-bold text-foreground">
                        {content.data.activityLevel}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      Macronutrient Breakdown
                    </h3>
                    <div className="space-y-2">
                      <p className="text-foreground">
                        Carbs: {content.data.breakdown.carbs}
                      </p>
                      <p className="text-foreground">
                        Protein: {content.data.breakdown.protein}
                      </p>
                      <p className="text-foreground">
                        Fat: {content.data.breakdown.fat}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {actionType === "doping" && content?.data && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3">Banned Substances</h3>
                    <ul className="space-y-2">
                      {content.data.bannedSubstances.map(
                        (substance: string, i: number) => (
                          <li
                            key={i}
                            className="flex items-center text-foreground"
                          >
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                            {substance}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">
                      Anti-Doping Guidelines
                    </h3>
                    <ul className="space-y-2">
                      {content.data.antiDopingTips.map(
                        (tip: string, i: number) => (
                          <li
                            key={i}
                            className="flex items-center text-foreground"
                          >
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            {tip}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {actionType === "medication" && content?.data && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Active Medications</h3>
                  <div className="space-y-3">
                    {content.data.medications.map((med: any, i: number) => (
                      <div key={i} className="bg-muted p-4 rounded-lg">
                        <p className="font-semibold text-foreground">
                          {med.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Dosage: {med.dosage}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Frequency: {med.frequency}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Interactions: {med.interactions}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {actionType === "nutrition" && content?.data && (
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Total Daily Calories
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {content.data.totalCalories}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Sample Meal Plan</h3>
                    <ul className="space-y-2">
                      {content.data.mealPlan.map((meal: string, i: number) => (
                        <li key={i} className="text-foreground text-sm">
                          {meal}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Hydration: {content.data.hydration}
                  </p>
                </div>
              )}

              {actionType === "recovery" && content?.data && (
                <div className="space-y-4">
                  <h3 className="font-semibold mb-3">Recovery Tips</h3>
                  <ul className="space-y-2">
                    {content.data.tips.map((tip: string, i: number) => (
                      <li
                        key={i}
                        className="text-foreground text-sm flex items-start"
                      >
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 mt-1.5"></span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-muted-foreground mt-4">
                    Recovery Time: {content.data.recovery_time}
                  </p>
                </div>
              )}

              {actionType === "performance" && content?.data && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(content.data.metrics).map(
                      ([metric, value]: any, i) => (
                        <div key={i} className="bg-muted p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground capitalize">
                            {metric}
                          </p>
                          <p className="text-lg font-bold text-foreground">
                            {value}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
                    <p className="font-semibold text-foreground mb-2">
                      Trend: {content.data.trend}
                    </p>
                    <h4 className="font-semibold text-sm mb-2">
                      Recommendations
                    </h4>
                    <ul className="space-y-1">
                      {content.data.recommendations.map(
                        (rec: string, i: number) => (
                          <li key={i} className="text-sm text-foreground">
                            - {rec}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="border-t border-border p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
          >
            Close
          </button>
          <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}
