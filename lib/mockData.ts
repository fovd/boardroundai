import { Patient, VitalSign, Medication, LabResult, Appointment, ClinicalNote, ImagingStudy } from '@/types';

export const mockPatients: Patient[] = [
  {
    id: '1',
    mrn: 'MRN001234',
    firstName: 'John',
    lastName: 'Smith',
    dateOfBirth: '1985-03-15',
    age: 39,
    gender: 'Male',
    phone: '(555) 123-4567',
    email: 'john.smith@email.com',
    address: '123 Main St, City, ST 12345',
    insurance: 'BlueCross BlueShield',
    primaryCarePhysician: 'Dr. Sarah Johnson'
  },
  {
    id: '2',
    mrn: 'MRN002567',
    firstName: 'Maria',
    lastName: 'Garcia',
    dateOfBirth: '1990-07-22',
    age: 34,
    gender: 'Female',
    phone: '(555) 234-5678',
    email: 'maria.garcia@email.com',
    address: '456 Oak Ave, City, ST 12345',
    insurance: 'Aetna',
    primaryCarePhysician: 'Dr. Michael Chen'
  },
  {
    id: '3',
    mrn: 'MRN003890',
    firstName: 'Robert',
    lastName: 'Williams',
    dateOfBirth: '1978-11-08',
    age: 46,
    gender: 'Male',
    phone: '(555) 345-6789',
    email: 'robert.williams@email.com',
    address: '789 Elm St, City, ST 12345',
    insurance: 'UnitedHealthcare',
    primaryCarePhysician: 'Dr. Sarah Johnson'
  },
  {
    id: '4',
    mrn: 'MRN004123',
    firstName: 'Emily',
    lastName: 'Davis',
    dateOfBirth: '1995-02-14',
    age: 29,
    gender: 'Female',
    phone: '(555) 456-7890',
    email: 'emily.davis@email.com',
    address: '321 Pine Rd, City, ST 12345',
    insurance: 'Cigna',
    primaryCarePhysician: 'Dr. Michael Chen'
  },
  {
    id: '5',
    mrn: 'MRN005456',
    firstName: 'James',
    lastName: 'Brown',
    dateOfBirth: '1982-09-30',
    age: 42,
    gender: 'Male',
    phone: '(555) 567-8901',
    email: 'james.brown@email.com',
    address: '654 Maple Dr, City, ST 12345',
    insurance: 'BlueCross BlueShield',
    primaryCarePhysician: 'Dr. Sarah Johnson'
  }
];

export const mockVitals: VitalSign[] = [
  {
    id: 'v1',
    patientId: '1',
    timestamp: '2024-01-15T10:30:00',
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80,
    heartRate: 72,
    temperature: 98.6,
    respiratoryRate: 16,
    oxygenSaturation: 98,
    weight: 185,
    height: 70,
    bmi: 26.5,
    recordedBy: 'Nurse Jane Doe'
  },
  {
    id: 'v2',
    patientId: '2',
    timestamp: '2024-01-15T09:15:00',
    bloodPressureSystolic: 118,
    bloodPressureDiastolic: 75,
    heartRate: 68,
    temperature: 98.4,
    respiratoryRate: 14,
    oxygenSaturation: 99,
    weight: 140,
    height: 65,
    bmi: 23.3,
    recordedBy: 'Nurse John Smith'
  },
  {
    id: 'v3',
    patientId: '1',
    timestamp: '2024-01-10T14:20:00',
    bloodPressureSystolic: 125,
    bloodPressureDiastolic: 82,
    heartRate: 75,
    temperature: 98.7,
    respiratoryRate: 17,
    oxygenSaturation: 97,
    weight: 186,
    height: 70,
    bmi: 26.7,
    recordedBy: 'Nurse Jane Doe'
  }
];

