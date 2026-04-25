# Data Model: Home Performance

## Entity: HomeBlock
- **Description**: Unidade independente de conteudo renderizada na Home.
- **Fields**:
  - `id` (string, unique): identificador canonico do bloco.
  - `title` (string): rotulo exibido ao usuario.
  - `state` (enum): `loading | content | empty | error`.
  - `itemsCount` (number): quantidade de itens disponiveis no bloco.
  - `updatedAt` (string datetime): timestamp da ultima atualizacao do bloco.
  - `errorCode` (string, optional): codigo tecnico para falha local.
- **Validation Rules**:
  - `id` obrigatorio e unico por tela.
  - `state=content` exige `itemsCount >= 1`.
  - `state=empty` exige `itemsCount = 0`.
  - `state=error` permite `errorCode` e exige acao de retry local.
- **State Transitions**:
  - `loading -> content | empty | error`
  - `error -> loading` (apos retry)
  - `content -> loading` (refresh explicito)

## Entity: HomeDiscoverySession
- **Description**: Sessao iniciada na abertura da Home ate interacao com primeiro carrossel.
- **Fields**:
  - `sessionId` (string, unique)
  - `startedAt` (string datetime)
  - `firstUsefulContentAt` (string datetime, optional)
  - `firstCarouselInteractionAt` (string datetime, optional)
  - `completed` (boolean)
- **Validation Rules**:
  - `completed=true` exige `firstCarouselInteractionAt`.
  - Duracao total da sessao deve ser calculavel para analise de conversao.

## Entity: ScrollJankEvent
- **Description**: Evento de fluidez capturado por telemetria durante scroll da Home.
- **Fields**:
  - `eventId` (string, unique)
  - `sessionId` (string, foreign key -> HomeDiscoverySession.sessionId)
  - `blockId` (string, optional, foreign key -> HomeBlock.id)
  - `timestamp` (string datetime)
  - `severity` (enum: `minor | major`)
  - `frameDropCount` (number)
  - `scrollVelocityBucket` (enum: `slow | medium | fast`)
- **Validation Rules**:
  - `frameDropCount >= 1`
  - `severity=major` para eventos acima do threshold definido.

## Entity: HomePerformanceBenchmark
- **Description**: Configuracao de benchmark oficial para validacao da feature.
- **Fields**:
  - `networkProfile` (object): latencia e banda alvo.
  - `deviceTier` (enum: `entry | mid`)
  - `buildType` (enum: `debug | release`)
  - `sampleSize` (number): numero minimo de execucoes por cenario.
- **Validation Rules**:
  - `networkProfile` obrigatorio para qualquer medicao valida.
  - `deviceTier` minimo cobre `entry` e `mid`.
  - `sampleSize >= 5` por fluxo critico.
