---
order: 98
label: Types et Paramètres
---
::: danger
Le module Swagger est actuellement en version Alpha, de nombreuses fonctionnalités sont manquantes. Si quelque chose dont vous avez besoin n'est pas encore ici, [veuillez remplir une demande de problème ou de fonctionnalité](https://github.com/Savory/Danet-Swagger/issues).
:::

## Corps, Query et Params

Le module `Swagger` recherche tous les décorateurs `@Body()` et `@Query()` dans les gestionnaires de route pour générer le document API. Il crée également des définitions de modèle correspondantes en profitant de la réflexion. Considérons le code suivant :

```ts
@Post()
async create(@Body() createTodoDto: CreateTodoDto) {
  this.todoService.create(createTodoDto);
}
```

::: tip
Pour définir explicitement la définition de corps, utilisez le décorateur `@BodyType(Todo)`.
Pour définir explicitement la définition de la requête, utilisez le décorateur `@QueryType(Todo)`.
:::

Sur la base de `Todo`, la définition de modèle suivante sera créée dans Swagger UI :
![image](https://user-images.githubusercontent.com/38007824/206904581-a7d39867-4a1b-40d2-be39-60e65897d99e.png)

Afin de rendre les propriétés de la classe visibles dans le module `Swagger`, nous devons les annoter avec le décorateur `@ApiProperty()` :

```ts
export class CreateTodoDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  priority!: number;

  @ApiProperty()
  colorLabel!: string;
}
```

::: tip
Si l'une de ces propriétés est facultative, vous pouvez utiliser le décorateur `@Optional()`.
:::

Ouvrons le navigateur et vérifions le modèle `Todo` généré :

![image](https://user-images.githubusercontent.com/38007824/206904638-1f44ef08-c8e1-4d95-b605-8acc80227397.png)

## Type de retour

En raison de l'absence de métadonnées `design:return` dans SWC (le compilateur TypeScript de Deno), vous devez **obligatoirement** utiliser le décorateur `@ReturnedType` pour indiquer ce que votre point d'extrémité renverra :

```ts
@ReturnedType(Todo)
@Get(':id')
async getById(@Param('id') id: string): Todo {
  return this.todoService.getById(id);
}
```

Si votre route renvoie un tableau, passez `true` en tant que deuxième argument de `ReturnedType` :

```ts
@ReturnedType(Todo, true)
@Get()
async getTodos(): Todo[] {
  return this.todoService.getAll();
}
```

## Enumérations

Pour identifier une `enum`, nous devons définir manuellement la propriété `enum` sur `@ApiProperty` avec un tableau de valeurs.

```ts
@ApiProperty({ enum: ['Admin', 'Moderator', 'User']})
role: UserRole;
```