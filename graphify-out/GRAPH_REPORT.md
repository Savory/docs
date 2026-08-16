# Graph Report - docs  (2026-08-16)

## Corpus Check
- Corpus is ~36,600 words - fits in a single context window. You may not need a graph.

## Summary
- 486 nodes · 579 edges · 25 communities (23 shown, 2 thin omitted)
- Extraction: 80% EXTRACTED · 19% INFERRED · 1% AMBIGUOUS · INFERRED: 110 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- RabbitMQ Messaging and HTTP Techniques
- Guards and Dependency Injection (FR)
- OpenAPI and Swagger
- Execution Context and Injection Scopes
- JWT Guard Recipe and Rate Limiting
- Danet CLI and Deno Deploy
- Middleware Guards and gRPC
- Project Lineage and Exception Filters
- Databases KV Queue and Throttler Storage
- VitePress Config and Sidebar Generation
- Middleware and HTTP Techniques (FR)
- Introduction and V1 to V2 Migration
- Documentation Site Conventions
- Dynamic Modules and RabbitMQ Exchanges
- Site Package Dependencies
- OpenAPI Types and Controllers
- Custom Providers and Dynamic Modules
- WebSockets and Zod Validation
- View Rendering and Static Files (FR)
- Dynamic Module Example Services
- useClass Provider Example
- Server-Sent Events Types
- Module Encapsulation Notes
- WebSocket Parameter Decorators

