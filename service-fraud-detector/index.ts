import { CommonKafka, MessagePayloadInterface } from "common-kafka";

class FraudDetectorService extends CommonKafka {
  constructor() {
    super("FraudDetectorService");
  }

  async main(): Promise<void> {
    const consumer = this.createConsumer(this.clientName);

    try {
      await consumer.connect();
      await consumer.subscribe({
        topic: "ECOMMERCE_NEW_ORDER",
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

export default new FraudDetectorService().main();
