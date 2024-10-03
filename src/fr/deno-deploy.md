---
label: Deno Deploy
order: 3
---

## Introduction

Deno Deploy est un système distribué qui te permet d'exécuter du JavaScript, TypeScript et WebAssembly près des utilisateurs, on the edge, dans le monde entier. Utilisant le moteur d'exécution V8, les serveurs Deno deploy fournissent une latence minimale et éliminent les abstractions inutiles. Tu peux développer ton script localement en utilisant le CLI de Deno, puis le déployer sur leur infrastructure, en moins d'une seconde, sans avoir besoin de configurer quoi que ce soit.

::: info **Astuce**
En savoir plus sur le [site Web officiel de Deno Deploy](https://deno.com/deploy)
:::

## Première étape

## Créer un compte
Avant de plonger dans les (quelques) commandes requises pour déployer ton projet Danet depuis ton environnement local ou depuis une action Github, tu dois [créer un compte sur Deno Deploy](https://deno.com/deploy/pricing).

Au moment de la rédaction de cette documentation, Deploy propose deux offres de prix.

0$ pour :
- 100 000 demandes par jour
- 100 GiB de transfert de données sortant par mois (entrant est gratuit)
- Jusqu'à 10ms de temps CPU (pas de temps réel) par demande

10$ par mois pour :

- Sous-domaines génériques
- Jusqu'à 50ms de temps CPU (pas de temps réel) par demande
- 5 millions de demandes par mois incluses
- 100 GiB de transfert de données sortant inclus (entrant est gratuit)

Tu peux commencer avec la version gratuite et passer à la version payante si nécessaire !

Le processus d'inscription est assez simple, il suffit de se connecter avec GitHub et voilà.

::: info **Astuce**
L'intégration de Github te permet de déployer depuis les actions Github sans avoir besoin d'un secret ou d'une variable d'environnement
:::

## Créer un projet

Maintenant que tu as un compte, tu dois créer un projet Deploy pour pouvoir déployer ton application.

Grâce à l'intégration Github, tu as accès à la liste de tes repositories et tu peux facilement sélectionner le repository que tu veux déployer sur ce projet.

Ensuite, tu dois sélectionner la branche qui sera déployée et comment sera ton déploiement continu :
- Automatique, afin que ton projet soit déployé tel quel à chaque push
- Github Action, si tu souhaites ajouter une étape de génération avant le déploiement.

Pour le projet Danet, nous devons sélectionner "Github Action".

La dernière entrée consiste à nommer ton projet, ce sera également le sous-domaine de ton projet.

## Déploiement depuis ton environnement local

Si tu veux une façon rapide de tester le déploiement, tu peux facilement le faire en 3 commandes.

TLDR :

```bash
$ danet bundle my-app.js
$ cd bundle
$ deployctl deploy --project=YOUR_PROJECT_NAME --no-static --token=YOUTOKEN my-app.js
```

::: info **Astuce**
`deployctl` provient de https://deno.com/deploy/docs/deployctl

Ton token peut être créé/trouvé [ici](https://dash.deno.com/account#access-tokens)
:::

### Bundle ton application
Bundle c'est créer un seul fichier JS qui contient tout le code source de ton projet.
Nous te recommandons d'utiliser la commande `danet bundle` pour bundle ton code, mais tu es libre d'utiliser n'importe quel bundler que tu souhaites tant qu'il gère l'option "emitDecoratorMetadata".

```bash
$ danet bundle my-app.js
```

### Déploie sur DD
Maintenant que tu as ton application en un seul fichier, tu peux l'envoyer pour le déploiement.
Pour ce faire, tu as besoin de [récupérer ton access token depuis Deploy](https://dash.deno.com/account#access-tokens)

```bash
$ deployctl deploy --project=NOM_DE_TON_PROJET --no-static --token=TONTOKEN my-app.js
```

## Action GitHub

Si tu as créé ton projet avec notre CLI, tu as déjà un workflow prêt à l'emploi dans `.github/workflows/run-test.yml` que tu peux utiliser, il te suffit de mettre le nom de ton projet dans la dernière étape :

```yaml
      - name: Deployer sur Deno Deploy
        uses: denoland/deployctl@v1
        with:
          project: TON NOM DE PROJET ICI
          entrypoint: run.js
          root: bundle
```

Si tu ne l'as pas (parce que tu as utilisé une ancienne version du projet de départ), pas de panique.

Crée un fichier yaml dans le dossier `.github/workflows`, quelque chose comme `deploy.yml`, et suis ces étapes :

### Mise en place du flux de travail :

```yaml
name: Deploy to Deno Deploy

on:
  push:
    branches: [main]

permissions:
  contents: read
  id-token: write # Nécessaire pour l'authentification avec Deno Deploy
```
### Configurer les jobs

Ensuite, nous avons besoin d'un job à exécuter, ce qui sera fait à chaque push.

- Clone le repo.
- Configure Deno (installe-le sur le worker).
- Installe Danet CLI.
- Rassemble notre application avec la commande `danet bundle`
- Envoie le bundle sur Deploy

```yaml
jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Setup le repo
        uses: actions/checkout@v3

      - name: Setup Deno
        # uses: denoland/setup-deno@v1
        uses: denoland/setup-deno@004814556e37c54a2f6e31384c9e18e983317366
        with:
          deno-version: v1.x

      - name: Installer le CLI Danet
        run: deno install --allow-read --allow-write --allow-run --allow-env -n danet jsr:@danet/cli

      - name: Bundle l'application avec le CLI Danet
        run: danet bundle run.js

      - name: Deployer sur Deno Deploy
        uses: denoland/deployctl@v1
        with:
          project: NOM-DE-TON-PROJET
          entrypoint: run.js
          root: bundle
```

### Exemple complet

Consulte le workflow sur notre starter project [ici](https://github.com/Savory/Danet-Starter/blob/main/.github/workflows/run-tests.yml)