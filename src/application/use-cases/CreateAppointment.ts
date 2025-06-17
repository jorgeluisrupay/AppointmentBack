import { Appointment } from "../../domain/entities/Appointment";
import { DynamoAppointmentRepository } from "../../infrastructure/repositories/DynamoAppointmentRepository";
import { SnsPublisher } from "../../infrastructure/services/SnsPublisher";
import { v4 as uuidv4 } from "uuid";

export class CreateAppointment {
  constructor(
    private readonly repo: DynamoAppointmentRepository,
    private readonly publisher: SnsPublisher
  ) {}

  async execute(input: {
    insuredId: string;
    scheduleId: number;
    countryISO: string;
  }): Promise<{ appointmentId: string; status: string }> {
    if (
      !input.insuredId ||
      !input.scheduleId ||
      !["PE", "CL"].includes(input.countryISO)
    ) {
      throw new Error("Parámetros inválidos");
    }

    const appointment = new Appointment({
      appointmentId: uuidv4(),
      insuredId: input.insuredId,
      scheduleId: input.scheduleId,
      countryISO: input.countryISO,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    await this.repo.save(appointment);
    await this.publisher.publish(appointment);

    return {
      appointmentId: appointment.props.appointmentId,
      status: appointment.props.status,
    };
  }
}
