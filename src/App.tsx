import React, { useState, useEffect } from 'react';
import { ActiveTab } from './types';
import { HomeScreen } from './components/HomeScreen';
import { ReportScreen } from './components/ReportScreen';
import { TrackScreen } from './components/TrackScreen';
import { SupportScreen } from './components/SupportScreen';
import { BottomNav } from './components/BottomNav';
import { PrivacyModal } from './components/PrivacyModal';
import { QuickExitOverlay } from './components/QuickExitOverlay';
import { Smartphone, Monitor, Lock } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isQuickExit, setIsQuickExit] = useState(false);
  const [activeTrackToken, setActiveTrackToken] = useState<string>('');
  const [viewMode, setViewMode] = useState<'mobile' | 'responsive'>('mobile');

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
    <div className="w-screen h-screen bg-[#EBF3FA] text-[#0E1E32] font-sans flex flex-col antialiased selection:bg-[#D2E4F7] selection:text-[#0E1E32] overflow-hidden safe-area-inset" style={{ paddingTop: 'max(20px, env(safe-area-inset-top))' }}>
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

      {/* Main App Container - Full Screen Responsive */}
      <main className="w-full flex-1 flex flex-col justify-between bg-white overflow-hidden">
        {/* Active Screen View */}
        <div className={`flex-1 bg-white flex flex-col w-full ${activeTab === 'track' || activeTab === 'home' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
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
  );
}
