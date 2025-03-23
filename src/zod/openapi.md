---
order: 98
label: OpenAPI
---

::: danger
The SwaggerModule is currently in Alpha, maaaany features are missing. If something you need is not here yet, [please fill an issue/feature request](https://github.com/Savory/Danet-Swagger/issues)
:::


## Pre-requiresites

First, if you don't know how to use Danet's swagger module first read the dedicated page [here](/openapi/introduction).
Second, in order to generate openAPI definition from zod, you will need to extend zod using [zod-to-openapi](https://www.npmjs.com/package/@anatine/zod-openapi). As follows: 

```ts
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);
```

Last, you will need to add an openApi title attribute to your zod schema as follows, so we know how to name the model in the openAPI definition:
```ts
const Cat = z.object({
    name: z.string(),
    breed: z.string(),
    dob: z.date(),
    isHungry: z.boolean().optional(),
    hobbies: z.array(z.any())
}).openapi({
    title: 'Cat'
})
```

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