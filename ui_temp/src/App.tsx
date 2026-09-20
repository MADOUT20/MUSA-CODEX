import React, { useState, useEffect } from 'react';
import { ActiveTab } from './types';
import { HomeScreen } from './components/HomeScreen';
import { ReportScreen } from './components/ReportScreen';
import { TrackScreen } from './components/TrackScreen';
import { SupportScreen } from './components/SupportScreen';
import { BottomNav } from './components/BottomNav';
import { PrivacyModal } from './components/PrivacyModal';
import { QuickExitOverlay } from './components/QuickExitOverlay';
import { Lock } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isQuickExit, setIsQuickExit] = useState(false);
  const [activeTrackToken, setActiveTrackToken] = useState<string>('');

  // Keyboard shortcut: double tap Escape for instant Quick Exit
  useEffect(() => {
    let lastEscapeTime = 0;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const now = Date.now();
        if (now - lastEscapeTime < 500) {
          setIsQuickExit(prev => !prev);
        }
        lastEscapeTime = now;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleStartReport = () => {
    setActiveTab('report');
  };

  const handleTrackReport = () => {
    setActiveTab('track');
  };

  const handleReportSubmitted = (token: string) => {
    setActiveTrackToken(token);
    setActiveTab('track');
  };

  return (
    <div className="min-h-screen bg-[#EBF3FA] text-[#0E1E32] font-sans flex flex-col items-center justify-start antialiased selection:bg-[#D2E4F7] selection:text-[#0E1E32]">
      {/* Decoy Quick Exit Academic Screen */}
      <QuickExitOverlay
        isActive={isQuickExit}
        onRestore={() => setIsQuickExit(false)}
      />

      {/* Privacy Safeguards Explanation Modal */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Header Bar */}
      <aside className="w-full bg-white/95 backdrop-blur-xs border-b border-[#D5E3F0] py-2 px-4 sm:px-6 flex items-center justify-between text-xs text-[#4D647E]">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1B4D82] animate-pulse" />
            <span className="font-semibold text-[#0E1E32] tracking-tight">READ BETWEEN THE LINES</span>
          </div>
          <span className="hidden sm:inline text-[#A0B8D0]">•</span>
          <span className="hidden sm:inline text-[11px] text-[#475E77]">University Anonymous Anti-Ragging Vault</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Exit trigger button */}
          <button
            onClick={() => setIsQuickExit(true)}
            className="flex items-center gap-1.5 text-[11px] font-medium text-[#0E1E32] hover:text-[#A82B3B] px-2.5 py-1 rounded-md bg-white hover:bg-[#FFF5F5] border border-[#D5E3F0] transition-colors cursor-pointer shadow-2xs"
            title="Press Esc twice or click to activate Quick Exit"
          >
            <Lock className="w-3 h-3 text-[#526B84]" />
            <span className="hidden xs:inline">Quick Exit (Esc)</span>
          </button>
        </div>
      </aside>

      {/* Main App Container */}
      <div className="w-full flex-1 flex flex-col justify-start items-center py-0">
        <main
          className="w-full flex flex-col justify-between bg-white transition-all max-w-full min-h-screen border-x border-[#CBD5E1] shadow-sm"
        >
          {/* Active Screen View */}
          <div className={`flex-1 bg-white flex flex-col ${activeTab === 'track' || activeTab === 'home' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
            {activeTab === 'home' && (
              <HomeScreen
                onStartReport={handleStartReport}
                onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
                onNavigateToSupport={() => setActiveTab('support')}
              />
            )}

            {activeTab === 'report' && (
              <ReportScreen
                onReportSubmitted={handleReportSubmitted}
                onCancel={() => setActiveTab('home')}
                onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
              />
            )}

            {activeTab === 'track' && (
              <TrackScreen
                initialToken={activeTrackToken}
                onNavigateToReport={() => setActiveTab('report')}
              />
            )}

            {activeTab === 'support' && (
              <SupportScreen
                onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
              />
            )}
          </div>

          {/* Fixed/Sticky Bottom Navigation */}
          <BottomNav
            activeTab={activeTab}
            onSelectTab={(tab) => setActiveTab(tab)}
          />
        </main>
      </div>
    </div>
  );
}
