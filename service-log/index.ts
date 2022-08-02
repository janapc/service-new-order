import { ConsumerFactory, EachMessagePayload } from 'common-kafka';
import Logger from 'common-logs';

class LogService {
  #consumer: ConsumerFactory;

  #logger: Logger;

  constructor() {
    this.#consumer = new ConsumerFactory('LogService');
    this.#logger = new Logger();
  }

  async main() {
    try {
      this.#consumer.run(
        [/ECOMMERCE.*/i],
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
      clientName: 'LogService',
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

export default new LogService().main();
