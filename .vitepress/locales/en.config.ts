import type { DefaultTheme, LocaleSpecificConfig } from "vitepress";
import { sidebar } from "../sidebar";

export const META_TITLE = "Danet";
export const META_URL = "https://docs.danet.land";
export const META_DESCRIPTION = "The most mature backend framework for Deno";

export const enConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
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
    editLink: {
      pattern: "https://github.com/savory/docs/edit/main/src/:path",
      text: "Suggest changes to this page",
    },
    nav: [
      { text: "Home", link: "/" },
      { text: "Documentation", link: "/introduction/welcome" },
      {
        text: "Links",
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
