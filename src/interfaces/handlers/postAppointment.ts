import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoAppointmentRepository } from "../../infrastructure/repositories/DynamoAppointmentRepository";
import { SnsPublisher } from "../../infrastructure/services/SnsPublisher";
import { CreateAppointment } from "../../application/use-cases/CreateAppointment";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return { statusCode: 400, body: "Body requerido" };
    }

    const { insuredId, scheduleId, countryISO } = JSON.parse(event.body);

    if (!insuredId || !scheduleId || !["PE", "CL"].includes(countryISO)) {
      return { statusCode: 400, body: "Parámetros inválidos" };
    }

    const useCase = new CreateAppointment(
      new DynamoAppointmentRepository(),
      new SnsPublisher()
    );

    const appointmentId = await useCase.execute({
      insuredId,
      scheduleId,
      countryISO,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Appointment created",
        appointmentId,
      }),
    };
  } catch (error: any) {
    console.error("❌ Error en postAppointment:", error);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};
