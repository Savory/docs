---
label: Deno's Fresh Integration
order: 4
---
## Introduction

Fresh est un framework web de nouvelle génération, conçu pour la vitesse, la fiabilité et la simplicité.

Certaines fonctionnalités remarquables sont :

- Rendu juste-à-temps sur le bord.
- Hydratation client basée sur des îles pour une interactivité maximale.
- Aucun surcoût d'exécution : aucun JS n'est envoyé au client par défaut.
- Pas d'étape de construction.
- Aucune configuration nécessaire.
- Support TypeScript dès le départ.
- Routage de système de fichiers à la Next.js.

::: info **Astuce**
En savoir plus sur le [site web officiel de Fresh Deno](https://fresh.deno.dev/)
:::


## Intégration avec Danet

Nous croyons que Fresh est un framework formidable pour le front-end grâce au rendu côté serveur (SSR) avec hydratation partielle, au routage de système de fichiers et au support de TypeScript.

Cependant, à notre avis, il manque des fonctionnalités spécialisées pour le back-end afin de permettre aux développeurs de créer une architecture backend de qualité entreprise avec flexibilité et robustesse.

Dans le même temps, Danet manque de fonctionnalités spécialisées pour créer des frontends géniaux.

C'est pourquoi nous avons travaillé à fournir une façon d'exécuter les deux, à partir du même processus. Vous permettant de rendre des pages géniales avec Fresh tout en ayant un code de logique métier / API robuste qui peut également être utilisé dans Fresh SSR pour le premier rendu.

Il y a deux façons de le faire :

- servir le contenu Fresh depuis le chemin `/` et vos points de terminaison d'API depuis un préfixe dédié tel que `/api`
- servir le contenu Fresh depuis un préfixe dédié, tel que `/dashboard`, et vos points de terminaison d'API depuis la racine `/`


::: danger **Déployer**
Jusqu'à ce que Deploy de Deno gère l'option de compilateur `emitDecoratorMetadata`, ou que Fresh gère la mise en paquet, il n'y a aucun moyen de déployer une application Danet avec une intégration Fresh sur Deno Deploy si vous utilisez une instance de `DanetApplication` dans les îles Fresh.
:::

## Configuration des dossiers et des fichiers

Bonne nouvelle, il n'y a que peu ou pas de changement dans la structure des dossiers de votre application Danet ou Fresh !

Disons que vous avez une application `danet-app` (générée à partir de notre CLI) et une application `fresh-app` (générée à partir du [guide de démarrage Fresh](https://fresh.deno.dev/#getting-started)) côte à côte comme suit :

![Screenshot 2023-04-16 at 17 08 48](https://user-images.githubusercontent.com/38007824/232283998-89510982-c917-474f-9a25-b80bbb8fc301.png)


Déplacez `fresh-app` dans `danet-app/src` (nous ne montrons pas tous les fichiers existants pour des raisons de clarté) :

![Screenshot 2023-04-16 at 17 08 13](https://user-images.githubusercontent.com/38007824/232283976-e4551764-8333-463a-a003-47dee910a44b.png

Tu peux supprimer `fresh-app/dev.ts` et `fresh-app/main.ts`, mais n'oublie pas les plugins que tu utilises dans `fresh-app/main.ts`, pour les passer en paramètres lors de l'activation de Fresh depuis ton application Danet.

## Fresh depuis la racine

Pour activer Fresh depuis `/`, utilise notre appel de module Fresh : `FreshModule.enableFreshFromRoot` depuis ta `DanetApplication`, **AVANT** l'appel de `.init`.
Les arguments de cette méthode sont :
- Ta DanetApplication
- L'URL du dossier Fresh
- Le préfixe depuis lequel tu veux que les routes de Danet soient accessibles
- L'objet de configuration de démarrage de Fresh.


```ts bootstrap.ts
import { AppModule } from './app.module.ts';
import { DanetApplication } from 'danet/mod.ts';
import { configAsync } from 'dotenv/mod.ts';
import twindConfig from "./dashboard/twind.config.ts";
import twindPlugin from "$fresh/plugins/twind.ts";
import { FreshModule } from "danet-fresh/mod.ts";

export const application = new DanetApplication();
export const bootstrap = async () => {
    await configAsync({export: true});

    const freshAppDirectory = new URL('./fresh-app/', import.meta.url);
    await FreshModule.enableFreshOnRoot(application, freshAppDirectory, '/api', {plugins: [twindPlugin(twindConfig)]});

    await application.init(AppModule);

    return application;
};

```
Tu peux supprimer `fresh-app/dev.ts` et `fresh-app/main.ts`, mais n'oublie pas les plugins que tu utilises dans `fresh-app/main.ts`, pour les passer en paramètres lorsque tu actives Fresh depuis ton application Danet.

## Fresh depuis la racine

Pour activer Fresh depuis `/`, utilise notre appel au module Fresh : `FreshModule.enableFreshFromRoot` depuis ton `DanetApplication`, **AVANT** d'appeler `.init`.
Les arguments de cette méthode sont :
- Ton DanetApplication
- L'URL du dossier Fresh
- Le préfixe à partir duquel tu souhaites que tes routes Danet soient accessibles
- L'objet de configuration de démarrage de Fresh.

```ts bootstrap.ts
import { AppModule } from './app.module.ts';
import { DanetApplication } from 'danet/mod.ts';
import { configAsync } from 'dotenv/mod.ts';
import twindConfig from "./dashboard/twind.config.ts";
import twindPlugin from "$fresh/plugins/twind.ts";
import { FreshModule } from "danet-fresh/mod.ts";

export const application = new DanetApplication();
export const bootstrap = async () => {
 await configAsync({ export: true });
 
 const freshAppDirectory = new URL('./fresh-app/', import.meta.url);
 await FreshModule.enableFreshFromRoot(application, freshAppDirectory, '/dashboard', { plugins: [twindPlugin(twindConfig)] });
 
 await application.init(AppModule);
 
 return application;
};

```

::: info **Astuce**
`danet-fresh/mod.ts` est déclaré dans la carte d'importation pour pointer vers https://deno.land/x/danet_fresh/
:::


## Fresh depuis un chemin donné

Pour activer Fresh depuis un chemin donné, appelle simplement `.enableFresh` depuis ton `DanetApplication`, **AVANT** d'appeler `.init`.
Les arguments de cette méthode sont :
- Ton DanetApplication
- L'URL du dossier Fresh
- Le préfixe à partir duquel tu souhaites que tes routes Fresh soient accessibles
- L'objet de configuration de démarrage de Fresh.

```ts bootstrap.ts
import { AppModule } from './app.module.ts';
import { DanetApplication } from 'danet/mod.ts';
import { configAsync } from 'dotenv/mod.ts';
import twindConfig from "./dashboard/twind.config.ts";
import twindPlugin from "$fresh/plugins/twind.ts";
import { FreshModule } from "danet-fresh/mod.ts";

export const application = new DanetApplication();
export const bootstrap = async () => {
 await configAsync({ export: true });
 
 const freshAppDirectory = new URL('./fresh-app/', import.meta.url);
 await FreshModule.enableFresh(application, freshAppDirectory, '/dashboard', { plugins: [twindPlugin(twindConfig)] });
 
 await application.init(AppModule);
 
 return application;
};

```

::: info **Astuce**
`danet-fresh/mod.ts` est déclaré dans la carte d'importation pour pointer vers https://deno.land/x/danet_fresh/
:::


## Exemple fonctionnel

Il y a une [branche spécifique sur notre projet de démarrage](https://github.com/Savory/Danet-Starter/tree/fresh-integration) avec une application Fresh de démonstration dans le dossier `src/dashboard`, servie depuis la racine.

Consulte-la si nécessaire !
