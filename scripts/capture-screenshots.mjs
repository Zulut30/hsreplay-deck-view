import { mkdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "..");
const screenshotDir = join(repoRoot, "assets", "screenshots");
const indexUrl = pathToFileURL(join(repoRoot, "index.html")).href;

const chromiumCandidates = [
  process.env.CHROMIUM_BIN,
  "chromium",
  "chromium-browser",
  "google-chrome",
  "google-chrome-stable"
].filter(Boolean);

function findChromium() {
  for (const candidate of chromiumCandidates) {
    const result = spawnSync(candidate, ["--version"], { encoding: "utf8" });
    if (result.status === 0) {
      return candidate;
    }
  }
  throw new Error("Chromium was not found. Set CHROMIUM_BIN or install chromium.");
}

function capture(chromium, name, view, windowSize) {
  const output = join(screenshotDir, name);
  const url = `${indexUrl}?view=${view}`;
  const result = spawnSync(
    chromium,
    [
      "--headless",
      "--disable-gpu",
      "--no-sandbox",
      "--hide-scrollbars",
      `--screenshot=${output}`,
      `--window-size=${windowSize}`,
      "--virtual-time-budget=7000",
      url
    ],
    { stdio: "inherit" }
  );
  if (result.status !== 0) {
    throw new Error(`Screenshot failed: ${name}`);
  }
}

mkdirSync(screenshotDir, { recursive: true });
const chromium = findChromium();
capture(chromium, "deck-demo.png", "deck", "620,1540");
capture(chromium, "rarity-cost-showcase.png", "showcase", "620,1160");
capture(chromium, "mobile-demo.png", "deck", "390,920");
