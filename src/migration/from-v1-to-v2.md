---
label: V1 to V2
order: 100
---

# Migrate from V1 to V2

In v1, we were using Oak internally. V2 switched to Hono for improved performances (cf [our benchmark](https://quickchart.io/chart/render/sf-adcfeec7-78bc-43c6-9019-09c18ae3bd48)).

There is only one breaking change, related to the HTTPContext structure

## HTTPContext's request and response object

`HTTPContext` moved from being a superset of hono's context to being a superset of [Hono's context](https://hono.dev/api/context).

This means that instead of using `context.response` and `context.request` we have to use `context.res` and `context.req`.

`context.res` is simply the response object that will be sent back to client (except if your controller method return something, then your controller method's returned value take precedence).

`context.req` is an [`HonoRequest`'s instance](https://hono.dev/api/request).