## God Nodes (most connected - your core abstractions)
1. `Techniques section config` - 9 edges
2. `@Controller()` - 7 edges
3. `@Injectable() decorator (FR)` - 7 edges
4. `DI fundamentals` - 7 edges
5. `@GrpcController()` - 7 edges
6. `@danet/grpc package` - 7 edges
7. `@Module() decorator` - 7 edges
8. `Danet CLI` - 6 edges
9. `SwaggerModule` - 6 edges
10. `Injection de dependance` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Automatic Module Wiring` --semantically_similar_to--> `Auto-generated Sidebar`  [INFERRED] [semantically similar]
  src/cli.md → CLAUDE.md
- `Fondamentaux Section` --implements--> `Section index.yml Config`  [INFERRED]
  src/fr/fundamentals/index.yml → CLAUDE.md
- `Migration Section (FR)` --implements--> `Section index.yml Config`  [INFERRED]
  src/fr/migration/index.yml → CLAUDE.md
- `OPENAPI Section (FR)` --implements--> `Section index.yml Config`  [INFERRED]
  src/fr/openapi/index.yml → CLAUDE.md
- `Locale Mirrored Subtree` --references--> `Danet Home Page (FR)`  [INFERRED]
  CLAUDE.md → src/fr/index.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **CLI scaffolding and automatic wiring flow** — src_cli_danet_generate, src_cli_schematics, src_cli_automatic_module_wiring, src_cli_skip_import, src_cli_path_option [EXTRACTED 1.00]
- **Bundle-then-deploy pipeline for Deno Deploy** — src_deno_deploy_danet_deploy, src_deno_deploy_danet_bundle, src_deno_deploy_deployctl, src_deno_deploy_github_action_workflow [EXTRACTED 1.00]
- **Decorator-driven OpenAPI document generation** — src_fr_openapi_introduction_swaggermodule, src_fr_openapi_introduction_specbuilder, src_fr_openapi_types_and_parameters_apiproperty, src_fr_openapi_types_and_parameters_returnedtype, src_fr_openapi_security_apisecurity, src_fr_openapi_operations_tag [EXTRACTED 1.00]
- **Dynamic ConfigModule configuration flow: register() binds options as a useValue injectable that ConfigService receives via @Inject** — src_fundamentals_dynamic_modules_configmodule, src_fundamentals_dynamic_modules_register, src_fundamentals_dynamic_modules_config_options_token, src_fundamentals_dynamic_modules_configservice, src_fundamentals_custom_injectables_inject_decorator, src_fundamentals_dynamic_modules_injectable_order [EXTRACTED 1.00]
- **Metadata-driven authorization: a custom @Roles decorator sets metadata that a guard reads through ExecutionContext and MetadataHelper** — src_fundamentals_execution_context_setmetadata, src_fundamentals_execution_context_roles_decorator, src_fundamentals_execution_context_metadatahelper, src_fundamentals_execution_context_getclass, src_fundamentals_execution_context_gethandler, src_fr_overview_guards_canactivate [EXTRACTED 1.00]
- **gRPC transport reuses the whole Danet pipeline: proto loading, controller decorators, DI, guards and exception mapping around a GrpcServer booted before app.init()** — src_grpc_overview_grpcserver, src_grpc_controllers_loadproto, src_grpc_controllers_grpccontroller, src_grpc_controllers_grpcmethod, src_grpc_error_handling_exception_mapping, src_grpc_controllers_global_guard_caveat [EXTRACTED 1.00]
- **OpenAPI document generation flow** — src_openapi_introduction_specbuilder, src_openapi_introduction_createdocument, src_openapi_introduction_setup, src_openapi_types_and_parameters_apiproperty, src_openapi_operations_tag [EXTRACTED 1.00]
- **Danet request lifecycle: middleware, guard, handler, exception filter** — src_overview_middlewares_danetmiddleware, src_overview_guards_authguard, src_overview_controllers_routing, src_overview_controllers_response_object, src_overview_exception_filters_exceptions_layer [INFERRED 0.85]
- **RabbitMQ publish/consume flow** — src_rabbitmq_overview_rabbitmqmodule, src_rabbitmq_overview_sendmessage, src_rabbitmq_overview_onrabbitmqmessage, src_rabbitmq_exchanges_and_acknowledgements_exchanges, src_rabbitmq_exchanges_and_acknowledgements_acknowledgements [EXTRACTED 1.00]
- **Decorator-driven message consumption across EventEmitter, KV Queue and RabbitMQ** — src_techniques_events_onevent, src_techniques_kvqueue_onqueuemessage, src_rabbitmq_publishing_and_consuming_onrabbitmqmessage, src_techniques_kvqueue_queueevent, src_techniques_events_in_process_only [EXTRACTED 1.00]
- **Throttling pipeline: module config, global guard, tracker and pluggable storage** — src_techniques_rate_limiting_throttlermodule, src_techniques_rate_limiting_throttlerguard, src_techniques_rate_limiting_global_guard, src_techniques_rate_limiting_gettracker, src_techniques_rate_limiting_throttlerstorage, src_techniques_rate_limiting_throttlerexception [EXTRACTED 1.00]
- **WebSocket message pipeline: controller, middleware, guard, handler, exception filter** — src_websockets_controllers_websocketcontroller, src_websockets_middlewares_danetmiddleware, src_websockets_guards_useguard, src_websockets_controllers_onwebsocketmessage, src_websockets_exception_filters_wsexceptionfilter, src_websockets_controllers_execution_context [INFERRED 0.85]

## Communities (25 total, 2 thin omitted)

### Community 0 - "RabbitMQ Messaging and HTTP Techniques"
Cohesion: 0.05
Nodes (46): RabbitMQ Publishing & Consuming (doc), Broker back-pressure signal (false return), Bootstrap injectable scanning for consumers, Queue-name-as-contract decoupling, One handler per message type, @OnRabbitMQMessage decorator, RabbitMQ.publish(exchange, routingKey, data, ...), RabbitMQ service (+38 more)

### Community 1 - "Guards and Dependency Injection (FR)"
Cohesion: 0.06
Nodes (41): AuthGuard (interface), GLOBAL_GUARD, SimpleAuthGuard, TokenInjector, Section Vue d'ensemble (FR), Guide Angular Dependency Injection (citation), Injection de dependance, @Injectable() decorator (FR) (+33 more)

### Community 2 - "OpenAPI and Swagger"
Cohesion: 0.05
Nodes (37): SwaggerModule.createDocument(), DanetApplication (OpenAPI bootstrap), SpecBuilder, @ApiBearerAuth(), @ApiSecurity() decorator, SpecBuilder security definitions, @Controller() decorator, DanetApplication (+29 more)

### Community 3 - "Execution Context and Injection Scopes"
Cohesion: 0.07
Nodes (30): ExecutionContext, MetadataHelper, @Roles() Custom Decorator, @SetMetadata(), Fondamentaux Section, beforeControllerMethodIsCalled, Injection Scope, Scope.GLOBAL (+22 more)

### Community 4 - "JWT Guard Recipe and Rate Limiting"
Cohesion: 0.07
Nodes (34): Recipes section config, JWT Guard recipe (doc), AuthGuard interface, canActivate(context), ExecutionContext, HMAC shared secret vs RSA/ECDSA key pair, jose library (jwtVerify / SignJWT), JwtAuthGuard (+26 more)

### Community 5 - "Danet CLI and Deno Deploy"
Cohesion: 0.08
Nodes (28): Automatic Module Wiring, Danet CLI, danet develop / danet start, danet generate (g), danet new, Database Provider Options, deno.json Import Map, --path option (+20 more)

### Community 6 - "Middleware Guards and gRPC"
Cohesion: 0.09
Nodes (26): canActivate(), ExecutionContext (dans les guards FR), DanetMiddleware (interface), Middleware fonctionnel, LoggerMiddleware, @Middleware() decorator, GreeterController, @GrpcController() (+18 more)

### Community 7 - "Project Lineage and Exception Filters"
Cohesion: 0.08
Nodes (23): Angular (architectural ancestor), NestJS (inspiration), Danet Documentation MIT License, NestJS Documentation License, AllExceptionsFilter, @Catch() decorator, CustomExceptionFilter, ExceptionFilter interface (+15 more)

### Community 8 - "Databases KV Queue and Throttler Storage"
Cohesion: 0.08
Nodes (26): Database Providers (doc), collectionName constructor attribute, @danet/database module, getSecondaryKeys(), KvRepository<T>, KvService, KvVoteRepository (SAASKIT example), onAppBootstrap / onAppClose connection lifecycle (+18 more)

### Community 9 - "VitePress Config and Sidebar Generation"
Cohesion: 0.10
Nodes (17): { generateSidebar }, Options, SidebarItem, VitePressSidebar, enConfig, META_DESCRIPTION, META_TITLE, META_URL (+9 more)

### Community 10 - "Middleware and HTTP Techniques (FR)"
Cohesion: 0.10
Nodes (23): Garde (Guard), @UseGuard() decorator, Contexte Hono, Middleware Danet (FR), Compression des reponses, hono compress middleware, CORS (partage de ressources entre origines), enableCors() (+15 more)

### Community 11 - "Introduction and V1 to V2 Migration"
Cohesion: 0.10
Nodes (19): Danet Framework, Deno Runtime, Hono HTTP Framework, Danet Philosophy, Hono (V2 HTTP engine), Migration from Danet V1 to V2, Oak (V1 HTTP engine), Migration Docs Section (+11 more)

### Community 12 - "Documentation Site Conventions"
Cohesion: 0.12
Nodes (18): Fence-with-filename Code Blocks, Danet Documentation Site, ignoreDeadLinks, Locale Mirrored Subtree, Page Frontmatter Convention, Section index.yml Config, Auto-generated Sidebar, VitePress (+10 more)

### Community 13 - "Dynamic Modules and RabbitMQ Exchanges"
Cohesion: 0.12
Nodes (16): DynamicModule, RabbitMQ exchanges, RabbitMQ module limitations, @OnRabbitMQMessage() binding options, Cross-language wire format, RabbitMQ Docs Section, amqplib, @danet/rabbitmq package (+8 more)

### Community 14 - "Site Package Dependencies"
Cohesion: 0.12
Nodes (16): front-matter, js-yaml, dependencies, front-matter, js-yaml, @types/js-yaml, vitepress-plugin-pagefind, devDependencies (+8 more)

### Community 15 - "OpenAPI Types and Controllers"
Cohesion: 0.15
Nodes (17): HonoRequest, HTTPContext, @ApiProperty() decorator, @BodyType() decorator, CreateTodoDto (OpenAPI model), @Optional() decorator, @QueryType() decorator, @ReturnedType() decorator (+9 more)

### Community 16 - "Custom Providers and Dynamic Modules"
Cohesion: 0.24
Nodes (11): 'CONNECTION' token, @Inject() decorator, Non-class-based provider tokens, TodoController (custom injectables), TodoService (custom injectables), useValue provider, 'CONFIG_OPTIONS' token, ConfigModule (+3 more)

### Community 17 - "WebSockets and Zod Validation"
Cohesion: 0.24
Nodes (11): @Body() (websocket message data), Zod Body and Query Validation (doc), @Body(schema) from @danet/zod, @Query(schema) from @danet/zod, Zod schema + z.infer typing pattern, Zod section config, Zod OpenAPI (doc), extendZodWithOpenApi (+3 more)

### Community 18 - "View Rendering and Static Files (FR)"
Cohesion: 0.33
Nodes (6): Moteur de template Handlebars, @Render() decorator, setViewEngineDir(), Convention /views, /views/layouts, /views/partials, DanetApplication (fichiers statiques), useStaticAssets()

### Community 19 - "Dynamic Module Example Services"
Cohesion: 0.67
Nodes (4): AuthModule, AuthService, UsersModule, UsersService

### Community 20 - "useClass Provider Example"
Cohesion: 0.67
Nodes (3): ConfigService (useClass example), Standard injectables shorthand, useClass provider

### Community 21 - "Server-Sent Events Types"
Cohesion: 0.67
Nodes (3): close event terminates the stream, SSEEvent (CustomEvent subclass), SSEMessage interface

## Ambiguous Edges - Review These
- `Section Vue d'ensemble (FR)` → `Danet home page`  [AMBIGUOUS]
  src/index.md · relation: references
