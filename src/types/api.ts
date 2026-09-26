export type Channel = "sms" | "whatsapp" | "email";
export type Language = "en" | "tw" | "ga" | "ee" | "dag";

export const languageLabel: Record<Language, string> = {
  en: "English",
  tw: "Twi",
  ga: "Ga",
  ee: "Ewe",
  dag: "Dagbani",
};

export interface ParentInfo {
  _id: string;
  fullName: string;
  phone: string;
  email?: string;
  preferredChannel: Channel;
  preferredLanguage?: Language;
  sendListenLink?: boolean;
}

export interface StudentRecord {
  _id: string;
  fullName: string;
  className: string;
  parent: ParentInfo;
}

export interface NotificationRecord {
  _id: string;
  message: string;
  channel: Channel;
  status: "pending" | "sent" | "failed";
  kind: "message" | "results" | "broadcast";
  aiGenerated?: boolean;
  language?: string;
  error?: string;
  createdAt: string;
  student?: { fullName: string; className: string } | null;
  parent?: { fullName: string } | null;
}

export interface ResultRecord {
  _id: string;
  subject: string;
  score: number;
  student: { _id: string; fullName: string; className: string };
}

export interface StatsResponse {
  students: number;
  parents: number;
  resultsRecorded: number;
  notifications: { sent: number; failed: number; pending: number };
  sentByChannel: Record<Channel, number>;
  recent: NotificationRecord[];
}

export interface BulkSendSummary {
  total: number;
  sent: number;
  failed: number;
}

export interface ResultsNotifySummary extends BulkSendSummary {
  skippedNoResults: number;
}

export interface PortalTerm {
  academicYear: string;
  term: string;
  average: number;
  results: { subject: string; score: number; remarks?: string }[];
}

export interface PortalChild {
  id: string;
  fullName: string;
  className: string;
  school?: string;
  terms: PortalTerm[];
}

export interface PortalMessage {
  _id: string;
  message: string;
  channel: Channel;
  kind: string;
  createdAt: string;
  student?: { fullName: string } | null;
}

export interface ResultsPreview {
  message: string;
  aiGenerated: boolean;
  language: string;
}

export interface ParentAccount {
  email: string;
  tempPassword: string;
  reset: boolean;
}
