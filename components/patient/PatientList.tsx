'use client';

import { Patient } from '@/types';
import { DataTable } from '@/components/ui/DataTable';
import { useRouter } from 'next/navigation';

interface PatientListProps {
  patients: Patient[];
}

export function PatientList({ patients }: PatientListProps) {
  const router = useRouter();

  const columns = [
    {
      header: 'Name',
      accessor: (row: Patient) => (
        <div className="font-medium text-gray-900">
          {row.firstName} {row.lastName}
        </div>
      )
    },
    {
      header: 'MRN',
      accessor: 'mrn' as keyof Patient
    },
    {
      header: 'Age',
      accessor: (row: Patient) => `${row.age} years`
    },
    {
      header: 'Gender',
      accessor: 'gender' as keyof Patient
    },
    {
      header: 'Date of Birth',
      accessor: (row: Patient) => new Date(row.dateOfBirth).toLocaleDateString('en-US')
    },
    {
      header: 'Phone',
      accessor: 'phone' as keyof Patient
    },
    {
      header: 'Primary Care',
      accessor: 'primaryCarePhysician' as keyof Patient
    }
  ];

  const handleRowClick = (patient: Patient) => {
    router.push(`/patient/${patient.id}`);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Patients</h2>
      </div>
      <DataTable
        data={patients}
        columns={columns}
        onRowClick={handleRowClick}
        keyExtractor={(row) => row.id}
      />
    </div>
  );
}

