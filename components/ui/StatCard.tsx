import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  status?: 'normal' | 'abnormal' | 'warning';
  icon?: React.ReactNode;
}

export function StatCard({ label, value, unit, status, icon }: StatCardProps) {
  const statusColors = {
    normal: 'border-l-green-500',
    abnormal: 'border-l-red-500',
    warning: 'border-l-yellow-500'
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 border-l-4 ${status ? statusColors[status] : 'border-l-blue-500'}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">
            {value}
            {unit && <span className="text-lg text-gray-500 ml-1">{unit}</span>}
          </p>
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
    </div>
  );
}

