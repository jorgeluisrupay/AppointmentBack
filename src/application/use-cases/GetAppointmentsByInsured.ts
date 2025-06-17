import { DynamoAppointmentRepository } from "../../infrastructure/repositories/DynamoAppointmentRepository";

export class GetAppointmentsByInsured {
  constructor(private readonly repo: DynamoAppointmentRepository) {}

  async execute(insuredId: string) {
    if (!insuredId) throw new Error("insuredId es requerido");
    return this.repo.findByInsuredId(insuredId);
  }
}
