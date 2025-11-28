import { getAxiosInstance } from "../api";

const API_BASE_URL = "https://techrun-backend.onrender.com/api";

export async function sendMessage(message: string): Promise<string> {
  try {
    const response = await getAxiosInstance().post("/ai/chat", { message });
    return response.data.response || "No response received";
  } catch (error: any) {
    console.error("Chat API error:", error);
    throw new Error(error.response?.data?.error || "Failed to send message");
  }
}
