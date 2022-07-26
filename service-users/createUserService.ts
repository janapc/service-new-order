import { v4 as uuidv4 } from "uuid";

import { ConsumerFactory, EachMessagePayload, Message } from "common-kafka";

import Database from "./Database";

type Order = {
  orderId: string;
  email: string;
  amount: number;
};

class createUserService {
  #consumer: ConsumerFactory;
  #database: Database;

  constructor() {
    this.#database = new Database();
    this.#consumer = new ConsumerFactory("createUserService");
  }

  async main() {
    await this.#consumer.run(
      "ECOMMERCE_NEW_ORDER",
      this.#processMessages.bind(this)
    );
  }

  async #processMessages({ message }: EachMessagePayload): Promise<void> {
    const value = Message.parse<Order>(String(message.value) || "");

    if (!(await this.#isNewUser(value.payload.email))) {
      await this.#insertNewUser(value.payload.email);
    }
  }

  async #isNewUser(email: string): Promise<boolean> {
    const query = `SELECT uuid FROM Users WHERE email = "${email}" limit 1`;
    const user = await this.#database.query(query, "get");

    return !!user;
  }

  async #insertNewUser(email: string) {
    const uuid = String(uuidv4());
    const query = `INSERT INTO Users (uuid, email) VALUES ("${uuid}","${email}")`;

    await this.#database.query(query, "run");

    console.info("\x1b[32m", `User ${uuid} and ${email} added`);
  }
}
export default new createUserService().main();
