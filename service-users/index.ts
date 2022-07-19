import { v4 as uuidv4 } from "uuid";

import { CommonKafka, Consumer, EachMessagePayload } from "common-kafka";

import Database from "./Database";

type Order = {
  orderId: string;
  email: string;
  amount: number;
};

class createUserService extends CommonKafka {
  #consumer: Consumer;
  #database: Database;

  constructor() {
    super("createUserService");

    this.#database = new Database();
    this.#consumer = this.createConsumer(this.clientName);
  }

  async main() {
    await this.#consumer.connect();
    await this.#consumer.subscribe({
      topic: "ECOMMERCE_NEW_ORDER",
    });

    await this.#consumer.run({
      autoCommitThreshold: 1,
      eachMessage: async (messagePayload: EachMessagePayload) => {
        const { topic, message, partition } = messagePayload;

        const order: Order =
          message.value && JSON.parse(message.value.toString());

        if (!(await this.#isNewUser(order.email))) {
          await this.#insertNewUser(order.email);
        }
      },
    });
  }

  async #isNewUser(email: string): Promise<boolean> {
    const query = `SELECT uuid FROM Users WHERE email = "${email}" limit 1`;
    const user = await this.#database.query(query, "get");

    return !!user;
  }

  async #insertNewUser(email: string) {
    const uuid = uuidv4().toString();
    const query = `INSERT INTO Users (uuid, email) VALUES ("${uuid}","${email}")`;

    await this.#database.query(query, "run");

    this.#consumer.logger().info(`User ${uuid} and ${email} added`);
  }
}
export default new createUserService().main();
