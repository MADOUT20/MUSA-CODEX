import React from 'react';
import { ShieldCheck, ArrowRight, Lock, PhoneCall, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface HomeScreenProps {
  onStartReport: () => void;
  onOpenPrivacy: () => void;
  onNavigateToSupport?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartReport,
  onOpenPrivacy,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col justify-between h-full px-5 sm:px-6 py-5 bg-[#FAFBFD] overflow-hidden select-none">
      {/* Discreet, Dignified Top Identity */}
      <header className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#0C2340] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            RL
          </div>
          <div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#0C2340] block">
              CAMPUS CONFIDENTIAL VAULT
            </span>
            <span className="text-xs font-semibold text-[#1A2634] leading-none">
              Read Between the Lines
            </span>
          </div>
        </div>

        {/* How it works Button */}
        <button
          type="button"
          onClick={onOpenPrivacy}
          aria-label="View how confidentiality and reporting works"
          title="How it works"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#D0D9E4] bg-white text-[#0C2340] hover:bg-[#F1F5F9] text-[11px] font-medium transition-colors cursor-pointer shadow-2xs"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#1E5C45]" />
          <span>How it works</span>
        </button>
      </header>

      {/* Main Center Creative Showcase: Hero Image with Poetic Reassurance */}
      <div className="my-3 w-full max-w-sm mx-auto flex flex-col items-center">
        {/* Creative Visual Anchor */}
        <div className="relative w-full rounded-2xl overflow-hidden border border-[#CBD5E1] shadow-sm bg-white group">
          {/* Poignant Photography */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E2E8F0]">
            <img
              src="./holding_hands.jpg"
              alt="Hands held tightly in quiet student solidarity and protection"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {/* Cinematic Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C2340] via-[#0C2340]/40 to-transparent" />

            {/* Overlaid Message: Clean, Empathetic, Creative */}
            <div className="absolute inset-x-0 bottom-0 p-4 text-left text-white">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-medium text-white mb-1.5 border border-white/30">
                <Lock className="w-2.5 h-2.5" />
                <span>Zero records kept</span>
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight drop-shadow-sm">
                You don't have to carry this alone.
              </h2>
              <p className="text-[11px] text-white/90 mt-1 leading-relaxed line-clamp-2">
                Hostel confinement, forced obedience, or harassment. Speak safely without anyone knowing who you are.
              </p>
            </div>
          </div>
        </div>

        {/* Minimal Micro-Reassurance */}
        <p className="mt-2.5 text-center text-xs text-[#556980] max-w-xs leading-relaxed">
          No roll numbers, names, or device IP logs. Your case is reviewed neutrally by the ombudsperson.
        </p>
      </div>

      {/* 24/7 Campus Crisis Line Block - Full Width */}
      <div className="w-full p-4 rounded-xl bg-[#FDF5F5] border border-[#F5D5D8] text-left my-2">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#8A2432] text-white flex items-center justify-center shrink-0 mt-0.5">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A2432]">
                24/7 Campus Crisis Line
              </span>
            </div>
            <h2 className="text-xs sm:text-sm font-semibold text-[#0C2340]">
              Immediate Escort & Anti-Ragging Security
            </h2>
            <p className="text-[11px] text-[#556980] mt-0.5 leading-relaxed">
              Direct dispatch for physical confrontation, hostel room confinement, or urgent campus security intervention.
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <a
                href="tel:8005557233"
                className="px-3 py-1.5 bg-[#8A2432] hover:bg-[#731E2A] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call (800) 555-SAFE</span>
              </a>
              <button
                type="button"
                onClick={() => handleCopy('main-phone', '(800) 555-7233')}
                className="p-1.5 text-xs text-[#526B84] hover:text-[#0C2340] rounded-lg border border-[#D9E2EC] bg-white hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                title="Copy number"
              >
                {copiedId === 'main-phone' ? <Check className="w-3.5 h-3.5 text-[#1E5C45]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* The Single Focal Action: Submit Grievance Button */}
      <div className="w-full max-w-sm mx-auto shrink-0 pt-2">
        <button
          type="button"
          onClick={onStartReport}
          className="w-full py-3.5 px-5 bg-[#0C2340] hover:bg-[#16365C] active:bg-[#07172B] text-white rounded-xl font-medium text-sm transition-all duration-150 cursor-pointer text-center flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          <span>Submit Grievance</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>

        <p className="text-[10px] text-[#64748B] text-center mt-2 font-mono">
          Private reference token generated upon submission
        </p>
      </div>
    </div>
  );
};
