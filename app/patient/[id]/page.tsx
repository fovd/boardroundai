import { notFound } from 'next/navigation';
import { getPatientById, getVitalsByPatientId, getMedicationsByPatientId, getLabsByPatientId, getAppointmentsByPatientId, getNotesByPatientId, getImagingByPatientId } from '@/lib/mockData';
import { PatientTabs } from '@/components/patient/PatientTabs';
import { User, Phone, Mail, MapPin, CreditCard, UserCheck } from 'lucide-react';

interface PatientPageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientPage({ params }: PatientPageProps) {
  const { id } = await params;
  const patient = getPatientById(id);

  if (!patient) {
    notFound();
  }

  const vitals = getVitalsByPatientId(id);
  const medications = getMedicationsByPatientId(id);
  const labs = getLabsByPatientId(id);
  const appointments = getAppointmentsByPatientId(id);
  const notes = getNotesByPatientId(id);
  const imaging = getImagingByPatientId(id);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {patient.firstName} {patient.lastName}
        </h1>
        <p className="text-gray-600 mt-1">MRN: {patient.mrn}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6 h-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Demographics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start">
                <User className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Age & Gender</p>
                  <p className="text-base font-medium text-gray-900">{patient.age} years old, {patient.gender}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-base font-medium text-gray-900">{patient.phone}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-base font-medium text-gray-900">{patient.email}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-base font-medium text-gray-900">{patient.address}</p>
                </div>
              </div>
              <div className="flex items-start">
                <CreditCard className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Insurance</p>
                  <p className="text-base font-medium text-gray-900">{patient.insurance}</p>
                </div>
              </div>
              <div className="flex items-start">
                <UserCheck className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Primary Care</p>
                  <p className="text-base font-medium text-gray-900">{patient.primaryCarePhysician}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 h-full">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Summary</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="text-base font-medium text-gray-900">
                {new Date(patient.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Medications</p>
              <p className="text-2xl font-bold text-blue-600">
                {medications.filter(m => m.status === 'Active').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Upcoming Appointments</p>
              <p className="text-2xl font-bold text-blue-600">
                {appointments.filter(a => a.status === 'Scheduled').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <PatientTabs
          vitals={vitals}
          medications={medications}
          labs={labs}
          appointments={appointments}
          notes={notes}
          imaging={imaging}
        />
      </div>
    </div>
  );
}

