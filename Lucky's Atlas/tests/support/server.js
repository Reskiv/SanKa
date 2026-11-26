import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const port = Number.parseInt(process.env.PORT || "4173", 10);
const host = process.env.HOST || "127.0.0.1";
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

function safeFile(pathname) {
  const relative = normalize(decodeURIComponent(pathname)).replace(/^[/\\]+/, "");
  if (relative.startsWith("..")) return null;
  return join(root, relative);
}

export async function handlePreviewRequest(request, response) {
  try {
      const url = new URL(request.url || "/", `http://${request.headers.host || host}`);
      const requested = safeFile(url.pathname);
      let file = requested;
      if (file) {
        try {
          if (!(await stat(file)).isFile()) file = null;
        } catch {
          file = null;
        }
      }
      if (!file) file = join(root, "index.html");
      const body = await readFile(file);
      response.writeHead(200, {
        "Content-Type": contentTypes[extname(file)] || "application/octet-stream",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff"
      });
      response.end(body);
  } catch {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Local preview unavailable");
  }
}

export function createPreviewServer() {
  return createServer(handlePreviewRequest);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = createPreviewServer();
  server.listen(port, host, () => {
    process.stdout.write(`SanKa preview: http://${host}:${port}\n`);
  });
}
