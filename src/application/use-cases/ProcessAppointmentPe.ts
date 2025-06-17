import { Appointment } from "../../domain/entities/Appointment";
import { DynamoAppointmentRepository } from "../../infrastructure/repositories/DynamoAppointmentRepository";
import { AppointmentConfirmedPublisher } from "../../infrastructure/services/AppointmentConfirmedPublisher";

export class ProcessAppointmentPe {
  constructor(
    private readonly repo: DynamoAppointmentRepository,
    private readonly publisher: AppointmentConfirmedPublisher
  ) {}

  async execute(appointment: Appointment): Promise<void> {
    if (!appointment.props.insuredId) {
      throw new Error("insuredId es requerido");
    }

    await this.repo.updateStatusToCompleted(appointment.props.insuredId);
    await this.publisher.publish(appointment);
  }
}
