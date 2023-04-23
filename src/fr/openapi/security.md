---
order: 97
label: Security
---

Pour définir les mécanismes de sécurité à utiliser pour une opération spécifique, utilise `@ApiSecurity()`.

```ts
@ApiSecurity('basic')
@Controller('todo')
export class TodoController {}
```

Avant d'exécuter ton application, n'oublie pas d'ajouter la définition de sécurité à ton document de base en utilisant `SpecBuilder` :

```ts
const options = new Spec().addSecurity('basic', {
  type: 'http',
  scheme: 'basic',
});
```

Certaines des techniques d'authentification les plus populaires sont intégrées (par exemple, `basic` et `bearer`) et donc tu n'as pas besoin de définir manuellement les mécanismes de sécurité comme indiqué ci-dessus.

## Authentification basique

Pour activer l'authentification de base, utilise `@ApiBasicAuth()`.

```ts
@ApiBasicAuth()
@Controller('todo')
export class TodoController {}
```

Ajoute la définition de sécurité à ton document de base en utilisant `SpecBuilder` :

```ts
const options = new SpecBuilder().addBasicAuth();
```

## Authentification Bearer

Pour activer l'authentification Bearer, utilise `@ApiBearerAuth()`.

```typescript
@ApiBearerAuth()
@Controller('todo')
export class TodoController {}
```

Avant d'exécuter ton application, n'oublie pas d'ajouter la définition de sécurité à ton document de base en utilisant `SpecBuilder` :

```typescript
const options = new SpecBuilder().addBearerAuth();
```

## Authentification OAuth2

Pour activer OAuth2, utilise `@ApiOAuth2()`.

```typescript
@ApiOAuth2(['todos:write'])
@Controller('todo')
export class TodoController {}
```

Avant d'exécuter ton application, n'oublie pas d'ajouter la définition de sécurité à ton document de base en utilisant `SpecBuilder` :

```typescript
const options = new SpecBuilder().addOAuth2();
```

## Authentification par cookie

Pour activer l'authentification par cookie, utilise `@ApiCookieAuth()`.

```typescript
@ApiCookieAuth()
@Controller('todo')
export class TodoController {}
```

Avant d'exécuter ton application, n'oublie pas d'ajouter la définition de sécurité à ton document de base en utilisant `SpecBuilder` :

```typescript
const options = new SpecBuilder().addCookieAuth('token');
```