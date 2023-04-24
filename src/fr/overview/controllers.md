---
order: 99
label: Controlleurs
---
Les contrôleurs sont responsables de la gestion des **requêtes** entrantes et du renvoi de **réponses** au client.

Le rôle d'un contrôleur est de recevoir des requêtes. Le mécanisme de **routage** permet de savoir quel contrôleur reçoit quelles requêtes. Généralement, chaque contrôleur a plus d'une route et chaque route peut effectuer une action différente.

Pour créer un contrôleur de base, nous utilisons des classes et des **décorateurs**. Les décorateurs associent les classes à des métadonnées requises et permettent à Danet de créer ce que nous pouvons appeler une carte de routage (associant les requêtes aux contrôleurs correspondants).

## Routage

Dans l'exemple suivant, nous utiliserons le décorateur `@Controller()`, qui est **obligatoire** pour définir un contrôleur. Nous spécifierons un préfixe optionnel `todo`. L'utilisation d'un préfixe dans un décorateur `@Controller()` nous permet de regrouper facilement un ensemble de routes liées et de minimiser la duplication de code. Par exemple, nous pouvons choisir de regrouper un ensemble de routes qui gèrent des interactions avec une entité client sous la route `/clients`. Dans ce cas, nous pourrions spécifier le préfixe `clients` dans le décorateur `@Controller('clients)` afin de ne pas avoir à répéter cette partie du chemin pour chaque route dans le fichier.

```ts todo.controller.ts
import { Controller, Get } from 'https://deno.land/x/danet/mod.ts';

@Controller('todo')
export class TodoController {
    @Get()
    findAll(): string {
        return 'Cette action renvoie toutes les tâches à faire';
    }
}
```

Le décorateur de méthode de requête HTTP `@Get()` devant la méthode `findAll()` indique à Danet de créer un handler pour un endpoints spécifique pour les requêtes HTTP. Le endpoint correspond à la méthode de requête HTTP (dans ce cas GET) et au path de la route. Quel est le path de la route ? Le path de la route pour un handler est déterminé en concaténant le préfixe (facultatif) déclaré pour le contrôleur et tout path spécifié dans le décorateur de méthode. Puisque nous avons déclaré un préfixe pour chaque route (`todo`) et n'avons ajouté aucune information de path dans le décorateur, Danet va mapper les requêtes `GET /todo` sur ce handler. Comme mentionné, le path comprend à la fois le préfixe de path du contrôleur facultatif **et** tout path déclaré dans le décorateur de méthode de requête. Par exemple, un préfixe de path de `customers` combiné avec le décorateur `@Get('profile')` produirait une correspondance de route pour les requêtes telles que `GET /customers/profile`.

Dans notre exemple ci-dessus, lorsqu'une requête GET est effectuée sur ce endpoint, Danet dirige la requête vers notre méthode `findAll()` définie par l'utilisateur. Notez que le nom de méthode que nous choisissons ici est totalement arbitraire. Nous devons évidemment déclarer une méthode pour lier la route, mais Danet n'attache aucune importance au nom de méthode choisi.

Cette méthode renverra un code 200 et la réponse associée, qui dans ce cas est juste une string.

## Objet de demande

Les handlers ont souvent besoin d'accéder aux détails de la **requête**. Danet fournit l'accès à l'[objet correspondant a la requete](https://doc.deno.land/https://deno.land/x/oak@v10.6.0/mod.ts/~/Request).
Nous pouvons accéder à l'objet de demande en demandant à Danet de l'injecter en ajoutant le décorateur `@Req()` à la signature du handler.

```ts todo.controller.ts
import { Controller, Get, Req } from 'https://deno.land/x/danet/mod.ts';

