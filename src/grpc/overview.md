---
order: 3
---

# Overview

[`@danet/grpc`](https://jsr.io/@danet/grpc) adds a native
[gRPC](https://grpc.io) transport to Danet, built on top of
[`@grpc/grpc-js`](https://www.npmjs.com/package/@grpc/grpc-js).

gRPC controllers reuse the **entire** Danet pipeline — dependency injection,
guards, middleware, exception filters and parameter resolution — exactly like
HTTP and WebSocket controllers. The gRPC server binds its own port and runs
alongside the HTTP server.

::: tip
gRPC runs as a real, native server (HTTP/2 + Protobuf), so any gRPC client — in
any language — can talk to it. This is not gRPC-Web or a proxy.
:::

## Requirements

- **Deno 2.8+** — server-side gRPC relies on `node:http2` trailer support.
- **`@danet/core` >= 2.11.0** — the release that exposes the transport hook this
  package plugs into.

> The first MVP supports **unary** RPCs. Streaming (server/client/bidi), TLS
> credentials and static Protobuf codegen are planned — see
> [Error handling & limitations](./error-handling).

## Installation

```sh
deno add jsr:@danet/grpc
```

Or import it directly with the `jsr:` specifier:

```ts
import { GrpcServer } from 'jsr:@danet/grpc';
```

## Quick start

### 1. Describe your service in a `.proto` file

```proto greeter.proto
syntax = "proto3";

package greeter;

service Greeter {
  rpc SayHello (HelloRequest) returns (HelloReply) {}
}

message HelloRequest {
  string name = 1;
}

message HelloReply {
  string message = 1;
}
```

### 2. Implement it as a controller

Annotate a class with `@GrpcController`, passing it the service definition, and
map methods to RPCs with `@GrpcMethod`.

```ts greeter.controller.ts
import {
  GrpcController,
  GrpcMethod,
  GrpcPayload,
  loadProto,
} from 'jsr:@danet/grpc';

const proto = loadProto('./greeter.proto');

@GrpcController(proto.greeter.Greeter.service)
export class GreeterController {
  @GrpcMethod()
  SayHello(@GrpcPayload() request: { name: string }) {
    return { message: `Hello ${request.name}` };
  }
}
```

### 3. Register the controller in a module

```ts greeter.module.ts
import { Module } from 'jsr:@danet/core';
import { GreeterController } from './greeter.controller.ts';

@Module({
  controllers: [GreeterController],
})
export class GreeterModule {}
```

### 4. Boot the application

Create a `GrpcServer` **before** `app.init()` so the transport can claim its
controllers during bootstrap, then start it on its own port.

```ts main.ts
import { DanetApplication } from 'jsr:@danet/core';
import { GrpcServer } from 'jsr:@danet/grpc';
import { GreeterModule } from './greeter.module.ts';

const app = new DanetApplication();
const grpc = new GrpcServer(app);

await app.init(GreeterModule);
await grpc.listen(50051);

// app.listen(3000) still works for HTTP on the same application.
```

That's it — your `Greeter` service is now reachable by any gRPC client on port
`50051`.

Next, see [Controllers](./controllers) for the full decorator API.
