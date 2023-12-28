import type { DefaultTheme, LocaleSpecificConfig } from "vitepress";
import { sidebar } from "../sidebar";

export const META_TITLE = "Danet";
export const META_URL = "https://docs.danet.land";
export const META_DESCRIPTION =
  "Le plus mature des framework backend pour Deno";

export const frConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
  description: META_DESCRIPTION,
  head: [
    ["meta", { property: "og:url", content: META_URL }],
    ["meta", { property: "twitter:url", content: META_URL }],
    ["meta", { property: "twitter:title", content: META_TITLE }],
    ["meta", { property: "og:description", content: META_DESCRIPTION }],
    ["meta", { property: "twitter:description", content: META_DESCRIPTION }],
    [
      "script",
      {
        "data-goatcounter": "https://danet.goatcounter.com/count",
        "src": "//gc.zgo.at/count.js",
        "async": "true",
      },
    ],
  ],
  themeConfig: {
    sidebar,
    search: {
      provider: "local",
      options: {
        locales: {
          "fr": {
            translations: {
              button: {
                buttonText: "Rechercher",
                buttonAriaLabel: "Rechercher",
              },
              modal: {
                noResultsText: "Pas de résultat",
                resetButtonTitle: "Réinitialiser la recherche",
                footer: {
                  selectText: "Pour sélectionner",
                  navigateText: "Pour naviguer",
                },
              },
            },
          },
        },
      },
    },
    editLink: {
      pattern: "https://github.com/savory/docs/edit/main/src/:path",
      text: "Suggérer des modifications à cette page",
    },
    nav: [
      { text: "Accueil", link: "/fr/" },
      { text: "Documentation", link: "/fr/introduction/welcome" },
      {
        text: 'v1 (legacy)',
        items: [
          {
            text: 'v2 (stable)',
            link: 'https://danet.land/'
          }
        ]
      },
      {
        text: "Liens",
        items: [
          {
            text: "Discussions",
            link: "https://github.com/Savory/Danet/discussions",
          },
          // {
          //   text: "Changelog",
          //   link: "https://github.com/Savory/Danet/blob/main/CHANGELOG.md",
          // },
        ],
      },
    ],
  },
};
