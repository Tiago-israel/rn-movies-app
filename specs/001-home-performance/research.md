# Research: Home Performance

## Decision 1: Renderizacao progressiva por bloco na Home
- **Decision**: Carregar e renderizar blocos da Home de forma independente, exibindo primeiro bloco util o quanto antes e mantendo placeholders por bloco.
- **Rationale**: Reduz tempo percebido inicial e evita que um bloco lento congele a tela inteira.
- **Alternatives considered**:
  - Carregamento em lote unico da Home (rejeitado por aumentar tempo ate primeiro conteudo).
  - Gate global de loading ate todos os blocos concluirem (rejeitado por piorar UX).

## Decision 2: Otmizacao de listas e itens pesados
- **Decision**: Priorizar componentes virtualizados (FlashList onde aplicavel), memoizacao de itens e callbacks estaveis nos carrosseis/blocos de Home.
- **Rationale**: Diminui trabalho de reconciliacao e quedas de frame em scroll longo.
- **Alternatives considered**:
  - Manter listas atuais sem ajustes de memoizacao (rejeitado por risco de nao atingir meta de -50% engasgo).
  - Otimizacao apenas em imagens sem ajuste de render (rejeitado por impacto parcial).

## Decision 3: Telemetria como criterio oficial de validacao
- **Decision**: Validar sucesso por telemetria com thresholds objetivos para tempo inicial, fluidez e sucesso de render.
- **Rationale**: Torna benchmark reproduzivel e comparavel entre builds/devices.
- **Alternatives considered**:
  - Medicao manual subjetiva em QA (rejeitado por baixa repetibilidade).
  - Avaliacao hibrida sem criterio primario claro (rejeitado por ambiguidade de aceite).

## Decision 4: Benchmark padrao (rede + devices)
- **Decision**: Definir explicitamente perfil de rede e faixa minima de devices para execucao dos testes de performance.
- **Rationale**: Evita resultados enviesados por ambiente e reduz regressao em aparelhos de entrada.
- **Alternatives considered**:
  - Fixar apenas perfil de rede (rejeitado por variacao forte entre dispositivos).
  - Fixar apenas devices (rejeitado por variacao de conectividade).

## Decision 5: Falha por bloco com retry local
- **Decision**: Em falha de API por bloco, exibir erro local com acao de tentar novamente no proprio bloco.
- **Rationale**: Mantem Home util mesmo com falha parcial e aumenta recuperabilidade.
- **Alternatives considered**:
  - Ocultar bloco silenciosamente (rejeitado por falta de transparencia).
  - Erro global da Home (rejeitado por indisponibilizar conteudo saudavel).

## Decision 6: Retorno detalhes -> Home com continuidade real
- **Decision**: Preservar posicao de scroll e estado ja carregado dos blocos ao voltar de detalhes.
- **Rationale**: Minimiza friccao na jornada de descoberta e evita recarregamentos desnecessarios.
- **Alternatives considered**:
  - Sempre recarregar no topo (rejeitado por quebrar continuidade).
  - Preservar apenas posicao sem estado (rejeitado por comportamento inconsistente).
