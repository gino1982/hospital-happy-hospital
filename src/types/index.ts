export interface Doctor {
  id: string;
  name: string;
  department: string;
  title: string;
  specialties: string[];
  imageUrl: string;
  introduction: string;
  isAvailable?: boolean;
}

export interface Schedule {
  id: string;
  doctorId: string;
  date: Date; // Keep as Date object for easier handling
  timeSlot: 'Morning' | 'Afternoon' | 'Evening';
  startTime: string; // e.g., "09:00"
  endTime: string; // e.g., "12:00"
  maxPatients: number;
  currentPatients: number;
  isAvailable: boolean;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name or image path
}

export interface Patient {
  name: string;
  idNumber: string;
  birthDate: string;
  phone: string;
  email?: string;
}

export interface Appointment {
  id: string;
  scheduleId: string;
  patient: Patient;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt: Date;
}
