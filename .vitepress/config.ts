import { enConfig } from "./locales//en.config";
import { ptConfig } from "./locales/pt.config";
import { frConfig } from "./locales/fr.config";
import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/default-theme-config
// https://vitepress.dev/reference/site-config

export default defineConfig({
  ignoreDeadLinks: true,
  title: "Danet",
  srcDir: "src",
  themeConfig: {
    logo: "/danet-logo.png",
    search: {
      provider: "local",
    },
    socialLinks: [
      { icon: "twitter", link: "https://twitter.com/DanetFramework" },
      { icon: "discord", link: "https://discord.gg/Q7ZHuDPgjA" },
      { icon: "github", link: "https://github.com/Savory/Danet" }
    ],
  },
  locales: {
    root: {
      label: "English",
      lang: "en",
      link: "/",
      ...enConfig,
    },
    fr: {
      label: "Français",
      link: "/fr/",
      lang: "fr",
      ...frConfig,
    },
  },
});