@Controller('todo')
export class TodoController {
  @Get()
  findAll(@Req() request: Request): string {
    return 'Cette action renvoie toutes les tâches à faire';
  }
}
```

L'objet `request` représente la requête HTTP et contient des propriétés tels que les paramètres, les en-têtes HTTP et le corps. Dans la plupart des cas, il n'est pas nécessaire de récupérer ces propriétés manuellement. Nous pouvons utiliser plutôt des décorateurs dédiés, tels que `@Body()` ou `@Query()`, qui sont disponibles par défaut. Ci-dessous, une liste des décorateurs fournis et les objets spécifiques à la plateforme qu'ils représentent.

| Décorateur | Type | Valeur |
|-----------|------|-------|
| `@Req()` | [oak.Request](https://deno.land/x/oak@v10.5.1/request.ts) | `ctx.request` |
| `@Res()` | [oak.Response](https://deno.land/x/oak@v10.5.1/response.ts) | `ctx.response` |
| `@Param(key: string)` | `string` | `context.params[key]` |
| `@Header(key? : string)` | `string \| undefined` | `ctx.request.headers` / `ctx.request.headers.get(key)` |
| `@Body(key?: string)` | `any` | `ctx.request.body` / `ctx.request.body[key]` |
| `@Query(key: string, options?: { value?: 'first' \| 'last' \| 'array' })` | `string \| string[]` | Récupère la première, la dernière ou toutes les valeurs pour le paramètre de requête nommé `key` |
| `@Query(options?: { value?: 'first' \| 'last' \| 'array' })` | `{ [key: string]: string \| string[] }` | Récupère la première, la dernière ou toutes les valeurs pour tous les paramètres de requête |


```ts todo.controller.ts
import { Controller, Get, Req } from 'https://deno.land/x/danet/mod.ts';

@Controller('todo')
export class TodoController {
  @Get()
  findAll(@Req() request: Request): string {
    return 'Cette action retourne tous les todos';
  }
}
```
## Ressources

Plus tôt, nous avons défini un endpoint pour récupérer les todos (**GET** route). Nous souhaiterons généralement également fournir un endpoint pour créer de nouveaux todos. Pour cela, créons le handler **POST** :

```ts todo.controller.ts
import { Controller, Get, Post } from 'https://deno.land/x/danet/mod.ts';

@Controller('todo')
export class TodoController {
  @Post()
  create(): string {
    return 'Cette action ajoute un nouveau todo';
  }

  @Get()
  findAll(): string {
    return 'Cette action retourne tous les todos';
  }
}
```

C'est aussi simple que ça. Danet fournit des décorateurs pour presque toutes les méthodes HTTP standard : `@Get()`, `@Post()`, `@Put()`, `@Delete()`, `@Patch()`. En outre, `@All()` définit un endpoint qui les gère tous.

## Paramètres de route

Les routes avec des chemins statiques ne fonctionneront pas lorsque tu auras besoin d'accepter des **données dynamiques** dans la requête (par exemple, `GET /todo/1` pour obtenir la tâche avec l'id `1`). Pour définir des routes avec des paramètres, on peut ajouter des **jetons** de paramètre de route dans le chemin de la route pour capturer la valeur dynamique à cette position dans l'URL de la requête. L'exemple ci-dessous montre l'utilisation d'un jeton de paramètre de route dans le décorateur `@Get()`. Les paramètres de route déclarés de cette manière peuvent être accédés en utilisant le décorateur `@Param()`, qui doit être ajouté à la signature de la méthode.

```ts
@Get(':id')
findOne(@Param('id') id: string): string {
  return `Cette action retourne la tâche #${id}`;
}
```

`@Param()` est utilisé pour décorer un paramètre de méthode en donnant un jeton de paramètre particulier au décorateur.

::: info Astuce
Importe `Param` depuis le package `https://deno.land/x/danet/mod.ts`.
:::

## Scopes

Pour les personnes provenant de différents milieux de programmation, il pourrait être inattendu d'apprendre que dans Danet, presque tout est partagé entre les requêtes entrantes. Nous avons une pool de connexions à la base de données, des services singleton avec un état global, etc.

Cependant, il y a des cas particuliers où la durée de vie du contrôleur basée sur la requête peut être le comportement souhaité, par exemple pour le suivi des requêtes ou la multi-tenantabilité. Une page de documentation sera créée pour expliquer comment faire cela.

## L'asynchrone

En tant que framework moderne, nous savons que l'extraction de données est principalement **asynchrone**. C'est pourquoi Danet prend en charge et fonctionne bien avec les fonctions `async`.

