import { Consumer, Kafka, EachMessagePayload } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';

const KAFKA_BROKERS = ['127.0.0.1:9092', '127.0.0.1:9093', '127.0.0.1:9094'];

export default class ConsumerFactory {
  #clientName: string;

  #consumer: Consumer;

  constructor(clientName: string) {
    this.#clientName = clientName;
    this.#consumer = this.#createConsumer();
  }

  async run(
    topicName: string | Array<RegExp>,
    processMessages: Function,
  ): Promise<void> {
    try {
      await this.#consumer.connect();

      if (typeof topicName === 'string') {
        await this.#consumer.subscribe({
          topic: topicName,
        });
      } else {
        await this.#consumer.subscribe({
          topics: topicName,
        });
      }

      await this.#consumer.run({
        autoCommitThreshold: 1,
        eachMessage: async (messages: EachMessagePayload) => processMessages(messages),
      });
    } catch (error) {
      this.#consumer.logger().error(String(error));
    }
  }

  async shutdown(): Promise<void> {
    await this.#consumer.disconnect();
  }

  #createConsumer(): Consumer {
    const kafka = new Kafka({
      brokers: KAFKA_BROKERS,
      clientId: `${this.#clientName}-${uuidv4()}`,
    });

    return kafka.consumer({ groupId: this.#clientName });
  }
}
