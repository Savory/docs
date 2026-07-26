---
order: 2
---

# Controllers

A gRPC controller is a class annotated with `@GrpcController()`. It binds your
controller methods to the RPCs declared in a Protobuf service, while letting you
reuse everything else Danet offers — dependency injection, guards, middleware
and exception filters.

## Loading a service definition

The decorator takes a gRPC **service definition**. The simplest way to obtain
one is to load a `.proto` file at runtime with the `loadProto` helper (a thin
wrapper around [`@grpc/proto-loader`](https://www.npmjs.com/package/@grpc/proto-loader)):

```ts
import { loadProto } from 'jsr:@danet/grpc';

const proto = loadProto(new URL('./greeter.proto', import.meta.url).pathname);
const GreeterService = proto.greeter.Greeter.service;
```

::: tip
The path is resolved by the process, not by the module, so a relative
`'./greeter.proto'` only resolves when the working directory happens to be the
right one. Anchoring it on `import.meta.url` makes it independent of where the
app is started from.
:::

## `@GrpcController`

Mark a class as a gRPC service:

```ts
@GrpcController(GreeterService)
export class GreeterController {}
```

Register the controller in a module just like any other controller:

```ts
@Module({ controllers: [GreeterController] })
export class GreeterModule {}
```

## `@GrpcMethod`

Map a method to an RPC. By default the RPC name is taken from the method name,
so a method named `SayHello` implements the `SayHello` RPC. Pass an explicit
name to override:

```ts
@GrpcController(GreeterService)
export class GreeterController {
  @GrpcMethod() // implements the "SayHello" RPC
  SayHello(@GrpcPayload() request: { name: string }) {
    return { message: `Hello ${request.name}` };
  }

  @GrpcMethod('SayGoodbye') // explicit RPC name
  goodbye(@GrpcPayload() request: { name: string }) {
    return { message: `Goodbye ${request.name}` };
  }
}
```

The value you return is serialized against the RPC's response message type.

## Parameter decorators

### `@GrpcPayload`

Injects the decoded request message:

```ts
@GrpcMethod()
SayHello(@GrpcPayload() request: { name: string }) {
  return { message: `Hello ${request.name}` };
}
```

### `@GrpcMetadata`

Injects the call [metadata](https://grpc.io/docs/guides/metadata/) (the gRPC
equivalent of headers), or the values stored under a key when one is given.

A metadata key may repeat, so `@GrpcMetadata('key')` gives you an **array**, not
a string:

```ts
@GrpcMethod()
SayHello(
  @GrpcPayload() request: { name: string },
  @GrpcMetadata('authorization') tokens: string[],
) {
  const token = tokens[0];
  // ...
}
```

Omit the key to receive the whole `Metadata` object:

```ts
@GrpcMethod()
SayHello(@GrpcMetadata() metadata: Metadata) {
  // ...
}
```

## Dependency injection

Controllers are resolved through Danet's injector, so constructor injection
works as usual:

```ts
@GrpcController(GreeterService)
export class GreeterController {
  constructor(private greetingService: GreetingService) {}

  @GrpcMethod()
  SayHello(@GrpcPayload() request: { name: string }) {
    return this.greetingService.greet(request.name);
  }
}
```

Every RPC call runs in its own execution context, so **request-scoped**
injectables (`SCOPE.REQUEST`) are instantiated fresh per call, just like in HTTP
requests.

## Guards & middleware

`@UseGuard` and `@Middleware` work on gRPC controllers and methods exactly as
they do on HTTP controllers:

```ts
@UseGuard(AuthGuard)
@GrpcController(GreeterService)
export class GreeterController {
  @GrpcMethod()
  SayHello(@GrpcPayload() request: { name: string }) {
    return { message: `Hello ${request.name}` };
  }
}
```

A guard that returns `false` (or throws) rejects the call with the appropriate
gRPC status — see [Error handling](./error-handling).

::: warning A global guard runs on gRPC calls too
A guard registered under `GLOBAL_GUARD` runs for every transport. If it reads
`context.req` (an HTTP header, typically), it throws on a gRPC call and the
client receives `UNKNOWN: Cannot read properties of undefined`. Branch on
`context.grpcMetadata` to read the equivalent value:

```ts
const token = context.grpcMetadata
  ? context.grpcMetadata.get('authorization')[0]
  : context.req.header('authorization');
```

`SetMetadata`-based whitelists such as `@Public()` keep working, since
`context.getHandler()` and `context.getClass()` are both set for gRPC calls.
:::

::: warning
Only **transport-agnostic** middleware works on gRPC controllers. Middleware
that reads HTTP request/response objects (`ctx.req` / `ctx.res`) has nothing to
operate on during a gRPC call (the same caveat applies to WebSocket
controllers).
:::
