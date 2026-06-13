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

const proto = loadProto('./greeter.proto');
const GreeterService = proto.greeter.Greeter.service;
```

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
equivalent of headers), or a single value when a key is given:

```ts
@GrpcMethod()
SayHello(
  @GrpcPayload() request: { name: string },
  @GrpcMetadata('authorization') token: string,
) {
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
  constructor(private greeterService: GreeterService) {}

  @GrpcMethod()
  SayHello(@GrpcPayload() request: { name: string }) {
    return this.greeterService.greet(request.name);
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

::: warning
Only **transport-agnostic** middleware works on gRPC controllers. Middleware
that reads HTTP request/response objects (`ctx.req` / `ctx.res`) has nothing to
operate on during a gRPC call (the same caveat applies to WebSocket
controllers).
:::
