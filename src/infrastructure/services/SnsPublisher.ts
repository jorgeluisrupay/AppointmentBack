import { SNS } from "aws-sdk";
import { Appointment } from "../../domain/entities/Appointment";

const sns = new SNS();
const TOPIC_ARN = process.env.APPOINTMENT_TOPIC_ARN!;

export class SnsPublisher {
  async publish(appointment: Appointment): Promise<void> {
    await sns
      .publish({
        TopicArn: TOPIC_ARN,
        Message: JSON.stringify(appointment.props),
        MessageAttributes: {
          countryISO: {
            DataType: "String",
            StringValue: appointment.props.countryISO,
          },
        },
      })
      .promise();
  }
}
