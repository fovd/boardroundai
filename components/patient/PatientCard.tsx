'use client';

import { Patient } from '@/types';
import { User, Phone, Mail, Calendar } from 'lucide-react';
import Link from 'next/link';

interface PatientCardProps {
  patient: Patient;
}

export function PatientCard({ patient }: PatientCardProps) {
  return (
    <Link href={`/patient/${patient.id}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {patient.firstName} {patient.lastName}
              </h3>
              <p className="text-sm text-gray-500 mb-4">MRN: {patient.mrn}</p>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{patient.age} years old, {patient.gender}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center col-span-2">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{patient.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

