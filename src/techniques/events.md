---
label: Events
order: 40
---
## Events


`EventEmitter` package provides a simple observer implementation, allowing you to subscribe and listen for various events that occur in your application.
Events serve as a great way to decouple various aspects of your application, since a single event can have multiple listeners that do not depend on each other.

`EventEmitterModule` internally uses the [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) API.

#### Getting started

No need to install an extra module, you can import it from `danet/mod.ts`

```ts
import { EventEmitterModule, EventEmitter } from `danet/mod.ts`
```

Import the `EventEmitterModule` into the root `AppModule`:

```typescript
import { Module, EventEmitterModule } from 'danet/mod.ts';

@Module({
  import: [EventEmitterModule],
})
export class AppModule {}
```

#### Dispatching Events

To dispatch (i.e., fire) an event, first inject `EventEmitter` using standard constructor injection:

```typescript
constructor(private eventEmitter: EventEmitter) {}
```

> **Hint** 💡 Import the `EventEmitter` from the `danet/mod.ts` package.

Then use it in a class as follows:

```typescript
this.eventEmitter.emit(
  'order.created',
  new OrderCreatedEvent({
    orderId: 1,
    payload: {},
  }),
);
```

#### Listening to Events

To declare an event listener, decorate a method with the `@OnEvent()` decorator preceding the method definition containing the code to be executed, as follows:

```typescript
class OrderListeners {
    @OnEvent('order.created')
    handleOrderCreatedEvent(payload: OrderCreatedEvent) {
      // handle and process "OrderCreatedEvent" event
    }
}
```

> **Warning 🚧** this modules does not support **wildcard** expressions yet.

#### Example

A working example is available [here](https://github.com/Savory/Danet/blob/main/example/events.ts).
