'use client';

import { FileText, MessageSquare } from 'lucide-react';

export type TabType = 'ehr' | 'ai-chat';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const tabs: { id: TabType; label: string; icon: typeof FileText }[] = [
    { id: 'ehr', label: 'EHR', icon: FileText },
    { id: 'ai-chat', label: 'AI Chat', icon: MessageSquare },
  ];

  return (
    <div className="bg-gray-200 border-b border-gray-300 h-10 flex items-end px-2 gap-0.5 relative z-30 w-full flex-shrink-0">
      {tabs.map((tab, index) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              group relative flex items-center gap-2 px-4 py-1.5 rounded-t-lg transition-all min-w-[120px] max-w-[240px] h-9
              ${activeTab === tab.id
                ? 'bg-white border-t-2 border-l border-r border-gray-300 shadow-[0_-2px_4px_rgba(0,0,0,0.05)] z-10 border-t-blue-500'
                : 'bg-gray-300 hover:bg-gray-250 border-t border-l border-r border-transparent hover:bg-gray-200'
              }
            `}
            style={{
              marginRight: index < tabs.length - 1 ? '-1px' : '0',
            }}
          >
            <Icon className={`w-4 h-4 flex-shrink-0 ${activeTab === tab.id ? 'text-gray-900' : 'text-gray-600'}`} />
            <span className={`text-sm font-semibold truncate flex-1 text-left ${activeTab === tab.id ? 'text-gray-900' : 'text-gray-700'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

