import { defineConfig } from 'vitepress'
import { sidebar } from "./sidebar.ts";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Danet",
  description: "The most mature backend framework for Deno",
  ignoreDeadLinks: true,
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
    search: {
      provider: 'local',
      options: {
        locales: {
          "fr": {
            translations: {
              button: {
                buttonText: 'Rechercher',
                buttonAriaLabel: 'Rechercher'
              },
              modal: {
                noResultsText: 'Pas de résultat',
                resetButtonTitle: 'Réinitialiser la recherche',
                footer: {
                  selectText: 'pour sélectionner',
                  navigateText: 'pour naviguer'
                }
              }
            }
          }
        }
      }
    },
    editLink: {
      pattern: 'https://github.com/savory/docs/edit/main/src/:path'
    },
    logo: '/danet-logo.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '' },
      { text: 'Documentation', link: 'welcome.md' }
    ],

    sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Savory/Danet' }
    ],
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
