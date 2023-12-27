---
label: V1 à V2
order: 100
---


# Migrer de la version 1 à la version 2

Dans la version 1, nous utilisions hono en interne. La version 2 a basculé vers Hono pour des performances améliorées (cf [notre benchmark](https://quickchart.io/chart/render/sf-adcfeec7-78bc-43c6-9019-09c18ae3bd48)).

Les changements majeurs se comptent sur les doigts d'une main, impactent les middlewares et touchent la plupart des utilisations avancées.

## Middlewares

Les middlewares appliqués avec `app.setGlobalMiddleware` et les décorateurs `@Middleware` doivent maintenant "cascader le retour" de la valeur de `next`, sinon la requête sera considérée comme `404 NOT FOUND`.

Par exemple, prends ce middleware très simple de la version 1 :

```ts
@Injectable()
class SimpleMiddleware implements DanetMiddleware {
    constructor(private simpleInjectable: SimpleInjectable) {
    }

    async action(ctx: ExecutionContext, next: NextFunction) {
        ctx.res.headers.append('middlewaredata', this.simpleInjectable.doSomething());
        next();
    }
}
```

La version 2 doit retourner next, comme suit :

```ts
@Injectable()
class SimpleMiddleware implements DanetMiddleware {
    constructor(private simpleInjectable: SimpleInjectable) {
    }

    async action(ctx: ExecutionContext, next: NextFunction) {
        ctx.res.headers.append('middlewaredata', this.simpleInjectable.doSomething());
        return next();
    }
}
```

::: info Astuce
Les middlewares appliqués via app.use fonctionnent comme prévu, ils ne s'exécutent pas de la même manière.
:::

## Requête et Réponse de HTTPContext

`HTTPContext` est passé d'être un superset du contexte d'hono à être un superset du [contexte d'Hono](https://hono.dev/api/context).

Cela signifie qu'au lieu d'utiliser `context.response` et `context.request`, nous devons utiliser `context.res` et `context.req`.

`context.res` est simplement l'objet de réponse qui sera renvoyé au client (sauf si la méthode de ton contrôleur renvoie quelque chose, auquel cas la valeur renvoyée par la méthode du contrôleur a la priorité).

`context.req` est une instance de [`HonoRequest`](https://hono.dev/api/request).