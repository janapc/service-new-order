import { CommonKafka, EachMessagePayload } from "common-kafka";

type Order = {
  orderId: string;
  email: string;
  amount: number;
};

class FraudDetectorService extends CommonKafka {
  constructor() {
    super("FraudDetectorService");
  }

  async main() {
    const consumer = this.createConsumer(this.clientName);
    const producer = this.createProducer();

    try {
      await producer.connect();

      await consumer.connect();
      await consumer.subscribe({
        topic: "ECOMMERCE_NEW_ORDER",
      });

      await consumer.run({
        autoCommitThreshold: 1,
        eachMessage: async (messagePayload: EachMessagePayload) => {
          const { topic, message, partition } = messagePayload;

          const order: Order =
            message.value && JSON.parse(message.value.toString());

          const topicName = this.#isFraud(order.amount)
            ? "ECOMMERCE_ORDER_REJECTED"
            : "ECOMMERCE_ORDER_APPROVED";
          await producer.send({
            topic: topicName,
            messages: [{ key: order.email, value: order?.toString() || "" }],
          });
        },
      });
    } catch (error) {
      consumer.logger().error(String(error));

      await producer.disconnect();
      await consumer.disconnect();
    }
  }

  #isFraud(amount: Number): boolean {
    return amount >= 4500;
  }
}

export default new FraudDetectorService().main();
