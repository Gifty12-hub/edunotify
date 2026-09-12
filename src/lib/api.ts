// src/lib/api.ts
// Real API call, to replace the equivalent mock function

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function sendNotification(
  studentId: string,
  message: string,
  sentBy: string
) {
  const response = await fetch(`${API_URL}/notifications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ studentId, message, sentBy }),
  });

  if (!response.ok) {
    throw new Error("Failed to send notification");
  }

  return response.json();
}