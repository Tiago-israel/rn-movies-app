# Tasks: Home Performance

**Input**: Design documents from `specs/001-home-performance/`  
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Incluidos porque o spec exige validacao dos fluxos criticos (`FR-011`) e criterios mensuraveis de performance.

**Organization**: Tasks agrupadas por user story para implementacao e validacao independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependencia direta)
- **[Story]**: Mapeia para user story (`US1`, `US2`, `US3`)
- Cada task inclui caminho exato de arquivo

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar benchmark oficial e instrumentacao comum.

- [X] T001 Definir perfis oficiais de benchmark (rede/device/build) em `features/movies/constants/home-performance-benchmark.ts`
- [X] T002 Criar tipos de telemetria da Home em `features/movies/types/home-performance.ts`
- [X] T003 [P] Criar helper de captura de eventos de performance em `features/movies/services/home-performance-telemetry.ts`
- [X] T004 [P] Criar utilitario de medicao de tempo de conteudo util inicial em `features/movies/services/home-first-content-timer.ts`
- [X] T005 [P] Criar helper para taxa de sucesso de renderizacao da Home (>99%) em `features/movies/services/home-render-success-rate.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infra comum obrigatoria antes de qualquer user story.

**⚠️ CRITICAL**: Nenhum trabalho de user story deve iniciar antes desta fase.

- [X] T006 Implementar modelo de estado por bloco (loading/content/empty/error) em `features/movies/types/home-block-state.ts`
- [X] T007 Implementar mapper de estado de bloco para views em `features/movies/controllers/home-block-state-mapper.ts`
- [X] T008 [P] Integrar contrato de eventos `home_block_state` e `home_first_useful_content` em `features/movies/services/home-performance-telemetry.ts`
- [X] T009 [P] Criar strings i18n para loading/erro/vazio da Home em `features/movies/constants/home-status-messages.ts`
- [X] T010 [P] Definir requisitos de acessibilidade (labels/roles/hints) para estados da Home em `features/movies/constants/home-status-a11y.ts`
- [X] T011 Adicionar teste unitario de transicao de estado de bloco em `features/movies/controllers/__tests__/home-block-state-mapper.test.ts`

**Checkpoint**: Base pronta para implementar stories com independencia.

---

## Phase 3: User Story 1 - Abertura rapida da Home (Priority: P1) 🎯 MVP

**Goal**: Exibir conteudo util inicial mais rapido, com loading/erro/vazio por bloco e retry local.

**Independent Test**: Abrir Home em rede normal e confirmar primeiro bloco util mais cedo + placeholders por bloco + erro local com retry sem derrubar a tela.

### Tests for User Story 1

- [X] T012 [P] [US1] Criar teste de integracao para renderizacao progressiva da Home em `features/movies/views/__tests__/home-progressive-render.test.tsx`
- [X] T013 [P] [US1] Criar teste de integracao para erro local com retry por bloco em `features/movies/views/__tests__/home-block-retry.test.tsx`
- [X] T014 [P] [US1] Criar teste de acessibilidade dos estados da Home em `features/movies/views/__tests__/home-status-accessibility.test.tsx`
- [X] T015 [US1] Criar fluxo Maestro de abertura da Home com estados por bloco em `.maestro/flows/home-performance-initial-load.yaml`

### Implementation for User Story 1

- [X] T016 [P] [US1] Refatorar orquestracao da Home para progresso parcial por bloco em `features/movies/views/home.tsx`
- [X] T017 [P] [US1] Ajustar carregamento de filmes para estado independente por bloco em `features/movies/controllers/use-movie-home.ts`
- [X] T018 [P] [US1] Ajustar carregamento de series para estado independente por bloco em `features/movies/controllers/use-tv-series-home.ts`
- [X] T019 [P] [US1] Ajustar carregamento de trending para estado independente por bloco em `features/movies/controllers/use-trending-home.ts`
- [X] T020 [US1] Implementar UI de loading/erro/vazio acionavel por bloco em `features/movies/views/home-movies.tsx`
- [X] T021 [US1] Implementar UI de loading/erro/vazio acionavel por bloco em `features/movies/views/home-series.tsx`
- [X] T022 [US1] Aplicar labels/roles a11y nos estados de bloco em `features/movies/views/home.tsx`
- [X] T023 [US1] Adicionar acao de retry local por bloco no componente de linha trending em `features/movies/components/trending-home-row.tsx`
- [X] T024 [US1] Emitir evento `home_first_useful_content` apos primeiro bloco util em `features/movies/views/home.tsx`
- [X] T025 [US1] Calcular e emitir taxa de sucesso de renderizacao completa da Home em `features/movies/services/home-render-success-rate.ts`

**Checkpoint**: US1 funcional e testavel de forma independente (MVP).

---

## Phase 4: User Story 2 - Scroll fluido na descoberta (Priority: P2)

**Goal**: Reduzir engasgos perceptiveis durante scroll da Home em listas e carrosseis.

**Independent Test**: Navegar continuamente por listas longas e imagens pesadas com reducao de engasgo validada por telemetria.

### Tests for User Story 2

- [X] T026 [P] [US2] Criar teste de render para estabilidade de itens memoizados em scroll em `features/movies/components/__tests__/trending-home-row.performance.test.tsx`
- [X] T027 [US2] Criar fluxo Maestro de scroll prolongado da Home em `.maestro/flows/home-performance-scroll.yaml`

### Implementation for User Story 2

- [X] T028 [P] [US2] Otimizar renderizacao de itens e callbacks no carrossel trending em `features/movies/components/trending-home-row.tsx`
- [X] T029 [P] [US2] Otimizar renderizacao de chips/linhas na Home em `features/movies/components/home-genre-chips.tsx`
- [X] T030 [US2] Aplicar configuracao de virtualizacao adequada nas listas da Home em `features/movies/views/home.tsx`
- [X] T031 [US2] Capturar e emitir evento `home_scroll_jank` com severidade e contexto em `features/movies/services/home-performance-telemetry.ts`
- [X] T032 [US2] Integrar medicao de jank por sessao de descoberta nos controllers da Home em `features/movies/controllers/use-trending-home.ts`

**Checkpoint**: US2 funcional, mantendo US1 estavel.

---

## Phase 5: User Story 3 - Retorno consistente para Home (Priority: P3)

**Goal**: Preservar continuidade no retorno de detalhes para Home (scroll + estado carregado).

**Independent Test**: Abrir detalhe de filme e retornar para Home mantendo posicao e estado, inclusive sob rede lenta/intermitente.

### Tests for User Story 3

- [X] T033 [P] [US3] Criar teste de navegacao para preservacao de estado no retorno em `features/movies/views/__tests__/home-return-state.test.tsx`
- [X] T034 [US3] Criar fluxo Maestro de ida/volta Home-Detalhes-Home em `.maestro/flows/home-performance-return.yaml`

### Implementation for User Story 3

- [X] T035 [P] [US3] Implementar persistencia de posicao de scroll da Home em `hooks/use-home-scroll-position.ts`
- [X] T036 [P] [US3] Integrar restauracao de scroll no retorno em `features/movies/views/home.tsx`
- [X] T037 [US3] Preservar estado carregado dos blocos ao voltar de detalhes em `features/movies/controllers/use-movie-home.ts`
- [X] T038 [US3] Emitir evento `home_discovery_completed` ao interagir com primeiro carrossel em `features/movies/views/home.tsx`
- [X] T039 [US3] Ajustar rota de entrada para manter continuidade de sessao na Home em `app/movies/index.tsx`

**Checkpoint**: US3 funcional sem regressao das stories anteriores.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Consolidacao final, observabilidade e validacao completa.

- [X] T040 [P] Consolidar contrato de telemetria implementado vs `contracts/telemetry-contract.md` em `specs/001-home-performance/contracts/telemetry-contract.md`
- [X] T041 Executar teste estruturado de identificacao de estados (SC-005) e registrar resultado em `specs/001-home-performance/quickstart.md`
- [X] T042 Executar e documentar checklist de validacao do quickstart em `specs/001-home-performance/quickstart.md`
- [X] T043 [P] Rodar lint e corrigir pendencias da feature em `features/movies/views/home.tsx`
- [X] T044 [P] Rodar suite de testes relevantes da Home e registrar evidencias em `specs/001-home-performance/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: sem dependencias.
- **Phase 2 (Foundational)**: depende da Phase 1 e bloqueia todas as stories.
- **Phase 3 (US1)**: inicia apos Phase 2.
- **Phase 4 (US2)**: inicia apos Phase 2; pode ocorrer em paralelo com US1 se houver equipe.
- **Phase 5 (US3)**: inicia apos Phase 2; recomenda-se apos estabilizar US1 para reduzir risco de regressao de navegacao.
- **Phase 6 (Polish)**: depende das stories selecionadas concluidas.

