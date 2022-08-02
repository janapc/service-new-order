import sqlite3 from 'sqlite3';

type Methods = 'run' | 'get' | 'all';

export default class LocalDatabase {
  #db: sqlite3.Database;

  constructor(name: string) {
    this.#db = LocalDatabase.#connection(name);
  }

  static #connection(name: string) : sqlite3.Database {
    const database = new sqlite3.Database(`${name}.db`);

    return database;
  }

  createIfNotExists(query: string) {
    try {
      this.#db.serialize(() => {
        this.#db.run(query);
      });
    } catch (error) {
      this.#db.close();
    }
  }

  async query(command: string, method: Methods): Promise<any | Error> {
    return new Promise((resolve, reject) => {
      this.#db[method](command, (error: Error, result: any) => {
        if (error) reject(error);
        else {
          resolve(result);
        }
      });
    });
  }
}
