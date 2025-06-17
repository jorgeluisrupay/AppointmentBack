export interface AppointmentProps {
  appointmentId: string;
  insuredId: string;
  scheduleId: number;
  countryISO: string;
  status: string;
  createdAt: string;
}

export class Appointment {
  constructor(public readonly props: AppointmentProps) {}
}
