'use client';

import { LabResult } from '@/types';
import { FlaskConical } from 'lucide-react';

interface LabsPanelProps {
  labs: LabResult[];
}

export function LabsPanel({ labs }: LabsPanelProps) {
  if (labs.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-500">No lab results available.</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      Normal: 'bg-green-100 text-green-800',
      Abnormal: 'bg-yellow-100 text-yellow-800',
      Critical: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.Normal}`}>
        {status}
      </span>
    );
  };

  const groupedLabs = labs.reduce((acc, lab) => {
    if (!acc[lab.category]) {
      acc[lab.category] = [];
    }
    acc[lab.category].push(lab);
    return acc;
  }, {} as Record<string, LabResult[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedLabs).map(([category, categoryLabs]) => (
        <div key={category} className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{category}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference Range</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Result Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categoryLabs.map((lab) => (
                  <tr key={lab.id}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FlaskConical className="w-4 h-4 text-blue-600 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{lab.testName}</div>
                          <div className="text-xs text-gray-500">{lab.testCode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {lab.value} {lab.unit}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lab.referenceRange}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {getStatusBadge(lab.status)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lab.resultDate).toLocaleDateString('en-US')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

