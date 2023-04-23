`ExecutionContext` fournit des détails supplémentaires sur le processus d'exécution en cours. Danet fournit une instance d' `ExecutionContext` dans des endroits où tu pourrais en avoir besoin, comme dans la méthode `canActivate()` d'un [garde](https://savory.github.io/Danet/overview/guards/) et la méthode `action()` d'un [middleware](https://savory.github.io/Danet/overview/middlewares/). Il fournit les méthodes suivantes :

```ts
type ExecutionContext = {
  /**
   * Returns the type of the controller class which the current handler belongs to.
   */
  getClass(): Constructor;
  /**
   * Returns a reference to the handler (method) that will be invoked next in the
   * request pipeline.
   */
  getHandler(): Function;
}
```

La méthode `getHandler()` renvoie une référence au gestionnaire qui va être invoqué. La méthode `getClass()` renvoie le type de la classe `Controller` à laquelle appartient ce gestionnaire particulier. Par exemple, si la requête actuellement traitée est une requête `POST`, liée à la méthode `create()` du `TodoController`, `getHandler()` renvoie une référence à la méthode `create()` et `getClass()` renvoie le **type** de `TodoController` (pas l'instance).

```typescript
const methodKey = ctx.getHandler().name; // "create"
const className = ctx.getClass().name; // "TodoController"
```

La capacité à accéder aux références de la classe et de la méthode du gestionnaire actuel offre une grande flexibilité. Plus important encore, cela nous donne l'opportunité d'accéder aux métadonnées définies par le décorateur `@SetMetadata()` depuis les gardes ou intercepteurs. Nous aborderons ce cas d'utilisation ci-dessous.

### Réflexion et métadonnées

Danet offre la possibilité d'attacher des **métadonnées personnalisées** aux gestionnaires de route via le décorateur `@SetMetadata()`. Nous pouvons ensuite accéder à ces métadonnées depuis notre classe pour prendre certaines décisions.

```typescript todo.controller.ts
@Post()
@SetMetadata('roles', ['admin'])
async create(@Body() createTodoDto: CreateTodoDto) {
  this.todoService.create(createCatDto);
}
```

Avec la construction ci-dessus, nous avons attaché la métadonnée `roles` (`roles` est une clé de métadonnée et `['admin']` est la valeur associée) à la méthode `create()`. Bien que cela fonctionne, il n'est pas recommandé d'utiliser `@SetMetadata()` directement dans vos routes. Au lieu de cela, créez vos propres décorateurs, comme illustré ci-dessous:

```typescript roles.decorators.ts
import { SetMetadata } from 'https://deno.land/x/danet/mod.ts';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

Cette approche est beaucoup plus propre et plus lisible, et est fortement typée. Maintenant que nous avons un décorateur `@Roles()` personnalisé, nous pouvons l'utiliser pour décorer la méthode `create()`.

```typescript todo.controller.ts
@Post()
@Roles('admin')
async create(@Body() createTodoDto: CreateTodoDto) {
    this.todoService.create(createCatDto);
}
```

Pour accéder au ou aux rôles de la route (métadonnées personnalisées), nous utiliserons les méthodes statiques de la classe `MetadataHelper`.

Pour lire les métadonnées du gestionnaire, utilisez la méthode `get()`.

```typescript
const roles = MetadataHelper.getMetadata<string[]>('roles', context.getHandler());
```

La méthode `MetadataHelper#getMetadata` nous permet d'accéder facilement aux métadonnées en passant deux arguments: une clé de métadonnée et un **contexte** (cible de décorateur) pour récupérer les métadonnées. Dans cet exemple, la clé spécifiée est `'roles'` (reportez-vous au fichier `roles.decorator.ts` ci-dessus et à l'appel à `SetMetadata()` effectué là-bas). Le contexte est fourni par l'appel à `context.getHandler()`, qui permet d'extraire les métadonnées pour le gestionnaire de route actuellement traité. Rappelez-vous que `getHandler()` nous donne une **référence** à la fonction gestionnaire de route.

En outre, nous pouvons organiser notre contrôleur en appliquant des métadonnées au niveau du contrôleur, s'appliquant à toutes les routes de la classe de contrôleur.

```typescript todo.controller.ts
@Roles('admin')
@Controller('todo')
export class TodoController {}
```

Dans ce cas, pour extraire les métadonnées du contrôleur, nous passons `context.getClass()` comme deuxième argument (pour fournir la classe de contrôleur comme contexte d'extraction de métadonnées) au lieu de `context.getHandler()`:

```typescript roles.guard.ts
const roles = MetadataHelper.getMetadata<string[]>('roles', context.getClass());
```