import { IncidentReport, SupportContact, AnonymousMessage } from '../types';

export const INITIAL_REPORTS: IncidentReport[] = [
  {
    id: 'RBL-4821-SAFE',
    createdAt: 'Yesterday at 8:14 PM',
    category: 'intimidation',
    categoryLabel: 'Covert Harassment & Intimidation',
    location: 'North Quad Dormitory, Block C',
    approximateDate: 'September 16, evening hours',
    narrative: 'Senior batch members were barring freshers from entering the communal kitchen after 9 PM and insisting on forced roll-calls in corridor B.',
    sanitizedNarrative: 'Upperclass residents restricted access to communal residential facilities during late hours and conducted unauthorized mandatory roll-calls.',
    urgency: 'high',
    desiredOutcome: 'Increased unannounced safety walk-throughs by resident advisors without revealing student identity.',
    status: 'advocate_assigned',
    statusLabel: 'Advocate Assigned & Under Review',
    timeline: [
      {
        id: 'tl-1',
        timestamp: 'Sep 17, 8:14 PM',
        title: 'Report Received & Tokenized',
        description: 'Anonymous token generated. IP headers and client metadata permanently purged.',
        badge: 'Secure System',
        actor: 'system'
      },
      {
        id: 'tl-2',
        timestamp: 'Sep 17, 9:30 PM',
        title: 'Sanitized Intake Review',
        description: 'Case categorized under Campus Anti-Intimidation Policy Section 4.2. Risk assessed as Moderate-High.',
        actor: 'ombudsperson'
      },
      {
        id: 'tl-3',
        timestamp: 'Today, 9:15 AM',
        title: 'Confidential Advocate Assigned',
        description: 'Senior Ombudsperson Dr. A. Vance assigned to review security footage logs and increase residential perimeter checks.',
        badge: 'In Progress',
        actor: 'ombudsperson'
      }
    ],
    messages: [
      {
        id: 'msg-1',
        sender: 'ombudsperson',
        timestamp: 'Sep 17, 10:05 PM',
        content: 'Thank you for stepping forward. Your identity is 100% shielded. We have scheduled discrete evening rounds by neutral residence staff. Have there been any direct verbal threats to your room?'
      },
      {
        id: 'msg-2',
        sender: 'student',
        timestamp: 'Sep 18, 12:40 AM',
        content: 'No direct threats to individual rooms yet, but they announced another mandatory gathering for tonight near the fire stairwell.'
      },
      {
        id: 'msg-3',
        sender: 'ombudsperson',
        timestamp: 'Today, 8:30 AM',
        content: 'Noted with urgency. We are dispatching staff advisors to remain stationed near the stairwell during the specified window. Please stay inside and reach out here if anything escalates.'
      }
    ]
  },
  {
    id: 'RBL-9014-CARE',
    createdAt: '3 days ago',
    category: 'academic_coercion',
    categoryLabel: 'Academic Coercion',
    location: 'Engineering Science Lab 3',
    approximateDate: 'September 14, afternoon',
    narrative: 'Lab assignments were being withheld unless junior students completed extra personal errands for department lab reps.',
    sanitizedNarrative: 'Academic lab apparatus and assignment sign-offs were conditioned upon non-curricular demands.',
    urgency: 'medium',
    desiredOutcome: 'Neutral faculty oversight during lab submission hours.',
    status: 'action_taken',
    statusLabel: 'Corrective Action Taken',
    timeline: [
      {
        id: 'tl-a1',
        timestamp: 'Sep 14, 4:20 PM',
        title: 'Report Registered',
        description: 'Cryptographic token assigned. Narrative scrubbed of specific student group nicknames.',
        actor: 'system'
      },
      {
        id: 'tl-a2',
        timestamp: 'Sep 15, 11:00 AM',
        title: 'Faculty Chair Consultation',
        description: 'Department ombuds met with Head of Laboratory to institute direct digital submissions via university portal.',
        actor: 'ombudsperson'
      },
      {
        id: 'tl-a3',
        timestamp: 'Sep 16, 2:00 PM',
        title: 'Protocol Implemented',
        description: 'All lab sign-offs now bypass peer representatives directly to teaching assistants.',
        badge: 'Resolved',
        actor: 'safety_board'
      }
    ],
    messages: [
      {
        id: 'msg-b1',
        sender: 'ombudsperson',
        timestamp: 'Sep 15, 11:30 AM',
        content: 'We met with the lab director without disclosing who submitted this report. A revised digital sign-off protocol has been instituted effective today.'
      },
      {
        id: 'msg-b2',
        sender: 'student',
        timestamp: 'Sep 16, 3:15 PM',
        content: 'Confirmed, the new portal submission worked smoothly today. Thank you so much for the quick help.'
      }
    ]
  }
];

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
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(INITIAL_REPORTS));
      return INITIAL_REPORTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_REPORTS;
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
