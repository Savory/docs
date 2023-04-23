---
  order: 98
---

Les injectables sont un concept fondamental dans Danet. De nombreuses classes de base de Danet peuvent être traitées comme un service - repositories, de factories, d'helpers, etc. L'idée principale d'un service est qu'il peut être **injecté** en tant que dépendance ; cela signifie que des objets peuvent créer diverses relations les uns avec les autres, et la fonction de "connexion" des instances d'objets peut être largement déléguée au système d'exécution de Danet.

![](https://docs.nestjs.com/assets/Components_1.png)
Image tirée de la [documentation NestJS](https://docs.nestjs.com/providers)

Dans le chapitre précédent, nous avons créé un simple `TodoController`. Les contrôleurs doivent gérer les requêtes HTTP et déléguer les tâches plus complexes aux **injectables**. Les injectables sont des classes JavaScript simples qui sont déclarées en tant qu'`injectables` dans un [module](/overview/modules.md).

> info **Astuce** Puisque Danet permet la possibilité de concevoir et d'organiser les dépendances de manière plus OO, nous recommandons fortement de suivre les principes [SOLID](https://en.wikipedia.org/wiki/SOLID).

## Services

Commençons par créer un simple `TodoService`. Ce service sera responsable du stockage et de la récupération de données, et est conçu pour être utilisé par le `TodoController`, il est donc un bon candidat pour être défini en tant que fournisseur.

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

Notre `TodoService` est une classe de base avec une propriété et deux méthodes. La seule nouvelle fonctionnalité est l'utilisation du décorateur `@Injectable()`. Le décorateur `@Injectable()` ajoute des métadonnées, qui déclarent que `TodoService` est une classe qui peut être gérée par le conteneur Danet [IoC](https://en.wikipedia.org/wiki/Inversion_of_control). Au fait, cet exemple utilise également une interface `Todo`, qui ressemble probablement à ceci:

```ts todo.interface
export interface Todo {
  title: string;
  description: string;
}
```

Maintenant que nous avons une classe de service pour récupérer les tâches à faire, utilisons-la à l'intérieur du `TodoController`:
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
Le `TodoService` est **injecté** via le constructeur de la classe. Notez l'utilisation de la syntaxe `private`. Cette abréviation nous permet de déclarer et d'initialiser la propriété `todoService` immédiatement au même endroit.

## Injection de dépendance

Danet est construit autour du puissant modèle de conception communément connu sous le nom d'**Injection de dépendance**. Nous recommandons de lire un excellent article sur ce concept dans la documentation officielle [Angular](https://angular.io/guide/dependency-injection).

Dans Danet, grâce aux capacités de TypeScript, il est extrêmement facile de gérer les dépendances car elles sont résolues simplement par type. Dans l'exemple ci-dessous, Danet résoudra `todoService` en créant et en renvoyant une instance de `TodoService` (ou, dans le cas normal d'un singleton, en renvoyant l'instance existante si elle a déjà été demandée ailleurs). Cette dépendance est résolue et passée au constructeur de votre contrôleur (ou affectée à la propriété indiquée):

```ts
constructor(private todoService: TodoService) {}
```

## Portées

Les injectables ont normalement une durée de vie ("portée") synchronisée avec le cycle de vie de l'application. Lorsque l'application est démarrée, chaque dépendance doit être résolue et donc chaque fournisseur doit être instancié. De même, lorsque l'application s'arrête, chaque fournisseur sera détruit. Cependant, il existe des moyens de rendre la durée de vie de votre fournisseur également **liée à la demande**. Vous pouvez en lire plus sur ces techniques sur la page suivante [!fundamentals](/fundamentals/injection-scopes.md)

[//]: # (## Custom injectables)

[//]: # ()
[//]: # (Danet has a built-in inversion of control &#40;"IoC"&#41; container that resolves relationships between injectables. This feature underlies the dependency injection feature described above, but is in fact far more powerful than what we've described so far. There are several ways to define a provider: you can use plain values, classes, and either asynchronous or synchronous factories. More examples are provided [here]&#40;/fundamentals/dependency-injection&#41;.)

## Enregistrement du fournisseur

Maintenant que nous avons défini un fournisseur (`TodoService`) et que nous avons un consommateur de ce service (`TodoController`), nous devons enregistrer le service auprès de Danet afin qu'il puisse effectuer l'injection. Nous le faisons en modifiant notre fichier de module (`app.module.ts`) et en ajoutant le service au tableau `injectables` du décorateur `@Module()`.

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

Danet pourra désormais résoudre les dépendances de la classe `TodoController`.