---
label: CORS
order: 60
---

Le partage de ressources entre origines multiples (CORS) est un mécanisme qui permet de demander des ressources à partir d'un autre domaine. Sous le capot, Danet utilise [cors package pour Deno](https://deno.land/x/cors). Ce package fournit diverses options que tu peux personnaliser en fonction de tes besoins.

## Pour commencer

Pour activer CORS, appelle la méthode `enableCors()` sur l'objet d'application Danet.

```typescript
const app = new DanetApplication();
app.enableCors();
```

La méthode `enableCors()` prend un objet de configuration facultatif comme argument. Les propriétés disponibles de cet objet sont décrites dans la documentation officielle du [package CORS](https://deno.land/x/cors#configuration-options).