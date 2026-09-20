import React from 'react';
import { Home, FileEdit, FileSearch, Headphones } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    {
      id: 'home' as ActiveTab,
      label: 'Home',
      icon: Home,
    },
    {
      id: 'report' as ActiveTab,
      label: 'Report',
      icon: FileEdit,
    },
    {
      id: 'track' as ActiveTab,
      label: 'Track',
      icon: FileSearch,
    },
    {
      id: 'support' as ActiveTab,
      label: 'Support',
      icon: Headphones,
    },
  ];

  return (
    <nav
      className="sticky bottom-0 z-40 w-full bg-[#FAFBFD] border-t border-[#DDE5ED] py-2.5 px-3"
      aria-label="Main Navigation"
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className="flex flex-col items-center justify-center min-w-[70px] py-2 cursor-pointer transition-colors group"
            >
              <div
                className={`p-2 rounded-md transition-colors ${
                  isActive
                    ? 'text-[#0C2340]'
                    : 'text-[#64748B] group-hover:text-[#0C2340]'
                }`}
              >
                <IconComponent className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
              </div>

              {/* Label */}
              <span
                className={`text-[11px] tracking-tight transition-colors mt-0.5 ${
                  isActive
                    ? 'font-semibold text-[#0C2340]'
                    : 'font-normal text-[#64748B] group-hover:text-[#0C2340]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
