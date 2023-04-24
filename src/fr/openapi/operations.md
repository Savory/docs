---
order: 97
label: Opérations
---


En termes OpenAPI, les chemins (paths) sont des points d'extrémité (endpoints ou ressources), tels que `/users` ou `/reports/summary`, que ton API expose, et les opérations sont les méthodes HTTP utilisées pour manipuler ces chemins, telles que `GET`, `POST` ou `DELETE`.


::: danger
Le SwaggerModule est actuellement en Alpha, de noooombreuses fonctionnalités manquent. Si quelque chose dont tu as besoin n'est pas encore là, [n'hésite pas à remplir une demande de fonctionnalité ou rapporter un problème](https://github.com/Savory/Danet-Swagger/issues)
:::


### Tags

Pour attacher un **contrôleur ou un point de terminaison (endpoint)** à une étiquette spécifique, utilise le décorateur `@Tag(nomDeLEtiquette)`.

```typescript
@Tag('cats')
@Controller('todo')
export class TodoController {
  @Tag('get')
  @Get(':id')
  async getById(@Param('id') id: string): Todo {
    return this.todoService.getById(id);
  }
}
```