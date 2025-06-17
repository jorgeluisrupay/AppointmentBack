// import { SQSEvent, SQSHandler } from "aws-lambda";
// import { createConnection } from "mysql2/promise";

// export const handler: SQSHandler = async (event: SQSEvent) => {
//   const connection = await createConnection({
//     host: process.env.RDS_HOST!,
//     user: process.env.RDS_USER!,
//     password: process.env.RDS_PASSWORD!,
//     database: process.env.RDS_DB_NAME!,
//   });

//   try {
//     for (const record of event.Records) {
//       const message = JSON.parse(record.body);

//       const {
//         appointmentId,
//         insuredId,
//         scheduleId,
//         countryISO,
//         status,
//         createdAt,
//       } = message;

//       await connection.execute(
//         `INSERT INTO appointments_pe (
//             appointment_id, insured_id, schedule_id, country_iso, status, created_at
//         ) VALUES (?, ?, ?, ?, ?, ?)`,
//         [appointmentId, insuredId, scheduleId, countryISO, status, createdAt]
//       );

//       console.log(`✔️ Inserted appointment for insuredId: ${insuredId}`);
//     }
//   } catch (error) {
//     console.error("❌ Error in appointment_pe:", error);
//   } finally {
//     await connection.end();
//     console.log("🔌 MySQL connection closed");
//   }
// };

import { SQSEvent } from "aws-lambda";
import { DynamoAppointmentRepository } from "../../infrastructure/repositories/DynamoAppointmentRepository";
import { ProcessAppointmentPe } from "../../application/use-cases/ProcessAppointmentPe";

export const handler = async (event: SQSEvent): Promise<void> => {
  const repo = new DynamoAppointmentRepository();
  const useCase = new ProcessAppointmentPe(repo);

  for (const record of event.Records) {
    try {
      const outer = JSON.parse(record.body);
      const message = JSON.parse(outer.Message);

      console.log("📥 Mensaje recibido:", message);

      await useCase.execute({
        insuredId: message.insuredId,
      });

      console.log(
        "✅ Estado actualizado a 'completed' para:",
        message.insuredId
      );
    } catch (err) {
      console.error("❌ Error al procesar appointment_pe:", err);
    }
  }
};
