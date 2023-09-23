---
label: Deno's Fresh Integration
order: 4
---
## Introdução

Fresh representa a próxima geração de frameworks web, construído para ser veloz, confiável e simples.

Algumas características marcantes:

- Renderização just-in-time na borda.
- Hidratação do cliente baseada em ilha para interatividade máxima.
- Sem sobrecarga de tempo de execução: nenhum JS é enviado ao cliente por padrão.
- Sem etapa de compilação.
- Nenhuma configuração necessária.
- Suporte ao TypeScript desde o início.
- Roteamento de sistema de arquivos ao estilo do Next.js.

::: info **Dica**
Saiba mais no [site oficial do Deno Fresh](https://fresh.deno.dev/)
:::


## Integração com o Danet

Acreditamos que o Fresh é um framework incrível para o frontend, graças à renderização do lado do servidor (SSR) com hidratação parcial, roteamento de sistema de arquivos e suporte ao TypeScript.

No entanto, na nossa opinião, ele carece de recursos especializados para o backend que permitam aos desenvolvedores construir uma arquitetura de backend de nível empresarial com flexibilidade e robustez.

Ao mesmo tempo, o Danet carece de recursos especializados para construir frontends incríveis.

É por isso que trabalhamos para fornecer uma maneira de executar ambos, no mesmo processo. Permitindo que você renderize páginas incríveis com o Fresh enquanto tem um código de lógica de negócios/API robusto que também pode ser usado no Fresh SSR para a primeira renderização.

Existem duas maneiras de fazer isso:

- Servir conteúdo do Fresh a partir do caminho `/` e seus pontos de extremidade de API a partir de um prefixo dedicado, como `/api`.
- Servir conteúdo do Fresh a partir de um prefixo dedicado, como `/dashboard`, e seus pontos de extremidade de API a partir da raiz `/`.


::: danger **Implantação**
Até que o Deno Deploy lide com a opção do compilador `emitDecoratorMetadata`, ou o Fresh lide com o empacotamento, não há como implantar um aplicativo Danet com integração Fresh no Deno Deploy se você usar uma instância de `DanetApplication` nas ilhas do Fresh.
:::

## Configuração de Pastas e Arquivos

Boas notícias, há pouca ou nenhuma mudança na estrutura de pastas do seu aplicativo Danet ou Fresh!

Suponha que você tenha um `danet-app` (gerado pelo nosso CLI) e um `fresh-app` (gerado em [fresh getting-started](https://fresh.deno.dev/#getting-started)) lado a lado da seguinte forma:

![Screenshot 2023-04-16 às 17 08 48](https://user-images.githubusercontent.com/38007824/232283998-89510982-c917-474f-9a25-b80bbb8fc301.png)


Mova `fresh-app` para dentro de `danet-app/src` (não mostramos todos os arquivos que existem para fins de clareza):

![Screenshot 2023-04-16 às 17 08 13](https://user-images.githubusercontent.com/38007824/232283976-e4551764-8333-463a-a003-47dee910a44b.png)


Você pode excluir `fresh-app/dev.ts` e `fresh-app/main.ts`, mas lembre-se dos plugins que você usa em `fresh-app/main.ts` para passá-los como parâmetros ao habilitar o Fresh no seu aplicativo Danet.

## Fresh a partir da raiz

Para habilitar o Fresh a partir de `/`, use a chamada do nosso Módulo Fresh: `FreshModule.enableFreshFromRoot` a partir do seu `DanetApplication`, **ANTES** de chamar `.init`.
Os argumentos deste método são:
- Seu DanetApplication
- URL da pasta Fresh
- o prefixo de onde você deseja que as rotas do Danet sejam acessíveis
- Objeto de configuração de início do Fresh.:

```ts bootstrap.ts
import { AppModule } from './app.module.ts';
import { DanetApplication } from 'danet/mod.ts';
import { configAsync } from 'dotenv/mod.ts';
import twindConfig from "./dashboard/twind.config.ts";
import twindPlugin from "$fresh/plugins/twind.ts";
import { FreshModule } from "danet-fresh/mod.ts";

export const application = new DanetApplication();
export const bootstrap = async () => {
    await configAsync({export: true});

    const freshAppDirectory = new URL('./fresh-app/', import.meta.url);
    await FreshModule.enableFreshOnRoot(application, freshAppDirectory, '/api', {plugins: [twindPlugin(twindConfig)]});

    await application.init(AppModule);

    return application;
};

```
::: info **Dica**
`danet-fresh/mod.ts` está declarado no mapa de importação para apontar para https://deno.land/x/danet_fresh/
:::


## Fresh a partir de um caminho específico

Para habilitar o Fresh a partir de um caminho específico, simplesmente chame: `.enableFresh` no seu `DanetApplication`, **ANTES** de chamar `.init`.
Os argumentos deste método são:
- Seu DanetApplication
- URL da pasta Fresh
- o prefixo de onde você deseja que as rotas do Fresh sejam acessíveis
- Objeto de configuração de início do Fresh.:

```ts bootstrap.ts
import { AppModule } from './app.module.ts';
import { DanetApplication } from 'danet/mod.ts';
import { configAsync } from 'dotenv/mod.ts';
import twindConfig from "./dashboard/twind.config.ts";
import twindPlugin from "$fresh/plugins/twind.ts";
import { FreshModule } from "danet-fresh/mod.ts";

export const application = new DanetApplication();
export const bootstrap = async () => {
 await configAsync({ export: true });
 
 const freshAppDirectory = new URL('./fresh-app/', import.meta.url);
 await FreshModule.enableFresh(application, freshAppDirectory, '/dashboard', { plugins: [twindPlugin(twindConfig)] });
 
 await application.init(AppModule);
 
 return application;
};

```

::: info **Dica**
`danet-fresh/mod.ts` está declarado no mapa de importação para apontar para [https://deno.land/x/danet_fresh/](https://deno.land/x/danet_fresh/)
:::


## Exemplo de Trabalho

Há um [branch específico no nosso projeto inicial](https://github.com/Savory/Danet-Starter/tree/fresh-integration) com uma aplicação Fresh de demonstração na pasta `src/dashboard`, servido a partir da raiz.

Confira, se necessário!

