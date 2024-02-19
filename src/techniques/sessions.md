---
label: Sessions
order: 60
---

**HTTP sessions** provide a way to store information about the user across multiple requests.

## Usage

As Danet uses hono under the hood, you can use [hono_sessions](https://deno.land/x/hono_sessions) package.

Then, apply the `hono_sessions` middleware as native hono middleware (for example, in your `bootstrap.ts` file).

hono_session use `Stores` to store session data in Cookies, or KV.
The simpliest way to handle sessions is with cookies using `CookieStore`: 


```typescript
import {
    Session,
    sessionMiddleware,
    CookieStore
} from 'https://deno.land/x/hono_sessions/mod.ts'

const app = new DanetApplication();
const store = new CookieStore()
app.use(
    sessionMiddleware({
        store,
        encryptionKey: 'password_at_least_32_characters_long', // Required for CookieStore, recommended for others
        expireAfterSeconds: 900, // Expire session after 15 minutes of inactivity
        cookieOptions: {
            sameSite: 'Lax', // Recommended for basic CSRF protection in modern browsers
            path: '/', // Required for this library to work properly
            httpOnly: true, // Recommended to avoid XSS attacks
        },
    })
);
```

## Session decorator

You can access the session in your routes using `@Session` decorator.
`hono_session`'s `Session` is basically a map, so we use the `Map` type.

```ts
import { Session,
} from 'https://deno.land/x/Danet/mod.ts';

@Get()
findAll(@Session() session: Map<unknown, unknown>) {
  const visits = session.get('visits');
  session.set('visits', visits ? visits + 1 : 1);
}
```
