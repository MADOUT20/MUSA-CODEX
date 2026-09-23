import React, { useState } from 'react';
import {
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Check,
  AlertTriangle,
  ChevronDown,
  Users,
  Eye,
  MessageCircle,
  Zap,
  BookOpen,
  AlertOctagon,
  HelpCircle
} from 'lucide-react';
import { IncidentReport, ReportCategory, ReportUrgency } from '../types';
import { saveReport } from '../data/initialData';

interface ReportScreenProps {
  onReportSubmitted: (token: string) => void;
  onCancel: () => void;
  onOpenPrivacy: () => void;
}

const CATEGORIES: { id: ReportCategory; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    id: 'ragging',
    label: 'Hostile Group Coercion / Ragging',
    desc: 'Forced submission, senior hierarchy enforcement, humiliating rituals or forced chores.',
    icon: <Users className="w-5 h-5" />
  },
  {
    id: 'intimidation',
    label: 'Covert Harassment & Intimidation',
    desc: 'Corridor stalking, room blocking, implied social isolation or hostel threats.',
    icon: <Eye className="w-5 h-5" />
  },
  {
    id: 'cyber_harassment',
    label: 'Digital / Group Chat Harassment',
    desc: 'Non-consensual recordings, group chat targeting, unauthorized photo circulation.',
    icon: <MessageCircle className="w-5 h-5" />
  },
  {
    id: 'verbal_abuse',
    label: 'Verbal Threats & Hostile Speech',
    desc: 'Aggressive insults, discriminatory slurs, explicit humiliation or veiled threats.',
    icon: <Zap className="w-5 h-5" />
  },
  {
    id: 'academic_coercion',
    label: 'Academic Coercion & Retaliation',
    desc: 'Withholding lab equipment, forced assignment completion, viva manipulation.',
    icon: <BookOpen className="w-5 h-5" />
  },
  {
    id: 'physical_distress',
    label: 'Physical Restraint or Force',
    desc: 'Physical blockage, aggressive confrontation, sleep or facility deprivation.',
    icon: <AlertOctagon className="w-5 h-5" />
  },
  {
    id: 'other',
    label: 'Other Campus Wellbeing Concern',
    desc: 'Any safety issue where you feel compromised, pressured, or unsafe.',
    icon: <HelpCircle className="w-5 h-5" />
  }
];

