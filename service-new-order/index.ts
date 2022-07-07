import { v4 as uuidv4 } from "uuid";

import { CommonKafka, TopicMessagesInterface } from "common-kafka";

class NewOrderProducer extends CommonKafka {
  constructor() {
    super("NewOrderProducer");
  }

  async main(): Promise<void> {
    const producer = this.createProducer();
    try {
      producer.logger().info(this.clientName);

      await producer.connect();

      const emailBody =
        "Thank you for your order! We are processing your order!";
      const userId = uuidv4();
      const order = {
        userId,
        orderId: uuidv4(),
        amount: Number(Math.random() * 5000 + 1),
      };

      const topicMessages: Array<TopicMessagesInterface> = [
        {
          topic: "ECOMMERCE_SEND_EMAIL",
          messages: [{ key: userId, value: emailBody }],
        },
        {
          topic: "ECOMMERCE_NEW_ORDER",
          messages: [{ key: userId, value: JSON.stringify(order) }],
        },
      ];

      await producer.sendBatch({ topicMessages });

      await producer.disconnect();
    } catch (error) {
      producer.logger().error(String(error));
    }
  }
}
export default new NewOrderProducer().main();
