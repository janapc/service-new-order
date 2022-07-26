import {
  EachMessagePayload,
  Message,
  ConsumerFactory,
  ProducerFactory,
  ProducerMessage,
} from "common-kafka";

import Database from "./Database";

class BatchSendMessageService {
  #consumer: ConsumerFactory;
  #producer: ProducerFactory;
  #database: Database;

  constructor() {
    this.#database = new Database();
    this.#consumer = new ConsumerFactory("BatchSendMessageService");
    this.#producer = new ProducerFactory("BatchSendMessageService");
  }

  async main() {
    try {
      await this.#producer.start();
      await this.#consumer.run(
        "ECOMMERCE_SEND_MESSAGE_TO_ALL_USERS",
        this.#processMessages.bind(this)
      );
    } catch (error) {
      this.#producer.shutdown();
      this.#consumer.shutdown();
    }
  }

  async #processMessages({ message }: EachMessagePayload): Promise<void> {
    try {
      const users = await this.#getAllUsers();

      const value = Message.parse<string>(String(message.value) || "");

      const messages: Array<ProducerMessage> = users.map((user) => ({
        topic: value.payload,
        messages: [
          {
            key: user.uuid,
            value: Message.formatter<{ uuid: string }>({
              payload: user,
              serviceName: "BatchSendMessageService",
              oldServiceName: value.correlationId.id,
            }),
          },
        ],
      }));

      await this.#producer.sendBatch(messages);
    } catch (error) {
      const value = Message.parse<string>(String(message.value) || "");
      this.#producer.send({
        topic: "ECOMMERCE_DEADLETTER",
        messages: [
          {
            key: value.correlationId.id,
            value: Message.formatter<string>({
              payload: value.payload,
              serviceName: "BatchSendMessageService",
              oldServiceName: value.correlationId.id,
            }),
          },
        ],
      });
    }
  }

  async #getAllUsers(): Promise<Array<{ uuid: string }>> {
    const query = `SELECT uuid FROM Users`;

    const users: Array<{ uuid: string }> = await this.#database.query(
      query,
      "all"
    );

    return users;
  }
}
export default new BatchSendMessageService().main();
