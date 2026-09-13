# 🌿 Permacultura Alentejo

PWA comunitária e sem fins lucrativos para partilha de conhecimento de
permacultura adaptado ao clima do Alentejo (Portugal).

## Funcionalidades

1. **🔮 Oráculo Permacultural** — chat com IA especializada, responde sempre
   em 3 passos (Zoneamento → Água/Solo → Plantio). Funciona com ou sem chave
   de API (ver abaixo).
2. **🌿 Explorador de Plantas** — catálogo de 30 espécies resilientes à seca,
   com pesquisa e filtros por camada, tolerância à seca e zona permacultural.
3. **📖 Guias Práticos** — leitor de guias em Markdown sobre Mulching e Swales.
4. **🗺️ Mapeamento Comunitário** — mapa estilizado com projetos no Alentejo e
   formulário "Registar a Minha Horta / Terreno" (guardado em `localStorage`).

## Como correr

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Ligar o Oráculo à API real da Anthropic (opcional)

Por omissão, `/api/chat` usa um **motor de simulação local (mock)** —
100% funcional, sem custos e sem necessidade de chave de API, ideal para
desenvolvimento e demonstrações.

Para usar o modelo Claude real:

```bash
cp .env.local.example .env.local
# edita .env.local e define:
# ANTHROPIC_API_KEY=sk-ant-...
```

Reinicia `npm run dev`. A rota deteta automaticamente a chave e passa a
chamar a API da Anthropic, mantendo o mesmo formato de resposta em 3 passos
(definido em `src/data/systemPrompt.ts`).

## PWA (instalável)

O projeto inclui `public/manifest.json` e `public/sw.js` (service worker
com cache de app-shell). Em produção (`npm run build && npm run start`),
o Chrome/Android/iOS deverão oferecer "Adicionar ao ecrã principal".

> Os ícones em `public/icons/` são SVGs de placeholder na paleta da marca —
> substitui por PNGs 192x192 e 512x512 próprios antes de publicar.

## Estrutura do projeto

```
src/
  app/
    layout.tsx          # layout raiz, metadata PWA
    page.tsx             # navegação principal (estado das 4 abas)
    globals.css
    api/chat/route.ts    # rota do Oráculo (Anthropic ou mock)
  components/
    Header.tsx
    BottomNav.tsx
    OraculoChat.tsx
    ExploradorPlantas.tsx
    GuiasPraticos.tsx
    MapaComunitario.tsx
    PwaRegister.tsx
  data/
    plantas.ts           # 30 espécies embutidas
    guias.ts             # 2 guias em Markdown embutidos
    concelhos.ts          # posições estilizadas dos concelhos no mapa
    systemPrompt.ts       # persona/regras do Oráculo
  types/
    index.ts
```

## Paleta de cores

| Nome  | Hex       |
|-------|-----------|
| Bege  | `#F5F5DC` |
| Oliva | `#556B2F` |
| Terra | `#8B4513` |
| Areia | `#E6DFD5` |

Definidas em `tailwind.config.js` como `bege`, `oliva`, `terra`, `areia`.
