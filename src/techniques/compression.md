---
label: Compression
order: 30
---

Compression can greatly decrease the size of the response body, thereby increasing the speed of a web app.

For high-traffic websites in production, it is strongly recommended to offload compression from the application server - typically in a reverse proxy (e.g., Nginx). In that case, you should not use compression middleware.


## Usage

As Danet uses hono under the hood, you can use [hono_compress](https://hono.dev/middleware/builtin/compress).

Then, apply its middleware as global middleware (for example, in your `bootstrap.ts` file).

```typescript
import { compress } from 'https://deno.land/x/hono/middleware.ts'

const app = new DanetApplication();
app.use(compress());
```
::: tip **Hint**
Feel free to use any other compression middleware you like
:::
