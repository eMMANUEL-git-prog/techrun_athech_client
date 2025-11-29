import axios, { type AxiosInstance } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://techrun-backend.onrender.com/api";

let axiosInstance: AxiosInstance | null = null;

export const getAxiosInstance = (): AxiosInstance => {
  if (!axiosInstance) {
    axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    axiosInstance.interceptors.request.use((config) => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }
  return axiosInstance;
};

export const api = {
  auth: {
    signup: (email: string, password: string, full_name: string) =>
      getAxiosInstance().post("/auth/signup", { email, password, full_name }),
    signin: (email: string, password: string) =>
      getAxiosInstance().post("/auth/signin", { email, password }),
    me: () => getAxiosInstance().get("/auth/me"),
    refresh: (refresh_token: string) =>
      getAxiosInstance().post("/auth/refresh", { refresh_token }),
  },

  alerts: {
    getAll: () => getAxiosInstance().get("/alerts"),
    create: (data: {
      type: string;
      severity: string;
      message: string;
      details?: string;
    }) => getAxiosInstance().post("/alerts", data),
    markAsRead: (id: string) => getAxiosInstance().patch(`/alerts/${id}/read`),
    delete: (id: string) => getAxiosInstance().delete(`/alerts/${id}`),
  },

  whereabouts: {
    getAll: () => getAxiosInstance().get("/whereabouts"),
    submit: (data: {
      date: string;
      time_slot: string;
      location: string;
      address: string;
      city: string;
      country: string;
      activity_type: string;
      notes: string;
      latitude: number;
      longitude: number;
    }) => getAxiosInstance().post("/whereabouts/submissions", data),
    update: (id: string, data: any) =>
      getAxiosInstance().put(`/whereabouts/${id}`, data),
    delete: (id: string) => getAxiosInstance().delete(`/whereabouts/${id}`),
    verify: (id: string) =>
      getAxiosInstance().post(`/whereabouts/${id}/verify`),
  },

  ai: {
    chat: (message: string) => getAxiosInstance().post("/ai/chat", { message }),
    calculateNutrition: (data: {
      age: number;
      weight: number;
      height: number;
      gender: "male" | "female";
      activityLevel: string;
    }) => getAxiosInstance().post("/ai/nutrition/calculate", data),
    predictPerformance: (data: { currentMetrics: any; trainingHistory: any }) =>
      getAxiosInstance().post("/ai/performance/predict", data),
    checkMedication: (medications: string[]) =>
      getAxiosInstance().post("/ai/medication/check", { medications }),
    generateAlerts: () => getAxiosInstance().post("/ai/alerts/generate"),
  },

  payments: {
    initiateMpesa: (data: {
      phone_number: string;
      amount: number;
      package_type: string;
    }) => getAxiosInstance().post("/payments/mpesa/stk-push", data),
    getTransactions: () => getAxiosInstance().get("/payments/transactions"),
  },

  users: {
    getAll: () => getAxiosInstance().get("/users"),
    getById: (id: string) => getAxiosInstance().get(`/users/${id}`),
    update: (
      id: string,
      data: { first_name?: string; last_name?: string; image_url?: string }
    ) => getAxiosInstance().put(`/users/${id}`, data),
    delete: (id: string) => getAxiosInstance().delete(`/users/${id}`),
    updateSubscription: (id: string, subscription_tier: string) =>
      getAxiosInstance().put(`/users/${id}/subscription`, {
        subscription_tier,
      }),
  },

  athletes: {
    getAll: () => getAxiosInstance().get("/athletes"),
    getById: (id: string) => getAxiosInstance().get(`/athletes/${id}`),
  },

  biomechanics: {
    getAll: () => getAxiosInstance().get("/biomechanics"),
    getById: (id: string) => getAxiosInstance().get(`/biomechanics/${id}`),
    create: (data: any) => getAxiosInstance().post("/biomechanics", data),
  },

  trainingLoad: {
    getAll: () => getAxiosInstance().get("/training-load"),
    getByWeek: (date: string) =>
      getAxiosInstance().get(`/training-load/week/${date}`),
    createOrUpdate: (data: any) =>
      getAxiosInstance().post("/training-load", data),
  },

  injury: {
    getAll: () => getAxiosInstance().get("/injury"),
    getLatest: () => getAxiosInstance().get("/injury/latest"),
    create: (data: any) => getAxiosInstance().post("/injury", data),
    review: (id: string, data: { status: string; notes?: string }) =>
      getAxiosInstance().put(`/injury/${id}/review`, data),
  },

  equipment: {
    getAll: () => getAxiosInstance().get("/equipment"),
    getActive: () => getAxiosInstance().get("/equipment/active"),
    create: (data: any) => getAxiosInstance().post("/equipment", data),
    updateUsage: (
      id: string,
      data: { distance_km?: number; uses_increment?: number }
    ) => getAxiosInstance().put(`/equipment/${id}/usage`, data),
    updateCondition: (id: string, data: any) =>
      getAxiosInstance().put(`/equipment/${id}/condition`, data),
    retire: (id: string) => getAxiosInstance().put(`/equipment/${id}/retire`),
    delete: (id: string) => getAxiosInstance().delete(`/equipment/${id}`),
  },

  performance: {
    getAll: () => getAxiosInstance().get("/performance"),
    getLatest: () => getAxiosInstance().get("/performance/latest"),
    create: (data: any) => getAxiosInstance().post("/performance", data),
  },

  behavioral: {
    getAll: () => getAxiosInstance().get("/behavioral"),
    getLatest: () => getAxiosInstance().get("/behavioral/latest"),
    create: (data: any) => getAxiosInstance().post("/behavioral", data),
  },
};
