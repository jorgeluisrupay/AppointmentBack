import { ProcessAppointmentPe } from "../ProcessAppointmentPe";

describe("ProcessAppointmentPe", () => {
  const mockRepo = {
    updateStatusToCompleted: jest.fn(),
  };

  it("debería actualizar el estado del appointment a 'completed'", async () => {
    const useCase = new ProcessAppointmentPe(mockRepo as any);

    const input = { insuredId: "12345" };
    await useCase.execute(input);

    expect(mockRepo.updateStatusToCompleted).toHaveBeenCalledWith("12345");
  });

  it("debería lanzar error si insuredId no está presente", async () => {
    const useCase = new ProcessAppointmentPe(mockRepo as any);

    await expect(useCase.execute({ insuredId: "" })).rejects.toThrow(
      "insuredId es requerido"
    );
  });
});
