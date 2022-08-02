import {
  ProducerFactory,
  ConsumerFactory,
  EachMessagePayload,
  Message,
  ProducerMessage,
} from 'common-kafka';

type Order = {
  orderId: string;
  email: string;
  amount: number;
};

class EmailNewOrderService {
  #consumer: ConsumerFactory;

  #producer: ProducerFactory;

  constructor() {
    this.#consumer = new ConsumerFactory('EmailNewOrderService');
    this.#producer = new ProducerFactory('EmailNewOrderService');
  }

  async main() {
    try {
      await this.#producer.start();
      await this.#consumer.run(
        'ECOMMERCE_NEW_ORDER',
        this.#processMessages.bind(this),
      );
    } catch (error) {
      await this.#consumer.shutdown();
      await this.#producer.shutdown();
    }
  }

  async #processMessages({ message }: EachMessagePayload): Promise<void> {
    const order = Message.parse<Order>(String(message.value) || '');
    const emailBody = 'Thank you for your order! We are processing your order!';

    const value = Message.formatter<string>({
      payload: emailBody,
      serviceName: 'EmailNewOrderService',
      oldServiceName: order.correlationId.id,
    });

    const messageToSend: ProducerMessage = {
      topic: 'ECOMMERCE_SEND_EMAIL',
      messages: [{ key: order.payload.email, value }],
    };

    await this.#producer.send(messageToSend);
  }
}

export default new EmailNewOrderService().main();
