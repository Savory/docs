---
order: 1
---

# Error handling & limitations

## Mapping exceptions to gRPC statuses

When a controller method (or a guard) throws, `@danet/grpc` converts the error
into a gRPC status code returned to the client.

Danet's built-in [HTTP exceptions](../fundamentals/exception-filters) are mapped
to the closest gRPC status:

| Danet exception              | HTTP | gRPC status            |
| ---------------------------- | ---- | ---------------------- |
| `BadRequestException`        | 400  | `INVALID_ARGUMENT`     |
| `UnauthorizedException`      | 401  | `UNAUTHENTICATED`      |
| `ForbiddenException`         | 403  | `PERMISSION_DENIED`    |
| `NotFoundException`          | 404  | `NOT_FOUND`            |
| `ConflictException`          | 409  | `ALREADY_EXISTS`       |
| `PreconditionFailedException`| 412  | `FAILED_PRECONDITION`  |
| `TooManyRequestsException`   | 429  | `RESOURCE_EXHAUSTED`   |
| `InternalServerErrorException`| 500 | `INTERNAL`             |
| `NotImplementedException`    | 501  | `UNIMPLEMENTED`        |
| `ServiceUnavailableException`| 503  | `UNAVAILABLE`          |
| `GatewayTimeoutException`    | 504  | `DEADLINE_EXCEEDED`    |

Any other error maps to `UNKNOWN`.

```ts
@GrpcMethod()
GetUser(@GrpcPayload() request: { id: string }) {
  const user = this.users.find(request.id);
  if (!user) {
    throw new NotFoundException('user not found'); // -> NOT_FOUND on the client
  }
  return user;
}
```

A denied guard throws `ForbiddenException`, so the client receives
`PERMISSION_DENIED`.

## Exception filters

Exception filters run for gRPC calls just like for HTTP requests. If a filter
returns a value, that value is sent back to the client as the RPC reply instead
of an error.

```ts
@UseFilter(MyGrpcFilter)
@GrpcController(GreeterService)
export class GreeterController { /* ... */ }
```

## Limitations

- **Unary RPCs only** for now. Streaming RPCs (server-, client- and
  bidirectional) are skipped — clients calling them receive `UNIMPLEMENTED`.
  Streaming support is planned.
- **Transport-agnostic middleware only** — middleware that depends on HTTP
  `ctx.req` / `ctx.res` will not work on gRPC controllers.
- **No DTO validation on the payload.** The Protobuf schema *is* the contract,
  so the class-validator based validation used by `@Body` does not apply to
  `@GrpcPayload`.
