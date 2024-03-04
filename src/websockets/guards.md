### Guards

There is no fundamental difference between web sockets guards and [regular HTTP application guards](/overview/guards.md).


#### Binding guards

The following example uses a method-scoped guard. Just as with HTTP based applications, you can also use gateway-scoped guards (i.e., prefix the gateway class with a `@UseGuards()` decorator).

```ts 
@UseGuards(AuthGuard)
@OnWebSocketMessage('events')
handleEvent(@WebSocket() socket: WebSocket) {
  socket.send({ topic: 'events', data: 'hello' })
}
```