### User Story Dependencies

- **US1 (P1)**: sem dependencia em outras stories (MVP).
- **US2 (P2)**: independente, mas valida melhor com base de US1 pronta.
- **US3 (P3)**: depende do fluxo Home/Detalhes existente e integra melhor apos US1.

### Within Each User Story

- Testes primeiro (quando aplicavel), depois implementacao.
- Modelagem/estado antes de integracao visual.
- Instrumentacao de telemetria antes da validacao final de metricas.

### Parallel Opportunities

- Setup: `T003`, `T004`, `T005`.
- Foundational: `T008`, `T009`, `T010`.
- US1: `T012`, `T013`, `T014`; `T017`, `T018`, `T019`.
- US2: `T026`; `T028`, `T029`.
- US3: `T033`; `T035`, `T036`.
- Polish: `T040`, `T043`, `T044`.

---

## Parallel Example: User Story 1

```bash
# Testes US1 em paralelo
Task: "T012 [US1] Criar teste de integracao para renderizacao progressiva em features/movies/views/__tests__/home-progressive-render.test.tsx"
Task: "T013 [US1] Criar teste de erro local com retry em features/movies/views/__tests__/home-block-retry.test.tsx"
Task: "T014 [US1] Criar teste de acessibilidade dos estados em features/movies/views/__tests__/home-status-accessibility.test.tsx"

# Controllers US1 em paralelo
Task: "T017 [US1] Ajustar use-movie-home.ts"
Task: "T018 [US1] Ajustar use-tv-series-home.ts"
Task: "T019 [US1] Ajustar use-trending-home.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Concluir Phase 1 + Phase 2.
2. Entregar US1 completa (Phase 3).
3. Validar metas de abertura inicial, taxa de renderizacao e estados por bloco.
4. Demonstrar MVP antes de expandir escopo.

### Incremental Delivery

1. Base pronta (Phase 1-2).
2. Entregar US1 e validar independentemente.
3. Adicionar US2 para fluidez de scroll.
4. Adicionar US3 para continuidade de retorno.
5. Finalizar com Polish + evidencias.

### Parallel Team Strategy

1. Time fecha Setup + Foundational.
2. Depois:
   - Dev A: US1
   - Dev B: US2
   - Dev C: US3
3. Integrar e validar por historia, mantendo independencia de testes.
