---
order: 99
---

La spécification [OpenAPI](https://swagger.io/specification/) est un format de définition indépendant du langage utilisé pour décrire les API RESTful. Danet fournit un [module](https://github.com/Savory/Danet-Swagger) dédié qui permet de générer une telle spécification en utilisant des décorateurs.

::: danger
Le module SwaggerModule est actuellement en version alpha et de nombreuses fonctionnalités sont manquantes. Si quelque chose dont vous avez besoin n'est pas encore là, [merci de remplir une demande de fonctionnalité ou un rapport d'erreur](https://github.com/Savory/Danet-Swagger/issues)
:::

## Bootstrap

Ouvre simplement le fichier `bootstrap.ts` et initialise Swagger en utilisant la classe `SwaggerModule` :

```ts bootstrap.ts
import { DanetApplication } from 'jsr:@danet/core';
import { SwaggerModule, SpecBuilder } from 'jsr:@danet/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const application = new DanetApplication();
  await application.init(AppModule);
  const spec = new SpecBuilder()
    .setTitle('Todo')
    .setDescription('The todo API')
    .setVersion('1.0')
    .build();
  const document = await SwaggerModule.createDocument(application, spec);
  SwaggerModule.setup('api', application, document);
  return application;
}
```

::: tip
Le `document` (retourné par la méthode `SwaggerModule#createDocument()`) est un objet sérialisable conforme à [OpenAPI Document](https://swagger.io/specification/#openapi-document). Au lieu de le diffuser via HTTP, vous pourriez également le sauvegarder sous forme de fichier JSON/YAML, et le consommer de différentes manières.
:::

Le `SpecBuilder` aide à structurer un document de base conforme à la spécification OpenAPI. Il fournit plusieurs méthodes qui permettent de définir des propriétés telles que le titre, la description, la version, etc. Pour créer un document complet (avec toutes les routes HTTP définies), nous utilisons la méthode `createDocument()` de la classe `SwaggerModule`. Cette méthode prend deux arguments, une instance d'application et un objet d'options Swagger.

Une fois que nous avons créé un document, nous pouvons appeler la méthode `setup()`. Elle prend :

1. Le chemin d'accès pour monter l'interface utilisateur Swagger
2. Une instance d'application
3. L'objet document instancié ci-dessus

Maintenant, vous pouvez exécuter la commande suivante pour démarrer le serveur HTTP :

```bash
$ deno task launch-server
```

Pendant que l'application est en cours d'exécution, ouvrez votre navigateur et accédez à `http://localhost:3000/api`. Vous devriez voir l'interface utilisateur Swagger.

![image](https://user-images.githubusercontent.com/38007824/206904215-c99be01c-7db0-4868-8cc8-63fe9046e3af.png)

Le `SwaggerModule` reflète automatiquement tous vos points d'extrémité.

::: tip
Pour générer et télécharger un fichier JSON Swagger, accédez à `http://localhost:3000/api/json` (en supposant que votre documentation Swagger est disponible sous `http://localhost:3000/api`).
:::