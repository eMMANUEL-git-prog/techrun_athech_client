import axios, { type AxiosInstance } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
};
