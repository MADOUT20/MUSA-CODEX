import React from 'react';
import { ShieldCheck, ArrowRight, Lock } from 'lucide-react';

interface HomeScreenProps {
  onStartReport: () => void;
  onOpenPrivacy: () => void;
  onNavigateToSupport?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartReport,
  onOpenPrivacy,
}) => {
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
      <div className="my-auto w-full max-w-sm mx-auto flex flex-col items-center">
        {/* Creative Visual Anchor */}
        <div className="relative w-full rounded-2xl overflow-hidden border border-[#CBD5E1] shadow-sm bg-white group">
          {/* Poignant Photography */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E2E8F0]">
            <img
              src="/holding_hands.jpg"
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
        <p className="mt-3.5 text-center text-xs text-[#556980] max-w-xs leading-relaxed">
          No roll numbers, names, or device IP logs. Your case is reviewed neutrally by the ombudsperson.
        </p>
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
