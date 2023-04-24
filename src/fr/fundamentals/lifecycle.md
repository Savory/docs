---
label: Cycle de vie
---

Une application Danet, ainsi que chaque élément d'application, a un cycle de vie. Danet fournit des **hooks de cycle de vie** qui donnent une visibilité sur les événements clés du cycle de vie et la capacité d'agir (exécuter du code enregistré sur votre `injectable` ou `controller`) lorsqu'ils se produisent.

## Événements de cycle de vie

Les événements de cycle de vie se produisent pendant le démarrage et l'arrêt de l'application. Danet appelle les méthodes de hook de cycle de vie enregistrées sur les `injectables` et les `controllers` à chacun des événements de cycle de vie suivants. Comme indiqué dans le diagramme ci-dessus, Danet appelle également les méthodes sous-jacentes appropriées pour commencer à écouter les connexions et arrêter d'écouter les connexions.

`OnAppClose` est déclenché uniquement si tu appelles explicitement `app.close()`.

| Méthode de hook de cycle de vie | Événement de cycle de vie déclenchant l'appel à la méthode du hook |
|---------------------------------|--------------------------------------------------------------------|
| `OnAppBootstrap()`              | Appelé une fois après l'injection de toutes les dépendances.       |
| `OnAppClose()`                  | Appelé sur `app.close` juste avant de fermer les connexions.       |

::: danger **Attention**
Les hooks de cycle de vie listés ci-dessus ne sont pas déclenchés pour les classes à portée de requête (**request-scoped**). Les classes à portée de requête ne sont pas liées au cycle de vie de l'application et leur durée de vie est imprévisible. Elles sont exclusivement créées pour chaque requête et supprimées après l'envoi de la réponse.
:::

## Utilisation

Chaque hook de cycle de vie est représenté par une interface. Les interfaces sont techniquement optionnelles car elles n'existent pas après la compilation TypeScript. Néanmoins, il est bon de les utiliser afin de bénéficier d'une forte typage et des outils d'éditeur. Pour enregistrer un hook de cycle de vie, implémente l'interface appropriée. Par exemple, pour enregistrer une méthode qui doit être appelée après que les injections ont été effectuées sur une classe particulière (par exemple, Controller ou Injectable), implémente l'interface `OnAppBootstrap` en fournissant une méthode `onAppBootstrap()`, comme indiqué ci-dessous :

```typescript user-service.ts
import { Injectable, AuthGuard } from 'https://deno.land/x/danet/mod.ts';

@Injectable()
export class UsersService implements OnAppBootstrap {
  onAppBootstrap() {
    console.log(`Le module a été initialisé.`);
  }
}
```

## Initialisation asynchrone

Le hook `OnAppBootstrap` te permet de différer le processus d'initialisation de l'application (retourne une `Promise` ou marque la méthode comme `async` et attend la fin d'une méthode asynchrone dans le corps de la méthode).

```typescript
async onAppBootstrap(): Promise<void> {
  await this.fetch();
}
```