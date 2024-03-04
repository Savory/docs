### Middlewares

There is no difference between the HTTP [middlewares](/overview/middlewares.md) layer and the corresponding web sockets layer. But at least you know they exist !

#### Example

Web sockets exception filters behave equivalently to HTTP exception filters. The following example uses a manually instantiated method-scoped filter. Just as with HTTP based applications, you can also use gateway-scoped filters (i.e., prefix the gateway class with a `@UseFilters()` decorator).

Here is an example, where we use middleware to tell the client how it's going. But your usecase will probably be better than ours !

```ts

@Injectable()
class SimpleMiddleware implements DanetMiddleware {
	constructor(private simpleInjectable: SimpleInjectable) {
	}

	async action(ctx: ExecutionContext, next: NextFunction) {
		ctx.websocket!.send(
			JSON.stringify({
				topic: 'status',
				data: {
          middleware: 'SimpleMiddleware'
        },
			}),
		);
		await next();
	}
}


@Middleware(SimpleMiddleware)
@WebSocketController('ws')
class ControllerWithMiddleware {
	@OnWebSocketMessage('trigger')
	getWithoutMiddleware() {
	}
}

```
