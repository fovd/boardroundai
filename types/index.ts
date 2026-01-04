export interface Patient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  insurance: string;
  primaryCarePhysician: string;
}

export interface VitalSign {
  id: string;
  patientId: string;
  timestamp: string;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  temperature: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  weight: number;
  height: number;
  bmi: number;
  recordedBy: string;
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  status: 'Active' | 'Discontinued' | 'Completed';
  instructions: string;
}

export interface LabResult {
  id: string;
  patientId: string;
  testName: string;
  testCode: string;
  value: string | number;
  unit: string;
  referenceRange: string;
  status: 'Normal' | 'Abnormal' | 'Critical';
  orderedDate: string;
  resultDate: string;
  orderedBy: string;
  category: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  date: string;
  time: string;
  provider: string;
  department: string;
  type: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show';
  reason: string;
  notes?: string;
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  date: string;
  time: string;
  author: string;
  authorRole: string;
  category: string;
  title: string;
  content: string;
  tags?: string[];
}

export interface ImagingStudy {
  id: string;
  patientId: string;
  studyType: string;
  studyCode: string;
  bodyPart: string;
  orderedDate: string;
  performedDate: string;
  orderedBy: string;
  performedBy: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  report?: {
    id: string;
    date: string;
    author: string;
    authorRole: string;
    findings: string;
    impression: string;
    recommendations?: string;
  };
  images?: {
    id: string;
    description: string;
    view: string;
  }[];
}

