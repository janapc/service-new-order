import { CommonKafka, EachMessagePayload } from "common-kafka";

export class EmailService extends CommonKafka {
  constructor() {
    super("EmailService");
  }

  async main() {
    const consumer = this.createConsumer(this.clientName);
    try {
      await consumer.connect();
      await consumer.subscribe({
        topic: "ECOMMERCE_SEND_EMAIL",
      });

      await consumer.run({
        autoCommitThreshold: 1,
        eachMessage: async (messagePayload: EachMessagePayload) => {
          this.logMessage(messagePayload);
        },
      });
    } catch (error) {
      consumer.logger().error(String(error));
      consumer.disconnect();
    }
  }
}

export default new EmailService().main();
