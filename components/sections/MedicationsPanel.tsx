'use client';

import { Medication } from '@/types';
import { Pill } from 'lucide-react';

interface MedicationsPanelProps {
  medications: Medication[];
}

export function MedicationsPanel({ medications }: MedicationsPanelProps) {
  if (medications.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-500">No medications recorded.</p>
      </div>
    );
  }

  const activeMedications = medications.filter(m => m.status === 'Active');
  const inactiveMedications = medications.filter(m => m.status !== 'Active');

  const getStatusBadge = (status: string) => {
    const styles = {
      Active: 'bg-green-100 text-green-800',
      Discontinued: 'bg-red-100 text-red-800',
      Completed: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.Completed}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {activeMedications.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Medications</h3>
          <div className="space-y-4">
            {activeMedications.map((med) => (
              <div key={med.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Pill className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{med.name}</h4>
                        {getStatusBadge(med.status)}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Dosage:</span> {med.dosage}
                        </div>
                        <div>
                          <span className="font-medium">Frequency:</span> {med.frequency}
                        </div>
                        <div>
                          <span className="font-medium">Route:</span> {med.route}
                        </div>
                        <div>
                          <span className="font-medium">Start Date:</span> {new Date(med.startDate).toLocaleDateString('en-US')}
                        </div>
                      </div>
                      {med.instructions && (
                        <p className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Instructions:</span> {med.instructions}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-gray-500">
                        Prescribed by {med.prescribedBy}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {inactiveMedications.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Inactive Medications</h3>
          <div className="space-y-4">
            {inactiveMedications.map((med) => (
              <div key={med.id} className="bg-white rounded-lg border border-gray-200 p-4 opacity-75">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Pill className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{med.name}</h4>
                        {getStatusBadge(med.status)}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Dosage:</span> {med.dosage}
                        </div>
                        <div>
                          <span className="font-medium">Frequency:</span> {med.frequency}
                        </div>
                        {med.endDate && (
                          <div>
                            <span className="font-medium">End Date:</span> {new Date(med.endDate).toLocaleDateString('en-US')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

