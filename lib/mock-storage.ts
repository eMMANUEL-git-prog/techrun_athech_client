// Mock storage for alerts, whereabouts, and other persistent data
export interface StorageAlert {
  id: string;
  userId: string;
  type: "location" | "medical" | "nutrition" | "performance" | "compliance";
  severity: "low" | "medium" | "high";
  message: string;
  details?: string;
  createdAt: number;
  read: boolean;
}

export interface StorageWhereabout {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  address: string;
  submittedAt: number;
  verifiedAt?: number;
  verified: boolean;
}

export interface StorageAthleteRecord {
  id: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  sport: string;
  level: string;
  subscriptionTier: "free" | "pro" | "premium";
}

export interface StorageMedicalRecord {
  id: string;
  athleteId: string;
  type: "injury" | "illness" | "medication" | "clearance";
  title: string;
  description: string;
  status: "pending" | "approved" | "resolved";
  date: number;
}

export interface StorageNutritionPlan {
  id: string;
  athleteId: string;
  createdAt: number;
  goals: string[];
  dietType: string;
  restrictions: string[];
}

const STORAGE_KEYS = {
  ALERTS: "athlete_track_alerts",
  WHEREABOUTS: "athlete_track_whereabouts",
  ATHLETES: "athlete_track_athletes",
  MEDICAL_RECORDS: "athlete_track_medical_records",
  NUTRITION_PLANS: "athlete_track_nutrition_plans",
  TRAINING_SESSIONS: "athlete_track_training_sessions",
};

export const mockStorage = {
  // Alerts
  getAlerts: (userId?: string): StorageAlert[] => {
    try {
      const alerts = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.ALERTS) || "[]"
      );
      return userId
        ? alerts.filter((a: StorageAlert) => a.userId === userId)
        : alerts;
    } catch {
      return [];
    }
  },

  addAlert: (alert: Omit<StorageAlert, "id" | "createdAt">) => {
    const alerts = mockStorage.getAlerts();
    const newAlert: StorageAlert = {
      ...alert,
      id: `alert_${Date.now()}`,
      createdAt: Date.now(),
    };
    alerts.push(newAlert);
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    return newAlert;
  },

  markAlertAsRead: (alertId: string) => {
    const alerts = mockStorage.getAlerts();
    const alert = alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.read = true;
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    }
  },

  // Whereabouts
  getWhereabouts: (userId?: string): StorageWhereabout[] => {
    try {
      const whereabouts = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.WHEREABOUTS) || "[]"
      );
      return userId
        ? whereabouts.filter((w: StorageWhereabout) => w.userId === userId)
        : whereabouts;
    } catch {
      return [];
    }
  },

  addWhereabout: (whereabout: Omit<StorageWhereabout, "id">) => {
    const whereabouts = mockStorage.getWhereabouts();
    const newWhereabout: StorageWhereabout = {
      ...whereabout,
      id: `whereabout_${Date.now()}`,
    };
    whereabouts.push(newWhereabout);
    localStorage.setItem(STORAGE_KEYS.WHEREABOUTS, JSON.stringify(whereabouts));
    return newWhereabout;
  },

  // Athletes
  getAthletes: (): StorageAthleteRecord[] => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ATHLETES) || "[]");
    } catch {
      return [];
    }
  },

  addAthlete: (athlete: Omit<StorageAthleteRecord, "id">) => {
    const athletes = mockStorage.getAthletes();
    const newAthlete: StorageAthleteRecord = {
      ...athlete,
      id: `athlete_${Date.now()}`,
    };
    athletes.push(newAthlete);
    localStorage.setItem(STORAGE_KEYS.ATHLETES, JSON.stringify(athletes));
    return newAthlete;
  },

  // Medical Records
  getMedicalRecords: (athleteId?: string): StorageMedicalRecord[] => {
    try {
      const records = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.MEDICAL_RECORDS) || "[]"
      );
      return athleteId
        ? records.filter((r: StorageMedicalRecord) => r.athleteId === athleteId)
        : records;
    } catch {
      return [];
    }
  },

  addMedicalRecord: (record: Omit<StorageMedicalRecord, "id">) => {
    const records = mockStorage.getMedicalRecords();
    const newRecord: StorageMedicalRecord = {
      ...record,
      id: `medical_${Date.now()}`,
    };
    records.push(newRecord);
    localStorage.setItem(STORAGE_KEYS.MEDICAL_RECORDS, JSON.stringify(records));
    return newRecord;
  },

  // Nutrition Plans
  getNutritionPlans: (athleteId?: string): StorageNutritionPlan[] => {
    try {
      const plans = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.NUTRITION_PLANS) || "[]"
      );
      return athleteId
        ? plans.filter((p: StorageNutritionPlan) => p.athleteId === athleteId)
        : plans;
    } catch {
      return [];
    }
  },

  addNutritionPlan: (plan: Omit<StorageNutritionPlan, "id" | "createdAt">) => {
    const plans = mockStorage.getNutritionPlans();
    const newPlan: StorageNutritionPlan = {
      ...plan,
      id: `nutrition_${Date.now()}`,
      createdAt: Date.now(),
    };
    plans.push(newPlan);
    localStorage.setItem(STORAGE_KEYS.NUTRITION_PLANS, JSON.stringify(plans));
    return newPlan;
  },

  // Training Sessions
  getTrainingSessions: (coachId?: string): any[] => {
    try {
      const sessions = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.TRAINING_SESSIONS) || "[]"
      );
      return coachId
        ? sessions.filter((s: any) => s.coachId === coachId)
        : sessions;
    } catch {
      return [];
    }
  },

  addTrainingSession: (session: any) => {
    const sessions = mockStorage.getTrainingSessions();
    const newSession = {
      ...session,
      id: `session_${Date.now()}`,
      createdAt: Date.now(),
    };
    sessions.push(newSession);
    localStorage.setItem(
      STORAGE_KEYS.TRAINING_SESSIONS,
      JSON.stringify(sessions)
    );
    return newSession;
  },
};
