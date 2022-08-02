import { v4 as uuidv4 } from 'uuid';

type Parse<T> = {
  payload: T;
  correlationId: { id: string };
};

type Params<T> = {
  payload: T;
  serviceName: string;
  oldServiceName?: string;
};

export default class Message {
  static formatter<T>(params: Params<T>): string {
    const correlationId = {
      id: `${params.oldServiceName || ''} | ${
        params.serviceName
      } (${uuidv4()})`,
    };

    return JSON.stringify({
      payload: params.payload,
      correlationId,
    });
  }

  static parse<T>(value: string): Parse<T> {
    return JSON.parse(value);
  }
}
