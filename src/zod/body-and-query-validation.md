---
order: 97
label: Body And Query Validation
---

::: danger
This page assumes that you are familiar with are familiar with Danet's controllers. If you are not, please read the [Controllers](/overview/controllers) page first.
:::


## Body, Query

Zod integration in Danet is very straightforward. First, you need to define your schemas using Zod. Then, you can use the `@Body()` and `@Query()` decorators from `@danet/zod` to validate the request body and query parameters.

For example:

```ts

import { Controller, Post } from '@danet/core';
import { Body } from '@danet/zod';

const CreateTodoSchema = z.object({
  title: z.string(),
  description: z.string(),
});

type CreateTodoSchema = z.infer<typeof CreateTodoSchema>;

@Controller('todos')
export class TodosController {
  constructor(private readonly todoService: TodoService) {}
    
  @Post()
  async create(@Body(CreateTodoSchema) createTodoDto: CreateTodoSchema) {
    this.todoService.create(createTodoDto);
  }
}
```

will automatically validate the request body against the `CreateTodoSchema` schema.

You can also use the `@Query()` decorator to validate query parameters:

```ts
import { Controller, Get } from '@danet/core';
import { Query } from '@danet/zod';

const GetTodoQuery = z.object({
  id: z.string(),
});

type GetTodoQuery = z.infer<typeof GetTodoQuery>;

@Controller('todos')
export class TodosController {
  constructor(private readonly todoService: TodoService) {}
    
  @Get(':id')
  async getById(@Query(GetTodoQuery) query: GetTodoQuery) {
    return this.todoService.getById(query.id);
  }
}
```


::: tip
Using these decorators will also allow you to generate OpenAPI documentation for your routes. More information on this can be found in the [OpenAPI](/zod/openapi) section.
:::