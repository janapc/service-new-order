import { v4 as uuidv4 } from 'uuid';

import { ConsumerFactory, EachMessagePayload, Message } from 'common-kafka';
import LocalDatabase from 'common-database';
import Logger from 'common-logs';

type Order = {
  orderId: string;
  email: string;
  amount: number;
};

class CreateUserService {
  #consumer: ConsumerFactory;

  #database: LocalDatabase;

  #logger: Logger;

  constructor() {
    this.#database = new LocalDatabase('users_database');
    this.#database.createIfNotExists('CREATE TABLE IF NOT EXISTS Users (uuid TEXT PRIMARY KEY, email TEXT)');
    this.#consumer = new ConsumerFactory('createUserService');
    this.#logger = new Logger();
  }

  async main() {
    await this.#consumer.run(
      'ECOMMERCE_NEW_ORDER',
      this.#processMessages.bind(this),
    );
  }

  async #processMessages({ message }: EachMessagePayload): Promise<void> {
    const value = Message.parse<Order>(String(message.value) || '');

    if (!(await this.#isNewUser(value.payload.email))) {
      await this.#insertNewUser(value.payload.email);
    }
  }

  async #isNewUser(email: string): Promise<boolean> {
    const query = `SELECT uuid FROM Users WHERE email = "${email}" limit 1`;
    const user = await this.#database.query(query, 'get');

    return !!user;
  }

  async #insertNewUser(email: string) {
    const uuid = String(uuidv4());
    const query = `INSERT INTO Users (uuid, email) VALUES ("${uuid}","${email}")`;

    await this.#database.query(query, 'run');

    this.#logger.log(`User ${uuid} and ${email} added`, 'info');
  }
}
export default new CreateUserService().main();
