---
label: Database Providers
order: 90
---

At some point when creating an API emerge the question about what DB to use. After a heated discussion among your peers and colleague you pick one.
Our [database module](https://deno.land/x/danet_database) allows you to easily integrate a DB provider into your Danet app.



Currently, it handles : 

- MongoDB
- Deno KV

## Getting started

Let's say you want to start using Mongodb in your Danet application. The easiest way is to import the `MongodbModule` in your `app.module.ts` as follows: 

```ts
import { Module } from 'jsr:@danet/core';
import { AppController } from './app.controller.ts';
import { MongodbModule } from 'danet_database/mongodb/module.ts';

@Module({
  controllers: [AppController],
  imports: [MongodbModule],
})
export class AppModule {}

```

This will make the MongodbModule's `MongodbService` available in your app if you want to access your Mongodb connection. 

Each provider's service implement [Danet lifecycle hooks](../fundamentals/lifecycle.md) `onAppBootstrap` and `onAppClose` to start and end connection to database server.

::: info Hint
 Check the code of each provider service in to see its features: https://github.com/Savory/Danet-Database/tree/main
:::

## Repositories

Each provider also export an abstract repository generic class that you can extend. Available at `danet_database/PROVIDER_NAME/repository.ts`.

These abstract classes implement the following `repository` interface from `danet_database/repository.ts`:

```ts
export interface Repository<T extends unknown> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | undefined>;
  // deno-lint-ignore no-explicit-any
  create(dto: unknown): Promise<any>;
  updateOne(id: string, dto: Partial<T>): Promise<unknown>;
  deleteOne(id: string): Promise<unknown>;
  deleteAll(): Promise<unknown>;
}

```

All repositories have a `collectionName` attribute set in constructors to know which collections/tables/prefix is queried. For example, here is our `MongodbItemRepository` from our [SAASKIT](https://github.com/Savory/saaskit-danet):

```ts
import { Injectable } from 'jsr:@danet/core';
import { Item } from './class.ts';
import { MongodbRepository } from "danet-database/mongodb/repository.ts";
import { MongodbService } from "danet-database/mongodb/service.ts";

@Injectable()
export class MongodbItemRepository extends MongodbRepository<Item> {
 constructor(protected service: MongodbService) {
  super(service, 'items');
 }
}
```

## Each provider specificity 

### MongoDB

You need at least the following env variable: `DB_NAME`, `DB_HOST`, `DB_PORT`. The following are optional (but recommended) : `DB_USERNAME`, `DB_PASSWORD`. 

Repository's `getAll` method can take an optional filter parameter (from [https://deno.land/x/mongo](https://deno.land/x/mongo))

A new method `getOne` which also takes an optional filter parameter

### KV

Repository has a method `getSecondaryKeys` which takes an object as parameter and will create secondary keys for it. You need to implement it for each repository with secondary keys. For example, here is an implementation of the VoteRepository from our [SAASKIT](https://github.com/Savory/saaskit-danet)

```ts
import { Injectable } from 'jsr:@danet/core';
import { Vote } from './class.ts';
import { type VoteRepository } from './repository.ts';
import { KvRepository } from "danet-database/kv/repository.ts";
import { KvService } from "danet-database/kv/service.ts";

@Injectable()
export class KvVoteRepository extends KvRepository<Vote>
  implements VoteRepository {
    constructor(protected kv: KvService) {
        super(kv, 'votes');
    }

    protected getSecondaryKeys(vote: Vote) {
        const voteByItemIdKey = [this.collectionName, vote.itemId, vote._id];
        const voteByUserIdAndItemIdKey = [
            this.collectionName,
            vote.userId,
            vote.itemId,
        ];
        return {voteByUserIdAndItemIdKey, voteByItemIdKey};
    }

    async getByItemId(itemId: string): Promise<Vote[]> {
        const votes = [];
        for await (
            const entry of this.kv.client().list<Vote>({
            prefix: [this.collectionName, itemId],
        })
            ) {
            votes.push(entry.value as Vote);
        }
        return votes;
    }

    async getByItemIdAndUserId(
        itemId: string,
        userId: string,
    ): Promise<Vote | undefined> {
        const entry = await this.kv.client().get<Vote>([
            this.collectionName,
            userId,
            itemId,
        ]);
        return entry.value !== null ? entry.value : undefined;
    }
}
```

We defined our secondary keys, and created the related "proprietary" method to access them.

*ALL* secondary keys entries are created when using `create` and updated when using `updateOne`. You do not have to think about managing them !