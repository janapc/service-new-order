import sqlite3, { RunResult } from "sqlite3";

type Methods = "run" | "get" | "all";

export default class Database {
  #db: sqlite3.Database;

  constructor() {
    this.#db = this.#connection();
  }

  #connection(): sqlite3.Database {
    const db = new sqlite3.Database("sqlite.db");

    db.serialize(() => {
      const schema = `CREATE TABLE IF NOT EXISTS Users (uuid TEXT PRIMARY KEY, email TEXT)`;

      db.run(schema);
    });

    return db;
  }

  async query(command: string, method: Methods): Promise<RunResult | Error> {
    return new Promise((resolve, reject) => {
      this.#db[method](command, (error: Error, result: RunResult) => {
        if (error) reject(error);
        else {
          resolve(result);
        }
      });
    });
  }
}
