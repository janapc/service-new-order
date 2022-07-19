import { v4 as uuidv4 } from "uuid";

import { CommonKafka, TopicMessages } from "common-kafka";

type Order = {
  orderId: string;
  email: string;
  amount: number;
};

class NewOrderProducer extends CommonKafka {
  constructor() {
    super("NewOrderProducer");
  }

  async main() {
    const producer = this.createProducer();

    try {
      await producer.connect();

      const email = `${Math.random()}@email.com`;

      for (let count = 0; count < 10; count++) {
        const emailBody =
          "Thank you for your order! We are processing your order!";
        const order: Order = {
          orderId: uuidv4(),
          amount: Number(Math.random() * 5000 + 1),
          email,
        };

        const topicMessages: Array<TopicMessages> = [
          {
            topic: "ECOMMERCE_SEND_EMAIL",
            messages: [{ key: email, value: emailBody }],
          },
          {
            topic: "ECOMMERCE_NEW_ORDER",
            messages: [{ key: email, value: JSON.stringify(order) }],
          },
        ];

        await producer.sendBatch({ topicMessages });
      }
    } catch (error) {
      producer.logger().error(String(error));
      producer.disconnect();
    }
  }
}
export default new NewOrderProducer().main();
