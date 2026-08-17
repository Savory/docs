---
order: 3
---

# Overview

[`@danet/graphql`](https://jsr.io/@danet/graphql) adds schema-first GraphQL to
a Danet application, modeled on NestJS's
[`@nestjs/graphql`](https://docs.nestjs.com/graphql/quick-start). You import
`GraphQLModule.forRoot(...)` in a module, declare resolver classes as
injectables, and the endpoint is served by the same HTTP server as the rest of
your application, with dependency injection, guards, and standard GraphQL
error responses. Execution is handled by the reference
[graphql-js](https://www.npmjs.com/package/graphql) implementation.

Under the hood the module reaches the running application through the
[`APPLICATION_HOST`](/fundamentals/application-host) token and mounts its route
on the application's Hono router during bootstrap.

## Installation

The package is published on [JSR](https://jsr.io/@danet/graphql) and requires
`@danet/core` **2.12.0** or newer:

```bash
deno add jsr:@danet/graphql
```

## Quickstart

Supply your schema as SDL type definitions, mark a class with `@Resolver()`,
and bind its methods to root fields with `@Query` / `@Mutation`:

```typescript app.module.ts
import { DanetApplication, Module } from 'jsr:@danet/core';
import { GraphQLModule, Query, Resolver } from 'jsr:@danet/graphql';

const typeDefs = `
	type Query {
		hello: String
	}
`;

@Resolver()
class HelloResolver {
	@Query()
	hello() {
		return 'world';
	}
}

@Module({
	imports: [GraphQLModule.forRoot({ typeDefs })],
	injectables: [HelloResolver],
})
class AppModule {}

const app = new DanetApplication();
await app.init(AppModule);
await app.listen(3000);
```

The endpoint executes operations sent as `POST /graphql` with a JSON body
(`query`, optional `variables` and `operationName`), and also queries sent as
`GET /graphql?query={ hello }`:

```bash
curl -X POST http://localhost:3000/graphql \
  -H 'Content-Type: application/json' \
  -d '{ "query": "{ hello }" }'
```

```json
{ "data": { "hello": "world" } }
```

## Options

`GraphQLModule.forRoot` accepts:

| Option       | Type      | Default    | Description                                                         |
| ------------ | --------- | ---------- | ------------------------------------------------------------------- |
| `typeDefs`   | `string`  | (required) | Schema definition language type definitions, the source of truth.   |
| `path`       | `string`  | `/graphql` | Path the endpoint is mounted at.                                    |
| `playground` | `boolean` | `false`    | Serve GraphiQL to browser requests (`Accept: text/html`) on `path`. |

### Custom path

```typescript app.module.ts
GraphQLModule.forRoot({ typeDefs, path: '/api/gql' });
```

The endpoint is then served at `/api/gql` and nothing is mounted at `/graphql`.

### Playground

```typescript app.module.ts
GraphQLModule.forRoot({ typeDefs, playground: true });
```

With the playground enabled, opening the endpoint in a browser serves an
interactive [GraphiQL](https://github.com/graphql/graphiql) editor querying
your schema: write queries with autocompletion and inline validation, run
them, and browse the generated schema documentation. Requests with any other
`Accept` header keep executing operations normally, so the same path serves
both browsers and API clients.

![GraphiQL playground running a todos query against a Danet app](https://raw.githubusercontent.com/Savory/Danet-graphql/main/.github/playground.png)

The playground is off by default; keep it for development rather than
production.

## Startup validation

`app.init()` fails fast with a descriptive error when:

- the type definitions are not valid SDL, or produce an invalid schema;
- a `@Query`/`@Mutation` decorated method names a field that does not exist on
  the corresponding root type.

Nothing broken ever starts serving.

## Limitations

- **Schema-first only.** Code-first schema generation (`@ObjectType` /
  `@Field`) and GraphQL subscriptions are planned follow-ups.
- **`SCOPE.REQUEST` injectables are per-resolution.** A request-scoped
  injectable consumed by a resolver or guard is created per resolved root
  field, not per HTTP request (unlike controller routes, where one request is
  one handler call).
- **The playground loads GraphiQL from a CDN** (unpkg), so the browser opening
  it needs network access.
