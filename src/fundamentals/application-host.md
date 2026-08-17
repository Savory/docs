---
label: Application Host
---
### Application host

Sometimes an injectable or a module needs to reach the running `DanetApplication` itself, for example to mount a route directly on the underlying [Hono](https://hono.dev) router. Danet registers the application in the injector under the public `APPLICATION_HOST` token, so anything living in the DI container can obtain it without the application being passed around.

This is Danet's analogue of NestJS's [`HttpAdapterHost`](https://docs.nestjs.com/faq/http-adapter): where a NestJS extension module injects the host to access the Express/Fastify adapter, a Danet extension injects `APPLICATION_HOST` to access the application and its Hono instance (`app.router`). This is what allows `forRoot`-style extension modules to mount their own endpoints.

#### Injecting the application

Any injectable can receive the running application through constructor injection with `@Inject(APPLICATION_HOST)`:

```typescript app-info.service.ts
import {
  APPLICATION_HOST,
  DanetApplication,
  Inject,
  Injectable,
} from 'jsr:@danet/core';

@Injectable()
export class AppInfoService {
  constructor(
    @Inject(APPLICATION_HOST) private app: DanetApplication,
  ) {}

  routes() {
    return this.app.router.routes;
  }
}
```

#### Mounting a route from a module hook

Module classes are constructed with plain `new`, so they do not get constructor injection. Inside a [lifecycle hook](/fundamentals/lifecycle) such as `onAppBootstrap`, read the token from the exported `injector` instead:

```typescript metrics.module.ts
import {
  APPLICATION_HOST,
  DanetApplication,
  injector,
  Module,
} from 'jsr:@danet/core';
import { OnAppBootstrap } from 'jsr:@danet/core/hook';

@Module({})
export class MetricsModule implements OnAppBootstrap {
  onAppBootstrap() {
    const app = injector.get<DanetApplication>(APPLICATION_HOST);
    app.router.get('/metrics', (c) => c.text('up'));
  }
}
```

Import `MetricsModule` in your root module and `/metrics` responds as soon as the application listens.

::: warning The injector is process-global
Danet's injector is a singleton shared by the whole process. When several applications are initialized in the same process (as test suites commonly do), `APPLICATION_HOST` resolves to the **most recently initialized** application.
:::
