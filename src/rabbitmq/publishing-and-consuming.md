---
order: 2
---

# Publishing & consuming

The package exposes one injectable service, `RabbitMQ`, and one method
decorator, `@OnRabbitMQMessage`. Together they mirror the KV Queue API
(`KvQueue.sendMessage` + `@OnQueueMessage`).

## The `RabbitMQ` service

Inject it through the constructor like any other injectable:

```ts
import { Injectable } from 'jsr:@danet/core';
import { RabbitMQ } from 'jsr:@danet/rabbitmq';

@Injectable()
export class OrderService {
  constructor(private rabbit: RabbitMQ) {}
}
```

### `sendMessage(queue, data, options?)`

Publishes a message to a queue. The queue is asserted as `durable` (created if
missing) and the payload is JSON-encoded. By default messages are `persistent`.

```ts
this.rabbit.sendMessage('order.created', { orderId: 1 });

// With amqplib publish options:
this.rabbit.sendMessage('order.created', { orderId: 1 }, {
  expiration: '60000', // ms TTL
  headers: { source: 'checkout' },
});
```

It returns a `Promise<boolean>` — `false` signals broker back-pressure (the
channel's write buffer is full).

### `publish(exchange, routingKey, data, exchangeType?, options?)`

Publishes to an exchange instead of directly to a queue — see
[Exchanges](./exchanges-and-acknowledgements#exchanges).

## Consuming with `@OnRabbitMQMessage`

Decorate a method with `@OnRabbitMQMessage(queue)`. During bootstrap the module
scans every injectable for decorated methods and wires each one up as a consumer
of its queue. The method receives the JSON-decoded message body:

```ts
import { Injectable } from 'jsr:@danet/core';
import { OnRabbitMQMessage } from 'jsr:@danet/rabbitmq';

class OrderCreatedMessage {
  orderId!: number;
}

@Injectable()
export class OrderHandler {
  @OnRabbitMQMessage('order.created')
  handleOrderCreated(payload: OrderCreatedMessage) {
    // handle and process the "order.created" message
  }
}
```

::: info **Hint** 💡
The decorated class must be an injectable that Danet knows about (registered in
a module's `injectables`), so it is instantiated and scanned at bootstrap.
:::

::: tip One handler per message type
Like KV Queue's `@OnQueueMessage`, each `@OnRabbitMQMessage` handles exactly one
queue, keeping handlers small and single-purpose. A queue may only have one
handler in a given app.
:::

## Decoupling between services

Because the queue name is the only contract, the producer and the consumer do
not need to live in the same application — or even be written in the same
language. One service can `sendMessage('order.created', …)` while a completely
separate Danet service consumes it with `@OnRabbitMQMessage('order.created')`.

See [Sending messages from a non-Danet app](./exchanges-and-acknowledgements#sending-messages-from-a-non-danet-app)
for the on-the-wire message format.
