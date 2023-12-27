---
order: 96
label: Middlewares
---
Les middlewares sont des fonctions appelées **avant** le gestionnaire de route. Les fonctions middleware ont accès à l'objet de contexte [d'hono](https://hono.dev/api/context).

<figure><img src="https://docs.nestjs.com/assets/Middlewares_1.png" /></figure>

<blockquote class="external">
  Les fonctions middleware peuvent effectuer les tâches suivantes :
  <ul>
    <li>exécuter n'importe quel code.</li>
    <li>apporter des modifications à l'objet de contexte.</li>
  </ul>
</blockquote>

Tu peux implémenter un middleware personnalisé de Danet dans une fonction ou dans une classe avec un décorateur `@Injectable()`. La classe doit implémenter l'interface `DanetMiddleware`, tandis que la fonction n'a pas d'exigences particulières. Commençons par implémenter une fonctionnalité middleware simple en utilisant la méthode de classe.

```ts logger.middleware.ts
import { Injectable, DanetMiddle, HttpContext, NextFunction } from 'https://deno.land/x/danet/mod.ts';

@Injectable()
export class LoggerMiddleware implements DanetMiddleware {
  async action(ctx: HttpContext, next: NextFunction) {
    console.log('Request...');
    await next();
  }
}
```
### Injection de dépendances

Les middlewares de Danet prennent en charge pleinement l'injection de dépendances. Tout comme avec les injectables et les controllers, ils sont capables d'**injecter des dépendances** qui sont disponibles dans le même module. Comme d'habitude, cela se fait via le `constructor`.

### Application de middleware

Tu peux appliquer des middlewares globalement, à des controllers et à des méthodes.

Pour les middlewares globaux, utilise simplement la méthode `addGlobalMiddlewares` de l'application Danet comme suit :

```ts bootstrap.ts
...
  const application = new DanetApplication();
  await application.init(AppModule);
  application.addGlobalMiddlewares(LoggerMiddleware); // autant de middlewares que vous voulez ;
...
```

Pour les controllers et les méthodes, utilisez simplement le décorateur `@Middleware` ! Comme `addGlobalMiddlewares`, il peut prendre autant de middlewares que nécessaire en tant qu'arguments.

```ts todo.controllers.ts
@Middleware(LoggerMiddleware)
@Controller('todo')
class TodoController {
	@Get('/')
	getWithMiddleware() {
    return 'OK'
    }
};
```

### Middleware fonctionnel

La classe `LoggerMiddleware` que nous avons utilisée est assez simple. Elle ne possède aucun membre, aucune méthode supplémentaire et aucune dépendance. Pourquoi ne pouvons-nous pas simplement la définir dans une fonction simple au lieu d'une classe ? En fait, nous le pouvons. Ce type de middleware s'appelle **middleware fonctionnel**. Transformons le middleware de journalisation d'une classe en middleware fonctionnel pour illustrer la différence :

```ts logger.middleware.ts
import { Injectable, DanetMiddle, HttpContext, NextFunction } from 'https://deno.land/x/danet/mod.ts';

export async function logger(ctx: HttpContext, next: NextFunction) {
  console.log(`Request...`);
  await next();
};
```
Et l'utiliser dans `TodoController` :

```ts todo.controller.ts
@Middleware(logger)
@Controller('todo')
class TodoController {
  @Get('/')
  getWithMiddleware() {
    return 'OK'
  }
};
```

::: info **Astuce**
Considère l'utilisation de l'alternative de **middleware fonctionnel** plus simple chaque fois que ton middleware n'a pas besoin de dépendances.
:::

### Middleware multiple

Comme mentionné ci-dessus, pour lier plusieurs middleware qui sont exécutés séquentiellement, il suffit de les fournir dans l'ordre de gauche à droite à `@Middleware` ou à `addGlobalMiddleware`.

### Middleware global

Si nous voulons lier du middleware à chaque route enregistrée en une seule fois, il suffit d'utiliser la méthode `addGlobalMiddlewares` de l'application Danet comme suit:

```ts bootstrap.ts
...
  const application = new DanetApplication();
  await application.init(AppModule);
  application.addGlobalMiddlewares(YourFirstMiddleware, SecondMiddleware); //as many middleware as you want;
...
```