type HomeRenderOutcome = "success" | "failure";

const outcomes: HomeRenderOutcome[] = [];

export function recordHomeRenderOutcome(outcome: HomeRenderOutcome) {
  outcomes.push(outcome);
}

export function getHomeRenderSuccessRate() {
  if (outcomes.length === 0) return null;
  const successCount = outcomes.filter((outcome) => outcome === "success").length;
  return successCount / outcomes.length;
}

export function isHomeRenderSuccessRateHealthy(threshold = 0.99) {
  const rate = getHomeRenderSuccessRate();
  if (rate === null) return true;
  return rate >= threshold;
}

export function resetHomeRenderOutcomes() {
  outcomes.length = 0;
}
