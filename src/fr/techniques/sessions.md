---
label: Sessions
order: 50
---

Les **sessions HTTP** fournissent un moyen de stocker des informations sur l'utilisateur à travers plusieurs requêtes.

## Utilisation

Comme Danet utilise hono sous le capot, tu peux utiliser le package [hono_sessions](https://deno.land/x/hono_sessions).

Ensuite, applique le middleware `hono_sessions` en tant que middleware global (par exemple, dans ton fichier `bootstrap.ts`).
hono_session utilise des `Stores` pour stocker les données de session dans les cookies, ou deno KV.
Le moyen le plus simple de gérer les sessions est avec les cookies en utilisant `CookieStore` :

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

## Le décorateur Session

Tu peux accéder à la session dans tes routes en utilisant le décorateur `@Session`.
La `Session` de `hono_session` est essentiellement une carte, donc nous utilisons le type `Map`.

```ts
import { Session,
} from 'https://deno.land/x/Danet/mod.ts';

@Get()
findAll(@Session() session: Map<unknown, unknown>) {
    const visits = session.get('visits');
    session.set('visits', visits ? visits + 1 : 1);
}
```