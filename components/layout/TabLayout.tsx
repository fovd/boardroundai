'use client';

import { useState } from 'react';
import { TabBar, TabType } from './TabBar';
import { AIChat } from '@/components/ai/AIChat';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface TabLayoutProps {
  children: React.ReactNode;
}

export function TabLayout({ children }: TabLayoutProps) {
  const [activeTab, setActiveTab] = useState<TabType>('ehr');

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chrome-style tabs at the very top */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Content below tabs */}
      {activeTab === 'ehr' ? (
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 lg:p-6">
              {children}
            </main>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <AIChat />
        </div>
      )}
    </div>
  );
}

