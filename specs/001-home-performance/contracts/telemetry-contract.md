# Contract: Home Performance Telemetry

## Purpose
Definir o contrato minimo de eventos e campos obrigatorios para validar os criterios de sucesso da Home Performance.

## Event: `home_first_useful_content`
- **When**: primeiro bloco util da Home fica visivel.
- **Required fields**:
  - `sessionId` (string)
  - `timestamp` (ISO-8601 string)
  - `timeFromAppOpenMs` (number)
  - `networkProfile` (string)
  - `deviceTier` (string: `entry|mid|high`)
  - `buildType` (string: `debug|release`)

## Event: `home_scroll_jank`
- **When**: evento de engasgo detectado durante scroll da Home.
- **Implementation**: `features/movies/services/home-performance-telemetry.ts` (`createHomeScrollJankEvent` / `trackHomeScrollJank`); amostragem do `ScrollView` principal em `features/movies/views/home.tsx` via `useHomeScrollJankTelemetry` em `features/movies/controllers/use-trending-home.ts`.
- **Required fields**:
  - `sessionId` (string)
  - `timestamp` (ISO-8601 string)
  - `networkProfile` (string)
  - `deviceTier` (string: `entry|mid|high`)
  - `buildType` (string: `debug|release`)
  - `blockId` (string, optional)
  - `frameDropCount` (number)
  - `severity` (string: `minor|major`)
  - `scrollVelocityBucket` (string: `slow|medium|fast`)

## Event: `home_block_state`
- **When**: mudanca de estado de um bloco na Home.
- **Required fields**:
  - `sessionId` (string)
  - `blockId` (string)
  - `fromState` (string: `loading|content|empty|error`)
  - `toState` (string: `loading|content|empty|error`)
  - `timestamp` (ISO-8601 string)
  - `hasRetryAction` (boolean)

## Event: `home_discovery_completed`
- **When**: usuario interage com primeiro carrossel na sessao.
- **Required fields**:
  - `sessionId` (string)
  - `timestamp` (ISO-8601 string)
  - `timeFromAppOpenMs` (number)
  - `firstCarouselId` (string)

## Validation Rules
- Eventos sem `sessionId` sao invalidos.
- Campos numericos de tempo devem ser >= 0.
- `home_block_state` com `toState=error` deve incluir `hasRetryAction=true`.
- Todos os eventos de benchmark devem incluir contexto de rede/device/build.
