---
label: Sessions
order: 50
---

Les **sessions HTTP** fournissent un moyen de stocker des informations sur l'utilisateur à travers plusieurs requêtes.

## Utilisation

Comme Danet utilise Oak sous le capot, tu peux utiliser le package [oak_sessions](https://deno.land/x/oak_sessions).

Ensuite, applique le middleware `oak_sessions` en tant que middleware global (par exemple, dans ton fichier `bootstrap.ts`).

```typescript
import { Session } from 'https://deno.land/x/oak_sessions@v4.0.5/mod.ts';

const app = new DanetApplication();
app.addGlobalMiddlewares(
  Session.initMiddleware(),
);
```
::: danger **Avertissement**
Le stockage de session côté serveur par défaut n'est pas conçu pour un environnement de production. Il est destiné au débogage et au développement. Pour en savoir plus, consulte le [dépôt officiel](https://deno.land/x/oak_sessions).
:::

## Avec les cookies

Oak_session utilise des `Stores` pour stocker les données de session dans les cookies, Sqlite, Mongodb ou Postgres.
Le moyen le plus simple de gérer les sessions est avec les cookies en utilisant `CookieStore` :

```typescript
import {
  CookieStore,
  Session,
} from 'https://deno.land/x/oak_sessions@v4.0.5/mod.ts';

const app = new DanetApplication();
app.addGlobalMiddlewares(
  Session.initMiddleware(
    new CookieStore(Deno.env.get('COOKIE_SECRET_KEY') as string),
  ) as MiddlewareFunction,
);
```

## Le décorateur Session

Tu peux accéder à la session dans tes routes en utilisant le décorateur `@Session`.
La `Session` de `oak_session` est essentiellement une carte, donc nous utilisons le type `Map`.

```ts
import { Session,
} from 'https://deno.land/x/Danet/mod.ts';

@Get()
findAll(@Session() session: Map<unknown, unknown>) {
    const visits = session.get('visits');
    session.set('visits', visits ? visits + 1 : 1);
}
```