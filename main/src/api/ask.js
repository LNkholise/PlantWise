const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api";

export async function askVoddie(message) {
  try {
    const response = await fetch(`${API_BASE}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      return "Sorry, I am having trouble responding right now.";
    }

    const reply = await response.text();
    return reply;

  } catch (error) {
    console.error("Failed to ask Voddie:", error);
    return "Sorry, I couldn't process your request. Please try again later.";
  }
}
