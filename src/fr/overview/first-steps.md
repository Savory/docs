---
order: 100
label: Premiers pas
---


Dans cet ensemble d'articles, tu apprendras les **fondamentaux de base** de Danet. Pour te familiariser avec les fondamentaux des applications Danet, nous construirons une application CRUD de base avec des fonctionnalités qui couvrent beaucoup de sujets.

## Prérequis

Assure-toi que [Deno](https://deno.land/) (version >= Install v1.24.3) est installé.

## Installation

La manière la plus facile de mettre en place un projet Danet est d'utiliser notre [CLI Danet](/cli.md)

```bash
$ deno install --allow-read --allow-write --allow-run --allow-env -n danet jsr:@danet/cli
$ danet new my-danet-project
$ cd my-danet-project
```

L'application est une API TODO CRUD avec MongoDB, Postgres ou une base de données In-Memory en fonction de ce que tu choisis lorsque tu exécutes la commande `danet new` !

## Utilisation de MongoDB ou Postgres

Pour exécuter l'application, tu as besoin d'un serveur de base de données exécutant l'un ou l'autre. Nous partons du principe que tu sais comment faire.

Ensuite, tu dois ajouter les informations de ton serveur quelque part pour que Danet puisse accéder à ces informations pour se connecter au serveur.

Tu as 2 façons de faire :

### Variables d'environnement

Ajoute les variables suivantes :

DB_NAME=
DB_HOST=
DB_PORT
DB_USERNAME
DB_PASSWORD=

### Dotenv

Danet prend en charge `dotenv` (parce que Deno le prend en charge nativement), tu peux donc créer un fichier `.env` à la racine de ton projet avec les mêmes variables :

``` .env
DB_NAME=
DB_HOST=
DB_PORT
DB_USERNAME
DB_PASSWORD=
```

::: info Astuce
Nous fournissons un fichier `.env.example` dans le projet.
:::

## Exécution de l'application

Une fois le processus d'installation terminé, tu peux exécuter la commande suivante dans ton terminal pour démarrer l'application :

```bash
$ deno task launch-server
```