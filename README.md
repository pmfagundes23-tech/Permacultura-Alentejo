# 🌿 Permacultura Alentejo

PWA comunitária e sem fins lucrativos — uma ferramenta de desenho em
permacultura para o Alentejo (Portugal), pensada para quem não tem
conhecimento prévio: lê o teu terreno, entende os princípios, e chega a
recomendações de plantio viáveis para o clima mediterrânico da região.

## Funcionalidades

1. **🔮 Oráculo Permacultural** — chat com IA especializada, responde sempre
   em 3 passos (Zoneamento → Água/Solo → Plantio). Funciona com ou sem chave
   de API (ver abaixo).
2. **🌿 Explorador de Plantas** — catálogo de 50 espécies documentadas
   (esquema `Plant`), com pesquisa e filtros por estrato, função ecológica,
   tolerância à seca e época de plantio. Quando existe um Perfil do Terreno
   preenchido, cada planta mostra a sua **% de compatibilidade** e a lista
   ordena-se por essa pontuação — sempre com as razões visíveis.
3. **📖 Guias Práticos / 🧭 Bússola** — guias em Markdown (Mulching, Swales) e
   a Bússola: as 3 éticas + 12 princípios de David Holmgren, cada um com uma
   pergunta que provoca reflexão e um exemplo aplicado ao Alentejo.
4. **🧭 Meu Terreno** — formulário em acordeão para o Perfil do Terreno
   (identificação, localização, clima, água, solo, vegetação, objetivos da
   pessoa), com botão de geolocalização e avisos legais automáticos para
   sobreiro/azinheira (espécies protegidas). Guardado em `localStorage`.

### `species_match` — como funciona a compatibilidade

`src/lib/speciesMatch.ts` cruza o Perfil do Terreno com cada planta usando
regras explicáveis (água disponível vs. tolerância à seca, textura do solo,
exposição solar, frio, manutenção vs. presença no terreno, objetivos da
pessoa) e devolve sempre uma lista de razões — nunca só um número. Espécies
com `invasive_status: "proibida por lei"` são automaticamente bloqueadas
(score 0).

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

> O Oráculo ainda não recebe o Perfil do Terreno como contexto — está no
> roadmap (fase 3), ver secção abaixo.

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
    ExploradorPlantas.tsx    # catálogo + species_match
    GuiasPraticos.tsx        # guias práticos + Bússola (princípios)
    PerfilTerreno.tsx        # formulário "Meu Terreno" (Site)
    PwaRegister.tsx
  data/
    plantas-v2.ts        # 50 espécies no esquema Plant (chaves em inglês)
    guias.ts             # 2 guias em Markdown embutidos
    principios.ts         # 3 éticas + 12 princípios (Bússola)
    site-opcoes.ts         # listas de opções para os campos do Perfil do Terreno
    systemPrompt.ts       # persona/regras do Oráculo
  lib/
    site-storage.ts       # leitura/escrita do Perfil do Terreno (localStorage)
    speciesMatch.ts        # motor do computed.species_match
  types/
    index.ts              # tipos de UI (Guia, Mensagem, AbaId)
    schema.ts              # esquema de dados (Site, Plant, Principle, Design, Observation, computed)
```

## Roadmap

Este projeto segue uma especificação faseada. O que já está feito:

- ✅ **Fase 1 (MVP)**: Perfil do Terreno, catálogo de 50 espécies, filtros por
  função/estrato/água/época, `species_match` com justificação visível,
  secção de princípios (Bússola).
- ⏸️ **Fase 2** (por fazer): simulador com mapa de satélite e desenho de
  zonas/plantio, validações automáticas completas (`spacing`,
  `water_deficit`, `monoculture`, ...), `computed.water_budget` e `sun_path`.
- ⏸️ **Fase 3** (por fazer): Oráculo com o Perfil do Terreno como contexto
  real, caderno de campo offline, calendário mensal de tarefas.
- ⏸️ **Fase 4** (por fazer): guildas pré-desenhadas, partilha pública de
  desenhos, alargamento a todo o Portugal continental.

## Paleta de cores

| Nome  | Hex       |
|-------|-----------|
| Bege  | `#F5F5DC` |
| Oliva | `#556B2F` |
| Terra | `#8B4513` |
| Areia | `#E6DFD5` |

Definidas em `tailwind.config.js` como `bege`, `oliva`, `terra`, `areia`.