- `Documentation NestJS (citation)` → `Danet pillars: Secure, Intuitive, Extensible`  [AMBIGUOUS]
  src/index.md · relation: conceptually_related_to
- `Danet CLI` → `Root module`  [AMBIGUOUS]
  src/overview/first-steps.md · relation: conceptually_related_to
- `hono cors middleware` → `Topic matching via Hono smart router`  [AMBIGUOUS]
  src/websockets/controllers.md · relation: conceptually_related_to

## Knowledge Gaps
- **117 isolated node(s):** `Options`, `SidebarItem`, `META_TITLE`, `META_URL`, `META_DESCRIPTION` (+112 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Section Vue d'ensemble (FR)` and `Danet home page`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `Documentation NestJS (citation)` and `Danet pillars: Secure, Intuitive, Extensible`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Danet CLI` and `Root module`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `hono cors middleware` and `Topic matching via Hono smart router`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `@OnWebSocketMessage() decorator` connect `JWT Guard Recipe and Rate Limiting` to `RabbitMQ Messaging and HTTP Techniques`, `WebSockets and Zod Validation`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `Techniques section config` connect `RabbitMQ Messaging and HTTP Techniques` to `Databases KV Queue and Throttler Storage`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `HTTPContext` connect `OpenAPI Types and Controllers` to `Introduction and V1 to V2 Migration`, `Project Lineage and Exception Filters`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._