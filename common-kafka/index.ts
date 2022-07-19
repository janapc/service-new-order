import {
  Consumer,
  Kafka,
  Producer,
  EachMessagePayload,
  TopicMessages,
} from "kafkajs";
import { v4 as uuidv4 } from "uuid";

import { logCreator } from "./utils/logger";

const KAFKA_BROKERS = ["127.0.0.1:9092", "127.0.0.1:9093", "127.0.0.1:9094"];

abstract class CommonKafka {
  clientName: string;
  private kafka: Kafka;

  constructor(clientName: string) {
    this.clientName = clientName;
    this.kafka = new Kafka({
      brokers: KAFKA_BROKERS,
      clientId: `${this.clientName}-${uuidv4()}`,
      logCreator,
    });
  }

  createConsumer(groupId: string): Consumer {
    return this.kafka.consumer({ groupId });
  }

  createProducer(): Producer {
    return this.kafka.producer();
  }

  logMessage(params: EachMessagePayload) {
    const data = {
      message: `(${params.topic}|${this.clientName}|${params.message.timestamp})`,
      extra: {
        partition: params.partition,
        key: params.message.key?.toString(),
        value: params.message.value?.toString(),
        offset: params.message.offset,
      },
    };

    this.kafka.logger().info(data.message, data.extra);
  }
}

export { Consumer, EachMessagePayload, TopicMessages, CommonKafka };
