import { v4 as uuidv4 } from 'uuid';

import { ProducerFactory, ProducerMessage, Message } from 'common-kafka';

type Order = {
  orderId: string;
  email: string;
  amount: number;
};

class NewOrder {
  #producer: ProducerFactory;

  constructor() {
    this.#producer = new ProducerFactory('NewOrder');
  }

  async main() {
    try {
      await this.#producer.start();

      const email = `${Math.random()}@email.com`;

      for (let count = 0; count < 10; count++) {
        const order: Order = {
          orderId: uuidv4(),
          amount: Number(Math.random() * 5000 + 1),
          email,
        };

        const value = Message.formatter<Order>({
          payload: order,
          serviceName: 'NewOrder',
        });

        const messages: ProducerMessage = {
          topic: 'ECOMMERCE_NEW_ORDER',
          messages: [{ key: email, value }],
        };

        await this.#producer.send(messages);
      }
    } catch (error) {
      this.#producer.shutdown();
    }
  }
}
export default new NewOrder().main();
