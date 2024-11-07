---
order: 98
label: OpenAPI
---

::: danger
The SwaggerModule is currently in Alpha, maaaany features are missing. If something you need is not here yet, [please fill an issue/feature request](https://github.com/Savory/Danet-Swagger/issues)
:::


## Body, Query

The `SwaggerModule` searches for all `@Body()` and `@Query()` from `@danet/zod` decorators in route handlers to generate the API document. It also creates corresponding model definitions . Consider the following code:

```ts
@Post()
async create(@Body(CreateTodoSchema) createTodoDto: CreateTodoSchema) {
  this.todoService.create(createTodoDto);
}
```

## Returned schema

You can use the `@ReturnedSchema` decorator to say what your endpoint will return :


```ts
@ReturnedSchema(TodoSchema)
@Get(':id')
async getById(@Param('id') id: string): Todo {
  return this.todoService.getById(id);
}
```

If your route returns an array, pass `true` as the second argument of `ReturnedSchema` : 


```ts
@ReturnedSchema(TodoSchema, true)
@Get()
async getTodos(): Todo[] {
  return this.todoService.getAll();
}
```