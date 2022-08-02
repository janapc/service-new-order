import LocalDatabase from 'common-database';

export default class NewOrderDatabase {
  #database: LocalDatabase;

  constructor() {
    this.#database = new LocalDatabase('orders_database');
    this.#database.createIfNotExists('CREATE TABLE IF NOT EXISTS Orders (uuid TEXT PRIMARY KEY)');
  }

  async saveNew(orderId: string): Promise<boolean> {
    if (await this.#wasProcessed(orderId)) {
      return false;
    }
    this.#insertNewOrder(orderId);
    return true;
  }

  async #wasProcessed(orderId: string) {
    const query = `SELECT uuid FROM Orders WHERE uuid = "${orderId}" limit 1`;
    const order = await this.#database.query(query, 'get');

    return !!order;
  }

  async #insertNewOrder(orderId: string) {
    const query = `INSERT INTO Orders (uuid) VALUES ("${orderId}")`;

    await this.#database.query(query, 'run');
  }
}