::: info Astuce
Apprends-en plus sur la fonctionnalité `async / await` [ici](https://kamilmysliwiec.com/typescript-2-1-introduction-async-await)
:::

Chaque fonction asynchrone doit renvoyer une `Promise`. Cela signifie que vous pouvez retourner une valeur différée que Danet pourra résoudre par lui-même. Voyons un exemple :

```ts todo.controller.ts
@Get()
async findAll(): Promise<any[]> {
    return [];
}
```

## Payload de la requête

Notre exemple précédent de handler de route POST n'accepte pas de paramètres.
Résolvons cela en ajoutant ici le décorateur `@Body()`.

Mais d'abord, nous devons déterminer le schéma DTO (objet de transfert de données). Un DTO est un objet qui définit comment les données seront envoyées. Nous déterminons le schéma DTO en utilisant une classe avec des décorateurs de validation de type.

Danet utilise [Validatte](https://github.com/Savory/validatte) pour valider le schéma DTO avec le corps reçu. Pour chaque attribut du corps de la requete, tu dois utiliser le décorateur correspondant.

Vous pouvez voir tous les décorateurs de validation disponibles [ici](https://github.com/Savory/validatte#available-decorators).

Créons la classe CreateTodoDto :

```ts create-todo.dto.ts
import { IsNumber, IsString, IsHexColor } from 'https://deno.land/x/validatte/mod.ts';

export class CreateTodoDto {
  @IsString()
  name!: string;

  @IsNumber()
  priority!: number;

  @IsHexColor()
  colorLabel!: string;
}
```
Il ne possède que trois propriétés de base. Ensuite, nous pouvons utiliser le DTO nouvellement créé à l'intérieur du TodoController :

```ts todo.controller.ts
@Post()
async create(@Body() createTodoDto: CreateTodoDto) {
  return "Cette action ajoute un nouveau todo";
}
```

Si le corps ne suit pas le DTO, un code d'état 400 est renvoyé. Comme dans l'exemple ci-dessous :

```json
{
	"status": 400,
	"name": "NotValidBodyException",
	"reasons": [
		{
			"property": "priority",
			"errorMessage": "Property must be a number",
			"constraints": []
		}
	],
	"message": "400 - Mauvais format du corps"
}
```

::: info Astuce
Plus de détails sur la validation du corps peuvent être trouvés [ici](https://savory.github.io/body-validation-in-danet/).
:::
## Gestion des erreurs

Il y a un chapitre séparé sur la gestion des erreurs (c.-à-d. travailler avec des exceptions) : [exception-filters](exception-filters.md)

## Exemple complet de ressource

Ci-dessous se trouve un exemple qui utilise plusieurs des décorateurs disponibles pour créer un contrôleur de base. Ce contrôleur expose plusieurs méthodes pour accéder et manipuler les données internes.

```ts todo.controller.ts
import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from 'https://deno.land/x/danet/mod.ts';
import { CreateTodoDto, UpdateTodoDto, ListAllEntities } from './dto';

@Controller('todo')
export class TodoController {
  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return "Cette action ajoute un nouveau todo";
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `Cette action retourne un todo #${id}`;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return `Cette action met à jour un todo #${id}`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `Cette action supprime un todo #${id}`;
  }
}
```
## Mise en place

Avec le contrôleur défini ci-dessus, Danet ne sait pas encore que le
`TodoController` existe et ne créera donc pas d'instance de cette classe.

Les contrôleurs appartiennent toujours à un module, c'est pourquoi nous incluons le tableau `controllers` dans le décorateur `@Module()`. Étant donné que nous n'avons pas encore défini d'autres modules que le module racine `AppModule`, nous utiliserons celui-ci pour introduire le `TodoController` :

```ts app.module.ts
import { Module } from 'https://deno.land/x/danet/mod.ts';
import { TodoController } from './todo/todo.controller';

@Module({
  controllers: [TodoController],
})
export class AppModule {}
```

Nous avons attaché les métadonnées à la classe du module en utilisant le décorateur `@Module()`, et Danet peut maintenant facilement refléter les contrôleurs qui doivent être montés.

Maintenant, il est temps de créer une `DanetApplication` qui initialisera notre `AppModule`.

Nous vous conseillons de créer une fonction de démarrage qui retourne l'instance de votre `DanetApplication`, cela facilitera les tests car vous pourrez récupérer l'instance de votre application et la faire écouter sur un port aléatoire.

```ts bootstrap.ts
import { AppModule } from './app.module.ts';
import { DanetApplication } from 'https://deno.land/x/danet/mod.ts';

export const bootstrap = async () => {
  const application = new DanetApplication();
  await application.init(AppModule);
  return application;
}
```

Pour obtenir une instance d'application, tu peux exécuter cette fonction et appeler la méthode `listen` pour exécuter le serveur.

```ts run.ts
import { bootstrap } from './bootstrap.ts';

const application = await bootstrap();
await application.listen(Number(Deno.env.get('PORT') || 3000));
```

Enfin, pour exécuter ce fichier, tu peux utiliser cette commande : `deno run --allow-net --unstable --allow-env run.ts`