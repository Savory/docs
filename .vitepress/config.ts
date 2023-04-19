import { defineConfig } from 'vitepress'
import { sidebar } from "./sidebar.ts";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Danet",
  description: "The most mature backend framework for Deno",
  head: [
    [
        'script',
      {
      'data-goatcounter': "https://danet.goatcounter.com/count",
      'async': true,
      'src':"//gc.zgo.at/count.js"
      }
    ]
  ],
  srcDir: "src",
  themeConfig: {
    logo: '/danet-logo.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '' },
      { text: 'Documentation', link: 'welcome.md' }
    ],

    sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Savory/Danet' }
    ]
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      dir: 'en'
    },
    fr: {
      label: 'Français',
      lang: 'fr', // optional, will be added  as `lang` attribute on `html` tag
      link: '/fr/' // default /fr/ -- shows on navbar translations menu, can be external
    }
  }
})
