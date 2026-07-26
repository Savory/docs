---
label: Queue with Deno.kv
order: 39
---
## KV Queue

Queues are a powerful design pattern that help you deal with common application scaling and performance challenges. Some examples of problems that Queues can help you solve are:

Smooth out processing peaks. For example, if users can initiate resource-intensive tasks at arbitrary times, you can add these tasks to a queue instead of performing them synchronously. Then you can have worker processes pull tasks from the queue in a controlled manner. You can easily add new Queue consumers to scale up the back-end task handling as the application scales up.
Break up monolithic tasks that may otherwise block the V8 (what Deno and Node use internally) event loop. For example, if a user request requires CPU intensive work like audio transcoding, you can delegate this task to other processes, freeing up user-facing processes to remain responsive.
Provide a reliable communication channel across various services. For example, you can queue tasks (jobs) in one process or service, and consume them in another. 

`KvQueue` package provides a simple abstraction, allowing you to fire and consume message.

::: tip Need a broker shared across services?
`KvQueue` is backed by `Deno.kv` and lives inside a single Deno app. If you need
to exchange messages across services or languages, the
[`@danet/rabbitmq`](/rabbitmq/overview) package offers the same listener model
(`@OnRabbitMQMessage` + a `RabbitMQ` service) on top of a real RabbitMQ broker.
:::

#### Getting started

No need to install an extra module, you can import it from `jsr:@danet/core`

```ts
import { KvQueueModule, KvQueue } from `jsr:@danet/core`
```

Import the `KvQueueModule` into the root `AppModule` as following:

```typescript app.module.ts
import { Module, KvQueueModule } from 'jsr:@danet/core';

@Module({
  imports: [KvQueueModule.forRoot()],
})
export class AppModule {}
```

::: info **Hint**
As `Deno.openKv` takes a path, you can also provide it to `forRoot()`.
:::

::: warning Enable the unstable API
`KvQueue` calls `Deno.openKv()`, which is still behind a flag. Run your app with
`--unstable-kv`, or add `"unstable": ["kv"]` to your `deno.json`.
:::

#### Send message to the queue

To send a message, first inject `KvQueue` using standard constructor injection:

```typescript
constructor(private queue: KvQueue) {}
```

::: **Hint** 💡 
Import the `KvQueue` from the `jsr:@danet/core` package.
:::

Then use it in a class as follows:

```typescript
this.queue.sendMessage('order.created', new OrderCreatedMessage(
  {
    orderId: 1,
    payload: {},
  }
))
```

#### Consuming message

To declare a message consumer, decorate a method with the `@OnQueueMessage()` decorator preceding the method definition containing the code to be executed, as follows:

```typescript order-message.handler.ts
@Injectable()
export class OrderMessageHandler {
    @OnQueueMessage('order.created')
    handleOrderCreatedEvent(payload: OrderCreatedMessage) {
      // handle and process "OrderCreatedMessage" event
    }
}
```

Register that class in the `injectables` array of a module. We scan injectables
at bootstrap, controllers are not scanned.

::: warning **Warning 🚧**
this module does not support **wildcard** expressions yet.
:::

::: warning `this` is not your instance
The decorated method is handed to `Deno.Kv.listenQueue` as a plain function, so
it runs detached from the instance it was declared on. Reaching for
`this.someService` inside a consumer throws. Keep the consumer self contained and
import the function that does the work.
:::

Only one method can listen to a given message type. If a message arrives with a
type nobody registered, we throw `Unhandled message type`. When a consumer
throws, `Deno.Kv` redelivers the message a few times with a growing delay before
giving up.

#### Sending message from a non Danet application

To  make DX better and comply with SRP , `@OnQueueMessage` decorator takes a "message type" argument, so one method handles only one type of message.

In order to keep it consistent, `KvQueue.sendMessage` also takes a message type as first argument, and then your payload.

However, Deno.kv does not have any message discrimination or channel. Which means that when we call kv.listenQueue under the hood, we have to consume all incoming messages.

To make everything work, we are actually sending a message constructed as follows:

```json
{
  type:"order.created",
  data: //object your provided
}
```

On the listener, we are doing the following:

```ts
this.kv.listenQueue((msg: QueueEvent) => {
			const type = msg.type;
			const callback = this.listenersMap.get(type);
			if (callback) {
				return callback(msg.data);
			}
			throw Error('Unhandled message type');
		});
```

So if you want to send message without using KvQueue, or from a non Danet app, please keep that in mind and format your message as shown above.