export const mockMedications: Medication[] = [
  {
    id: 'm1',
    patientId: '1',
    name: 'Lisinopril',
    dosage: '10 mg',
    frequency: 'Once daily',
    route: 'Oral',
    startDate: '2023-06-01',
    prescribedBy: 'Dr. Sarah Johnson',
    status: 'Active',
    instructions: 'Take with or without food'
  },
  {
    id: 'm2',
    patientId: '1',
    name: 'Metformin',
    dosage: '500 mg',
    frequency: 'Twice daily',
    route: 'Oral',
    startDate: '2023-08-15',
    prescribedBy: 'Dr. Sarah Johnson',
    status: 'Active',
    instructions: 'Take with meals'
  },
  {
    id: 'm3',
    patientId: '2',
    name: 'Levothyroxine',
    dosage: '75 mcg',
    frequency: 'Once daily',
    route: 'Oral',
    startDate: '2022-01-10',
    prescribedBy: 'Dr. Michael Chen',
    status: 'Active',
    instructions: 'Take on empty stomach, 30 minutes before breakfast'
  },
  {
    id: 'm4',
    patientId: '2',
    name: 'Ibuprofen',
    dosage: '400 mg',
    frequency: 'As needed',
    route: 'Oral',
    startDate: '2023-12-01',
    endDate: '2024-01-01',
    prescribedBy: 'Dr. Michael Chen',
    status: 'Completed',
    instructions: 'Take with food, maximum 3 times per day'
  }
];

export const mockLabs: LabResult[] = [
  {
    id: 'l1',
    patientId: '1',
    testName: 'Complete Blood Count',
    testCode: 'CBC',
    value: 'Normal',
    unit: '',
    referenceRange: 'Normal',
    status: 'Normal',
    orderedDate: '2024-01-10',
    resultDate: '2024-01-11',
    orderedBy: 'Dr. Sarah Johnson',
    category: 'Hematology'
  },
  {
    id: 'l2',
    patientId: '1',
    testName: 'Hemoglobin A1C',
    testCode: 'HbA1c',
    value: 6.2,
    unit: '%',
    referenceRange: '< 5.7%',
    status: 'Abnormal',
    orderedDate: '2024-01-10',
    resultDate: '2024-01-11',
    orderedBy: 'Dr. Sarah Johnson',
    category: 'Chemistry'
  },
  {
    id: 'l3',
    patientId: '1',
    testName: 'Lipid Panel',
    testCode: 'LIPID',
    value: 185,
    unit: 'mg/dL',
    referenceRange: '< 200 mg/dL',
    status: 'Normal',
    orderedDate: '2024-01-10',
    resultDate: '2024-01-11',
    orderedBy: 'Dr. Sarah Johnson',
    category: 'Chemistry'
  },
  {
    id: 'l4',
    patientId: '2',
    testName: 'TSH (Thyroid Stimulating Hormone)',
    testCode: 'TSH',
    value: 2.5,
    unit: 'mIU/L',
    referenceRange: '0.4 - 4.0 mIU/L',
    status: 'Normal',
    orderedDate: '2024-01-08',
    resultDate: '2024-01-09',
    orderedBy: 'Dr. Michael Chen',
    category: 'Endocrinology'
  },
  {
    id: 'l5',
    patientId: '2',
    testName: 'Complete Metabolic Panel',
    testCode: 'CMP',
    value: 'Normal',
    unit: '',
    referenceRange: 'Normal',
    status: 'Normal',
    orderedDate: '2024-01-08',
    resultDate: '2024-01-09',
    orderedBy: 'Dr. Michael Chen',
    category: 'Chemistry'
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: 'a1',
    patientId: '1',
    date: '2024-01-20',
    time: '10:00 AM',
    provider: 'Dr. Sarah Johnson',
    department: 'Primary Care',
    type: 'Follow-up',
    status: 'Scheduled',
    reason: 'Diabetes management follow-up'
  },
  {
    id: 'a2',
    patientId: '1',
    date: '2024-01-05',
    time: '2:30 PM',
    provider: 'Dr. Sarah Johnson',
    department: 'Primary Care',
    type: 'Office Visit',
    status: 'Completed',
    reason: 'Annual physical exam',
    notes: 'Patient doing well, medications adjusted'
  },
  {
    id: 'a3',
    patientId: '2',
    date: '2024-01-22',
    time: '11:00 AM',
    provider: 'Dr. Michael Chen',
    department: 'Endocrinology',
    type: 'Follow-up',
    status: 'Scheduled',
    reason: 'Thyroid function monitoring'
  },
  {
    id: 'a4',
    patientId: '2',
    date: '2024-01-02',
    time: '9:00 AM',
    provider: 'Dr. Michael Chen',
    department: 'Endocrinology',
    type: 'Office Visit',
    status: 'Completed',
    reason: 'Routine check-up',
    notes: 'All labs within normal limits'
  }
];

