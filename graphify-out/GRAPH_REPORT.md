# Graph Report - docs  (2026-08-17)

## Corpus Check
- 82 files · ~37,840 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 506 nodes · 596 edges · 33 communities (31 shown, 2 thin omitted)
- Extraction: 81% EXTRACTED · 18% INFERRED · 1% AMBIGUOUS · INFERRED: 110 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1599f3d1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Techniques section config
- @Injectable() decorator (FR)
- SwaggerModule
- @Controller
- ThrottlerGuard
- Danet CLI
- @GrpcController
- ExceptionFilter interface
- ScheduleModule
- en.config.ts
- Middleware Danet (FR)
- Danet Framework
- Danet Framework
- @danet/rabbitmq package
- dependencies
- HTTPContext
- useValue provider
- SwaggerModule
- Moteur de template Handlebars
- AuthModule
- useClass provider
- SSEEvent (CustomEvent subclass)
- Absence d'encapsulation des injectables
- @WebSocket() parameter decorator
- @Module() decorator
- SpecBuilder security definitions
- Overview
- Resolvers
- RabbitMQModule.forRoot
- Exceptions layer
- Application host
- @Injectable() decorator

## God Nodes (most connected - your core abstractions)
1. `Techniques section config` - 9 edges
2. `@Injectable() decorator (FR)` - 7 edges
3. `DI fundamentals` - 7 edges
4. `@Module() decorator` - 7 edges
5. `@Controller()` - 7 edges
6. `@GrpcController()` - 7 edges
7. `@danet/grpc package` - 7 edges
8. `Overview` - 6 edges
9. `Resolvers` - 6 edges
10. `@Module() decorator (FR)` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Automatic Module Wiring` --semantically_similar_to--> `Auto-generated Sidebar`  [INFERRED] [semantically similar]
  src/cli.md → CLAUDE.md
- `Fondamentaux Section` --implements--> `Section index.yml Config`  [INFERRED]
  src/fr/fundamentals/index.yml → CLAUDE.md
- `@SSE() decorator` --semantically_similar_to--> `@WebSocketController() decorator`  [INFERRED] [semantically similar]
  src/techniques/sse.md → src/websockets/controllers.md
- `Techniques section config` --references--> `Database Providers (doc)`  [INFERRED]
  src/techniques/index.yml → src/techniques/databases.md
- `Techniques section config` --references--> `Task Scheduling (doc)`  [INFERRED]
  src/techniques/index.yml → src/techniques/task-scheduling.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **CLI scaffolding and automatic wiring flow** — src_cli_danet_generate, src_cli_schematics, src_cli_automatic_module_wiring, src_cli_skip_import, src_cli_path_option [EXTRACTED 1.00]
- **Decorator-driven message consumption across EventEmitter, KV Queue and RabbitMQ** — src_techniques_events_onevent, src_techniques_kvqueue_onqueuemessage, src_rabbitmq_publishing_and_consuming_onrabbitmqmessage, src_techniques_kvqueue_queueevent, src_techniques_events_in_process_only [EXTRACTED 1.00]
- **Bundle-then-deploy pipeline for Deno Deploy** — src_deno_deploy_danet_deploy, src_deno_deploy_danet_bundle, src_deno_deploy_deployctl, src_deno_deploy_github_action_workflow [EXTRACTED 1.00]
- **Dynamic ConfigModule configuration flow: register() binds options as a useValue injectable that ConfigService receives via @Inject** — src_fundamentals_dynamic_modules_configmodule, src_fundamentals_dynamic_modules_register, src_fundamentals_dynamic_modules_config_options_token, src_fundamentals_dynamic_modules_configservice, src_fundamentals_custom_injectables_inject_decorator, src_fundamentals_dynamic_modules_injectable_order [EXTRACTED 1.00]
- **gRPC transport reuses the whole Danet pipeline: proto loading, controller decorators, DI, guards and exception mapping around a GrpcServer booted before app.init()** — src_grpc_overview_grpcserver, src_grpc_controllers_loadproto, src_grpc_controllers_grpccontroller, src_grpc_controllers_grpcmethod, src_grpc_error_handling_exception_mapping, src_grpc_controllers_global_guard_caveat [EXTRACTED 1.00]
- **Metadata-driven authorization: a custom @Roles decorator sets metadata that a guard reads through ExecutionContext and MetadataHelper** — src_fundamentals_execution_context_setmetadata, src_fundamentals_execution_context_roles_decorator, src_fundamentals_execution_context_metadatahelper, src_fundamentals_execution_context_getclass, src_fundamentals_execution_context_gethandler, src_fr_overview_guards_canactivate [EXTRACTED 1.00]
- **OpenAPI document generation flow** — src_openapi_introduction_specbuilder, src_openapi_introduction_createdocument, src_openapi_introduction_setup, src_openapi_types_and_parameters_apiproperty, src_openapi_operations_tag [EXTRACTED 1.00]
- **RabbitMQ publish/consume flow** — src_rabbitmq_overview_rabbitmqmodule, src_rabbitmq_overview_sendmessage, src_rabbitmq_overview_onrabbitmqmessage, src_rabbitmq_exchanges_and_acknowledgements_exchanges, src_rabbitmq_exchanges_and_acknowledgements_acknowledgements [EXTRACTED 1.00]
- **Decorator-driven OpenAPI document generation** — src_fr_openapi_introduction_swaggermodule, src_fr_openapi_introduction_specbuilder, src_fr_openapi_types_and_parameters_apiproperty, src_fr_openapi_types_and_parameters_returnedtype, src_fr_openapi_security_apisecurity, src_fr_openapi_operations_tag [EXTRACTED 1.00]
- **Throttling pipeline: module config, global guard, tracker and pluggable storage** — src_techniques_rate_limiting_throttlermodule, src_techniques_rate_limiting_throttlerguard, src_techniques_rate_limiting_global_guard, src_techniques_rate_limiting_gettracker, src_techniques_rate_limiting_throttlerstorage, src_techniques_rate_limiting_throttlerexception [EXTRACTED 1.00]
- **Danet request lifecycle: middleware, guard, handler, exception filter** — src_overview_middlewares_danetmiddleware, src_overview_guards_authguard, src_overview_controllers_routing, src_overview_controllers_response_object, src_overview_exception_filters_exceptions_layer [INFERRED 0.85]
- **WebSocket message pipeline: controller, middleware, guard, handler, exception filter** — src_websockets_controllers_websocketcontroller, src_websockets_middlewares_danetmiddleware, src_websockets_guards_useguard, src_websockets_controllers_onwebsocketmessage, src_websockets_exception_filters_wsexceptionfilter, src_websockets_controllers_execution_context [INFERRED 0.85]

## Communities (33 total, 2 thin omitted)

### Community 0 - "Techniques section config"
Cohesion: 0.06
Nodes (44): RabbitMQ Publishing & Consuming (doc), Broker back-pressure signal (false return), Queue-name-as-contract decoupling, One handler per message type, @OnRabbitMQMessage decorator, RabbitMQ.publish(exchange, routingKey, data, ...), RabbitMQ service, RabbitMQ.sendMessage(queue, data, options?) (+36 more)

### Community 1 - "@Injectable() decorator (FR)"
Cohesion: 0.06
Nodes (42): AuthGuard (interface), SimpleAuthGuard, Section Vue d'ensemble (FR), Guide Angular Dependency Injection (citation), Injection de dependance, @Injectable() decorator (FR), Conteneur IoC Danet (FR), Documentation NestJS (citation) (+34 more)

### Community 2 - "SwaggerModule"
Cohesion: 0.07
Nodes (28): Deno Runtime, OpenAPI Docs Section, SwaggerModule.createDocument(), Danet-Swagger Module, DanetApplication (OpenAPI bootstrap), OpenAPI Specification, SpecBuilder, SwaggerModule (+20 more)

### Community 3 - "@Controller"
Cohesion: 0.07
Nodes (30): ExecutionContext, MetadataHelper, @Roles() Custom Decorator, @SetMetadata(), Fondamentaux Section, beforeControllerMethodIsCalled, Injection Scope, Scope.GLOBAL (+22 more)

### Community 4 - "ThrottlerGuard"
Cohesion: 0.07
Nodes (34): Recipes section config, JWT Guard recipe (doc), AuthGuard interface, canActivate(context), ExecutionContext, HMAC shared secret vs RSA/ECDSA key pair, jose library (jwtVerify / SignJWT), JwtAuthGuard (+26 more)

### Community 5 - "Danet CLI"
Cohesion: 0.08
Nodes (28): Automatic Module Wiring, Danet CLI, danet develop / danet start, danet generate (g), danet new, Database Provider Options, deno.json Import Map, --path option (+20 more)

### Community 6 - "@GrpcController"
Cohesion: 0.12
Nodes (19): DanetMiddleware (interface), Middleware fonctionnel, LoggerMiddleware, @Middleware() decorator, @GrpcController(), @GrpcMethod(), @GrpcPayload(), loadProto() (+11 more)

### Community 7 - "ExceptionFilter interface"
Cohesion: 0.25
Nodes (7): AllExceptionsFilter, @Catch() decorator, CustomExceptionFilter, ExceptionFilter interface, HttpContext (filter argument), @UseFilter() decorator, @UseGuard() decorator

### Community 8 - "ScheduleModule"
Cohesion: 0.07
Nodes (28): Bootstrap injectable scanning for consumers, Database Providers (doc), collectionName constructor attribute, @danet/database module, getSecondaryKeys(), KvRepository<T>, KvService, KvVoteRepository (SAASKIT example) (+20 more)

### Community 9 - "en.config.ts"
Cohesion: 0.10
Nodes (17): { generateSidebar }, Options, SidebarItem, VitePressSidebar, enConfig, META_DESCRIPTION, META_TITLE, META_URL (+9 more)

### Community 10 - "Middleware Danet (FR)"
Cohesion: 0.08
Nodes (29): canActivate(), ExecutionContext (dans les guards FR), GLOBAL_GUARD, Garde (Guard), TokenInjector, @UseGuard() decorator, addGlobalMiddlewares(), DanetApplication (FR middlewares) (+21 more)

### Community 11 - "Danet Framework"
Cohesion: 0.17
Nodes (12): Angular (architectural ancestor), Danet Framework, Hono HTTP Framework, NestJS (inspiration), Danet Philosophy, Danet Documentation MIT License, NestJS Documentation License, Hono (V2 HTTP engine) (+4 more)

### Community 12 - "Danet Framework"
Cohesion: 0.12
Nodes (18): Fence-with-filename Code Blocks, Danet Documentation Site, ignoreDeadLinks, Locale Mirrored Subtree, Page Frontmatter Convention, Section index.yml Config, Auto-generated Sidebar, VitePress (+10 more)

### Community 13 - "@danet/rabbitmq package"
Cohesion: 0.29
Nodes (8): Cross-language wire format, RabbitMQ Docs Section, amqplib, @danet/rabbitmq package, Events (in-process pub/sub), frameMax connection workaround, KV Queue (Deno.kv transport), Choosing between Events, KV Queue and RabbitMQ

### Community 14 - "dependencies"
Cohesion: 0.12
Nodes (16): front-matter, js-yaml, dependencies, front-matter, js-yaml, @types/js-yaml, vitepress-plugin-pagefind, devDependencies (+8 more)

### Community 15 - "HTTPContext"
Cohesion: 0.10
Nodes (23): HonoRequest, HTTPContext, @ApiProperty() decorator, @BodyType() decorator, CreateTodoDto (OpenAPI model), @Optional() decorator, @QueryType() decorator, @ReturnedType() decorator (+15 more)

### Community 16 - "useValue provider"
Cohesion: 0.24
Nodes (11): 'CONNECTION' token, @Inject() decorator, Non-class-based provider tokens, TodoController (custom injectables), TodoService (custom injectables), useValue provider, 'CONFIG_OPTIONS' token, ConfigModule (+3 more)

### Community 17 - "SwaggerModule"
Cohesion: 0.24
Nodes (11): @Body() (websocket message data), Zod Body and Query Validation (doc), @Body(schema) from @danet/zod, @Query(schema) from @danet/zod, Zod schema + z.infer typing pattern, Zod section config, Zod OpenAPI (doc), extendZodWithOpenApi (+3 more)

### Community 18 - "Moteur de template Handlebars"
Cohesion: 0.33
Nodes (6): Moteur de template Handlebars, @Render() decorator, setViewEngineDir(), Convention /views, /views/layouts, /views/partials, DanetApplication (fichiers statiques), useStaticAssets()

### Community 19 - "AuthModule"
Cohesion: 0.67
Nodes (4): AuthModule, AuthService, UsersModule, UsersService

### Community 20 - "useClass provider"
Cohesion: 0.67
Nodes (3): ConfigService (useClass example), Standard injectables shorthand, useClass provider

### Community 21 - "SSEEvent (CustomEvent subclass)"
Cohesion: 0.67
Nodes (3): close event terminates the stream, SSEEvent (CustomEvent subclass), SSEMessage interface

### Community 25 - "@Module() decorator"
Cohesion: 0.20
Nodes (12): Controller scopes, GLOBAL_GUARD token, Dependency Injection, Injectable scopes, IoC container, Provider registration, SOLID principles, Feature module (+4 more)

### Community 26 - "SpecBuilder security definitions"
Cohesion: 0.18
Nodes (7): @ApiBearerAuth(), @ApiSecurity() decorator, SpecBuilder security definitions, AuthGuard interface, Authorization, JWT Guard recipe, SimpleAuthGuard

### Community 27 - "Overview"
Cohesion: 0.22
Nodes (8): Custom path, Installation, Limitations, Options, Overview, Playground, Quickstart, Startup validation

### Community 28 - "Resolvers"
Cohesion: 0.29
Nodes (6): `@Args`, `@Context`, Error shaping, Guards, `@Query` and `@Mutation`, Resolvers

### Community 29 - "RabbitMQModule.forRoot"
Cohesion: 0.29
Nodes (5): DynamicModule, RabbitMQ exchanges, @OnRabbitMQMessage() binding options, @OnRabbitMQMessage() decorator, RabbitMQModule.forRoot()

### Community 30 - "Exceptions layer"
Cohesion: 0.33
Nodes (6): TodoController, Exceptions layer, HttpException and built-in HTTP exceptions, Automatic acknowledgements, noAck consume option, prefetch (QoS)

### Community 31 - "Application host"
Cohesion: 0.50
Nodes (3): Application host, Injecting the application, Mounting a route from a module hook

### Community 32 - "@Injectable() decorator"
Cohesion: 0.50
Nodes (4): @Injectable() decorator, TodoService, RabbitMQ injectable, RabbitMQ.sendMessage()

## Ambiguous Edges - Review These
- `hono cors middleware` → `Topic matching via Hono smart router`  [AMBIGUOUS]
  src/websockets/controllers.md · relation: conceptually_related_to
- `Danet pillars: Secure, Intuitive, Extensible` → `Documentation NestJS (citation)`  [AMBIGUOUS]
  src/index.md · relation: conceptually_related_to
- `Section Vue d'ensemble (FR)` → `Danet home page`  [AMBIGUOUS]
  src/index.md · relation: references
- `Danet CLI` → `Root module`  [AMBIGUOUS]
  src/overview/first-steps.md · relation: conceptually_related_to

## Knowledge Gaps
- **130 isolated node(s):** `Options`, `SidebarItem`, `META_TITLE`, `META_URL`, `META_DESCRIPTION` (+125 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `hono cors middleware` and `Topic matching via Hono smart router`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Danet pillars: Secure, Intuitive, Extensible` and `Documentation NestJS (citation)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Section Vue d'ensemble (FR)` and `Danet home page`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `Danet CLI` and `Root module`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `@OnWebSocketMessage() decorator` connect `ThrottlerGuard` to `Techniques section config`, `SwaggerModule`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `Techniques section config` connect `Techniques section config` to `ScheduleModule`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `HTTPContext` connect `HTTPContext` to `Danet Framework`, `ExceptionFilter interface`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._