import { ConsumerFactory, EachMessagePayload } from 'common-kafka';
import Logger from 'common-logs';

export class EmailService {
  #consumer: ConsumerFactory;

  #logger: Logger;

  constructor() {
    this.#consumer = new ConsumerFactory('EmailService');
    this.#logger = new Logger();
  }

  async main() {
    try {
      this.#consumer.run(
        'ECOMMERCE_SEND_EMAIL',
        this.#processMessages.bind(this),

      );
    } catch (error) {
      this.#consumer.shutdown();
    }
  }

  async #processMessages({
    message, topic, partition,
  }: EachMessagePayload): Promise<void> {
    const value = JSON.parse(String(message.value));
    const data = {
      clientName: 'EmailService',
      topic,
      partition,
      value,
      key: String(message.key),
      offset: message.offset,
      timestamp: message.timestamp,
    };

    this.#logger.log(JSON.stringify(data), 'info');
  }
}

export default new EmailService().main();
