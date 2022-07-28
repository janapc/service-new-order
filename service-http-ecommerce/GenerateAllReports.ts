import { Request, Response } from 'express';

import { ProducerFactory, Message, ProducerMessage } from 'common-kafka';

export default class GenerateAllReports {
  #producer: ProducerFactory;

  constructor() {
    this.#producer = new ProducerFactory('GenerateAllReports');
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      await this.#producer.start();

      const value = Message.formatter<string>({
        payload: 'ECOMMERCE_USER_GENERATE_READING_REPORT',
        serviceName: 'GenerateAllReports',
      });

      const message: ProducerMessage = {
        topic: 'ECOMMERCE_SEND_MESSAGE_TO_ALL_USERS',
        messages: [
          {
            key: 'ECOMMERCE_USER_GENERATE_READING_REPORT',
            value,
          },
        ],
      };

      await this.#producer.send(message);

      return res.status(200).json({ message: 'Report requests generated' });
    } catch (error) {
      this.#producer.shutdown();

      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
