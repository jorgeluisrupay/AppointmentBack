import { GetAppointmentsByInsured } from "../GetAppointmentsByInsured";
import { Appointment } from "../../../domain/entities/Appointment";

describe("GetAppointmentsByInsured", () => {
  const mockRepo = {
    findByInsuredId: jest.fn(),
  };

  it("debería retornar una lista de appointments válidos", async () => {
    const useCase = new GetAppointmentsByInsured(mockRepo as any);

    const mockData = [
      new Appointment({
        appointmentId: "1",
        insuredId: "12345",
        scheduleId: 101,
        countryISO: "PE",
        status: "completed",
        createdAt: new Date().toISOString(),
      }),
    ];

    mockRepo.findByInsuredId.mockResolvedValueOnce(mockData);

    const result = await useCase.execute("12345");

    expect(result).toEqual(mockData);
    expect(mockRepo.findByInsuredId).toHaveBeenCalledWith("12345");
  });

  it("debería lanzar error si insuredId es vacío", async () => {
    const useCase = new GetAppointmentsByInsured(mockRepo as any);

    await expect(useCase.execute("")).rejects.toThrow("insuredId es requerido");
  });
});
