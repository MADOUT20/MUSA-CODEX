import { IncidentReport, SupportContact, AnonymousMessage } from '../types';

export const INITIAL_REPORTS: IncidentReport[] = [];

export const SUPPORT_RESOURCES: SupportContact[] = [
  {
    id: 'res-1',
    name: '24/7 Campus Crisis & Safety Line',
    role: 'Immediate Distress Response',
    description: 'Direct emergency telephone line staffed by trained trauma-informed campus responders. Instant dispatch or phone accompaniment.',
    availability: '24 Hours / 7 Days a week',
    contactMethod: '(800) 555-SAFE (7233)',
    isConfidential: true,
    type: 'crisis'
  },
  {
    id: 'res-2',
    name: 'University Ombuds Office',
    role: 'Neutral & Confidential Advocate',
    description: 'An independent, impartial resource to discuss harassment, ragging, unfair treatment, or administrative disputes off-the-record.',
    availability: 'Mon - Fri, 8:30 AM - 5:30 PM',
    contactMethod: 'ombuds@campus-safety.edu / Hall 4 Rm 204',
    isConfidential: true,
    type: 'ombuds'
  },
  {
    id: 'res-3',
    name: 'SafeWalk Escort Service',
    role: 'Nighttime Campus Transit & Walking Companion',
    description: 'Two trained student safety aides accompany you from libraries, labs, or dining halls to your residence hall or vehicle.',
    availability: 'Every night, 7:00 PM - 3:00 AM',
    contactMethod: 'Tap to Request or call ext. 4410',
    isConfidential: true,
    type: 'escort'
  },
  {
    id: 'res-4',
    name: 'Student Psychological Counseling Center',
    role: 'Confidential Mental Health & Trauma Support',
    description: 'Licensed counselors offering free, confidential one-on-one sessions for stress, intimidation, social anxiety, and trauma recovery.',
    availability: 'Appointments & Walk-in Crisis triage',
    contactMethod: 'counseling-center@campus-safety.edu',
    isConfidential: true,
    type: 'counseling'
  },
  {
    id: 'res-5',
    name: 'National Anti-Ragging Helpline',
    role: 'Statutory Independent Oversight',
    description: 'Government-mandated 24/7 anti-ragging toll-free authority with strict legal guarantees of student whistleblower protection.',
    availability: '24/7 Toll-Free',
    contactMethod: '1800-180-5522 (Toll Free)',
    isConfidential: true,
    type: 'legal'
  }
];

export const STORAGE_KEY_REPORTS = 'rbl_reports_v1';

export function getStoredReports(): IncidentReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REPORTS);
    if (!raw) {
      return [];
    }
    const reports = JSON.parse(raw);
    if (!Array.isArray(reports)) return [];

    // MIGRATION: Remove any mock/demo reports that match the fake token format (RBL-xxxx-SAFE)
    // This cleanses persisted LocalStorage without wiping legitimate real reports.
    return reports.filter(r => !r.id.toUpperCase().endsWith('-SAFE'));
  } catch {
    return [];
  }
}

export function saveReport(report: IncidentReport): void {
  try {
    const list = getStoredReports();
    const updated = [report, ...list];
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save report to local storage', err);
  }
}

export function addMessageToReport(reportId: string, messageText: string): IncidentReport | null {
  try {
    const list = getStoredReports();
    const reportIndex = list.findIndex(r => r.id.toLowerCase() === reportId.toLowerCase());
    if (reportIndex === -1) return null;

    const newMsg: AnonymousMessage = {
      id: 'msg-' + Date.now(),
      sender: 'student',
      timestamp: 'Just now',
      content: messageText
    };

    const targetReport = list[reportIndex];
    const updatedReport = {
      ...targetReport,
      messages: [...targetReport.messages, newMsg]
    };

    list[reportIndex] = updatedReport;
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(list));
    return updatedReport;
  } catch (err) {
    console.error('Failed to add message', err);
    return null;
  }
}
