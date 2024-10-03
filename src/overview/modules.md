---
order: 97
---


A module is a class annotated with a `@Module()` decorator. The `@Module()` decorator provides metadata that **Danet** makes use of to organize the application structure.

Each application has at least one module, a **root module**. The root module is the starting point Danet uses to build the **application graph** - the internal data structure Danet uses to resolve module and provider relationships and dependencies. While very small applications may theoretically have just the root module, this is not the typical case. We want to emphasize that modules are **strongly** recommended as an effective way to organize your components. Thus, for most applications, the resulting architecture will employ multiple modules, each declaring a closely related set of **capabilities**.

The `@Module()` decorator takes a single object whose properties describe the module:

|               |                                                                                                                    |
|---------------|--------------------------------------------------------------------------------------------------------------------|
| `injectables` | the injectables that will be instantiated by the Danet injector and that may be shared at least across this module |
| `controllers` | the set of controllers defined in this module which have to be instantiated                                        |
| `imports`     | the list of imported modules that declare the injectables which are required in this module                        |

[//]: # (| `exports`     | the subset of `injectables` that are provided by this module and should be available in other modules which import this module. You can use either the provider itself or just its token &#40;`provide` value&#41; |)

The module **does not encapsulate** injectables. This means that you can inject injectables from any module as long as it has been resolved.

This will change in the future.

## Feature modules

The `TodoController` and `TodoService` belong to the same application domain. As they are closely related, it makes sense to move them into a feature module. A feature module simply organizes code relevant for a specific feature, keeping code organized and establishing clear boundaries. This helps us manage complexity and develop with [SOLID](https://en.wikipedia.org/wiki/SOLID) principles, especially as the size of the application and/or team grow.

To demonstrate this, we'll create the `TodoModule`.

```ts todo.module.ts
import { Module } from 'jsr:@danet/core';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  controllers: [TodoController],
  injectables: [TodoService],
})
export class TodoModule {}
```

Above, we defined the `TodoModule` in the `todo.module.ts` file, and moved everything related to this module into the `todo` directory. The last thing we need to do is import this module into the root module (the `AppModule`, defined in the `app.module.ts` file).

```typescript app.module.ts
import { Module } from 'jsr:@danet/core';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [TodoModule],
})
export class AppModule {}
```

## Shared modules

In Danet, modules are **singletons** by default, and thus you can share the same instance of any provider between multiple modules effortlessly.

Every module is automatically a **shared module**. Once created it can be reused by any module. Let's imagine that we want to share an instance of the `TodoService` between several other modules. In order to do that, nothing has to be done, any module that imports the `TodoModule` has access to the `TodoService` and will share the same instance with all other modules that import it as well.

## Global modules

Like in [Angular](https://angular.io) `injectables` are registered in the global scope. Once defined, they're available everywhere.

## Dynamic modules

The Danet module system includes a powerful feature called **dynamic modules**. This feature enables you to easily create customizable modules that can register and configure providers dynamically. Dynamic modules are covered extensively [here](/fundamentals/dynamic-modules.md). In this chapter, we'll give a brief overview to complete the introduction to modules.

Following is an example of a dynamic module definition for a `DatabaseModule`:

```ts 
import { Module, DynamicModule } from 'jsr:@danet/core';
import { createDatabaseProviders } from './database.providers';
import { Connection } from './connection.provider';

@Module({
  providers: [Connection],
})
export class DatabaseModule {
  static forRoot(entities = [], options?): DynamicModule {
    const providers = createDatabaseProviders(options, entities);
    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers,
    };
  }
}
```

This module defines the `Connection` provider by default (in the `@Module()` decorator metadata), but additionally - depending on the `entities` and `options` objects passed into the `forRoot()` method - exposes a collection of providers, for example, repositories. Note that the properties returned by the dynamic module **extend** (rather than override) the base module metadata defined in the `@Module()` decorator. That's how both the statically declared `Connection` provider **and** the dynamically generated repository providers are exported from the module.


The `DatabaseModule` can be imported and configured in the following manner:

```ts
import { Module } from 'jsr:@danet/core';
import { DatabaseModule } from './database/database.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [DatabaseModule.forRoot([User])],
})
export class AppModule {}
```

If you want to in turn re-export a dynamic module, you can omit the `forRoot()` method call in the exports array:

The [Dynamic modules](/fundamentals/dynamic-modules) chapter covers this topic in greater detail.