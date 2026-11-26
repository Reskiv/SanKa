import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import { join, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { CAFES } from "../../src/data/cafes.js";

const root = fileURLToPath(new URL("../../", import.meta.url));

async function filesUnder(directory) {
  const output = [];
  for (const name of await readdir(directory)) {
    const path = join(directory, name);
    const info = await stat(path);
    if (info.isDirectory()) output.push(...await filesUnder(path));
    else output.push(path);
  }
  return output;
}

const runtimeFiles = (await filesUnder(join(root, "src"))).filter((path) => [".js", ".css"].includes(extname(path)));
const jsFiles = runtimeFiles.filter((path) => extname(path) === ".js");
const cssFiles = runtimeFiles.filter((path) => extname(path) === ".css");
const sources = new Map(await Promise.all(runtimeFiles.map(async (path) => [path, await readFile(path, "utf8")])));
const javascript = jsFiles.map((path) => sources.get(path)).join("\n");
const html = await readFile(join(root, "index.html"), "utf8");

const banned = [
  ["HTML string injection API", /\binnerHTML\b/],
  ["dynamic evaluation", /\beval\s*\(/],
  ["runtime fetch", /\bfetch\s*\(/],
  ["XML request", /XMLHttpRequest/],
  ["socket", /WebSocket/],
  ["geolocation API", /navigator\.geolocation/],
  ["cookies", /document\.cookie/]
];
for (const [label, pattern] of banned) assert.doesNotMatch(javascript, pattern, label);
assert.doesNotMatch(html, /\son[a-z]+\s*=/i, "inline event handler");
// The SVG DOM namespace identifies elements; it is not a network destination.
const runtimeUrls = `${html}\n${javascript}`
  .replaceAll("http://local.test", "")
  .replaceAll("http://www.w3.org/2000/svg", "");
assert.doesNotMatch(runtimeUrls, /https?:\/\//i, "external runtime URL");

const storageMentions = jsFiles.filter((path) => sources.get(path).includes("localStorage"));
assert.deepEqual(storageMentions.map((path) => relative(root, path)), ["src/app.js"], "storage is injected only at bootstrap");

assert.match(html, /connect-src 'none'/);
assert.match(html, /frame-src 'none'/);
assert.match(html, /object-src 'none'/);
assert.match(html, /form-action 'none'/);
assert.match(html, /script-src 'self'/);

for (const cafe of CAFES) {
  assert.ok(cafe.image.src.startsWith("/assets/"));
  await stat(join(root, cafe.image.src.slice(1)));
  const serialized = JSON.stringify(cafe).toLowerCase();
  assert.doesNotMatch(serialized, /latitude|longitude|street address|verified visit/);
}

const jsBytes = (await Promise.all(jsFiles.map(async (path) => (await stat(path)).size))).reduce((sum, size) => sum + size, 0);
const cssBytes = (await Promise.all(cssFiles.map(async (path) => (await stat(path)).size))).reduce((sum, size) => sum + size, 0);
assert.ok(jsBytes < 100_000, `application JavaScript is ${jsBytes} bytes`);
// The five-screen visual system adds responsive layouts, purpose-driven motion,
// and reduced-motion styles. Keep the uncompressed source budget below 90 KB.
assert.ok(cssBytes < 90_000, `application CSS is ${cssBytes} bytes`);

const testFiles = (await filesUnder(join(root, "tests"))).filter((path) => path.endsWith(".test.js"));
const testText = (await Promise.all(testFiles.map((path) => readFile(path, "utf8")))).join("\n");
for (let id = 1; id <= 17; id += 1) assert.match(testText, new RegExp(`FR-${String(id).padStart(2, "0")}`));
for (let id = 1; id <= 27; id += 1) assert.match(testText, new RegExp(`AC-${String(id).padStart(2, "0")}`));

process.stdout.write(`Static checks passed. Application JS: ${jsBytes} bytes; CSS: ${cssBytes} bytes. FR-01..FR-17 and AC-01..AC-27 are named in developer tests.\n`);
