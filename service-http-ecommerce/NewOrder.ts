import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';

import { ProducerFactory, Message, ProducerMessage } from 'common-kafka';

type Order = {
  orderId: string;
  email: string;
  amount: number;
};

type Body = {
  [key: string]: any;
};

export default class NewOrder {
  #producer: ProducerFactory;

  constructor() {
    this.#producer = new ProducerFactory('NewOrder');
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      await this.#producer.start();

      if (!NewOrder.#isOrderValid(req.body)) {
        return res
          .status(400)
          .json({ error: 'The order is invalid, please verify the data sent' });
      }

      const { amount, email } = req.body;

      const emailBody = 'Thank you for your order! We are processing your order!';
      const order: Order = {
        orderId: uuidv4(),
        amount,
        email,
      };

      const value = Message.formatter<Order>({
        payload: order,
        serviceName: 'NewOrder',
      });

      const messages: Array<ProducerMessage> = [
        {
          topic: 'ECOMMERCE_SEND_EMAIL',
          messages: [{ key: order.email, value: emailBody }],
        },
        {
          topic: 'ECOMMERCE_NEW_ORDER',
          messages: [{ key: order.email, value }],
        },
      ];

      await this.#producer.sendBatch(messages);

      return res.status(200).json({ message: 'New order sent' });
    } catch (error) {
      this.#producer.shutdown();

      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static #isOrderValid(body: Body): boolean {
    return !!(body.email && body.amount && typeof body.amount === 'number');
  }
}
