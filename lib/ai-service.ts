import { mockStorage, StorageAlert } from "./mock-storage";

const alertMessages = {
  athlete: [
    {
      type: "location" as const,
      message: "Scheduled whereabouts submission due in 2 hours",
      severity: "medium" as const,
    },
    {
      type: "nutrition" as const,
      message: "Your calorie intake is below recommended levels",
      severity: "low" as const,
    },
    {
      type: "performance" as const,
      message: "AI detected improvement in your endurance metrics",
      severity: "low" as const,
    },
    {
      type: "compliance" as const,
      message: "Anti-doping test scheduled for tomorrow",
      severity: "high" as const,
    },
  ],
  coach: [
    {
      type: "performance" as const,
      message: "Team average performance up 15% this week",
      severity: "low" as const,
    },
    {
      type: "compliance" as const,
      message: "3 athletes pending medical clearance",
      severity: "high" as const,
    },
    {
      type: "location" as const,
      message: "Team whereabouts verification at 100%",
      severity: "low" as const,
    },
  ],
  medic: [
    {
      type: "medical" as const,
      message: "2 athletes with pending injury reports",
      severity: "high" as const,
    },
    {
      type: "compliance" as const,
      message: "Medical clearance documents expiring soon",
      severity: "medium" as const,
    },
  ],
  nutritionist: [
    {
      type: "nutrition" as const,
      message: "5 meal plans require updates",
      severity: "medium" as const,
    },
    {
      type: "performance" as const,
      message: "AI detected nutrition deficiency in 2 athletes",
      severity: "high" as const,
    },
  ],
};

export const aiService = {
  generateLoginAlerts: (
    userId: string,
    userRole: "athlete" | "coach" | "medic" | "nutritionist" | "admin"
  ) => {
    const roleAlerts =
      alertMessages[userRole as keyof typeof alertMessages] || [];

    // Get 1-2 random alerts for this role
    const count = Math.random() > 0.5 ? 1 : 2;
    const selectedAlerts = [];

    for (let i = 0; i < count && i < roleAlerts.length; i++) {
      const randomIndex = Math.floor(Math.random() * roleAlerts.length);
      selectedAlerts.push(roleAlerts[randomIndex]);
    }

    return selectedAlerts.map((alert) =>
      mockStorage.addAlert({
        userId,
        type: alert.type,
        severity: alert.severity,
        message: alert.message,
        read: false,
      })
    );
  },

  calculateNutrition: (
    age: number,
    weight: number,
    height: number,
    gender: "male" | "female",
    activityLevel: "sedentary" | "light" | "moderate" | "active" | "veryActive"
  ) => {
    // Harris-Benedict equation for BMR
    let bmr: number;
    if (gender === "male") {
      bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
    } else {
      bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
    }

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    const tdee = bmr * activityMultipliers[activityLevel];

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      protein: Math.round((tdee * 0.25) / 4), // 25% protein, 4 cal/g
      carbs: Math.round((tdee * 0.55) / 4), // 55% carbs, 4 cal/g
      fat: Math.round((tdee * 0.2) / 9), // 20% fat, 9 cal/g
      recommendations: generateNutritionRecommendations(age, activityLevel),
    };
  },

  predictPerformance: (currentMetrics: any) => {
    return {
      trend: Math.random() > 0.5 ? "improving" : "stable",
      nextWeekPrediction: Math.round(
        currentMetrics.current * (0.95 + Math.random() * 0.1)
      ),
      recommendations: [
        "Increase training intensity by 10%",
        "Focus on recovery between sessions",
        "Monitor nutrition intake closely",
      ],
    };
  },

  checkDrugInteractions: (medications: string[]) => {
    const commonInteractions: { [key: string]: string[] } = {
      ibuprofen: ["warfarin", "aspirin"],
      aspirin: ["ibuprofen", "warfarin"],
      "vitamin d": [],
      "protein powder": [],
    };

    const interactions: string[] = [];
    medications.forEach((med, idx) => {
      const medLower = med.toLowerCase();
      medications.forEach((otherMed, otherIdx) => {
        if (idx !== otherIdx) {
          const potentialInteractions = commonInteractions[medLower] || [];
          if (
            potentialInteractions.some((i) =>
              otherMed.toLowerCase().includes(i)
            )
          ) {
            interactions.push(
              `Possible interaction between ${med} and ${otherMed}`
            );
          }
        }
      });
    });

    return { safe: interactions.length === 0, interactions };
  },
};

function generateNutritionRecommendations(
  age: number,
  activityLevel: string
): string[] {
  const recommendations = [
    "Drink at least 3-4 liters of water daily",
    "Include protein in every meal for muscle recovery",
    "Eat carbs within 30 minutes post-workout",
    "Get 7-9 hours of quality sleep",
    "Avoid processed foods and sugary drinks",
  ];

  if (activityLevel === "veryActive" || activityLevel === "active") {
    recommendations.push("Increase electrolyte intake on training days");
  }

  if (age < 25) {
    recommendations.push("Ensure adequate calcium for bone development");
  }

  return recommendations.slice(0, 4);
}
