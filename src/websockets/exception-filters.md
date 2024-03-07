### Exception filters

The only difference between the HTTP [exception filter](/overview/exception-filters.md) layer and the corresponding web sockets layer is that instead of throwing `HttpException`, you should use return a valid message with `topic` and `data`.

```typescript
return { topic: 'error', data: { customMessage: 'not cool my friend' }};
```

With the sample above, Danet will handle the thrown exception and emit the `exception` message with the following structure:

#### Filters

Web sockets exception filters behave equivalently to HTTP exception filters. The following example uses a manually instantiated method-scoped filter. Just as with HTTP based applications, you can also use gateway-scoped filters (i.e., prefix the gateway class with a `@UseFilters()` decorator).

```ts
@UseFilters(new WsExceptionFilter())
@OnWebSocketMessage('events')
onEvent(@Body() data: any ) {
  return { 'events' , data };
}
```
