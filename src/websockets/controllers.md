# Controllers

Most of the concepts discussed elsewhere in this documentation, such as dependency injection, decorators, exception filters, pipes, guards and interceptors, apply equally to controllers. Wherever possible, Danet abstracts implementation details so that the same components can run across HTTP-based platforms and WebSockets. This section covers the aspects of Danet that are specific to WebSockets.

In Danet, a websocket contrller is simply a class annotated with `@WebSocketController()` decorator. Danet does not use any third party library to handle websocket, we use the [WebApi WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)


## Overview

In general, each WebSocketController is listening on the same port as the **HTTP server** and accessible on the given endpoints. For example, if you want to connect on `ws://youwebsite.com/ws` do the following: 

```typescript
@WebSocketController('ws')
```

The controller is now listening, but we have not yet subscribed to any incoming messages. Let's create a handler that will subscribe to the `events` messages and respond to the user with the exact same data.

```ts events.controller.ts
@SubscribeMessage('events')
handleEvent(@Body() data: string): string {
  return { topic: 'events' , data };
}
```

Once the controller is created, we can register it in our module.

```ts events.module.ts
import { Module } from 'danet/mod.ts';
import { Eventscontroller } from './events.controller';

@Module({
  controllers: [Eventscontroller]
})
export class EventsModule {}
```

You can also pass in a property key to the decorator to extract it from the incoming message body:

```ts events.controller.ts
@OnWebSocketMessage('events')
handleEvent(@Body('name') name: string) {
  return { topic: 'hello', data: name };
}
```

## Execution context

When implementing any websocket features (such as `ExceptionFilters`, `Middleware` or `Guards`) and you get access to the `ExecutionContext`, you have access to two additionnal properties, `WebSocket`, representing the current socket, a `WebSocketTopic`, with the actual message topic.

## Send message from your client

In order to have a very good DX with topics (and topic matchers as described below), all message received by your Danet application need to contain a `topic` and `data`.
For example:

```ts
const websocket = new WebSocket(
			`ws://localhost:3000/ws`,
		);
websocket.onopen = (e) => {
			websocket.send(
				JSON.stringify({ topic: 'trigger', data: { obiwan: 'kenobi' } }),
			);
		};

```

## Method parameters decorators

We created the WebsocketController in a way to make *almost* permutable with the HttpController. Which means that `@Body` and `@Param` decorators will work exactly the same (for you, Danet user). We also have a new `@WebSocket` decorator to get the current socket reference.

### WebSocket instance


### Message data with attribute name
```ts events.controller.ts
@OnWebSocketMessage('events')
handleEvent(@WebSocket() socket: WebSocket) {
  return socket.send(JSON.string({ topic: 'hello', data: name });;
}
```


### Message data with attribute name
```ts events.controller.ts
@OnWebSocketMessage('events')
handleEvent(@Body('name') name: string) {
  return { topic: 'hello', data: name };
}
```

### Get the whole message data
```ts events.controller.ts
@OnWebSocketMessage('events')
handleEvent(@Body() payload: { name: string, whateveryouwant: CoolObject }) {
  return { topic: 'hello', data: name };
}
```

### Topic parameters with `@Param`
```ts events.controller.ts
@OnWebSocketMessage('user/:userId')
handleEvent(@Param('userId') userId: string ) {
  return { topic: 'hello', data: userId };
}
```

## Topic Matching

Under the hood, we use Hono smart router on message topic. This mean that you can have very specific message handler, as if you were building an HTTP endpoints. Some examples from Hono's documentation: 

- '/user/:name'
- '/posts/:id/comment/:comment_id'
- '/api/animal/:type?'
- '/post/:date{[0-9]+}/:title{[a-z]+}'