export const mockNotes: ClinicalNote[] = [
  {
    id: 'n1',
    patientId: '1',
    date: '2024-01-05',
    time: '2:45 PM',
    author: 'Dr. Sarah Johnson',
    authorRole: 'Primary Care Physician',
    category: 'Progress Note',
    title: 'Annual Physical Exam',
    content: 'Patient presents for annual physical exam. Blood pressure well controlled on current medications. Diabetes management stable with HbA1c of 6.2%. Patient reports good adherence to medication regimen. No new concerns. Plan: Continue current medications, repeat labs in 3 months.',
    tags: ['Physical Exam', 'Diabetes', 'Hypertension']
  },
  {
    id: 'n2',
    patientId: '1',
    date: '2024-01-05',
    time: '2:50 PM',
    author: 'Dr. Sarah Johnson',
    authorRole: 'Primary Care Physician',
    category: 'Assessment and Plan',
    title: 'Medication Review',
    content: 'Reviewed current medications. Lisinopril 10mg daily - continue. Metformin 500mg twice daily - continue. Patient tolerating well with no side effects reported.',
    tags: ['Medications', 'Review']
  },
  {
    id: 'n3',
    patientId: '2',
    date: '2024-01-02',
    time: '9:15 AM',
    author: 'Dr. Michael Chen',
    authorRole: 'Endocrinologist',
    category: 'Progress Note',
    title: 'Thyroid Function Follow-up',
    content: 'Patient presents for routine thyroid function monitoring. TSH level is 2.5 mIU/L, within normal range. Patient reports feeling well with good energy levels. Current Levothyroxine dose appears appropriate. Plan: Continue current medication, follow-up in 6 months.',
    tags: ['Thyroid', 'Follow-up']
  },
  {
    id: 'n4',
    patientId: '2',
    date: '2024-01-02',
    time: '9:20 AM',
    author: 'Dr. Michael Chen',
    authorRole: 'Endocrinologist',
    category: 'Assessment and Plan',
    title: 'Lab Results Review',
    content: 'Reviewed recent lab results. Complete Metabolic Panel within normal limits. TSH 2.5 mIU/L (normal). Patient counseled on importance of medication adherence.',
    tags: ['Labs', 'Review']
  }
];

