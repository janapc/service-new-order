import fs from 'fs';
import path from 'path';

import { ConsumerFactory, EachMessagePayload } from 'common-kafka';
import Logger from 'common-logs';

class ReadingReportService {
  #consumer: ConsumerFactory;

  #logger: Logger;

  constructor() {
    this.#consumer = new ConsumerFactory('ReadingReportService');
    this.#logger = new Logger();
  }

  async main() {
    try {
      await this.#consumer.run(
        'ECOMMERCE_USER_GENERATE_READING_REPORT',
        this.#processMessages.bind(this),
      );
    } catch (error) {
      await this.#consumer.shutdown();
    }
  }

  #createReport(uuid: string) {
    const pathFileBase = path.resolve(__dirname, './utils/report-model.txt');
    const file = fs.readFileSync(pathFileBase);

    const newFile = `${String(file)}\r Created for ${uuid}`;
    const pathTarget = path.resolve(__dirname, `./target/${uuid}.txt`);

    fs.writeFileSync(pathTarget, newFile, { encoding: 'utf-8' });

    this.#logger.log(`File created:  ${String(pathTarget)}`, 'info');
  }

  async #processMessages({ message }: EachMessagePayload): Promise<void> {
    const uuid = message.key?.toString() || '';

    this.#createReport(uuid);
  }
}

export default new ReadingReportService().main();
