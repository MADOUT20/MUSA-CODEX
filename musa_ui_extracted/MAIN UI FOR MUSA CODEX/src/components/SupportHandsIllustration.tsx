import React from 'react';

export const SupportHandsIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full max-w-[280px] mx-auto rounded-xl p-1.5 bg-[#F1F4F8] border border-[#D9E2EC] ${className}`}>
      {/* Editorial photograph container */}
      <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-[#E2E8F0] border border-[#CBD5E1]">
        <img
          src="/holding_hands.jpg"
          alt="Hands held together in support and solidarity"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
        {/* Soft natural film warmth overlay */}
        <div className="absolute inset-0 bg-[#0F223A]/10 pointer-events-none" />
      </div>
    </div>
  );
};


