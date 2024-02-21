---
label: V1 à V2
order: 100
---


# Migrer de la version 1 à la version 2

Dans la version 1, nous utilisions hono en interne. La version 2 a basculé vers Hono pour des performances améliorées (cf [notre benchmark](https://quickchart.io/chart/render/sf-adcfeec7-78bc-43c6-9019-09c18ae3bd48)).

Il y a un breaking change concernant le context.

## Requête et Réponse de HTTPContext

`HTTPContext` est passé d'être un superset du contexte d'Oak à être un superset du [contexte d'Hono](https://hono.dev/api/context).

Cela signifie qu'au lieu d'utiliser `context.response` et `context.request`, nous devons utiliser `context.res` et `context.req`.

`context.res` est simplement l'objet de réponse qui sera renvoyé au client (sauf si la méthode de ton contrôleur renvoie quelque chose, auquel cas la valeur renvoyée par la méthode du contrôleur a la priorité).

`context.req` est une instance de [`HonoRequest`](https://hono.dev/api/request).
