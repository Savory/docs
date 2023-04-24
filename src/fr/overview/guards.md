---
order: 90
label: Guardes
---

Un garde est une classe annotée avec le décorateur `@Injectable()`, qui implémente l'interface `AuthGuard`.

Les gardes ont une **seule responsabilité**. Ils déterminent si une requête donnée sera gérée par le gestionnaire de route ou non, en fonction de certaines conditions (comme les autorisations, les rôles, les ACL, etc.) présentes à l'exécution. C'est souvent appelé **autorisation**.

## Garde d'autorisation

Comme mentionné précédemment, **l'autorisation** est un excellent cas d'utilisation pour les gardes car des routes spécifiques ne doivent être disponibles que lorsque l'appelant (généralement un utilisateur authentifié spécifique) dispose de permissions suffisantes. Le `AuthGuard` que nous allons maintenant construire suppose qu'un utilisateur est authentifié (et qu'un jeton est donc attaché aux en-têtes de la requête). Il extraira et validera le jeton, puis utilisera les informations extraites pour déterminer si la requête peut ou non être traitée.

```typescript simple-auth-guard.ts

import { Injectable, AuthGuard } from 'https://deno.land/x/danet/mod.ts';
import { ExecutionContext } from "./router.ts";

@Injectable()
export class SimpleAuthGuard implements AuthGuard {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> {
        const request = context.request;
        return validateRequest(request);
    }
}
```

La logique à l'intérieur de la fonction `validateRequest()` peut être aussi simple ou sophistiquée que nécessaire. Le but principal de cet exemple est de montrer comment les guards s'intègrent dans le cycle de requête/réponse.

Chaque guard doit implémenter une fonction `canActivate()`. Cette fonction doit renvoyer un booléen, indiquant si la requête actuelle est autorisée ou non. Elle peut renvoyer la réponse de manière synchrone ou asynchrone via une `Promise`. Danet utilise la valeur de retour pour contrôler la prochaine action :

- si elle renvoie `true`, la requête sera traitée.
- si elle renvoie `false`, Danet refusera la requête.

## Attacher des guards

Comme les pipes et les filtres d'exception, les guards peuvent être liés à un contrôleur (au niveau du contrôleur), au niveau de la méthode ou globalement. Ci-dessous, nous configurons un guard au niveau du contrôleur en utilisant le décorateur `@UseGuards()`. Ce décorateur peut prendre un seul argument ou une liste d'arguments séparés par des virgules. Cela vous permet d'appliquer facilement l'ensemble approprié de guards avec une seule déclaration.

```typescript todo.controller.ts
@Controller('todo')
@UseGuards(SimpleGuard)
export class TodoController {}
```

La construction ci-dessus attache le guard à chaque gestionnaire déclaré par ce contrôleur. Si nous souhaitons que le guard ne s'applique qu'à une seule méthode, nous appliquons le décorateur `@UseGuards()` au niveau de la **méthode**.

Les guards globaux sont utilisés dans toute l'application, pour chaque contrôleur et chaque gestionnaire de route. Vous pouvez configurer un guard global en utilisant le code suivant :

```typescript app.module.ts
import { Module, AuthGuard } from 'https://deno.land/x/danet/mod.ts';

@Module({
  providers: [
    new TokenInjector(SimpleGuard, GLOBAL_GUARD)
  ],
})
export class AppModule {}
```
