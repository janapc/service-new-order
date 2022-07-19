import { CommonKafka, EachMessagePayload } from "common-kafka";

class LogService extends CommonKafka {
  constructor() {
    super("LogService");
  }

  async main() {
    const consumer = this.createConsumer(this.clientName);
    try {
      await consumer.connect();
      await consumer.subscribe({
        topics: [/ECOMMERCE.*/i],
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

export default new LogService().main();
