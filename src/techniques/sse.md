---
label: Server Sent Events
order: 20
---

### Server-Sent Events

Server-Sent Events (SSE) is a server push technology enabling a client to receive automatic updates from a server via HTTP connection. Each notification is sent as a block of text terminated by a pair of newlines (learn more [here](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)).

#### Usage

To enable Server-Sent events on a route (route registered within a **controller class**), annotate the method handler with the `@SSE()` decorator.

```typescript sse.controller.ts
@SSE('sse')
sendUpdate(): EventTarget {
  const eventTarget = new EventTarget();
  let id = 0;
  const interval = setInterval(() => {
    if (id >= 4) {
      clearInterval(interval);
      const event = new SSEEvent({
        retry: 1000,
        id: `${id}`,
        data: 'close',
        event: 'close',
      });
      eventTarget.dispatchEvent(event);
      return;
    }
    const event = new SSEEvent({
      retry: 1000,
      id: `${id}`,
      data: 'world',
      event: 'hello',
    });
    eventTarget.dispatchEvent(event);
    id++;
  }, 100);
  return eventTarget;
}
```

> info **Hint** The `@SSE()` decorator and the `SSEEvent` class are imported from `@danet/core`, while `EventTarget` is a web standard class.

> warning **Warning** Server-Sent Events routes must return an `EventTarget`.

In the example above, we defined a route named `sse` that will allow us to propagate real-time updates. These events can be listened to using the [EventSource API](https://developer.mozilla.org/en-US/docs/Web/API/EventSource).

The `sse` method returns an `EventTarget` that dispatches multiple `SSEEvent` (in this example, one every 100ms). `SSEEvent` is a `CustomEvent` subclass; its constructor takes an object respecting the `SSEMessage` interface, which matches the specification:

```typescript
export interface SSEMessage {
  data: string | object;
  id?: string;
  event?: string;
  retry?: number;
}
```

> info **Hint** `data` may be an object. Danet `JSON.stringify` it before writing it to the stream, since the SSE wire format only carries text.

#### Closing the stream

Danet keeps the connection open until it receives an event whose `event` field is `close`, as in the example above. Once that event is dispatched, the stream is closed and the connection ends. Make sure your `EventTarget` eventually dispatches one, otherwise the connection stays open indefinitely.

> warning **Warning** Danet subscribes to your `EventTarget` **after** the handler returns it. Any event dispatched synchronously inside the handler, before returning, is lost. Dispatch from a timer, an interval or an awaited callback instead.

With this in place, we can now create an instance of the `EventSource` class in our client-side application, passing the `/sse` route (which matches the endpoint we have passed into the `@SSE()` decorator above) as a constructor argument.

`EventSource` instance opens a persistent connection to an HTTP server, which sends events in `text/event-stream` format. The connection remains open until closed by calling `EventSource.close()`.

Once the connection is opened, incoming messages from the server are delivered to your code in the form of events. If there is an event field in the incoming message, the triggered event is the same as the event field value. If no event field is present, then a generic `message` event is fired ([source](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)).

```javascript
const eventSource = new EventSource('/sse');
eventSource.onmessage = ({ data }) => {
  console.log('New message', JSON.parse(data));
};
```

#### Example

A working example is available [here](https://github.com/Savory/Danet/blob/main/spec/sse.test.ts).