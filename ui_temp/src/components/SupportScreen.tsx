import React, { useState } from 'react';
import {
  PhoneCall,
  HelpCircle,
  Clock,
  ChevronDown,
  Check,
  Copy,
  ArrowLeft
} from 'lucide-react';
import { SUPPORT_RESOURCES } from '../data/initialData';

interface SupportScreenProps {
  onOpenPrivacy: () => void;
}

type SupportView = 'directory' | 'faq';

export const SupportScreen: React.FC<SupportScreenProps> = ({
  onOpenPrivacy
}) => {
  const [currentView, setCurrentView] = useState<SupportView>('directory');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const FAQS = [
    {
      q: 'Will my report alert the individuals involved?',
      a: 'No. Reports are triaged independently by the campus ombudsperson. No notifications or accusations are sent to subjects named in the narrative without careful investigation and prior safety planning.'
    },
    {
      q: 'Can administrators look up my IP address or network log?',
      a: 'No. The platform strips all IP addresses, device user-agents, and network timestamps at edge entry. Even university IT network engineers cannot trace incoming submissions to your device.'
    },
    {
      q: 'Can I report on behalf of a friend or classmate?',
      a: 'Yes. You can submit witness statements or express concern for a peer. Select the appropriate category and note in the narrative that you are reporting as an observer.'
    },
    {
      q: 'What if I am in immediate physical danger right now?',
      a: 'Please use the 24/7 Campus Crisis Line or call emergency dispatch immediately at (800) 555-SAFE or 911. The anonymous intake form is monitored continually but is intended for protective interventions.'
    },
    {
      q: 'What role does the Campus Ombudsperson play?',
      a: 'The University Ombudsperson functions as a neutral, confidential, and informal advocate. They can guide you through options, conduct non-attributable inquiries, or initiate safety patrols without triggering formal adversarial hearings unless you request it.'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top Header with FAQ symbol on top right - pinned at top */}
      <div className="py-3 px-4 sm:px-6 border-b border-[#E2E8F0] flex items-center justify-between shrink-0 bg-white z-10">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#0C2340]">
            {currentView === 'faq'
              ? 'Frequently Asked Questions'
              : 'Campus Wellbeing & Support'}
          </h1>
          <p className="text-xs sm:text-sm text-[#4A5D73] mt-0.5">
            {currentView === 'faq'
              ? 'Answers to common questions regarding privacy, anonymity, and response.'
              : 'Confidential university contacts, nighttime escorts, and mental health counseling.'}
          </p>
        </div>

        {/* Top Right Header Action Symbols */}
        <div className="flex items-center gap-1.5 shrink-0 ml-3">
          {currentView !== 'directory' && (
            <button
              type="button"
              onClick={() => setCurrentView('directory')}
              aria-label="Back to support directory"
              title="Back to support directory"
              className="p-2 rounded-full border border-[#D9E2EC] bg-white hover:bg-[#F1F5F9] text-[#0C2340] transition-colors cursor-pointer flex items-center justify-center group"
            >
              <ArrowLeft className="w-4 h-4 text-[#0C2340]" />
            </button>
          )}

          {/* FAQ Option Symbol */}
          <button
            type="button"
            onClick={() => setCurrentView(currentView === 'faq' ? 'directory' : 'faq')}
            aria-label="Frequently Asked Questions"
            title="Frequently Asked Questions"
            className={`p-2 rounded-full border transition-colors cursor-pointer flex items-center justify-center group ${
              currentView === 'faq'
                ? 'bg-[#0C2340] text-white border-[#0C2340]'
                : 'bg-white hover:bg-[#F1F5F9] text-[#0C2340] border-[#D9E2EC]'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dedicated Scrollable Body for Support Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 pb-8">
        {/* VIEW 1: Dedicated FAQ View */}
        {currentView === 'faq' && (
          <div className="max-w-md mx-auto w-full animate-in fade-in space-y-2.5">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="border border-[#E2E8F0] rounded-xl bg-white overflow-hidden transition-all text-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-3.5 text-left font-medium text-[#0C2340] flex items-center justify-between gap-2 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 shrink-0 transition-transform text-[#64748B] ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-3.5 pb-3.5 pt-1 text-[#4A5D73] leading-relaxed border-t border-[#E2E8F0] bg-[#FAFBFD]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => setCurrentView('directory')}
              className="mt-6 text-xs font-medium text-[#0C2340] hover:underline flex items-center gap-1.5 self-center mx-auto cursor-pointer pt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Support Directory</span>
            </button>
          </div>
        )}

        {/* VIEW 2: Main Support Directory (default) */}
        {currentView === 'directory' && (
          <div className="animate-in fade-in space-y-4">
            <div className="max-w-md mx-auto w-full">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#0C2340]">
                  Confidential Campus Resources
                </h3>
                <span className="text-[11px] text-[#64748B]">
                  {SUPPORT_RESOURCES.length} resources available
                </span>
              </div>

              <div className="space-y-3 pb-4">
                {SUPPORT_RESOURCES.map((res) => (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs text-xs text-left"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-sm text-[#0C2340]">{res.name}</h4>
                        <p className="text-[#1A4568] font-medium mt-0.5 text-[11px]">{res.role}</p>
                      </div>
                      {res.isConfidential && (
                        <span className="text-[10px] font-medium text-[#1E5C45] bg-[#EDF7F2] px-2 py-0.5 rounded border border-[#BFDFD0] shrink-0">
                          Confidential
                        </span>
                      )}
                    </div>

                    <p className="text-[#4A5D73] mt-1.5 leading-relaxed">
                      <span className="font-medium text-[#0C2340]">
                        {res.description}
                      </span>
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
                      <div className="flex items-center gap-1">
                        <span className="hidden sm:inline">
                          {res.availability}
                        </span>
                      </div>
                      <button
                      type="button"
                      onClick={() => handleCopy(res.id, res.contactMethod)}
                      className="font-mono text-[#0C2340] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>{res.contactMethod}</span>
                        {copiedId === res.id ? <Check className="w-3 h-3 text-[#1E5C45]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
