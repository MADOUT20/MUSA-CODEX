import React from 'react';
import { ShieldCheck, Lock, EyeOff, FileText, X } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E1E32]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white border border-[#E2E8F0] rounded-2xl shadow-xl p-6 text-[#0E1E32]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#0E1E32]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-[#0E1E32]">How Privacy Works</h3>
              <p className="text-xs text-[#607994]">Guaranteed Campus Safety Protocol</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-[#607994] hover:text-[#0E1E32] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Pillars */}
        <div className="mt-5 space-y-3 text-sm leading-relaxed text-[#1A2E44]">
          <div className="p-3.5 bg-white border border-[#E2E8F0] rounded-xl flex gap-3 items-start shadow-2xs">
            <EyeOff className="w-5 h-5 text-[#2E7D63] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-xs tracking-wider uppercase text-[#0E1E32]">No Identity Record</h4>
              <p className="text-xs text-[#4E657E] mt-1">
                You are never asked for your student ID, enrollment number, name, or phone number. The submission is entirely decoupled from university directories.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-white border border-[#E2E8F0] rounded-xl flex gap-3 items-start shadow-2xs">
            <Lock className="w-5 h-5 text-[#1E4D82] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-xs tracking-wider uppercase text-[#0E1E32]">Zero IP or Device Logging</h4>
              <p className="text-xs text-[#4E657E] mt-1">
                Network addresses, browser fingerprints, and physical geolocation are purged at intake. The campus IT infrastructure cannot link this traffic to your device.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-white border border-[#E2E8F0] rounded-xl flex gap-3 items-start shadow-2xs">
            <FileText className="w-5 h-5 text-[#2B6CB0] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-xs tracking-wider uppercase text-[#0E1E32]">Private Tokenized Tracking</h4>
              <p className="text-xs text-[#4E657E] mt-1">
                A cryptographic token (e.g. <span className="font-mono font-medium text-[#0E1E32]">RBL-8924-X</span>) is generated exclusively in your browser. Only someone holding this key can check status updates.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-white border border-[#E2E8F0] rounded-xl flex gap-3 items-start shadow-2xs">
            <ShieldCheck className="w-5 h-5 text-[#0E1E32] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-xs tracking-wider uppercase text-[#0E1E32]">Protected Two-Way Channel</h4>
              <p className="text-xs text-[#4E657E] mt-1">
                Campus safety ombudspersons can reply to your report to provide updates or safety measures, without ever knowing who they are speaking with.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-[#E2E8F0]">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-[#0E1E32] hover:bg-[#1B3150] text-white rounded-xl font-medium text-sm transition-colors cursor-pointer shadow-[0_2px_8px_rgba(14,30,50,0.18)]"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
