/**
 * Runs the Maestro CLI with typical install dirs on PATH (Windows often misses ~/.maestro/bin).
 * Usage: node scripts/run-maestro.cjs test .maestro/smoke
 */
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const INSTALL_HINT =
  "Install the Maestro CLI: https://docs.maestro.dev/maestro-cli/how-to-install-maestro-cli\n" +
  "Windows (PowerShell): `curl` is not curl—use `curl.exe -fsSL \"https://get.maestro.mobile.dev\" | bash` from Git Bash or WSL (bash required), OR download maestro.zip from GitHub releases, extract to C:\\maestro, add C:\\maestro\\bin to PATH.";

function isWin() {
  return process.platform === "win32";
}

function standardMaestroBinDirs() {
  const home = process.env.USERPROFILE || process.env.HOME || "";
  const dirs = [path.join(home, ".maestro", "bin")];
  if (isWin()) {
    dirs.push(path.join("C:", "maestro", "bin"));
  }
  return dirs;
}

function resolveMaestroInDirs(dirs) {
  const names = isWin()
    ? ["maestro.bat", "maestro.cmd", "maestro.exe"]
    : ["maestro"];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    for (const name of names) {
      const full = path.join(dir, name);
      if (fs.existsSync(full)) {
        return full;
      }
    }
  }
  return null;
}

function withMaestroPath(env) {
  const existing = standardMaestroBinDirs().filter((d) => fs.existsSync(d));
  if (existing.length === 0) {
    return env;
  }
  const sep = isWin() ? ";" : ":";
  const prefix = existing.join(sep);
  const pathKey =
    Object.keys(env).find((k) => k.toLowerCase() === "path") || "Path";
  const current = env[pathKey] || "";
  return { ...env, [pathKey]: `${prefix}${sep}${current}` };
}

function findMaestroOnPath(env) {
  const cmd = isWin() ? "where" : "which";
  const r = spawnSync(cmd, ["maestro"], {
    encoding: "utf8",
    env,
    shell: isWin(),
  });
  if (r.status !== 0 || !r.stdout) {
    return null;
  }
  const first = r.stdout.trim().split(/\r?\n/)[0];
  return first && fs.existsSync(first) ? first : null;
}

function resolveMaestroExecutable() {
  const env = withMaestroPath({ ...process.env });
  return (
    resolveMaestroInDirs(standardMaestroBinDirs()) || findMaestroOnPath(env)
  );
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node scripts/run-maestro.cjs <maestro arguments...>");
  process.exit(1);
}

const resolved = resolveMaestroExecutable();
if (!resolved) {
  console.error("Maestro CLI not found on this machine.\n");
  console.error(INSTALL_HINT);
  process.exit(1);
}

const useShell = isWin() && /\.(bat|cmd)$/i.test(resolved);
const result = spawnSync(resolved, args, {
  stdio: "inherit",
  env: withMaestroPath({ ...process.env }),
  shell: useShell,
});

if (result.error) {
  console.error(result.error.message);
  console.error("\n" + INSTALL_HINT);
  process.exit(1);
}

process.exit(result.status === null ? 1 : result.status);
