---
order: 95
---

Danet est fourni avec une **couche d'exceptions intégrée** qui est responsable du traitement de toutes les exceptions non gérées au sein d'une application. Lorsque c'est le cas, elle est interceptée par cette couche, qui envoie alors automatiquement une réponse appropriée et compréhensible pour l'utilisateur.

Par défaut, cette action est effectuée par un **filtre d'exceptions global** intégré, qui gère toutes les exceptions. Lorsqu'une exception est **non reconnue** (c'est-à-dire qu'elle ne possède pas les propriétés `statusCode` et `message`), le filtre d'exceptions intégré génère la réponse JSON par défaut suivante :

```json
{
  "statusCode": 500,
  "message": "Erreur interne du serveur !"
}
```

::: info **Astuce**
Toute exception levée contenant les propriétés `statusCode` et `message` sera correctement renseignée et renvoyée en tant que réponse (au lieu de `InternalServerError` par défaut pour les exceptions non reconnues).
:::

### Exceptions HTTP intégrées

Danet fournit un ensemble d'exceptions standard qui héritent de la classe de base `HttpException` et représentent la plupart des exceptions HTTP les plus courantes :

- `BadRequestException`
- `UnauthorizedException`
- `NotFoundException`
- `ForbiddenException`
- `NotAcceptableException`
- `RequestTimeoutException`
- `ConflictException`
- `GoneException`
- `HttpVersionNotSupportedException`
- `PayloadTooLargeException`
- `UnsupportedMediaTypeException`
- `UnprocessableEntityException`
- `InternalServerErrorException`
- `NotImplementedException`
- `ImATeapotException`
- `MethodNotAllowedException`
- `BadGatewayException`
- `ServiceUnavailableException`
- `GatewayTimeoutException`
- `PreconditionFailedException`

## Filtres d'exceptions

Bien que le filtre d'exceptions de base (intégré) puisse gérer automatiquement de nombreux cas pour toi, tu peux souhaiter avoir **un contrôle total** sur la couche d'exceptions. Par exemple, tu peux vouloir ajouter des logs ou utiliser un schéma JSON différent en fonction de certains facteurs dynamiques. Les **filtres d'exceptions** sont conçus précisément à cette fin. Ils te permettent de contrôler le flux de contrôle exact et le contenu de la réponse envoyée au client.

Créons un filtre d'exceptions qui est responsable de la capture des exceptions qui sont une instance de la classe `CustomException`, et de la mise en œuvre d'une logique de réponse personnalisée pour elles.

```ts custom-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  HttpContext,
} from 'https://deno.land/x/danet/mod.ts';

@Injectable()
@Catch(CustomException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: CustomException, ctx: HttpContext) {
    const response = ctx.response;
    const request = ctx.request;
    const status = exception.status;

    response.status = status;
    response.body = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };
  }
}
```

Le décorateur `@Catch(CustomException)` lie les métadonnées requises au filtre d'exceptions, indiquant à Danet que ce filtre particulier recherche des exceptions de type `CustomException` et rien d'autre. Le décorateur `@Catch()` prend un seul paramètre.

## Liaison des filtres

Liaisons notre nouveau filtre `CustomerExceptionFilter` à la méthode `create()` de `TodoController`.

```ts cats.controller.ts
@Post()
@UseFilter(CustomerExceptionFilter)
async create(@Body() createTodoDto: CreateTodoDto) {
  throw new ForbiddenException();
}
```

Nous avons utilisé le décorateur `@UseFilters()` ici. Similaire au décorateur `@Catch()`, il prend la classe de ton filtre, laissant la responsabilité de l'instanciation au framework, et permettant **l'injection de dépendance**.

Dans l'exemple ci-dessus, le filtre `CustomException` est appliqué uniquement au gestionnaire de route unique `create()`, le rendant spécifique à la méthode. Les filtres d'exceptions peuvent être spécifiques à différents niveaux : méthode, contrôleur ou global. Par exemple, pour configurer un filtre spécifique au contrôleur, tu ferais ce qui suit :

```ts cats.controller.ts
@UseFilter(CustomExceptionFilter)
export class TodoController {}
```

Cette construction configure le filtre `CustomException` pour chaque gestionnaire de route défini à l'intérieur du `TodoController`.

## Tout capturer

Pour capturer **chaque** exception non gérée (indépendamment du type d'exception), omet le décorateur `@Catch()`.
```typescript
import {
  Catch,
  ExceptionFilter,
  HttpContext,
} from 'https://deno.land/x/danet/mod.ts';

@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: unknown, ctx: HttpContext): boolean {
    const response = ctx.response;
    const request = ctx.request;
    const status = exception.status;

    response.status = status;
    response.body = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };
  }
}
```
