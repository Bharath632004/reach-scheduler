import { Email } from "@/types/email";

// Mock data — replace with real API calls to your Express backend
const MOCK_SCHEDULED: Email[] = [
  { id: "1", to: "john@acme.com", subject: "Partnership Opportunity", body: "Hi John...", scheduledAt: "2026-02-07T10:00:00Z", status: "scheduled", sender: "outreach@company.com" },
  { id: "2", to: "sarah@startup.io", subject: "Quick Question", body: "Hey Sarah...", scheduledAt: "2026-02-07T10:05:00Z", status: "scheduled", sender: "outreach@company.com" },
  { id: "3", to: "mike@enterprise.co", subject: "Intro from ReachInbox", body: "Hi Mike...", scheduledAt: "2026-02-07T10:10:00Z", status: "scheduled", sender: "sales@company.com" },
  { id: "4", to: "lisa@growth.dev", subject: "Let's connect", body: "Hi Lisa...", scheduledAt: "2026-02-07T10:15:00Z", status: "sending", sender: "sales@company.com" },
];

const MOCK_SENT: Email[] = [
  { id: "5", to: "alex@demo.com", subject: "Follow up", body: "Hi Alex...", scheduledAt: "2026-02-06T09:00:00Z", sentAt: "2026-02-06T09:00:02Z", status: "sent", sender: "outreach@company.com" },
  { id: "6", to: "emma@test.org", subject: "Quick intro", body: "Hey Emma...", scheduledAt: "2026-02-06T09:05:00Z", sentAt: "2026-02-06T09:05:03Z", status: "sent", sender: "outreach@company.com" },
  { id: "7", to: "david@fail.net", subject: "Re: Project", body: "Hi David...", scheduledAt: "2026-02-06T09:10:00Z", sentAt: "2026-02-06T09:10:01Z", status: "failed", sender: "sales@company.com" },
];

// Simulates API delay
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

// Replace these with actual fetch() calls to your Express backend
// e.g. const BASE = "http://localhost:3001/api";

export async function fetchScheduledEmails(): Promise<Email[]> {
  await delay(600);
  return MOCK_SCHEDULED;
}

export async function fetchSentEmails(): Promise<Email[]> {
  await delay(600);
  return MOCK_SENT;
}

export async function scheduleEmails(data: {
  subject: string;
  body: string;
  emails: string[];
  startTime: string;
  delayBetweenEmails: number;
  hourlyLimit: number;
}): Promise<{ success: boolean; count: number }> {
  await delay(800);
  // POST to your Express backend: fetch(`${BASE}/schedule`, { method: 'POST', body: JSON.stringify(data) })
  return { success: true, count: data.emails.length };
}
