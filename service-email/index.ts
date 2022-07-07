import { CommonKafka, MessagePayloadInterface } from "common-kafka";

export class EmailService extends CommonKafka {
  constructor() {
    super("EmailService");
  }

  async main(): Promise<void> {
    const consumer = this.createConsumer(this.clientName);
    try {
      await consumer.connect();
      await consumer.subscribe({
        topic: "ECOMMERCE_SEND_EMAIL",
      });

      await consumer.run({
        autoCommitThreshold: 1,
        eachMessage: async (messagePayload: MessagePayloadInterface) => {
          const data = this.logMessage({
            ...messagePayload,
            clientName: this.clientName,
          });
          consumer.logger().info(data.message, data.extra);
        },
      });
    } catch (error) {
      consumer.logger().error(String(error));
    }
  }
}

export default new EmailService().main();
