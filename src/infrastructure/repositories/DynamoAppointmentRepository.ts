import { DynamoDB } from "aws-sdk";
import { Appointment } from "../../domain/entities/Appointment";

const dynamo = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.APPOINTMENTS_TABLE!;

export class DynamoAppointmentRepository {
  async findByInsuredId(insuredId: string): Promise<Appointment[]> {
    const result = await dynamo
      .query({
        TableName: TABLE_NAME,
        KeyConditionExpression: "insuredId = :id",
        ExpressionAttributeValues: {
          ":id": insuredId,
        },
      })
      .promise();

    return (result.Items || []).map((item) => new Appointment(item as any));
  }

  async save(appointment: Appointment): Promise<void> {
    await dynamo
      .put({
        TableName: TABLE_NAME,
        Item: appointment.props,
      })
      .promise();
  }

  async updateStatusToCompleted(insuredId: string): Promise<void> {
    await dynamo
      .update({
        TableName: TABLE_NAME,
        Key: { insuredId },
        UpdateExpression: "set #st = :s",
        ExpressionAttributeNames: { "#st": "status" },
        ExpressionAttributeValues: { ":s": "completed" },
      })
      .promise();
  }
}
