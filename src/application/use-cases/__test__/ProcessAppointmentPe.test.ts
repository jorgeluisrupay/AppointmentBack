import { ProcessAppointmentPe } from "../ProcessAppointmentPe";
import { Appointment } from "../../../domain/entities/Appointment";

describe("ProcessAppointmentPe", () => {
  const mockRepo = {
    updateStatusToCompleted: jest.fn(),
  };

  const mockPublisher = {
    publish: jest.fn(),
  };

  const createMockAppointment = (): Appointment =>
    new Appointment({
      appointmentId: "abc123",
      insuredId: "12345",
      scheduleId: 101,
      countryISO: "PE",
      status: "pending",
      createdAt: new Date().toISOString(),
    });

  it("debería actualizar el estado y publicar el evento", async () => {
    const useCase = new ProcessAppointmentPe(
      mockRepo as any,
      mockPublisher as any
    );

    const appointment = createMockAppointment();
    await useCase.execute(appointment);

    expect(mockRepo.updateStatusToCompleted).toHaveBeenCalledWith("12345");
    expect(mockPublisher.publish).toHaveBeenCalledWith(appointment);
  });

  it("debería lanzar error si insuredId no está presente", async () => {
    const appointment = new Appointment({
      appointmentId: "xyz789",
      insuredId: "", // vacío
      scheduleId: 102,
      countryISO: "CL",
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    const useCase = new ProcessAppointmentPe(
      mockRepo as any,
      mockPublisher as any
    );

    await expect(useCase.execute(appointment)).rejects.toThrow(
      "insuredId es requerido"
    );
  });
});
