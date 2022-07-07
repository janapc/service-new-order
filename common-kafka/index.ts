import {
  Consumer,
  Kafka,
  Producer,
  EachMessagePayload,
  TopicMessages,
} from "kafkajs";
import { v4 as uuidv4 } from "uuid";

import { logCreator } from "./utils/logger";

interface MessageInterface {
  topic: string;
  partition: number;
  clientName: string;
  message: {
    offset: string;
    key: Buffer | null;
    value: Buffer | null;
    timestamp: string;
  };
}

interface LogMessageInterface {
  message: string;
  extra: {
    partition: number;
    offset: string;
  };
}

export interface MessagePayloadInterface extends EachMessagePayload {}
export interface TopicMessagesInterface extends TopicMessages {}

export abstract class CommonKafka {
  clientName: string;

  constructor(clientName: string) {
    this.clientName = clientName;
  }

  createConsumer(groupId: string): Consumer {
    const kafka = new Kafka({
      brokers: ["127.0.0.1:9092"],
      clientId: `${this.clientName}-${uuidv4()}`,
      logCreator,
    });

    return kafka.consumer({ groupId });
  }

  createProducer(): Producer {
    const kafka = new Kafka({
      brokers: ["127.0.0.1:9092"],
      clientId: `${this.clientName}-${uuidv4()}`,
      logCreator,
    });

    return kafka.producer();
  }

  logMessage(params: MessageInterface): LogMessageInterface {
    return {
      message: `(${params.topic}|${params.clientName}|${
        params.message.timestamp
      }) : ${params.message.key?.toString()} - ${params.message.value?.toString()}`,
      extra: {
        partition: params.partition,
        offset: params.message.offset,
      },
    };
  }
}
