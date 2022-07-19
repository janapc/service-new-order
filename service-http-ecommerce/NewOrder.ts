import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";

import { CommonKafka, TopicMessages } from "common-kafka";

type Order = {
  orderId: string;
  email: string;
  amount: number;
};

interface Body {
  [key: string]: any;
}

export default class NewOrder extends CommonKafka {
  constructor() {
    super("NewOrder");
  }

  async create(req: Request, res: Response): Promise<Response> {
    const producer = this.createProducer();

    try {
      await producer.connect();

      if (!this.#isOrderValid(req.body)) {
        return res
          .status(400)
          .json({ error: "The order is invalid, please verify the data sent" });
      }

      const { amount, email } = req.body;

      const emailBody =
        "Thank you for your order! We are processing your order!";
      const order: Order = {
        orderId: uuidv4(),
        amount,
        email,
      };

      const topicMessages: Array<TopicMessages> = [
        {
          topic: "ECOMMERCE_SEND_EMAIL",
          messages: [{ key: order.email, value: emailBody }],
        },
        {
          topic: "ECOMMERCE_NEW_ORDER",
          messages: [{ key: order.email, value: JSON.stringify(order) }],
        },
      ];

      await producer.sendBatch({ topicMessages });

      return res.status(200).json({ message: "New order sent" });
    } catch (error) {
      producer.logger().error(String(error));
      producer.disconnect();

      return res.status(500).json({ error: "Internal server error" });
    }
  }

  #isOrderValid(body: Body): boolean {
    return !!(body.email && body.amount && typeof body.amount === "number");
  }
}
