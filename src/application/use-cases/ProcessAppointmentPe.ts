import { DynamoAppointmentRepository } from "../../infrastructure/repositories/DynamoAppointmentRepository";

export class ProcessAppointmentPe {
  constructor(private readonly repo: DynamoAppointmentRepository) {}

  async execute(input: { insuredId: string }): Promise<void> {
    if (!input.insuredId) {
      throw new Error("insuredId es requerido");
    }

    await this.repo.updateStatusToCompleted(input.insuredId);
  }
}
