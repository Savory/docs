---
order: 1
---

# Exchanges & acknowledgements

By default a listener consumes a durable queue directly, which is all you need
for simple point-to-point messaging. RabbitMQ's
[exchanges](https://www.rabbitmq.com/tutorials/amqp-concepts#exchanges) unlock
fan-out and topic routing, and acknowledgements give you delivery guarantees.

## Exchanges

### Binding a consumer to an exchange

Pass binding options as the second argument of `@OnRabbitMQMessage`. The queue
is asserted, the exchange is asserted, and the queue is bound to it with the
given routing key:

```ts
import { OnRabbitMQMessage } from 'jsr:@danet/rabbitmq';

@Injectable()
export class OrderNotifier {
  @OnRabbitMQMessage('order.shipped.email', {
    exchange: 'orders',
    exchangeType: 'topic', // 'direct' | 'topic' | 'fanout' | 'headers'
    routingKey: 'order.shipped',
  })
  sendShippingEmail(payload: { orderId: number }) {
    // ...
  }
}
```

Two consumers binding different queues to the same `topic`/`fanout` exchange
both receive a copy of each matching message — that is the fan-out pattern.

### Publishing to an exchange

Use `publish(exchange, routingKey, data, exchangeType?, options?)`:

```ts
this.rabbit.publish('orders', 'order.shipped', { orderId: 1 }, 'topic');
```

The exchange is asserted (created if missing) before publishing, and the payload
is JSON-encoded and `persistent` by default.

## Acknowledgements

Messages are acknowledged automatically:

- the handler **resolves** → the message is **ack**ed;
- the handler **throws** → the message is **nack**ed **without requeue**, so a
  [dead-letter](https://www.rabbitmq.com/docs/dlx) policy can pick it up instead
  of redelivering in a hot loop.

To take over acking yourself, opt out of auto-ack with `consumeOptions`:

```ts
@OnRabbitMQMessage('order.created', {
  consumeOptions: { noAck: true },
})
handle(payload: OrderCreated) {
  // you are responsible for acking — nothing is acked or nacked for you
}
```

Use `prefetch` in `RabbitMQModule.forRoot({ url, prefetch })` to cap how many
unacknowledged messages the broker delivers at once (QoS), which is how you
spread work across multiple consumer instances.

## Sending messages from a non-Danet app

Unlike Danet's [KV Queue](../techniques/kvQueue) — where `Deno.kv` exposes a
single global queue, so messages must be wrapped as `{ type, data }` to be
routed — RabbitMQ has **native queues and exchanges**. No wrapper is needed: the
message **body is simply the JSON of your payload**.

A message published with:

```ts
this.rabbit.sendMessage('order.created', { orderId: 1 });
```

is delivered with body:

```json
{ "orderId": 1 }
```

`@OnRabbitMQMessage('order.created')` consumes the `order.created` queue and
`JSON.parse`s the body. So any RabbitMQ producer — in any language — that
publishes JSON to the same queue (or to an exchange bound to it) will be
consumed by your Danet handler, and vice-versa.

## Limitations

- **One handler per queue.** A queue maps to a single `@OnRabbitMQMessage`
  method within an app.
- **No DTO validation.** Payloads are `JSON.parse`d as-is; the class-validator
  based validation used by `@Body` does not apply. Validate inside the handler
  if you need it.
- **No wildcard channel matching in the decorator.** Routing is delegated to
  RabbitMQ — use a `topic` exchange and routing-key patterns (e.g. `order.*`)
  instead.
