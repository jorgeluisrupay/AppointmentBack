import { EventBridge } from "aws-sdk";
import { Appointment } from "../../domain/entities/Appointment";

export class AppointmentConfirmedPublisher {
  private eventBridge = new EventBridge();

  async publish(appointment: Appointment): Promise<void> {
    await this.eventBridge
      .putEvents({
        Entries: [
          {
            Source: "appointments.pe",
            DetailType: "appointmentConfirmed",
            Detail: JSON.stringify({
              appointmentId: appointment.props.appointmentId,
              insuredId: appointment.props.insuredId,
              status: "completed",
            }),
            EventBusName: "default",
          },
        ],
      })
      .promise();
  }
}
