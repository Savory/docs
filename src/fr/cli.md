---
label: CLI
order: 1
---

## Aperçu

Le [CLI Danet](https://github.com/Savory/Danet-CLI) est un outil d'interface de ligne de commande qui t'aide à setup, run et bundle les projets Danet.

À l'avenir, il permettra notamment pour créer facilement des modules/controllers/service. Les projets créés via le CLI mettent en place les meilleures pratiques afin d'encourager des applications bien structurées.

## Installation

L'installation des paquets Deno en tant que commandes est simple. Tu peux les installer sous le nom de ton choix. Pour des raisons de simplicité, nous installons notre danet-cli sous le nom `danet`.

```bash
$ deno install --allow-read --allow-write --allow-run --allow-env -n danet https://deno.land/x/danet_cli/main.ts
```

## Workflow travail de base

Une fois installé, tu peux invoquer des commandes directement depuis le terminal de ton OS grâce à la commande `danet`. Tu peux voir les commandes disponibles en tapant :

```bash
$ danet --help
```

Pour créer et lancer un nouveau projet Danet basique, places toi dans le dossier parent de ton nouveau projet, et lances les commandes suivantes :

```bash
$ danet new mon-projet-danet
$ cd mon-projet-danet
$ danet develop //run sans file watching
$ danet start //run sans file watching
```

Dans ton navigateur, ouvres <a href="http://localhost:3000" target="_blank" rel="noreferrer">http://localhost:3000</a> pour voir fonctionner la nouvelle application.

## Options de base de données

Lors de la création d'un nouveau projet, le CLI Danet te demandera quel fournisseur de base de données tu souhaites utiliser entre `mongodb`, `postgres` et `in-memory` et générera tout le code nécessaire.

La seule chose que tu as à faire lorsque tu utilises `mongodb` ou `postgres` est de définir des variables d'environnement ou de les placer dans un fichier `.env` dans le répertoire racine de ton projet.

Cependant, si tu veux que ce soit moins interactif, tu peux passer les options suivantes à `danet new` : 

- `--mongodb`
- `--postgres`
- `---en-mémoire`
