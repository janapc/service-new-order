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

class FraudDetectorService {
  #consumer: ConsumerFactory;

  #producer: ProducerFactory;

  constructor() {
    this.#consumer = new ConsumerFactory('FraudDetectorService');
    this.#producer = new ProducerFactory('FraudDetectorService');
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
    const value = Message.formatter<Order>({
      payload: order.payload,
      serviceName: 'FraudDetectorService',
      oldServiceName: order.correlationId.id,
    });

    const topicName = FraudDetectorService.#isFraud(order.payload.amount)
      ? 'ECOMMERCE_ORDER_REJECTED'
      : 'ECOMMERCE_ORDER_APPROVED';

    const messageToSend: ProducerMessage = {
      topic: topicName,
      messages: [{ key: order.payload.email, value }],
    };

    await this.#producer.send(messageToSend);
  }

  static #isFraud(amount: Number): boolean {
    return amount >= 4500;
  }
}

export default new FraudDetectorService().main();
