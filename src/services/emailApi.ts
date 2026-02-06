import { Email } from "@/types/email";

const BASE_URL = "http://localhost:3001/api/emails";

// 🔹 Fetch Scheduled Emails
export async function fetchScheduledEmails(): Promise<Email[]> {
  const response = await fetch(`${BASE_URL}/scheduled`);

  if (!response.ok) {
    throw new Error("Failed to fetch scheduled emails");
  }

  return await response.json();
}

// 🔹 Fetch Sent Emails
export async function fetchSentEmails(): Promise<Email[]> {
  const response = await fetch(`${BASE_URL}/sent`);

  if (!response.ok) {
    throw new Error("Failed to fetch sent emails");
  }

  return await response.json();
}

// 🔹 Schedule Emails
export async function scheduleEmails(data: {
  subject: string;
  body: string;
  emails: string[];
  startTime: string;
  delayBetweenEmails: number;
  hourlyLimit: number;
}): Promise<{ success: boolean; count: number }> {
  
  const response = await fetch(`${BASE_URL}/schedule`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to schedule emails");
  }

  return await response.json();
}

