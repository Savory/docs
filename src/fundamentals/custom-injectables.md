In earlier chapters, we touched on various aspects of **Dependency Injection (DI)** and how it is used in Danet. One example of this is the [constructor based](/overview/injectables.md) dependency injection used to inject instances (often service injectables) into classes. You won't be surprised to learn that Dependency Injection is built into the Danet core in a fundamental way. So far, we've only explored one main pattern. As your application grows more complex, you may need to take advantage of the full features of the DI system, so let's explore them in more detail.

## DI fundamentals

Dependency injection is an [inversion of control (IoC)](https://en.wikipedia.org/wiki/Inversion_of_control) technique wherein you delegate instantiation of dependencies to the IoC container (in our case, the Danet runtime system), instead of doing it in your own code imperatively. Let's examine what's happening in this example from the [Injectables chapter](/overview/injectables.md).

First, we define a provider. The `@Injectable()` decorator marks the `TodoService` class as a provider.
```ts todo.service.ts
import { Injectable } from 'https://deno.land/x/danet/mod.ts';
import { Todo } from './todo.interface';

@Injectable()
export class TodoService {
  private readonly todos: Todo[] = [];

  create(todo: Todo) {
    this.todos.push(todo);
  }

  findAll(): Todo[] {
    return this.todos;
  }
}
```

Then we request that Danet inject the provider into our controller class:

```ts todo.controller

import { Controller, Get, Post, Body } from 'https://deno.land/x/danet/mod.ts';
import { CreateTodoDto } from './create-todo.dto';
import { TodoService } from './todo.service';
import { Todo } from './todo.interface';

@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Post()
  async create(@Body() createTodoDto: CreateTodoDto) {
    this.todoService.create(createTodoDto);
  }

  @Get()
  async findAll(): Promise<Todo[]> {
    return this.todoService.findAll();
  }
}
```

Finally, we register the provider with the Danet IoC container:

```ts app.module
import { Module } from 'https://deno.land/x/danet/mod.ts';
import { TodoController } from './todo/todo.controller';
import { TodoService } from './todo/todo.service';

@Module({
  controllers: [TodoController],
  injectables: [TodoService],
})
export class AppModule {}
```

What exactly is happening under the covers to make this work? There are three key steps in the process:

1. In `todo.service.ts`, the `@Injectable()` decorator declares the `TodoService` class as a class that can be managed by the Danet IoC container.
2. In `todo.controller.ts`, `TodoController` declares a dependency on the `TodoService` token with constructor injection:

```ts
  constructor(private todoService: TodoService)
```

3. In `app.module.ts`, we associate the token `TodoService` with the class `TodoService` from the `todo.service.ts` file. We'll <a href="/fundamentals/custom-injectables#standard-injectables">see below</a> exactly how this association (also called _registration_) occurs.

When the Danet IoC container instantiates a `TodoController`, it first looks for any dependencies\*. When it finds the `TodoService` dependency, it performs a lookup on the `TodoService` token, which returns the `TodoService` class, per the registration step (#3 above). Assuming `SINGLETON` scope (the default behavior), Danet will then either create an instance of `TodoService`, cache it, and return it, or if one is already cached, return the existing instance.

\*This explanation is a bit simplified to illustrate the point. One important area we glossed over is that the process of analyzing the code for dependencies is very sophisticated, and happens during application bootstrapping. One key feature is that dependency analysis (or "creating the dependency graph"), is **transitive**. In the above example, if the `TodoService` itself had dependencies, those too would be resolved. The dependency graph ensures that dependencies are resolved in the correct order - essentially "bottom up". This mechanism relieves the developer from having to manage such complex dependency graphs.

## Standard injectables

Let's take a closer look at the `@Module()` decorator. In `app.module`, we declare:

```ts
@Module({
  controllers: [TodoController],
  injectables: [TodoService],
})
```

The `injectables` property takes an array of `injectables`. So far, we've supplied those injectables via a list of class names. In fact, the syntax `injectables: [TodoService]` is short-hand for the more complete syntax:

```ts
injectables: [
  {
    token: TodoService,
    useClass: TodoService,
  },
];
```

Now that we see this explicit construction, we can understand the registration process. Here, we are clearly associating the token `TodoService` with the class `TodoService`. The short-hand notation is merely a convenience to simplify the most common use-case, where the token is used to request an instance of a class by the same name.

## Custom injectables

What happens when your requirements go beyond those offered by _Standard injectables_? Here are a few examples:

- You want to create a custom instance instead of having Danet instantiate (or return a cached instance of) a class
- You want to re-use an existing class in a second dependency
- You want to override a class with a mock version for testing

Danet allows you to define Custom injectables to handle these cases. It provides several ways to define custom injectables. Let's walk through them.

## Value injectables: `useValue`

The `useValue` syntax is useful for injecting a constant value, putting an external library into the Danet container, or replacing a real implementation with a mock object. Let's say you'd like to force Danet to use a mock `TodoService` for testing purposes.

```ts
import { TodoService } from './todo.service';

const mockTodoService = {
  /* mock implementation
  ...
  */
};

@Module({
  imports: [todoModule],
  injectables: [
    {
      token: TodoService,
      useValue: mockTodoService,
    },
  ],
})
export class AppModule {}
```

In this example, the `TodoService` token will resolve to the `mockTodoService` mock object. `useValue` requires a value - in this case a literal object that has the same interface as the `TodoService` class it is replacing. Because of TypeScript's [structural typing](https://www.typescriptlang.org/docs/handbook/type-compatibility.html), you can use any object that has a compatible interface, including a literal object or a class instance instantiated with `new`.

## Non-class-based provider tokens

So far, we've used class names as our provider tokens (the value of the `provide` property in a provider listed in the `injectables` array). This is matched by the standard pattern used with [constructor based injection](/injectables), where the token is also a class name. (Refer back to [DI Fundamentals](#di-fundamentals) for a refresher on tokens if this concept isn't entirely clear). Sometimes, we may want the flexibility to use strings or symbols as the DI token. For example:

```ts
import { connection } from './connection';

@Module({
  injectables: [
    {
      token: 'CONNECTION',
      useValue: connection,
    },
  ],
})
export class AppModule {}
```

In this example, we are associating a string-valued token (`'CONNECTION'`) with a pre-existing `connection` object we've imported from an external file.

::: warning **Notice**
In addition to using strings as token values, you can also use JavaScript [symbols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) or TypeScript [enums](https://www.typescriptlang.org/docs/handbook/enums.html).
:::

We've previously seen how to inject a provider using the standard [constructor based injection](https://docs.Danet.com/injectables#dependency-injection) pattern. This pattern **requires** that the dependency be declared with a class name. The `'CONNECTION'` custom provider uses a string-valued token. Let's see how to inject such a provider. To do so, we use the `@Inject()` decorator. This decorator takes a single argument - the token.

```ts
@Injectable()
export class todoRepository {
  constructor(@Inject('CONNECTION') connection: Connection) {}
}
```

While we directly use the string `'CONNECTION'` in the above examples for illustration purposes, for clean code organization, it's best practice to define tokens in a separate file, such as `constants.ts`. Treat them much as you would symbols or enums that are defined in their own file and imported where needed.

## Class injectables: `useClass`

The `useClass` syntax allows you to dynamically determine a class that a token should resolve to. For example, suppose we have an abstract (or default) `ConfigService` class. Depending on the current environment, we want Danet to provide a different implementation of the configuration service. The following code implements such a strategy.

```ts
const configServiceProvider = {
  token: ConfigService,
  useClass:
    process.env.NODE_ENV === 'development'
      ? DevelopmentConfigService
      : ProductionConfigService,
};

@Module({
  injectables: [configServiceProvider],
})
export class AppModule {}
```

Let's look at a couple of details in this code sample. You'll notice that we define `configServiceProvider` with a literal object first, then pass it in the module decorator's `injectables` property. This is just a bit of code organization, but is functionally equivalent to the examples we've used thus far in this chapter.

Also, we have used the `ConfigService` class name as our token. For any class that depends on `ConfigService`, Danet will inject an instance of the provided class (`DevelopmentConfigService` or `ProductionConfigService`) overriding any default implementation that may have been declared elsewhere (e.g., a `ConfigService` declared with an `@Injectable()` decorator).
