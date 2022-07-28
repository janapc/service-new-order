import sqlite3 from 'sqlite3';

type Methods = 'run' | 'get' | 'all';

export default class Database {
  #db: sqlite3.Database;

  constructor() {
    this.#db = Database.#connection();
  }

  static #connection() : sqlite3.Database {
    const database = new sqlite3.Database('sqlite.db');

    database.serialize(() => {
      const schema = 'CREATE TABLE IF NOT EXISTS Users (uuid TEXT PRIMARY KEY, email TEXT)';

      database.run(schema);
    });

    return database;
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
