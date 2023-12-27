---
label: Compression
order: 30
---

La compression peut considérablement réduire la taille du corps de réponse, augmentant ainsi la vitesse d'une application web.

Pour les sites Web à fort trafic en production, il est fortement recommandé de décharger la compression du serveur d'application - généralement dans un proxy inverse (par exemple, Nginx). Dans ce cas, tu ne dois pas utiliser de middleware de compression.

## Utilisation

Comme Danet utilise hono en interne, tu peux utiliser le package [hono_compress](https://hono.dev/middleware/builtin/compress).

Ensuite, applique son middleware en tant que middleware global (par exemple, dans ton fichier `bootstrap.ts`).

```typescript
import { compress } from 'https://deno.land/x/hono/middleware.ts'

const app = new DanetApplication();
app.use(compress());
```
::: tip **Astuce**
N'hésite pas à utiliser n'importe quel autre middleware de compression que tu aimes.
:::