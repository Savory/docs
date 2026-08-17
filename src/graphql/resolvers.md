---
order: 2
---

# Resolvers

A resolver is a class annotated with `@Resolver()` and declared in a module's
`injectables` (mirroring NestJS, where resolvers are providers). The injector
instantiates it, so constructor dependencies resolve exactly like those of a
controller.

```typescript todo.resolver.ts
import { Injectable, Module } from 'jsr:@danet/core';
import {
	Args,
	GraphQLModule,
	Mutation,
	Query,
	Resolver,
} from 'jsr:@danet/graphql';

const typeDefs = `
	type Query {
		todos: [String]
	}
	type Mutation {
		createTodo(title: String!): String
	}
`;

@Injectable()
class TodoService {
	private todos: string[] = [];

	getAll() {
		return this.todos;
	}

	create(title: string) {
		this.todos.push(title);
		return title;
	}
}

@Resolver()
class TodoResolver {
	constructor(private todoService: TodoService) {}

	@Query('todos')
	getAll() {
		return this.todoService.getAll();
	}

	@Mutation()
	createTodo(@Args('title') title: string) {
		return this.todoService.create(title);
	}
}

@Module({
	imports: [GraphQLModule.forRoot({ typeDefs })],
	injectables: [TodoService, TodoResolver],
})
class AppModule {}
```

## `@Query` and `@Mutation`

`@Query(name?)` binds a method to a field of the schema's `Query` root type,
`@Mutation(name?)` to a field of `Mutation`. The field name defaults to the
method name, so `@Mutation() createTodo()` implements the `createTodo` field;
pass an explicit name (`@Query('todos')`) to bind a differently named method.

Schema fields without a decorated method resolve through GraphQL's default
property access, so plain data fields need no resolver.

## `@Args`

`@Args('title')` injects the value of a single named argument of the field.
`@Args()` without a name injects the whole arguments object:

```typescript search.resolver.ts
@Resolver()
class SearchResolver {
	@Query('search')
	search(@Args() args: { term: string; limit: number }) {
		return this.searchService.find(args.term, args.limit);
	}
}
```

## `@Context`

`@Context()` injects the per-request
[execution context](/fundamentals/execution-context), which exposes the
incoming HTTP request:

```typescript viewer.resolver.ts
import { ExecutionContext } from 'jsr:@danet/core';
import { Context, Query, Resolver } from 'jsr:@danet/graphql';

@Resolver()
class ViewerResolver {
	@Query('viewer')
	viewer(@Context() context: ExecutionContext) {
		return context.req.header('authorization');
	}
}
```

## Guards

[Guards](/overview/guards) run before resolver execution with the same
semantics as HTTP routes: a guard registered under `GLOBAL_GUARD` applies to
every resolver, and `@UseGuard` applies to a resolver class or method. When a
guard denies access the resolver method is not invoked and the response
reports the denial as a GraphQL `errors` entry for that field.

```typescript admin.resolver.ts
import {
	AuthGuard,
	ExecutionContext,
	Injectable,
	UseGuard,
} from 'jsr:@danet/core';
import { Query, Resolver } from 'jsr:@danet/graphql';

@Injectable()
class AdminGuard implements AuthGuard {
	canActivate(context: ExecutionContext) {
		return context.req.header('authorization') === 'admin-token';
	}
}

@UseGuard(AdminGuard)
@Resolver()
class AdminResolver {
	@Query('adminStats')
	adminStats() {
		return 'sensitive';
	}
}
```

## Error shaping

Failures always come back in GraphQL response shape, never as a
transport-level error. Invalid query documents return an `errors` array
describing the problem, and an exception thrown by a resolver becomes an
`errors` entry carrying the exception message while the server keeps serving.
Stack traces go to the server-side logger only and are never sent to the
client.
