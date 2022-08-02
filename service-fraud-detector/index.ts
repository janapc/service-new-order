import {
  ProducerFactory,
  ConsumerFactory,
  EachMessagePayload,
  Message,
  ProducerMessage,
} from 'common-kafka';
import LocalDatabase from 'common-database';
import Logger from 'common-logs';

type Order = {
  orderId: string;
  email: string;
  amount: number;
};

class FraudDetectorService {
  #consumer: ConsumerFactory;

  #producer: ProducerFactory;

  #database: LocalDatabase;

  #logger: Logger;

  constructor() {
    this.#database = new LocalDatabase('frauds_database');
    this.#database.createIfNotExists('CREATE TABLE IF NOT EXISTS Orders (uuid TEXT PRIMARY KEY, isFraud BOOLEAN)');

    this.#consumer = new ConsumerFactory('FraudDetectorService');
    this.#producer = new ProducerFactory('FraudDetectorService');
    this.#logger = new Logger();
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

    if (await this.#wasProcessed(order.payload.orderId)) {
      this.#logger.log(`Order ${order.payload.orderId} was already processed`, 'info');

      return;
    }

    const isFraud = FraudDetectorService.#isFraud(order.payload.amount);

    await this.#insertFraudDatabase(order.payload.orderId, isFraud);

    const value = Message.formatter<Order>({
      payload: order.payload,
      serviceName: 'FraudDetectorService',
      oldServiceName: order.correlationId.id,
    });

    const topicName = isFraud ? 'ECOMMERCE_ORDER_REJECTED' : 'ECOMMERCE_ORDER_APPROVED';
    const messageToSend: ProducerMessage = {
      topic: topicName,
      messages: [{ key: order.payload.email, value }],
    };

    await this.#producer.send(messageToSend);
  }

  async #insertFraudDatabase(orderId: string, isFraud: boolean) {
    const query = `INSERT INTO Orders (uuid, isFraud) VALUES ("${orderId}","${isFraud}")`;

    await this.#database.query(query, 'run');
  }

  async #wasProcessed(orderId: string) {
    const query = `SELECT uuid FROM Orders WHERE uuid = "${orderId}" limit 1`;
    const order = await this.#database.query(query, 'get');

    return !!order;
  }

  static #isFraud(amount: Number): boolean {
    return amount >= 4500;
  }
}

export default new FraudDetectorService().main();
