import { Kafka, Producer, TopicMessages } from "kafkajs";
import { v4 as uuidv4 } from "uuid";

import { logCreator } from "./utils/logger";

export type ProducerMessage = {
  topic: string;
  messages: Array<{ key: string; value: string }>;
};

const KAFKA_BROKERS = ["127.0.0.1:9092", "127.0.0.1:9093", "127.0.0.1:9094"];

export class ProducerFactory {
  clientName: string;
  #producer: Producer;

  constructor(clientName: string) {
    this.clientName = clientName;
    this.#producer = this.#createProducer();
  }

  async start(): Promise<void> {
    try {
      await this.#producer.connect();
    } catch (error) {
      this.#producer
        .logger()
        .error(`Error connecting the producer: ${String(error)}`);
    }
  }

  async shutdown(): Promise<void> {
    await this.#producer.disconnect();
  }

  async sendBatch(messages: Array<ProducerMessage>): Promise<void> {
    const topicMessages: Array<TopicMessages> = messages;

    await this.#producer.sendBatch({ topicMessages });
  }

  async send(message: ProducerMessage): Promise<void> {
    await this.#producer.send(message);
  }

  #createProducer(): Producer {
    const kafka = new Kafka({
      brokers: KAFKA_BROKERS,
      clientId: `${this.clientName}-${uuidv4()}`,
      logCreator,
    });

    return kafka.producer();
  }
}
