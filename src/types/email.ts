export interface Email {
  id: string;
  to: string;
  subject: string;
  body: string;
  scheduledAt: string;
  sentAt?: string;
  status: 'scheduled' | 'sending' | 'sent' | 'failed';
  sender?: string;
}

export interface User {
  name: string;
  email: string;
  avatar: string;
}

export interface ComposeFormData {
  subject: string;
  body: string;
  emails: string[];
  startTime: string;
  delayBetweenEmails: number;
  hourlyLimit: number;
}

export interface ApiConfig {
  baseUrl: string;
}
