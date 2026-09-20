import React, { useState } from 'react';
import { Search, BookOpen, ExternalLink, RefreshCw } from 'lucide-react';

interface QuickExitOverlayProps {
  isActive: boolean;
  onRestore: () => void;
}

export const QuickExitOverlay: React.FC<QuickExitOverlayProps> = ({ isActive, onRestore }) => {
  const [searchQuery, setSearchQuery] = useState('differential equations in ecology');

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#FFFFFF] text-[#20202A] overflow-y-auto font-sans">
      {/* Decoy Campus Academic Library Navbar */}
      <header className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#1A365D] flex items-center justify-center text-white">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-[#0F172A] tracking-tight">University Library Catalog</h1>
            <p className="text-[11px] text-[#64748B]">Digital Repository & Scholarly Journals</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Subtle emergency exit to Google */}
          <a
            href="https://www.google.com"
            className="text-xs text-[#64748B] hover:text-[#0F172A] px-2.5 py-1.5 rounded border border-[#CBD5E1] flex items-center gap-1"
          >
            Leave to Google <ExternalLink className="w-3 h-3" />
          </a>
          
          {/* Discreet resume button for the user */}
          <button
            onClick={onRestore}
            className="text-xs text-[#64748B] hover:text-[#0F172A] p-1.5 rounded hover:bg-[#E2E8F0] transition-colors"
            title="Resume session"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Decoy Search Bar */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#1A365D]"
              placeholder="Search peer-reviewed articles, books, dissertations..."
            />
          </div>
          <div className="flex gap-2 mt-2 text-xs text-[#64748B]">
            <span>Filter:</span>
            <span className="underline cursor-pointer">Peer-Reviewed Only</span>
            <span>•</span>
            <span className="underline cursor-pointer">Full Text Online</span>
            <span>•</span>
            <span className="underline cursor-pointer">2022 - 2026</span>
          </div>
        </div>

        {/* Decoy Academic Articles */}
        <div className="space-y-6">
          <div className="p-4 rounded-lg border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all">
            <span className="text-[11px] font-semibold text-[#0D9488] uppercase tracking-wider">Journal of Theoretical Biology • Vol 48</span>
            <h2 className="text-base font-medium text-[#1A365D] mt-1 hover:underline cursor-pointer">
              Nonlinear Dynamics and Stability in Multi-Species Predator-Prey Models with Spatial Heterogeneity
            </h2>
            <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
              This paper analyzes coupled non-linear partial differential equations describing population densities with diffusive dispersal gradients across varied biological habitats...
            </p>
            <div className="mt-3 flex items-center gap-4 text-xs text-[#64748B]">
              <span>PDF Full Text (2.4 MB)</span>
              <span>•</span>
              <span>Citations (42)</span>
              <span>•</span>
              <span>DOI: 10.1016/j.jtbi.2024.11029</span>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all">
            <span className="text-[11px] font-semibold text-[#0D9488] uppercase tracking-wider">Applied Mathematics Quarterly • Issue 12</span>
            <h2 className="text-base font-medium text-[#1A365D] mt-1 hover:underline cursor-pointer">
              Numerical Methods for Boundary Value Discretization in Turbulent Flow Regimes
            </h2>
            <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
              Formulation of second-order compact difference schemes applied to Reynolds-averaged Navier-Stokes equations within complex orthogonal curvilinear coordinates...
            </p>
            <div className="mt-3 flex items-center gap-4 text-xs text-[#64748B]">
              <span>PDF Full Text (1.8 MB)</span>
              <span>•</span>
              <span>Citations (19)</span>
              <span>•</span>
              <span>DOI: 10.1137/amq.2025.0489</span>
            </div>
          </div>
        </div>

        {/* Discreet bottom restore bar */}
        <div className="mt-12 pt-6 border-t border-[#E2E8F0] flex justify-between items-center text-xs text-[#94A3B8]">
          <p>University Library System v4.12 • Session Active</p>
          <button
            onClick={onRestore}
            className="text-xs text-[#64748B] hover:text-[#1A365D] underline font-medium"
          >
            Click here to resume confidential portal
          </button>
        </div>
      </main>
    </div>
  );
};
