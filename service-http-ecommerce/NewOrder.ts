import { Request, Response } from 'express';

import { ProducerFactory, Message, ProducerMessage } from 'common-kafka';
import Logger from 'common-logs';

import NewOrderDatabase from './NewOrderDatabase';

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

  #database: NewOrderDatabase;

  #logger: Logger;

  constructor() {
    this.#producer = new ProducerFactory('NewOrder');
    this.#database = new NewOrderDatabase();
    this.#logger = new Logger();
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      await this.#producer.start();

      if (!NewOrder.#isOrderValid(req.body)) {
        return res
          .status(400)
          .json({ error: 'The order is invalid, please verify the data sent' });
      }

      const { amount, email, uuid } = req.body;

      if (await this.#database.saveNew(uuid)) {
        const order: Order = {
          orderId: uuid,
          amount,
          email,
        };

        const value = Message.formatter<Order>({
          payload: order,
          serviceName: 'NewOrder',
        });

        const messages: ProducerMessage = {
          topic: 'ECOMMERCE_NEW_ORDER',
          messages: [{ key: order.email, value }],
        };

        await this.#producer.send(messages);
      } else {
        this.#logger.log('Old order received.', 'info');
      }

      return res.status(200).json({ message: 'New order sent' });
    } catch (error) {
      this.#producer.shutdown();

      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static #isOrderValid(body: Body): boolean {
    return !!(body.email && body.amount && body.uuid && typeof body.amount === 'number');
  }
}
