---
label: Rate Limiting
order: 70
---

# Rate Limiting

A common technique to protect applications from brute-force attacks is
**rate-limiting**. It caps how many requests a given client can make to your API
within a time window, returning a `429 Too Many Requests` response once the
limit is exceeded.

Danet ships a throttler built on top of [Guards](/overview/guards), modeled
after [`@nestjs/throttler`](https://docs.nestjs.com/security/rate-limiting).

References:
- https://docs.nestjs.com/security/rate-limiting

## Installation

No need to install an extra module, you can import everything from
`jsr:@danet/core`.

Configure the throttler with `ThrottlerModule.forRoot()` and enable it
application-wide by registering `ThrottlerGuard` as the global guard:

```typescript app.module.ts
import {
  GLOBAL_GUARD,
  Module,
  ThrottlerGuard,
  ThrottlerModule,
} from 'jsr:@danet/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
  ],
  injectables: [
    { useClass: ThrottlerGuard, token: GLOBAL_GUARD },
  ],
})
export class AppModule {}
```

This configuration allows **10 requests every 60 seconds** (`ttl` is expressed
in **milliseconds**) for every route in the application, keyed by the caller's
IP address.

> Prefer to throttle only a subset of your app? Instead of registering the
> global guard, apply it where needed with `@UseGuard(ThrottlerGuard)` on a
> controller or a route handler.

## Multiple throttlers

`forRoot()` accepts an array, so you can enforce several windows at once — for
example a short burst limit alongside a longer sustained limit. Give each one a
`name` to tell them apart:

```typescript app.module.ts
ThrottlerModule.forRoot([
  { name: 'short', ttl: 1000, limit: 3 },
  { name: 'long', ttl: 60000, limit: 100 },
]);
```

Every throttler is enforced independently: a request is blocked as soon as it
exceeds **any** of them.

## Overriding limits with `@Throttle()`

Use the `@Throttle()` decorator to override the configured limits for a specific
controller or route handler. The options are keyed by throttler name (`default`
when you did not name your throttler):

```typescript app.controller.ts
import { Controller, Get, Throttle } from 'jsr:@danet/core';

@Controller('auth')
export class AuthController {
  // Stricter than the global config: at most one request per minute.
  @Throttle({ default: { ttl: 60000, limit: 1 } })
  @Get('login')
  login() {
    return 'OK';
  }
}
```

When using named throttlers, target them by name, e.g.
`@Throttle({ short: { ttl: 1000, limit: 1 } })`.

## Skipping throttling with `@SkipThrottle()`

To bypass the throttler entirely for a controller or a route handler, use
`@SkipThrottle()`:

```typescript app.controller.ts
import { Controller, Get, SkipThrottle } from 'jsr:@danet/core';

@Controller('health')
export class HealthController {
  @SkipThrottle()
  @Get()
  check() {
    return 'OK';
  }
}
```

## Response headers

On every throttled request, the following headers are added to the response so
clients can adapt:

| Header | Description |
| --- | --- |
| `X-RateLimit-Limit` | The maximum number of requests allowed in the window. |
| `X-RateLimit-Remaining` | The number of requests left in the current window. |
| `X-RateLimit-Reset` | The number of seconds until the window resets. |
| `Retry-After` | Sent on a `429` response: how many seconds to wait before retrying. |

When several named throttlers are configured, the headers are suffixed with the
throttler name (e.g. `X-RateLimit-Limit-short`).

A blocked request returns a `429` with the standard Danet exception body:

```json
{
  "name": "ThrottlerException",
  "status": 429,
  "description": "ThrottlerException: Too Many Requests",
  "message": "429 - ThrottlerException: Too Many Requests"
}
```

## Identifying the caller (proxies)

By default a caller is identified by its IP address. The tracker honors the
`X-Forwarded-For` and `X-Real-IP` headers before falling back to the connection's
remote address, so it works behind a reverse proxy.

To key on something else — an API key or an authenticated user id — extend
`ThrottlerGuard` and override `getTracker()`:

```typescript user-throttler.guard.ts
import { ExecutionContext, Injectable, ThrottlerGuard } from 'jsr:@danet/core';

@Injectable()
export class UserThrottlerGuard extends ThrottlerGuard {
  protected getTracker(context: ExecutionContext): string {
    // e.g. throttle per authenticated user instead of per IP.
    return context.get('userId') ?? super.getTracker(context);
  }
}
```

Then register `UserThrottlerGuard` instead of `ThrottlerGuard`.

## Custom storage

Request counts are kept in memory by default through
`InMemoryThrottlerStorage`, which automatically evicts expired windows so the
store never grows unbounded. Because that storage is **process-local**, it is
not shared across instances in a horizontally-scaled deployment.

To share state — for example via Redis or `Deno.KV` — implement the
`ThrottlerStorage` interface and pass your storage as the second argument to
`forRoot()`:

```typescript
import { ThrottlerStorage, ThrottlerStorageRecord } from 'jsr:@danet/core';

export class RedisThrottlerStorage implements ThrottlerStorage {
  async increment(key: string, ttl: number): Promise<ThrottlerStorageRecord> {
    // Atomically increment `key`, set its expiry to `ttl` ms on first hit,
    // and return the running total plus the remaining time to live.
    // ...
    return { totalHits, timeToExpire };
  }
}
```

```typescript app.module.ts
ThrottlerModule.forRoot(
  [{ ttl: 60000, limit: 10 }],
  new RedisThrottlerStorage(),
);
```

`increment` records a hit for `key` and returns a `ThrottlerStorageRecord`:

- `totalHits` — the number of requests recorded for the key within the current
  window.
- `timeToExpire` — the remaining time before the window resets, in
  milliseconds.

Implementations are responsible for starting a fresh window once the previous
one has expired.
