import { CreateAppointment } from "../CreateAppointment";
import { Appointment } from "../../../domain/entities/Appointment";

describe("CreateAppointment", () => {
  const mockRepo = {
    save: jest.fn(),
  };

  const mockPublisher = {
    publish: jest.fn(),
  };

  it("debería crear un appointment y retornar id y status", async () => {
    const useCase = new CreateAppointment(
      mockRepo as any,
      mockPublisher as any
    );

    const input = {
      insuredId: "12345",
      scheduleId: 100,
      countryISO: "PE",
    };

    const result = await useCase.execute(input);

    expect(result).toHaveProperty("appointmentId");
    expect(result.status).toBe("pending");
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
    expect(mockPublisher.publish).toHaveBeenCalledTimes(1);
  });

  it("debería lanzar error si falta insuredId", async () => {
    const useCase = new CreateAppointment(
      mockRepo as any,
      mockPublisher as any
    );

    await expect(() =>
      useCase.execute({
        insuredId: "",
        scheduleId: 100,
        countryISO: "PE",
      })
    ).rejects.toThrow();
  });
});
