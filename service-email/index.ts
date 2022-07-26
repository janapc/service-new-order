import { ConsumerFactory } from "common-kafka";

export class EmailService {
  #consumer: ConsumerFactory;

  constructor() {
    this.#consumer = new ConsumerFactory("EmailService");
  }

  async main() {
    try {
      this.#consumer.run(
        "ECOMMERCE_SEND_EMAIL",
        this.#consumer.logMessage.bind(this.#consumer)
      );
    } catch (error) {
      this.#consumer.shutdown();
    }
  }
}

export default new EmailService().main();
