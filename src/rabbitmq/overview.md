---
order: 3
---

# Overview

[`@danet/rabbitmq`](https://jsr.io/@danet/rabbitmq) adds a
[RabbitMQ](https://www.rabbitmq.com) queue/messaging transport to Danet, built
on top of [`amqplib`](https://www.npmjs.com/package/amqplib).

It brings the same DI-driven, decorator-based listener model used by Danet's
built-in [KV Queue](../techniques/kvQueue) and [Events](../techniques/events)
modules to a real RabbitMQ broker: inject `RabbitMQ` to **publish**, and
decorate methods with `@OnRabbitMQMessage` to **consume**.

::: tip When should I use this over KV Queue or Events?

- [**Events**](../techniques/events) — in-process pub/sub. Lives and dies with a
  single instance; great for decoupling code inside one app.
- [**KV Queue**](../techniques/kvQueue) — durable queue backed by `Deno.kv`. No
  extra infrastructure, but tied to Deno and a single global queue.
- **RabbitMQ** — a battle-tested message broker shared across many services and
  languages, with native queues, exchanges, routing and acknowledgements. Reach
  for it when messages must cross service (or language) boundaries.

:::

## Requirements

- A reachable RabbitMQ broker. For local development:
  ```sh
  docker run -d -p 5672:5672 -p 15672:15672 rabbitmq:3-management
  ```
- **`@danet/core` >= 2.11.0**.

## Installation

```sh
deno add jsr:@danet/rabbitmq
```

Or import it directly with the `jsr:` specifier:

```ts
import { RabbitMQModule } from 'jsr:@danet/rabbitmq';
```

## Quick start

### 1. Import the module

Import `RabbitMQModule.forRoot()` into your root module, passing at least an AMQP
`url`:

```ts app.module.ts
import { Module } from 'jsr:@danet/core';
import { RabbitMQModule } from 'jsr:@danet/rabbitmq';
import { OrderService } from './order.service.ts';

@Module({
  imports: [
    RabbitMQModule.forRoot({
      url: 'amqp://guest:guest@localhost:5672',
      prefetch: 10, // optional QoS — max unacked messages in flight
    }),
  ],
  injectables: [OrderService],
})
export class AppModule {}
```

### 2. Publish messages

Inject `RabbitMQ` and call `sendMessage(queue, payload)`. The payload is
JSON-encoded and the queue is created (durable) if it doesn't exist yet:

```ts order.service.ts
import { Injectable } from 'jsr:@danet/core';
import { RabbitMQ } from 'jsr:@danet/rabbitmq';

@Injectable()
export class OrderService {
  constructor(private rabbit: RabbitMQ) {}

  create() {
    this.rabbit.sendMessage('order.created', { orderId: 1 });
  }
}
```

### 3. Consume messages

Decorate a method with `@OnRabbitMQMessage(queue)`. It receives the JSON-decoded
payload:

```ts order.service.ts
import { OnRabbitMQMessage } from 'jsr:@danet/rabbitmq';

@Injectable()
export class OrderService {
  // ...

  @OnRabbitMQMessage('order.created')
  handleOrderCreated(payload: { orderId: number }) {
    // process the message
  }
}
```

### 4. Boot the application

Nothing special — the module connects to the broker and starts consuming during
`app.init()`:

```ts main.ts
import { DanetApplication } from 'jsr:@danet/core';
import { AppModule } from './app.module.ts';

const app = new DanetApplication();
await app.init(AppModule);
await app.listen(3000);
```

That's it — your app now publishes to and consumes from RabbitMQ.

Next, see [Publishing & consuming](./publishing-and-consuming) for the full API.
