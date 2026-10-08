// Turns `expo export --platform web` output into an artifact page: the page body only (the artifact
// host adds the document skeleton) and relative URLs, because the page is not served from "/".
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));

const html = readFileSync(join(dist, "index.html"), "utf8");
const scripts = [...html.matchAll(/<script[^>]*src="([^"]+)"[^>]*><\/script>/g)].map((m) => m[1].replace(/^\//, "./"));
if (scripts.length === 0) throw new Error("No bundle <script> found in dist/index.html");

// Asset URLs inside the JS bundles are absolute ("/assets/..."); make them relative to the page.
const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
for (const file of walk(join(dist, "_expo")).filter((f) => f.endsWith(".js"))) {
  const code = readFileSync(file, "utf8");
  const fixed = code.replaceAll('"/assets/', '"./assets/');
  if (fixed !== code) writeFileSync(file, fixed);
}

const page = `<title>Kalori Takip Önizleme</title>
<style>
  :root { color-scheme: dark; }
  html, body, #root { height: 100%; }
  body { margin: 0; background: #170b21; }
  #root { display: flex; }
</style>
<div id="root"></div>
${scripts.map((src) => `<script src="${src}" defer></script>`).join("\n")}
`;
writeFileSync(join(dist, "artifact.html"), page);
console.log(`artifact.html written with ${scripts.length} script(s)`);
