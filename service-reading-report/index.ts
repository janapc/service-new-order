import fs from 'fs';
import path from 'path';

import { ConsumerFactory, EachMessagePayload } from 'common-kafka';

class ReadingReportService {
  #consumer: ConsumerFactory;

  constructor() {
    this.#consumer = new ConsumerFactory('ReadingReportService');
  }

  async main() {
    try {
      await this.#consumer.run(
        'ECOMMERCE_USER_GENERATE_READING_REPORT',
        ReadingReportService.#processMessages.bind(this),
      );
    } catch (error) {
      await this.#consumer.shutdown();
    }
  }

  static #createReport(uuid: string) {
    const pathFileBase = path.resolve(__dirname, './utils/report-model.txt');
    const file = fs.readFileSync(pathFileBase);

    const newFile = `${String(file)}\r Created for ${uuid}`;
    const pathTarget = path.resolve(__dirname, `./target/${uuid}.txt`);

    fs.writeFileSync(pathTarget, newFile, { encoding: 'utf-8' });

    console.info('\x1b[32m', `File created:  ${String(pathTarget)}`);
  }

  static async #processMessages({ message }: EachMessagePayload): Promise<void> {
    const uuid = message.key?.toString() || '';

    ReadingReportService.#createReport(uuid);
  }
}

export default new ReadingReportService().main();