export const mockImaging: ImagingStudy[] = [
  {
    id: 'img1',
    patientId: '1',
    studyType: 'Chest X-Ray',
    studyCode: 'XR-CHEST',
    bodyPart: 'Chest',
    orderedDate: '2024-01-10',
    performedDate: '2024-01-10',
    orderedBy: 'Dr. Sarah Johnson',
    performedBy: 'Dr. Robert Martinez, Radiologist',
    status: 'Completed',
    images: [
      {
        id: 'img1-1',
        description: 'PA and Lateral views',
        view: 'PA View'
      },
      {
        id: 'img1-2',
        description: 'PA and Lateral views',
        view: 'Lateral View'
      }
    ],
    report: {
      id: 'rpt1',
      date: '2024-01-10',
      author: 'Dr. Robert Martinez',
      authorRole: 'Radiologist',
      findings: 'The heart is normal in size and configuration. The mediastinal contours are within normal limits. The lungs are clear bilaterally without evidence of acute infiltrates, consolidation, or pleural effusion. The bony structures are intact. No acute cardiopulmonary abnormalities.',
      impression: 'Normal chest X-ray. No acute findings.',
      recommendations: 'No follow-up imaging required at this time.'
    }
  },
  {
    id: 'img2',
    patientId: '1',
    studyType: 'Chest X-Ray',
    studyCode: 'XR-CHEST',
    bodyPart: 'Chest',
    orderedDate: '2023-12-05',
    performedDate: '2023-12-05',
    orderedBy: 'Dr. Sarah Johnson',
    performedBy: 'Dr. Robert Martinez, Radiologist',
    status: 'Completed',
    images: [
      {
        id: 'img2-1',
        description: 'PA view only',
        view: 'PA View'
      }
    ],
    report: {
      id: 'rpt2',
      date: '2023-12-05',
      author: 'Dr. Robert Martinez',
      authorRole: 'Radiologist',
      findings: 'The heart size is within normal limits. The mediastinum is unremarkable. Both lungs are clear without evidence of acute disease. No pleural effusion or pneumothorax. The osseous structures appear intact.',
      impression: 'Normal chest X-ray examination.'
    }
  },
  {
    id: 'img3',
    patientId: '2',
    studyType: 'Chest X-Ray',
    studyCode: 'XR-CHEST',
    bodyPart: 'Chest',
    orderedDate: '2024-01-08',
    performedDate: '2024-01-08',
    orderedBy: 'Dr. Michael Chen',
    performedBy: 'Dr. Robert Martinez, Radiologist',
    status: 'Completed',
    images: [
      {
        id: 'img3-1',
        description: 'PA and Lateral views',
        view: 'PA View'
      },
      {
        id: 'img3-2',
        description: 'PA and Lateral views',
        view: 'Lateral View'
      }
    ],
    report: {
      id: 'rpt3',
      date: '2024-01-08',
      author: 'Dr. Robert Martinez',
      authorRole: 'Radiologist',
      findings: 'The cardiac silhouette is normal in size. The mediastinal structures are within normal limits. Clear lung fields bilaterally. No evidence of acute pulmonary disease, pleural effusion, or pneumothorax. The visualized osseous structures are intact.',
      impression: 'Normal chest radiograph.'
    }
  }
];

export function getPatientById(id: string): Patient | undefined {
  return mockPatients.find(p => p.id === id);
}

export function getVitalsByPatientId(patientId: string): VitalSign[] {
  return mockVitals.filter(v => v.patientId === patientId).sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function getMedicationsByPatientId(patientId: string): Medication[] {
  return mockMedications.filter(m => m.patientId === patientId);
}

export function getLabsByPatientId(patientId: string): LabResult[] {
  return mockLabs.filter(l => l.patientId === patientId).sort((a, b) => 
    new Date(b.resultDate).getTime() - new Date(a.resultDate).getTime()
  );
}

export function getAppointmentsByPatientId(patientId: string): Appointment[] {
  return mockAppointments.filter(a => a.patientId === patientId).sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateB.getTime() - dateA.getTime();
  });
}

export function getNotesByPatientId(patientId: string): ClinicalNote[] {
  return mockNotes.filter(n => n.patientId === patientId).sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateB.getTime() - dateA.getTime();
  });
}

export function getImagingByPatientId(patientId: string): ImagingStudy[] {
  return mockImaging.filter(i => i.patientId === patientId).sort((a, b) => {
    const dateA = new Date(a.performedDate || a.orderedDate);
    const dateB = new Date(b.performedDate || b.orderedDate);
    return dateB.getTime() - dateA.getTime();
  });
}

