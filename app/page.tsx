import { PatientList } from '@/components/patient/PatientList';
import { mockPatients } from '@/lib/mockData';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage and view patient records</p>
      </div>
      <PatientList patients={mockPatients} />
    </div>
  );
}
