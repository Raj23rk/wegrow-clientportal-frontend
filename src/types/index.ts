export type UserRole = 'client' | 'admin';

export interface User {
  id?: string;
  _id?: string;
  email: string;
  clientId: string | null;
  role: UserRole;
  name: string;
  title: string;
}

export type ActionStatus = 'Not Started' | 'In Progress' | 'Under Review' | 'Completed' | 'Delayed';
export type ActionPriority = 'High' | 'Medium' | 'Low';

export interface ActionComment {
  by: string;
  date: string;
  text: string;
}

export interface ActionItem {
  id: string;
  actionId?: string;
  _id?: string;
  month: number;
  title: string;
  desc: string;
  priority: ActionPriority;
  owner: string;
  due: string;
  status: ActionStatus;
  progress: number;
  comments: ActionComment[];
  attachments: string[];
}

export interface MonthPlan {
  n: number;
  key: string;
  name: string;
  year: number;
  theme: string;
  objective: string;
  focus: string[];
  outcome: string;
  notes: string;
}

export interface SessionSummary {
  participants: string[];
  discussions: string[];
  findings: string[];
  decisions: string[];
  next: string[];
}

export interface Session {
  id: string;
  sessionId?: string;
  _id?: string;
  date: string;
  title: string;
  mode: 'In person' | 'Online';
  duration: number;
  time: string;
  location: string;
  link?: string;
  consultant: string;
  agenda: string[];
  objectives: string[];
  status: 'Completed' | 'Upcoming';
  summary?: SessionSummary | null;
  attachments: string[];
}

export interface ReportItem {
  id: string;
  reportId?: string;
  _id?: string;
  name: string;
  cat: string;
  date: string;
  desc: string;
  pages: number;
}

export type UpdateType = 'General Update' | 'Important Update' | 'Action Required' | 'Milestone' | 'Recommendation';

export interface BusinessUpdate {
  id: string;
  updateId?: string;
  _id?: string;
  title: string;
  body: string;
  date: string;
  cat: string;
  type: UpdateType;
}

export interface ClientEvent {
  id: string;
  eventId?: string;
  _id?: string;
  title: string;
  type: string;
  date: string;
  time: string;
  loc: string;
  desc: string;
  agenda: string[];
  speakers: string[];
  participants: string;
  seats: number;
  hue: number;
  registeredClientIds?: string[];
}

export interface ClientPhoto {
  id: string;
  photoId?: string;
  _id?: string;
  cat: string;
  title: string;
  date: string;
  desc: string;
  hue: number;
  seed: number;
}

export interface ClientDocument {
  id: string;
  docId?: string;
  _id?: string;
  name: string;
  cat: string;
  date: string;
  by: string;
  type: string;
  size: string;
}

export interface NotificationItem {
  id: string;
  notifId?: string;
  _id?: string;
  cat: 'Sessions' | 'Action Plan' | 'Reports' | 'Events' | 'Important';
  text: string;
  date: string;
  read: boolean;
  link: string;
}

export interface SessionFeedback {
  session: string;
  rating: number;
  useful: string;
  relevance: string;
  improve: string;
  comments: string;
  date?: string;
  _id?: string;
  clientId?: string;
}

export interface ScoreHistoryPoint {
  m: string;
  v: number;
}

export interface DeptPerformance {
  k: string;
  prev: number;
  v: number;
}

export interface ClientData {
  id: string;
  clientId?: string;
  _id?: string;
  company: string;
  short: string;
  color: string;
  industry: string;
  size: string;
  city: string;
  location: string;
  contact: string;
  contactTitle: string;
  email: string;
  phone: string;
  start: string;
  end: string;
  consultant: string;
  areas: string[];
  people: Record<string, string>;
  scoreHistory: ScoreHistoryPoint[];
  dept: DeptPerformance[];
  months: MonthPlan[];
  actions: ActionItem[];
  sessions: Session[];
  reports: ReportItem[];
  updates: BusinessUpdate[];
  events: ClientEvent[];
  photos: ClientPhoto[];
  documents: ClientDocument[];
  notifications: NotificationItem[];
  feedback: SessionFeedback[];
  readUpdates?: string[];
}

