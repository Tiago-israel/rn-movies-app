type HomeFirstContentTimer = {
  startAtMs: number;
  firstContentAtMs?: number;
};

let timer: HomeFirstContentTimer | null = null;

export function startHomeFirstContentTimer(startAtMs = Date.now()) {
  timer = { startAtMs };
}

export function markHomeFirstContentAt(timestampMs = Date.now()) {
  if (!timer) {
    timer = { startAtMs: timestampMs };
  }
  if (!timer.firstContentAtMs) {
    timer.firstContentAtMs = timestampMs;
  }
}

export function getHomeFirstContentElapsedMs(): number | null {
  if (!timer?.firstContentAtMs) return null;
  return Math.max(0, timer.firstContentAtMs - timer.startAtMs);
}

export function resetHomeFirstContentTimer() {
  timer = null;
}
