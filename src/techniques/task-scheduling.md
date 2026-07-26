---
label: Task Scheduling
order: 50
---
### Task Scheduling

**Task scheduling** allows you to schedule arbitrary code (methods/functions) to execute at a fixed date/time, at recurring intervals, or once after a specified interval. In the Linux world, this is often handled by packages like [cron](https://en.wikipedia.org/wiki/Cron) at the OS level. For Deno apps, we have a native module (yet in `unstable`) called [`Deno.cron`](https://docs.deno.com/api/deno/~/Deno.cron), to provide cron-like functionality 

References: 
- https://docs.deno.com/api/deno/~/Deno.cron
- https://docs.deno.com/deploy/kv/manual/cron/
- https://docs.nestjs.com/techniques/task-scheduling

#### Installation

No need to install an extra module, you can import it from `jsr:@danet/core`

To activate job scheduling, import the `ScheduleModule` into the root `AppModule`:

```typescript app.module.ts
import { ScheduleModule, Module } from 'jsr:@danet/core';

@Module({
  imports: [ScheduleModule],
})
export class AppModule {}
```

Registration occurs when the `onAppBootstrap` lifecycle hook occurs, ensuring that all modules have loaded and declared any scheduled jobs.

::: warning Enable the unstable API
`@Cron()` calls `Deno.cron()`, which is still behind a flag. Run your app with
`--unstable-cron`, or add `"unstable": ["cron"]` to your `deno.json`. `@Interval()`
and `@Timeout()` use plain timers and need no flag.
:::

::: info Where scheduled methods are looked for
We scan the classes registered in the `injectables` array of your modules.
Controllers are not scanned, so put your scheduled methods on an injectable.
:::

#### Declarative cron jobs

A cron job schedules an arbitrary function (method call) to run automatically. Cron jobs can run:

- Once, at a specified date/time.
- On a recurring basis; recurring jobs can run at a specified instant within a specified interval (for example, once per hour, once per week, once every 5 minutes)

Declare a cron job with the `@Cron()` decorator preceding the method definition containing the code to be executed, as follows:

```typescript tasks.service.ts
import { Cron, Injectable, Logger } from 'jsr:@danet/core';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron('45 * * * *')
  handleCron() {
    this.logger.log('Called when the current minutes is 45');
  }
}
```

In this example, the `handleCron()` method will be called each time the current minutes is `45`. In other words, the method will be run once per hour, at the 45 minute mark.

The `@Cron()` decorator supports all standard [cron patterns](http://crontab.org/):

- Asterisk (e.g. `*`)
- Ranges (e.g. `1-3,5`)
- Steps (e.g. `*/2`)

In the example above, we passed `45 * * * *` to the decorator. The following key shows how each position in the cron pattern string is interpreted:

<pre class="language-javascript"><code class="language-javascript">
* * * * *
| | | | |
| | | | day of week
| | | months
| | day of month
| hours
minutes
</code></pre>

Some sample cron patterns are:

<table>
  <tbody>
    <tr>
      <td><code>10 * * * *</code></td>
      <td>every hour, at the start of the 10th minute</td>
    </tr>
    <tr>
      <td><code>*/30 9-17 * * *</code></td>
      <td>every 30 minutes between 9am and 5pm</td>
    </tr>
   <tr>
      <td><code>30 11 * * 1-5</code></td>
      <td>Monday to Friday at 11:30am</td>
    </tr>
  </tbody>
</table>

Like `@nestjs/schedule` package, we also provides a convenient enum with commonly used cron patterns. You can use this enum as follows:

```typescript tasks.service.ts
import { Cron, CronExpression, Injectable, Logger } from 'jsr:@danet/core';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_30_MINUTES)
  handleCron() {
    this.logger.log('Called every 30 minutes');
  }
}
```

In this example, the `handleCron()` method will be called every `30` minutes.

::: warning What `Deno.cron` accepts
`CronExpression` is inherited from `@nestjs/schedule`, which uses a six field
syntax with a leading seconds field. `Deno.cron` only parses **five fields**, its
day of week is **1 to 7** (Sunday is `7`, not `0`) and its month is **1 to 12**.
Entries such as `EVERY_WEEK`, `EVERY_WEEKEND`, `EVERY_YEAR`, the
`EVERY_30_MINUTES_BETWEEN_*` group and the whole `MONDAY_TO_FRIDAY_*` group are
rejected with `Invalid cron schedule` when the app boots. When in doubt, write
the five field string yourself.
:::

::: info Job names must be unique
The name we give the job is the **name of the method**. `Deno.cron` refuses two
jobs with the same name, so two methods called `cleanUp()` in two different
injectables will fail at boot with `Cron with this name already exists`.
:::

#### Declarative intervals

To declare that a method should run at a (recurring) specified interval, prefix the method definition with the `@Interval()` decorator. Pass the interval value, as a number in milliseconds, to the decorator as shown below:

```typescript tasks.service.ts
@Interval(10000)
handleInterval() {
  this.logger.log('Called every 10 seconds');
}
```

> info **Hint** This mechanism uses the JavaScript `setInterval()` function under the hood. You can also utilize a cron job to schedule recurring jobs.


#### Declarative timeouts

To declare that a method should run (once) at a specified timeout, prefix the method definition with the `@Timeout()` decorator. Pass the relative time offset (in milliseconds), from application startup, to the decorator as shown below:

```typescript tasks.service.ts
@Timeout(5000)
handleTimeout() {
  this.logger.log('Called once after 5 seconds');
}
```

> info **Hint** This mechanism uses the JavaScript `setTimeout()` function under the hood.


#### Dynamic schedule module API

> **Warning 🚧** this module does not support **dynamic scheduling** yet.

#### Example

A working example is available [here](https://github.com/Savory/Danet/blob/main/example/schedule.ts).