export const ReportScreen: React.FC<ReportScreenProps> = ({
  onReportSubmitted,
  onCancel,
  onOpenPrivacy
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [openDropdown, setOpenDropdown] = useState<'location' | 'time' | null>(null);

  const locationOptions = [
    'Residence Halls / Dormitory',
    'Academic Building / Classrooms',
    'Laboratories / Engineering Wing',
    'Student Union / Dining Commons',
    'Campus Library / Study Corridors',
    'Campus Walkway / Outdoor Quad',
    'Digital Group Chat / Social Media',
    'Off-Campus University Transit'
  ];

  const timeOptions = [
    'Within the last 48 hours',
    'Earlier this week',
    'Ongoing / Recurring pattern',
    'During late night hours (after 10 PM)',
    'More than 2 weeks ago'
  ];

  // Form state
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory>('intimidation');
  const [narrative, setNarrative] = useState('');
  const [locationZone, setLocationZone] = useState('Residence Halls / Dormitory');
  const [approximateTime, setApproximateTime] = useState('Within the last 48 hours');
  const [urgency, setUrgency] = useState<ReportUrgency>('medium');
  const [desiredOutcome, setDesiredOutcome] = useState('Discreet unannounced walk-throughs by neutral campus staff');

  // Submission completion state
  const [submittedToken, setSubmittedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const backendUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8000/api/complaint'
        : 'http://10.0.2.2:8000/api/complaint';

      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: narrative,
          category: selectedCategory,
          location: locationZone,
          timeframe: approximateTime,
          desired_action: desiredOutcome,
          urgency: urgency
        }),
      });
      console.log('SUBMITTING_PAYLOAD:', {
        category: selectedCategory,
        location: locationZone,
        timeframe: approximateTime,
        desired_action: desiredOutcome,
        urgency: urgency
      });

      if (!response.ok) throw new Error('Backend communication failure');

      const analysis = await response.json();
      const generatedToken = analysis.tracking_token;
      const catObj = CATEGORIES.find(c => c.id === selectedCategory);

      const newReport: IncidentReport = {
        id: generatedToken,
        createdAt: 'Just now',
        category: selectedCategory,
        categoryLabel: catObj ? catObj.label : 'General Safety',
        location: locationZone,
        locationDetails: approximateTime,
        approximateDate: approximateTime,
        narrative: narrative || 'Confidential report submitted by anonymous student.',
        sanitizedNarrative: narrative,
        urgency: urgency,
        desiredOutcome: desiredOutcome,
        status: 'submitted',
        statusLabel: `Received & Tokenized (${analysis.risk_level} Risk)`,
        timeline: [
          {
            id: `tl-${Date.now()}-1`,
            timestamp: 'Just now',
            title: 'Encrypted Report Received',
            description: `System detected ${analysis.emotion} with ${Math.round(analysis.confidence * 100)}% confidence. Analysis categorized as ${analysis.risk_level} risk level.`,
            badge: 'Identity Vault Active',
            actor: 'system'
          },
          {
            id: `tl-${Date.now()}-2`,
            timestamp: 'Upcoming',
            title: 'Triaged by Campus Ombudsperson',
            description: 'Will be reviewed under campus safety guidelines without requesting student identity.',
            actor: 'ombudsperson'
          }
        ],
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'ombudsperson',
            timestamp: 'Automated System Notice',
            content: `Your report has been secured in the confidential intake vault. Because the system detected a ${analysis.risk_level.toLowerCase()} risk level, a priority triage will be conducted.`
          }
        ]
      };

      saveReport(newReport);
      setSubmittedToken(generatedToken);
    } catch (error) {
      console.error('Submission Error:', error);
      alert('Failed to connect to the safety backend. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (submittedToken) {
      navigator.clipboard.writeText(submittedToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (submittedToken) {
    return (
      <div className="flex flex-col min-h-full pb-8 px-4 sm:px-6 pt-3 animate-in fade-in bg-white">
        <div className="max-w-md mx-auto w-full text-center mt-6">
          <div className="w-14 h-14 rounded-full bg-[#EAF5F0] text-[#2E7D63] border border-[#2E7D63]/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <span className="text-[11px] font-semibold tracking-wider uppercase text-[#2E7D63] bg-[#EAF5F0] px-3 py-1 rounded-full border border-[#2E7D63]/20">
            Report Safely Recorded
          </span>

          <h2 className="text-2xl font-semibold tracking-tight text-[#0E1E32] mt-3">
            Your identity was never captured.
          </h2>
          <p className="text-sm text-[#384D65] mt-2 leading-relaxed">
            Please save your unique anonymous tracking token. This is the only way to track progress and view confidential updates from the campus safety board.
          </p>

          <div className="mt-6 p-4 rounded-xl bg-white border-2 border-[#E2E8F0] shadow-xs text-left">
            <span className="text-xs font-medium text-[#526B84] uppercase tracking-wider block">
              Your Anonymous Tracking Token
            </span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xl sm:text-2xl font-mono font-bold text-[#0E1E32] tracking-wider">
                {submittedToken}
              </span>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-medium text-[#0E1E32] transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#2E7D63]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Token</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-[#526B84] mt-2 border-t border-[#E2EDF7] pt-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#C44525] shrink-0" />
              <span>Store this code securely. Without it, you cannot retrieve updates for this anonymous submission.</span>
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={() => onReportSubmitted(submittedToken)}
              className="w-full py-3 px-4 bg-[#0E1E32] hover:bg-[#1B3150] text-white rounded-xl font-medium text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(14,30,50,0.18)]"
            >
              <span>Track this report now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onCancel}
              className="w-full py-2.5 px-4 bg-transparent hover:bg-[#F1F5F9] text-[#384D65] rounded-xl font-medium text-sm transition-colors cursor-pointer"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between py-3 px-4 sm:px-6 border-b border-[#E2E8F0] shrink-0">
        <button
          onClick={() => {
            if (step > 1) setStep((step - 1) as any);
            else onCancel();
          }}
          className="flex items-center gap-1.5 text-xs font-medium text-[#526B84] hover:text-[#0E1E32] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{step === 1 ? 'Cancel' : 'Back'}</span>
        </button>

        <span className="text-xs font-semibold tracking-wider uppercase text-[#0E1E32]">
          Step {step} of 4
        </span>

        <button
          onClick={onOpenPrivacy}
          className="flex items-center gap-1 text-xs text-[#205085] hover:underline cursor-pointer"
        >
          <ShieldCheck className="w-5 h-5" />
          <span>Shielded</span>
        </button>
      </div>

      <div className="flex gap-1.5 mt-3 mb-5 max-w-md mx-auto w-full px-4 sm:px-6 shrink-0">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= step ? 'bg-[#0E1E32]' : 'bg-[#E2E8F0]'
            }`}
          />
        ))}
      </div>

      <div className="flex-1 overflow-hidden px-4 sm:px-6 pb-8 flex flex-col">

      {step === 1 && (
        <div className="max-w-md mx-auto w-full flex flex-col h-full">
          <div className="flex-shrink-0 mb-3">
            <h2 className="text-2xl font-semibold tracking-tight text-[#0E1E32]">
              What kind of concern occurred?
            </h2>
            <p className="text-sm text-[#384D65] mt-1">
              Select the category that describes the situation.
            </p>
          </div>

          <div className="space-y-1.5 flex-1">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;

              return (
                <label
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-start gap-3 p-2.5 rounded-xl border transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-[#0C2340] bg-[#F4F7FB]'
                      : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-[#0C2340] text-white' : 'text-[#0C2340]'
                  }`}>
                    {cat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[#0C2340] leading-snug">
                      {cat.label}
                    </h3>
                    <p className="text-xs text-[#526B84] mt-0.5 leading-snug line-clamp-1">
                      {cat.desc}
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center ${
                    isSelected
                      ? 'border-[#0C2340] bg-[#0C2340]'
                      : 'border-[#CBD5E1]'
                  }`}>
                    {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                </label>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#E2E8F0] shrink-0 mt-2">
            <button
              onClick={() => setStep(2)}
              className="w-full py-2.5 bg-[#0E1E32] hover:bg-[#1B3150] text-white rounded-xl font-medium text-base transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(14,30,50,0.18)]"
            >
              <span>Continue to Narrative</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-md mx-auto w-full animate-in fade-in">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#0E1E32]">
            Tell us what happened
          </h2>
          <p className="text-xs sm:text-sm text-[#384D65] mt-1 mb-3">
            Write as much or as little as you feel comfortable sharing.
          </p>

          <div className="relative">
            <textarea
              rows={7}
              value={narrative}
              onChange={(e) => {
                setNarrative(e.target.value);
              }}
              placeholder="Describe what occurred, any specific statements, repeated patterns, or locations. E.g., 'A group gathered in the dormitory corridor demanding junior students stay outside after hours...'"
              className="w-full p-3.5 text-sm rounded-xl border border-[#E2E8F0] bg-white text-[#0E1E32] placeholder-[#7B93AC] focus:outline-none focus:border-[#0E1E32] focus:ring-1 focus:ring-[#0E1E32]"
            />
          </div>

          <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 bg-white hover:bg-[#F8FAFC] text-[#0E1E32] border border-[#E2E8F0] rounded-xl font-medium text-sm transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={narrative.trim().length < 5}
              className="flex-1 py-3 bg-[#0E1E32] hover:bg-[#1B3150] text-white rounded-xl font-medium text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_2px_8px_rgba(14,30,50,0.18)]"
            >
              <span>Next: Location</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="max-w-md mx-auto w-full animate-in fade-in">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#0E1E32]">
            Where & when did this happen?
          </h2>
          <p className="text-xs sm:text-sm text-[#384D65] mt-1 mb-4">
            Approximate locations help campus safety adjust patrol paths or facility monitoring.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#0E1E32] mb-1.5">
                Campus Location Zone
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown('location')}
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#0E1E32] focus:outline-none focus:border-[#0E1E32] flex items-center justify-between hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  <span>{locationZone}</span>
                  <ChevronDown className={`w-5 h-5 text-[#607994] transition-transform ${openDropdown === 'location' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'location' && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                    {locationOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setLocationZone(option);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-3 py-2.5 text-sm transition-colors ${
                          locationZone === option
                            ? 'bg-[#0E1E32] text-white font-medium'
                            : 'text-[#0E1E32] hover:bg-[#F8FAFC]'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#0E1E32] mb-1.5">
                Approximate Timeframe
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown('time')}
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#0E1E32] focus:outline-none focus:border-[#0E1E32] flex items-center justify-between hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  <span>{approximateTime}</span>
                  <ChevronDown className={`w-5 h-5 text-[#607994] transition-transform ${openDropdown === 'time' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'time' && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                    {timeOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setApproximateTime(option);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-3 py-2.5 text-sm transition-colors ${
                          approximateTime === option
                            ? 'bg-[#0E1E32] text-white font-medium'
                            : 'text-[#0E1E32] hover:bg-[#F8FAFC]'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
              <p className="text-xs text-[#384D65] leading-relaxed">
                <strong className="text-[#0E1E32]">Discretion Note:</strong> You do not have to name specific room numbers if you fear proximity identification. Broad zones are sufficient for preventive measures.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-3 bg-white hover:bg-[#F8FAFC] text-[#0E1E32] border border-[#E2E8F0] rounded-xl font-medium text-sm transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="flex-1 py-3 bg-[#0E1E32] hover:bg-[#1B3150] text-white rounded-xl font-medium text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_2px_8px_rgba(14,30,50,0.18)]"
            >
              <span>Next: Action</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="max-w-md mx-auto w-full animate-in fade-in">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#0E1E32]">
            Desired Action & Urgency
          </h2>
          <p className="text-xs sm:text-sm text-[#384D65] mt-1 mb-4">
            Let the ombudsperson know what level of intervention you are requesting.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#0E1E32] mb-1.5">
                Urgency Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'low', label: 'Low', desc: 'Informational note' },
                  { id: 'medium', label: 'Medium', desc: 'Active review' },
                  { id: 'high', label: 'High', desc: 'Prompt action' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setUrgency(item.id as ReportUrgency)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      urgency === item.id
                        ? 'border-[#0E1E32] bg-[#0E1E32] text-white shadow-xs'
                        : 'border-[#E2E8F0] bg-white text-[#0E1E32] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <span className="text-xs font-bold block">{item.label}</span>
                    <span className={`text-[10px] block leading-tight ${urgency === item.id ? 'text-[#C5D9EC]' : 'text-[#526B84]'}`}>
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#0E1E32] mb-1.5">
                What action would you like campus staff to take?
              </label>
              <div className="space-y-2">
                {[
                  'Discreet unannounced walk-throughs by neutral campus staff',
                  'Assign a confidential Ombudsperson to advise and monitor',
                  'Policy warning issued to the residential block or department without naming students',
                  'Keep this record in the confidential safety log for future pattern analysis'
                ].map((outcome) => (
                  <label
                    key={outcome}
                    className={`block p-2.5 rounded-xl border text-xs leading-snug cursor-pointer transition-colors ${
                      desiredOutcome === outcome
                        ? 'border-[#0E1E32] bg-white font-medium text-[#0E1E32] ring-1 ring-[#0E1E32]/10'
                        : 'border-[#E2E8F0] bg-white text-[#384D65] hover:bg-[#F8FAFC]'
                    }`}
                    onClick={() => setDesiredOutcome(outcome)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded-full border shrink-0 flex items-center justify-center ${desiredOutcome === outcome ? 'border-[#0E1E32] bg-[#0E1E32]' : 'border-[#A1B8CE]'}`}>
                        {desiredOutcome === outcome && <div className="w-1 h-1 bg-white rounded-full" />}
                      </div>
                      <span>{outcome}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Final Security Pledge Box */}
            <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#2E7D63] shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#384D65] leading-relaxed">
                By submitting, your narrative is encrypted and routed directly to the university independent ombuds office. No device data or IP address is retained.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex gap-3">
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-3 bg-white hover:bg-[#F8FAFC] text-[#0E1E32] border border-[#E2E8F0] rounded-xl font-medium text-sm transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 bg-[#0E1E32] hover:bg-[#1B3150] text-white rounded-xl font-medium text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_2px_8px_rgba(14,30,50,0.18)]"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Submit Anonymously</span>
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};