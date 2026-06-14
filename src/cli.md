---
label: CLI
order: 1
---
## Overview

The [Danet CLI](https://github.com/Savory/Danet-CLI) is a command-line interface tool that helps you to initialize, run, bundle your Danet applications and scaffold modules, controllers and services.

Projects created with the CLI embody best-practice architectural patterns to encourage well-structured apps.

## Installation

Installing Deno packages as a commands is simple. You can install them under any name you want. For simplicity's sake, we install our danet-cli under the name `danet`.  

```bash
$ deno install --allow-read --allow-write --allow-run --allow-env --global -n danet jsr:@danet/cli
```

## Basic workflow

Once installed, you can invoke CLI commands directly from your OS command line through the `danet` command. See the available `danet` commands by entering the following:

```bash
$ danet --help
```

To create, run a new basic Danet project, go to the folder that should be the parent of your new project, and run the following commands:

```bash
$ danet new my-danet-project
$ cd my-danet-project
$ danet develop //run with file watching
$ danet start  //run without file watching
```

In your browser, open  <a href="http://localhost:3000" target="_blank" rel="noreferrer">http://localhost:3000</a> to see the new application running.

## Generating Components

From inside a project, you can scaffold modules, controllers and services with the `generate` command (aliased as `g`):

```bash
$ danet generate <schematic> <name>
$ danet g <schematic> <name>
```

The available schematics, with their aliases, are:

| Schematic    | Alias | Generates                  | Class created      |
| ------------ | ----- | -------------------------- | ------------------ |
| `module`     | `mo`  | `src/<name>/module.ts`     | `<Name>Module`     |
| `controller` | `co`  | `src/<name>/controller.ts` | `<Name>Controller` |
| `service`    | `s`   | `src/<name>/service.ts`    | `<Name>Service`    |

Each component lives in its own folder, following the Danet folder convention. The provided name is normalized to `kebab-case` for the folder and `PascalCase` for the class, so `danet g co user-profile`, `danet g co userProfile` and `danet g co UserProfile` all produce the folder `user-profile` and the class `UserProfileController`.

```bash
$ danet g module cat        # src/cat/module.ts        -> class CatModule
$ danet g controller cat    # src/cat/controller.ts    -> class CatController
$ danet g service cat       # src/cat/service.ts       -> class CatService
```

### Automatic module wiring

By default, generated components are automatically registered in the relevant `@Module` so you don't have to edit it by hand:

- a **controller** is added to the `controllers` array of its sibling module;
- a **service** is added to the `injectables` array of its sibling module;
- a **module** is added to the `imports` array of your root `src/app.module.ts`.

For instance, after generating the controller and service above, the module is updated for you:

```typescript src/cat/module.ts
import { Module } from 'jsr:@danet/core';
import { CatController } from './controller.ts';
import { CatService } from './service.ts';

@Module({
  controllers: [CatController],
  injectables: [CatService],
})
export class CatModule {}
```

Wiring is skipped (without error) when the target module file cannot be found. To opt out entirely, pass `--skip-import`:

```bash
$ danet g controller cat --skip-import
```

You can also change where the component folder is created with `--path` (defaults to `src`):

```bash
$ danet g module cat --path src/features
```

## Database Options

When creating a new project, Danet CLI will ask you what database provider you want to use between `mongodb`, `postgres` and `in-memory` and will generate all the required code.

The only thing left if you use `mongodb` or `postgres` will be to set environment variables or put them in a `.env` file in your project's root folder.

However, if you need it to be less interactive, you can pass the followings options when calling `danet new` : 

- `--mongodb`
- `--postgres`
- `--in-memory`