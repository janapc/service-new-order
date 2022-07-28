import { ConsumerFactory } from 'common-kafka';

class LogService {
  #consumer: ConsumerFactory;

  constructor() {
    this.#consumer = new ConsumerFactory('LogService');
  }

  async main() {
    try {
      this.#consumer.run(
        [/ECOMMERCE.*/i],
        this.#consumer.logMessage.bind(this.#consumer),
      );
    } catch (error) {
      this.#consumer.shutdown();
    }
  }
}

export default new LogService().main();
