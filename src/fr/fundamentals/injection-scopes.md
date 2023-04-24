---
label: Portée de l'injection
---

Pour les personnes venant de différents milieux de programmation, il peut être surprenant d'apprendre que dans Danet, presque tout est partagé entre les requêtes entrantes. Nous avons un pool de connexions à la base de données, des services singleton avec un état global, etc. Rappelle-toi que Node.js ne suit pas le modèle Multi-threaded Stateless Request/Response dans lequel chaque requête est traitée par un thread séparé. Ainsi, l'utilisation d'instances singleton est totalement **sûre** pour nos applications.

Cependant, il existe des cas particuliers où le cycle de vie de la requête peut être le comportement souhaité, par exemple pour le caching par requête dans les applications GraphQL, le suivi des requêtes et le multi-tenant. Les scopes d'injection fournissent un mécanisme pour obtenir le comportement souhaité du cycle de vie du fournisseur.

## Portée de fournisseur

Un fournisseur peut avoir l'un des portées suivants :

<table>
  <tr>
    <td><code>GLOBAL</code></td>
    <td>Une seule instance du fournisseur est partagée dans toute l'application. La durée de vie de l'instance est directement liée au cycle de vie de l'application. Une fois l'application amorcée, tous les fournisseurs singleton ont été instanciés. Le scope singleton est utilisé par défaut.</td>
  </tr>
  <tr>
    <td><code>REQUEST</code></td>
    <td>Une nouvelle instance du fournisseur est créée exclusivement pour chaque <strong>requête</strong> entrante. L'instance est libérée après le traitement de la requête.</td>
  </tr>
</table>


::: info Astuce
L'utilisation du scope singleton est **recommandée** pour la plupart des cas d'utilisation. Le partage de fournisseurs entre les consommateurs et les requêtes signifie qu'une instance peut être mise en cache et que son initialisation ne se produit qu'une fois, lors du démarrage de l'application.
:::
## Utilisation

Spécifie la portée d'injection en passant la propriété `scope` à l'objet d'options du décorateur `@Injectable()` :

```typescript
import { Injectable, Scope } from 'https://deno.land/x/danet/mod.ts';

@Injectable({ scope: Scope.REQUEST })
export class TodoService {}
```

La portée singleton est utilisée par défaut et n'a pas besoin d'être déclarée. Si tu veux déclarer un fournisseur avec une portée singleton, utilise la valeur `Scope.GLOBAL` pour la propriété `scope`.

## Portée du contrôleur

Les contrôleurs peuvent également avoir une portée qui s'applique à toutes les méthodes de requête déclarées dans ce contrôleur. Comme pour la portée du fournisseur, la portée du contrôleur déclare sa durée de vie. Pour un contrôleur à portée de demande, une nouvelle instance est créée pour chaque demande entrante et collectée par le ramasse-miettes une fois que la demande a terminé son traitement.

Déclare la portée du contrôleur avec la propriété `scope` de l'objet `ControllerOptions` :

```typescript
@Controller({
  path: 'todo',
  scope: Scope.REQUEST,
})
export class TodoController {}
```

## Hiérarchie de la portée

La portée `REQUEST` remonte dans la chaîne d'injection. Un contrôleur qui dépend d'un fournisseur à portée de demande sera également à portée de demande.

Imagine le graphique de dépendance suivant : `TodoController <- TodoService <- TodoRepository`. Si `TodoService` est à portée de demande (et les autres sont des singletons par défaut), le `TodoController` deviendra à portée de demande car il dépend du service injecté. Le `TodoRepository`, qui n'est pas dépendant, restera à portée de singleton.

## Accès au contexte

Tu peux avoir besoin d'accéder à une référence à l'objet de demande d'origine lors de l'utilisation de fournisseurs à portée de demande. Tu peux y accéder en utilisant la méthode `beforeControllerMethodIsCalled` comme suit. Et oui, cela peut être asynchrone.

```typescript
import { Injectable, Scope, Inject, HttpContext } from 'https://deno.land/x/danet/mod.ts';

@Injectable({ scope: Scope.REQUEST })
export class TodoService {
  constructor() {}
  
  async beforeControllerMethodIsCalled(ctx: HttpContext) {
    //faire quelque chose avec le contexte
  }
}
```

## Performance

L'utilisation de fournisseurs à portée de demande aura un impact sur les performances de l'application. Nous devons créer une instance de ta classe pour chaque demande. Par conséquent, cela ralentira ton temps de réponse moyen et le résultat global de référencement. Sauf si un fournisseur doit être à portée de demande, il est fortement recommandé d'utiliser la portée de singleton par défaut.

::: info Astuce
Bien que cela puisse sembler assez intimidant, une application conçue correctement qui tire parti des fournisseurs à portée de demande ne devrait pas ralentir de plus de ~5% en termes de latence.
:::