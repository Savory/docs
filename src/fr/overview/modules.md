---
order: 97
---
Un module est une classe annotée avec un décorateur `@Module()`. Le décorateur `@Module()` fournit des métadonnées que **Danet** utilise pour organiser la structure de l'application.

Chaque application a au moins un module, un **module racine**. Le module racine est le point de départ que Danet utilise pour construire le **graphe d'application** - la structure de données interne que Danet utilise pour résoudre les relations et les dépendances des modules et des fournisseurs. Bien que les très petites applications puissent théoriquement avoir uniquement le module racine, ce n'est pas le cas typique. Nous voulons souligner que les modules sont **fortement** recommandés comme un moyen efficace d'organiser vos composants. Ainsi, pour la plupart des applications, l'architecture résultante utilisera plusieurs modules, chacun déclarant un ensemble étroitement lié de **capacités**.

Le décorateur `@Module()` prend un seul objet dont les propriétés décrivent le module :

|               |                                                                                                                    |
|---------------|--------------------------------------------------------------------------------------------------------------------|
| `injectables` | les injectables qui seront instanciés par l'injecteur Danet et qui peuvent être partagés au moins entre ce module |
| `controllers` | l'ensemble des contrôleurs définis dans ce module qui doivent être instanciés                                        |
| `imports`     | la liste des modules importés qui déclarent les injectables requis dans ce module                        |

[//]: # (| `exports`     | le sous-ensemble de `injectables` qui est fourni par ce module et doit être disponible dans d'autres modules qui importent ce module. Vous pouvez utiliser soit le fournisseur lui-même, soit simplement son jeton &#40;valeur de `provide`&#41; |)

Le module **n'encapsule pas** les injectables. Cela signifie que vous pouvez injecter des injectables à partir de n'importe quel module tant qu'il a été résolu.

Cela changera dans le futur.

## Modules de fonctionnalités

Le `TodoController` et `TodoService` appartiennent au même domaine d'application. Comme ils sont étroitement liés, il est logique de les déplacer dans un module de fonctionnalités. Un module de fonctionnalités organise simplement le code pertinent pour une fonctionnalité spécifique, en maintenant le code organisé et en établissant des limites claires. Cela nous aide à gérer la complexité et à développer avec les principes [SOLID](https://en.wikipedia.org/wiki/SOLID), surtout lorsque la taille de l'application et/ou de l'équipe augmente.

Pour le démontrer, nous allons créer le `TodoModule`.

```ts todo.module.ts
import { Module } from 'https://deno.land/x/danet/mod.ts';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  controllers: [TodoController],
  injectables: [TodoService],
})
export class TodoModule {}
```

Ci-dessus, nous avons défini le `TodoModule` dans le fichier `todo.module.ts` et déplacé tout ce qui concerne ce module dans le répertoire `todo`. La dernière chose à faire est d'importer ce module dans le module racine (le `AppModule`, défini dans le fichier `app.module.ts`).

```typescript app.module.ts
import { Module } from'https://deno.land/x/danet/mod.ts';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [TodoModule],
})
export class AppModule {}
```

## Modules partagés

Dans Danet, les modules sont des **singletons** par défaut, ainsi tu peux partager la même instance de n'importe quel fournisseur entre plusieurs modules sans effort.

Chaque module est automatiquement un **module partagé**. Une fois créé, il peut être réutilisé par n'importe quel module. Imaginons que nous voulions partager une instance de `TodoService` entre plusieurs autres modules. Pour ce faire, rien n'a besoin d'être fait, tout module qui importe le `TodoModule` a accès au `TodoService` et partagera la même instance avec tous les autres modules qui l'importent également.

## Modules globaux

Les `injectables` sont enregistrés dans la portée globale, comme dans [Angular](https://angular.io). Une fois définis, ils sont disponibles partout.