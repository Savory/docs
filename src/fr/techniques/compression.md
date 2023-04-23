---
label: Compression
order: 30
---

La compression peut considérablement réduire la taille du corps de réponse, augmentant ainsi la vitesse d'une application web.

Pour les sites Web à fort trafic en production, il est fortement recommandé de décharger la compression du serveur d'application - généralement dans un proxy inverse (par exemple, Nginx). Dans ce cas, tu ne dois pas utiliser de middleware de compression.

## Utilisation

Comme Danet utilise Oak en interne, tu peux utiliser le package [oak_compress](https://deno.land/x/oak_compress).

Ensuite, applique son middleware en tant que middleware global (par exemple, dans ton fichier `bootstrap.ts`).

```typescript
import { brotli } from "https://deno.land/x/oak_compress/mod.ts";

const app = new DanetApplication();
app.addGlobalMiddlewares(brotli());
// app.addGlobalMiddlewares(gzip());
// app.addGlobalMiddlewares(deflate());
```
::: tip **Astuce**
N'hésite pas à utiliser n'importe quel autre middleware de compression que tu aimes.
:::