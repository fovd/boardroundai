'use client';

import { useState } from 'react';
import { VitalsPanel } from '@/components/sections/VitalsPanel';
import { MedicationsPanel } from '@/components/sections/MedicationsPanel';
import { LabsPanel } from '@/components/sections/LabsPanel';
import { AppointmentsPanel } from '@/components/sections/AppointmentsPanel';
import { NotesPanel } from '@/components/sections/NotesPanel';
import { ImagingPanel } from '@/components/sections/ImagingPanel';
import { VitalSign, Medication, LabResult, Appointment, ClinicalNote, ImagingStudy } from '@/types';

interface PatientTabsProps {
  vitals: VitalSign[];
  medications: Medication[];
  labs: LabResult[];
  appointments: Appointment[];
  notes: ClinicalNote[];
  imaging: ImagingStudy[];
}

const tabs = [
  { id: 'vitals', label: 'Vitals' },
  { id: 'medications', label: 'Medications' },
  { id: 'labs', label: 'Labs' },
  { id: 'imaging', label: 'Imaging' },
  { id: 'appointments', label: 'Appointments' },
  { id: 'notes', label: 'Notes' }
];

export function PatientTabs({
  vitals,
  medications,
  labs,
  appointments,
  notes,
  imaging
}: PatientTabsProps) {
  const [activeTab, setActiveTab] = useState('vitals');

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-2 px-4 border-b-2 font-medium text-sm transition-colors relative
                ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-gray-700 hover:text-gray-900'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="py-6">
        {activeTab === 'vitals' && <VitalsPanel vitals={vitals} />}
        {activeTab === 'medications' && <MedicationsPanel medications={medications} />}
        {activeTab === 'labs' && <LabsPanel labs={labs} />}
        {activeTab === 'imaging' && <ImagingPanel imaging={imaging} />}
        {activeTab === 'appointments' && <AppointmentsPanel appointments={appointments} />}
        {activeTab === 'notes' && <NotesPanel notes={notes} />}
      </div>
    </div>
  );
}

