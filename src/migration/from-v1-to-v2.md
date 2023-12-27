---
label: V1 to V2
order: 100
---

# Migrate from V1 to V2

In v1, we were using hono internally. V2 switched to Hono for improved performances (cf [our benchmark](https://quickchart.io/chart/render/sf-adcfeec7-78bc-43c6-9019-09c18ae3bd48)).

Breaking changes can be counted on fingers, impacted middlewares and impact most of the advanced usages.

## Middlewares

Middlewares that are applied with `app.setGlobalMiddleware` and `@Middleware` decorators, now have to "cascade return" `next` return value otherwise the request will be considered as `404 NOT FOUND`.

For example, take this very simple middleware from v1: 

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

The v2 version must return next, as follows: 

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

::: info Hint
Middleware applied via `app.use` run as expected, they do not run in the same manner.
:::


## HTTPContext's request and response object

`HTTPContext` moved from being a superset of hono's context to being a superset of [Hono's context](https://hono.dev/api/context).

This means that instead of using `context.response` and `context.request` we have to use `context.res` and `context.req`.

`context.res` is simply the response object that will be sent back to client (except if your controller method return something, then your controller method's returned value take precedence).

`context.req` is an [`HonoRequest`'s instance](https://hono.dev/api/request).

