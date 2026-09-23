import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  ShieldCheck, 
  Clock, 
  Send, 
  AlertCircle, 
  MessageSquare, 
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import { IncidentReport } from '../types';
import { getStoredReports, addMessageToReport } from '../data/initialData';

interface TrackScreenProps {
  initialToken?: string;
  onNavigateToReport: () => void;
}

export const TrackScreen: React.FC<TrackScreenProps> = ({
  initialToken = '',
  onNavigateToReport
}) => {
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [searchToken, setSearchToken] = useState(initialToken);
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(null);
  const [errorNotFound, setErrorNotFound] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const loaded = getStoredReports();
    setReports(loaded);

    if (initialToken) {
      const match = loaded.find(r => r.id.toLowerCase() === initialToken.toLowerCase());
      if (match) {
        setSelectedReport(match);
      } else {
        setSearchToken(initialToken);
      }
    } else if (loaded.length > 0) {
      setSelectedReport(loaded[0]);
    }
  }, [initialToken]);

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorNotFound(false);
    const token = searchToken.trim();
    if (!token) return;

    try {
      const backendUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? `http://localhost:8000/api/complaint/${token}`
        : `http://10.0.2.2:8000/api/complaint/${token}`;

      const response = await fetch(backendUrl);
      if (!response.ok) throw new Error('Complaint not found');

      const data = await response.json();

      const report: IncidentReport = {
        id: token,
        createdAt: data.updated_at,
        category: 'General Safety',
        categoryLabel: 'Safety Report',
        location: 'Confidential',
        locationDetails: 'Confidential',
        approximateDate: data.updated_at,
        narrative: 'Content protected for privacy.',
        sanitizedNarrative: 'Content protected for privacy.',
        urgency: 'Not specified',
        desiredOutcome: 'Not specified',
        status: data.status.toLowerCase(),
        statusLabel: data.status,
        timeline: [
          {
            id: `tl-api-${Date.now()}`,
            timestamp: data.updated_at,
            title: `Status: ${data.status}`,
            description: `Current risk level: ${data.risk_level}. Emotion: ${data.emotion}.`,
            badge: 'Verified',
            actor: 'system'
          }
        ],
        messages: []
      };

      setSelectedReport(report);
      setErrorNotFound(false);
    } catch (error) {
      console.error('Tracking Error:', error);
      setErrorNotFound(true);
      setSelectedReport(null);
    }
  }, [searchToken]);

  const handleRefresh = useCallback(async () => {
    if (!selectedReport) return;
    setIsRefreshing(true);
    const token = selectedReport.id;
    try {
      const backendUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? `http://localhost:8000/api/complaint/${token}`
        : `http://10.0.2.2:8000/api/complaint/${token}`;
      const response = await fetch(backendUrl);
      if (!response.ok) throw new Error('Complaint not found');
      const data = await response.json();
      setSelectedReport(prev => {
        if (!prev) return null;
        return {
          ...prev,
          createdAt: data.updated_at,
          approximateDate: data.updated_at,
          status: data.status.toLowerCase(),
          statusLabel: data.status,
          timeline: [
            ...prev.timeline.filter(e => !e.id.startsWith('tl-api-')),
            {
              id: `tl-api-${Date.now()}`,
              timestamp: data.updated_at,
              title: `Status: ${data.status}`,
              description: `Current risk level: ${data.risk_level}. Emotion: ${data.emotion}.`,
              badge: 'Verified',
              actor: 'system'
            }
          ]
        };
      });
      setErrorNotFound(false);
    } catch (error) {
      console.error('Refresh Error:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedReport]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedReport) {
      interval = setInterval(() => {
        handleRefresh();
      }, 10000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedReport, handleRefresh]);

  const getStatusBadge = (status: IncidentReport['status']) => {
    switch (status) {
      case 'submitted':
        return <span className="text-[11px] font-medium text-[#1A4568] bg-[#EEF4FA] px-2 py-0.5 rounded border border-[#CBDCEE]">Intake Received</span>;
      case 'under_review':
        return <span className="text-[11px] font-medium text-[#1A4568] bg-[#EEF4FA] px-2 py-0.5 rounded border border-[#CBDCEE]">Under Review</span>;
      case 'advocate_assigned':
        return <span className="text-[11px] font-medium text-[#0C2340] bg-[#E2ECF7] px-2 py-0.5 rounded border border-[#B8D0E8]">Advocate Assigned</span>;
      case 'action_taken':
      case 'resolved':
        return <span className="text-[11px] font-medium text-[#1E5C45] bg-[#EDF7F2] px-2 py-0.5 rounded border border-[#BFDFD0]">Resolution Active</span>;
      default:
        return null;
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport || !replyText.trim()) return;
    const updated = addMessageToReport(selectedReport.id, replyText.trim());
    if (updated) {
      setSelectedReport(updated);
      setReports(getStoredReports());
      setReplyText('');
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden px-4 sm:px-6 pt-2 pb-3 bg-white">
      <div className="py-2.5 border-b border-[#E2E8F0] flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-[#0E1E32]">
            {isChatOpen ? 'Confidential Ombuds Channel' : 'Track a Confidential Report'}
          </h1>
          <p className="text-xs text-[#384D65] mt-0.5">
            {isChatOpen 
              ? 'Direct two-way shielded message channel with your assigned ombudsperson.' 
              : 'Enter your anonymous token to check safety measures and advocate actions.'}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 ml-3">
          {isChatOpen && (
            <button
              type="button"
              onClick={() => setIsChatOpen(false)}
              className="p-2 rounded-full border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9] text-[#0E1E32] transition-colors cursor-pointer shadow-2xs flex items-center justify-center group"
            >
              <ArrowLeft className="w-4 h-4 text-[#0E1E32] group-hover:-translate-x-0.5 transition-transform" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsChatOpen(prev => !prev)}
            className={`p-2 rounded-full border transition-colors cursor-pointer shadow-2xs flex items-center justify-center group ${
              isChatOpen ? 'bg-[#0E1E32] text-white border-[#0E1E32]' : 'bg-white hover:bg-[#F1F5F9] text-[#0E1E32] border-[#E2E8F0]'
            }`}
          >
            <MessageSquare className={`w-4 h-4 transition-transform group-hover:scale-105 ${isChatOpen ? 'text-white' : 'text-[#0E1E32]'}`} />
          </button>
        </div>
      </div>

      {isChatOpen ? (
        <div className="mt-3 max-w-md mx-auto w-full flex flex-col flex-1 overflow-hidden animate-in fade-in">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-[0_2px_12px_rgba(15,35,65,0.04)] flex flex-col flex-1 overflow-hidden">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#E2EDF7] mb-2 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#0E1E32]">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#0E1E32]">
                    Confidential Ombuds Channel
                  </h3>
                  <span className="text-[10px] text-[#4E657E]">
                    {selectedReport ? `Connected to Case: ${selectedReport.id}` : 'Direct Campus Ombuds Support'}
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-[#2E7D63] font-medium flex items-center gap-1 bg-[#EAF5F0] px-2 py-0.5 rounded-full border border-[#2E7D63]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D63]" />
                Shielded
              </span>
            </div>
            <div className="space-y-2.5 flex-1 overflow-y-auto pr-1 py-1">
              {[
                { id: 'm1', sender: 'system', timestamp: '10:00 AM', content: 'Hello. How can we assist you with your complaint?' },
                { id: 'm2', sender: 'student', timestamp: '10:01 AM', content: 'I would like an update on my report.' },
                { id: 'm3', sender: 'support', timestamp: '10:02 AM', content: 'Your report is currently under review. We will keep you updated.' },
              ].map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                    msg.sender === 'student'
                      ? 'bg-[#0E1E32] text-white ml-6 shadow-xs'
                      : 'bg-[#F8FAFC] text-[#0E1E32] border border-[#E2E8F0] mr-6'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 opacity-75 text-[10px]">
                    <span className="font-semibold">
                      {msg.sender === 'student' ? 'You (Anonymous)' : 'Campus Safety Ombudsperson'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p>{msg.content}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="mt-2 pt-2 border-t border-[#E2EDF7] shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Send a confidential follow-up note..."
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-[#E2E8F0] bg-white text-[#0E1E32] focus:outline-none focus:border-[#0E1E32]"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim() || !selectedReport}
                  className="px-3 py-1.5 bg-[#0E1E32] hover:bg-[#1B3150] text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-40 cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[9px] text-[#607994] mt-1">
                Replies are posted without any IP address or sender footprint.
              </p>
            </form>
          </div>
          <button
            type="button"
            onClick={() => setIsChatOpen(false)}
            className="mt-2 text-xs font-medium text-[#0E1E32] hover:text-[#1E4D82] flex items-center gap-1 self-center cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Status Overview</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col flex-1 overflow-hidden max-w-md mx-auto w-full animate-in fade-in pt-2">
          <form onSubmit={handleSearch} className="w-full shrink-0">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#607994]" />
                <input
                  type="text"
                  value={searchToken}
                  onChange={(e) => setSearchToken(e.target.value)}
                  placeholder="e.g. RBL-4821-SAFE"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E2E8F0] bg-white text-xs sm:text-sm text-[#0E1E32] font-mono focus:outline-none focus:border-[#0E1E32]"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 bg-[#0E1E32] hover:bg-[#1B3150] text-white rounded-xl font-medium text-xs transition-colors cursor-pointer shadow-[0_2px_8px_rgba(14,30,50,0.18)]"
              >
                Track
              </button>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto pb-0.5 text-xs text-[#607994]">
              <span className="text-[10px]">Recent:</span>
              {reports.length > 0 ? (
                reports.slice(0, 3).map((rep) => (
                  <button
                    key={rep.id}
                    type="button"
                    onClick={() => {
                      setSearchToken(rep.id);
                      setSelectedReport(rep);
                      setErrorNotFound(false);
                    }}
                    className={`px-2 py-0.5 rounded font-mono text-[10px] border transition-colors cursor-pointer ${
                      selectedReport?.id === rep.id
                        ? 'border-[#0E1E32] bg-[#0E1E32] text-white'
                        : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#0E1E32]'
                    }`}
                  >
                    {rep.id}
                  </button>
                ))
              ) : (
                <span className="italic opacity-70">No reports submitted yet.</span>
              )}
            </div>
            {errorNotFound && (
              <div className="mt-2 p-2 bg-[#FFF3ED] border border-[#E07A5F]/30 rounded-xl flex items-start gap-2 text-xs text-[#C44525]">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[11px]">Token not found</p>
                  <p className="text-[10px] text-[#524E48]">
                    Please verify your exact anonymous code format (e.g. RBL-xxxx-SAFE).
                  </p>
                </div>
              </div>
            )}
          </form>
          {selectedReport && (
            <div className="mt-3 flex flex-col flex-1 overflow-hidden space-y-2.5">
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-3 sm:p-3.5 shadow-xs shrink-0">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#607994] tracking-wider uppercase block">
                      Token: {selectedReport.id}
                    </span>
                    <h2 className="text-sm font-semibold text-[#0E1E32] mt-0.5">
                      {selectedReport.categoryLabel}
                    </h2>
                  </div>
                  {getStatusBadge(selectedReport.status)}
                </div>
                <div className="mt-2 pt-2 border-t border-[#E2EDF7] grid grid-cols-2 gap-2 text-[11px] text-[#4E657E]">
                  <div>
                    <span className="text-[9px] uppercase text-[#607994] block">Zone</span>
                    <span className="font-medium text-[#0E1E32]">{selectedReport.location}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-[#607994] block">Submitted</span>
                    <span className="font-medium text-[#0E1E32]">{selectedReport.createdAt}</span>
                  </div>
                </div>
                <div className="mt-2 p-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                  <span className="text-[9px] uppercase font-semibold text-[#1E4D82] block">
                    De-Identified Narrative on File
                  </span>
                  <p className="text-[11px] text-[#1A2E44] mt-0.5 italic leading-snug line-clamp-2">
                    "{selectedReport.sanitizedNarrative || selectedReport.narrative}"
                  </p>
                </div>
              </div>
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-3 shadow-xs flex flex-col flex-1 overflow-hidden">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8EDF4] mb-2 shrink-0">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#0E1E32] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#1E4D82]" />
                    <span>Campus Action Timeline</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className="p-1.5 rounded-lg bg-white border border-[#E2E8F0] text-[#0E1E32] hover:bg-[#F8FAFC] transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
                      title="Refresh Status"
                    >
                      <RefreshCw className="w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}" />
                    </button>
                    <span className="text-[10px] text-[#607994]">Scrollable</span>
                  </div>
                </div>
                <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E8F0] overflow-y-auto flex-1 pr-1.5 py-1">
                  {selectedReport.timeline.map((event) => (
                    <div key={event.id} className="relative pl-6">
                      <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-white border-2 border-[#0E1E32]" />
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold text-[#0E1E32]">{event.title}</h4>
                          <span className="text-[9px] text-[#607994]">{event.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-[#4E657E] mt-0.5 leading-relaxed">
                          {event.description}
                        </p>
                        {event.badge && (
                          <span className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded bg-[#F1F5F9] border border-[#E2E8F0] text-[#0E1E32] font-medium">
                            {event.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {!selectedReport && !errorNotFound && (
            <div className="mt-8 text-center max-w-sm mx-auto p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center mx-auto text-[#0E1E32] mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-[#0E1E32]">No Report Loaded</h3>
              <p className="text-xs text-[#4E657E] mt-1 leading-relaxed">
                Enter your token above to retrieve an existing report, or start a new confidential intake.
              </p>
              <button
                onClick={onNavigateToReport}
                className="mt-4 px-4 py-2 bg-[#0E1E32] hover:bg-[#1B3150] text-white rounded-xl text-xs font-medium transition-colors cursor-pointer shadow-[0_2px_8px_rgba(14,30,50,0.18)]"
              >
                Submit a New Report
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
