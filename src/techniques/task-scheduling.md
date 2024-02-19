---
label: Task Scheduling
order: 50
---
### Task Scheduling

**Task scheduling** allows you to schedule arbitrary code (methods/functions) to execute at a fixed date/time, at recurring intervals, or once after a specified interval. In the Linux world, this is often handled by packages like [cron](https://en.wikipedia.org/wiki/Cron) at the OS level. For Deno apps, we have a native module (yet in `unstable`) called [`Deno.cron`](https://deno.land/api@v1.40.5?s=Deno.cron&unstable), to provide cron-like functionality 

References: 
- https://deno.land/api@v1.40.5?s=Deno.cron
- https://examples.deno.land/cron
- https://docs.nestjs.com/techniques/task-scheduling


#### Installation

No need to install an extra module, you can import it from `danet/mod.ts`

To activate job scheduling, import the `ScheduleModule` into the root `AppModule`:

```typescript
@@filename(app.module)
import { ScheduleModule, Module } from 'danet/mod.ts';

@Module({
  imports: [ScheduleModule],
})
export class AppModule {}
```

Registration occurs when the `onAppBootstrap` lifecycle hook occurs, ensuring that all modules have loaded and declared any scheduled jobs.

#### Declarative cron jobs

A cron job schedules an arbitrary function (method call) to run automatically. Cron jobs can run:

- Once, at a specified date/time.
- On a recurring basis; recurring jobs can run at a specified instant within a specified interval (for example, once per hour, once per week, once every 5 minutes)

Declare a cron job with the `@Cron()` decorator preceding the method definition containing the code to be executed, as follows:

```typescript
import { Cron, Injectable } from 'danet/mod.ts';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron('45 * * * *')
  handleCron() {
    this.logger.debug('Called when the current minutes is 45');
  }
}
```

In this example, the `handleCron()` method will be called each time the current minutes is `45`. In other words, the method will be run once per minute, at the 45 minute mark.

The `@Cron()` decorator supports all standard [cron patterns](http://crontab.org/):

- Asterisk (e.g. `*`)
- Ranges (e.g. `1-3,5`)
- Steps (e.g. `*/2`)

In the example above, we passed `45 * * * * *` to the decorator. The following key shows how each position in the cron pattern string is interpreted:

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

```typescript
import { Injectable, Logger, Cron, CronExpression  } from 'danet/mod.ts';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_30_MINUTES)
  handleCron() {
    this.logger.debug('Called every 30 minutes');
  }
}
```

In this example, the `handleCron()` method will be called every `30` minutes.

#### Declarative intervals

To declare that a method should run at a (recurring) specified interval, prefix the method definition with the `@Interval()` decorator. Pass the interval value, as a number in milliseconds, to the decorator as shown below:

```typescript
@Interval(10000)
handleInterval() {
  this.logger.debug('Called every 10 seconds');
}
```

> info **Hint** This mechanism uses the JavaScript `setInterval()` function under the hood. You can also utilize a cron job to schedule recurring jobs.


#### Declarative timeouts

To declare that a method should run (once) at a specified timeout, prefix the method definition with the `@Timeout()` decorator. Pass the relative time offset (in milliseconds), from application startup, to the decorator as shown below:

```typescript
@Timeout(5000)
handleTimeout() {
  this.logger.debug('Called once after 5 seconds');
}
```

> info **Hint** This mechanism uses the JavaScript `setTimeout()` function under the hood.


#### Dynamic schedule module API

> **Warning 🚧** this module does not support **dynamic scheduling** yet.

#### Example

A working example is available [here](https://github.com/Savory/Danet/blob/main/example/schedule.ts).
