import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoAppointmentRepository } from "../../infrastructure/repositories/DynamoAppointmentRepository";
import { GetAppointmentsByInsured } from "../../application/use-cases/GetAppointmentsByInsured";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const insuredId = event.pathParameters?.insuredId;

    const useCase = new GetAppointmentsByInsured(
      new DynamoAppointmentRepository()
    );

    const appointments = await useCase.execute(insuredId!);

    return {
      statusCode: 200,
      body: JSON.stringify(appointments),
    };
  } catch (error: any) {
    console.error("❌ Error en getAppointments:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
