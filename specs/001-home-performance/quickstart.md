# Quickstart: Home Performance

## 1) Preparacao
1. Instalar dependencias:
   - `npm install`
2. Iniciar o app:
   - `npm run start`
3. Executar em device/emulador alvo (Android/iOS) na faixa de benchmark definida.

## 2) Validacao funcional basica
1. Abrir Home e confirmar primeiro conteudo util com placeholders por bloco.
2. Simular falha parcial de bloco e validar erro local com acao de retry.
3. Navegar Home -> Detalhes -> Home e validar preservacao de scroll e estado carregado.

## 3) Validacao de performance
1. Executar cenarios no perfil de rede oficial da feature.
2. Coletar telemetria dos indicadores:
   - tempo para primeiro conteudo util;
   - ocorrencias de engasgo em scroll;
   - taxa de sucesso de renderizacao completa;
   - taxa de conclusao da jornada de descoberta.
3. Comparar com baseline aprovada pelo time.

## 4) Gates de qualidade
1. Lint:
   - `npm run lint`
2. Testes unitarios relevantes:
   - `npm run test`
3. Fluxos E2E (quando alterar jornada critica):
   - `npm run e2e:android:flows`

## 5) Criterio de pronto da feature
- SC-001 >= 30% de melhora no tempo para conteudo util inicial.
- SC-002 >= 50% de reducao de engasgo.
- SC-003 > 99% de sucesso de renderizacao da Home.
- SC-004 >= 15% de aumento na conclusao da jornada de descoberta.
- SC-005: em testes de experiencia, >= 90% dos participantes identificam claramente loading, erro e vazio por bloco (validar com roteiro estruturado e amostra minima definida pelo time).

## 6) SC-005 — teste estruturado de estados (registro)
- **Roteiro**: apresentar Home com bloco em loading, depois erro com retry, depois vazio; participante descreve o que ve sem ajuda.
- **Registro**: data, dispositivo, N participantes, taxa de identificacao correta por estado.
- **Resultado (template)**: _Pendente execucao em painel / device pool do time._

## 7) Checklist de validacao (build local)
- [x] Lint: `npm run lint` (Home: `features/movies/views/home.tsx` e ficheiros relacionados).
- [x] Testes Jest focados na feature: `npx jest --no-watch --testPathPattern="home-(progressive-render|block-retry|status-accessibility|return-state)|home-block-state-mapper|trending-home-row.performance" --passWithNoTests` (ajustar padrao conforme suite).
- [x] Fluxos Maestro em `.maestro/flows/home-performance-initial-load.yaml`, `home-performance-scroll.yaml`, `home-performance-return.yaml`.

## 8) Evidencias de testes (registro local)
- Executar o comando da secao 7 e anexar ou colar o resumo de saida (exit code 0) no historial do PR ou run de CI.
