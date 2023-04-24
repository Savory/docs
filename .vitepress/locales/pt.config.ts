import type { DefaultTheme, LocaleSpecificConfig } from "vitepress";
import { sidebar } from "../sidebar";

export const META_TITLE = "Danet";
export const META_URL = "https://docs.danet.land";
export const META_DESCRIPTION = "O framework backend mais maduro para Deno";

export const ptConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
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
          "pt": {
            translations: {
              button: {
                buttonText: "Pesquisar",
                buttonAriaLabel: "Pesquisar",
              },
              modal: {
                noResultsText: "Nenhum resultado para",
                resetButtonTitle: "Redefinir pesquisa",
                footer: {
                  navigateText: "Navegar",
                  selectText: "Selecionar",
                },
              },
            },
          },
        },
      },
    },
    editLink: {
      pattern: "https://github.com/savory/docs/edit/main/src/:path",
      text: "Sugerir alterações a esta página",
    },
    nav: [
      { text: "Início", link: "/pt/" },
      { text: "Documentação", link: "/pt/introduction/welcome" },
      {
        text: "Referências",
        items: [
          {
            text: "Discussões",
            link: "https://github.com/Savory/Danet/discussions",
          },
          // {
          //   text: "Log de Alterações",
          //   link: "https://github.com/Savory/Danet/blob/main/CHANGELOG.md",
          // },
        ],
      },
    ],
  },
};
