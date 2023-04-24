---
label: Fichiers statiques
---

Si tu veux que ton application Danet serve des fichiers statiques à partir d'un dossier spécifique, par exemple pour servir un fichier .png, tu dois simplement enregistrer le dossier en utilisant la méthode `useStaticAssets` de ton instance `DanetApplication` comme suit :

```ts
  const app = new DanetApplication();
  await app.init(MyModule);
  const staticAssetsPath = `${Deno.cwd()}/assets`;
  app.useStaticAssets(staticAssetsPath);
```