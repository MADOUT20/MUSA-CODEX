export type ActiveTab = 'home' | 'report' | 'track' | 'support';

export type ReportCategory = 
  | 'ragging' 
  | 'intimidation' 
  | 'cyber_harassment' 
  | 'verbal_abuse' 
  | 'academic_coercion' 
  | 'physical_distress' 
  | 'other';

export type ReportUrgency = 'low' | 'medium' | 'high' | 'immediate';

export type ReportStatus = 'submitted' | 'under_review' | 'advocate_assigned' | 'action_taken' | 'resolved';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  badge?: string;
  actor: 'system' | 'ombudsperson' | 'safety_board';
}

export interface AnonymousMessage {
  id: string;
  sender: 'student' | 'ombudsperson';
  timestamp: string;
  content: string;
}

export interface IncidentReport {
  id: string; // Token ID e.g. RBL-8392-SAFE
  createdAt: string;
  category: ReportCategory;
  categoryLabel: string;
  location: string;
  locationDetails?: string;
  approximateDate: string;
  narrative: string;
  sanitizedNarrative?: string;
  urgency: ReportUrgency;
  desiredOutcome: string;
  status: ReportStatus;
  statusLabel: string;
  timeline: TimelineEvent[];
  messages: AnonymousMessage[];
  hasEvidenceAttachments?: boolean;
}

export interface SupportContact {
  id: string;
  name: string;
  role: string;
  description: string;
  availability: string;
  contactMethod: string;
  isConfidential: boolean;
  type: 'counseling' | 'ombuds' | 'escort' | 'legal' | 'crisis';
}
