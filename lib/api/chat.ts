const API_BASE_URL = "http://localhost:5000/api";

export async function sendMessage(message: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.reply || "No response received";
  } catch (error) {
    console.error("Chat API error:", error);
    throw error;
  }
}
