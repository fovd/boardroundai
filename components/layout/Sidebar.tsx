'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Calendar, FileText, Settings } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Patients', href: '/', icon: Users, matchPattern: '/patient' },
  { name: 'Appointments', href: '/', icon: Calendar },
  { name: 'Reports', href: '/', icon: FileText },
  { name: 'Settings', href: '/', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex w-64 bg-gray-50 border-r border-gray-200 h-full overflow-y-auto flex-col flex-shrink-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">MedChart</h1>
        <p className="text-xs text-gray-500 mt-1">Electronic Health Records</p>
      </div>
      <nav className="px-4 space-y-1">
        {navigation.map((item) => {
          let isActive = false;
          if (pathname !== '/') {
            isActive = item.matchPattern
              ? pathname.startsWith(item.matchPattern)
              : pathname === item.href;
          }
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

