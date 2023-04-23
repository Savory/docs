# Afficher du HTML

Créer des API c'est cool, mais parfois, on veut créer une application MVC simple qui affichera de l'HTML.

Pour cela, Danet intègre le moteur de template [Handlebars](https://handlebarsjs.com/).

## Avant d'écrire du code

### Crée les répertoires suivants à la racine de ton projet

```
/views
/views/layouts
/views/partials
```

::: info Info
Si tu veux mettre ces répertoires ailleurs, tu peux fournir le chemin vers `views` au moment de l'exécution avec `app.setViewEngineDir('mon/chemin/vers/views');`
:::

### Crée une mise en page par défaut appelée `main.hbs` avec le contenu suivant :

```handlebars
{{{body}}}
```

## Affichons des choses maintenant !

Tout d'abord, créons ton premier modèle appelé `hello.hbs` dans le répertoire `views`. Il affichera 2 variables passées depuis ton contrôleur.

```handlebars
<html>
  <head>
    <meta charset="utf-8" />
    <title>{{title}}</title>
  </head>
  <body>
    Hello
    {{name}}!
  </body>
</html>
```

Maintenant, disons à ton contrôleur qu'il doit rendre cette vue sur une route spécifique :

```ts
@Controller('nice-controller')
class MonControleur {
  @Render('hello')
  @Get('/')
  renderUnBeauHTML() {
    return { title: "le titre de la page", name: "monde" };
  }
}
```

Nous spécifions le modèle à utiliser avec le décorateur `@Render()`, et la valeur de retour de la méthode de la route est passée au modèle pour le rendu.

Note que la valeur de retour est un objet avec les propriétés `title` et `name`, correspondant aux espaces réservés `title` et `name` que nous avons utilisés dans le modèle.