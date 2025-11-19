import axios, { AxiosInstance } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://techrun-athech-server.onrender.com/api";

let axiosInstance: AxiosInstance | null = null;

export const getAxiosInstance = (): AxiosInstance => {
  if (!axiosInstance) {
    axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor to attach auth token
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
  },
  athletes: {
    getAll: () => getAxiosInstance().get("/athletes"),
    create: (data: any) => getAxiosInstance().post("/athletes", data),
  },
  whereabouts: {
    submitLocation: (data: any) =>
      getAxiosInstance().post("/whereabouts/submissions", data),
    updateSubmission: (data: any) =>
      getAxiosInstance().post("/whereabouts/updates", data),
    verifySubmission: (data: any) =>
      getAxiosInstance().post("/whereabouts/verifications", data),
  },
  alerts: {
    getAll: () => getAxiosInstance().get("/alerts"),
    create: (data: any) => getAxiosInstance().post("/alerts", data),
  },
};
