import { rmSync } from "node:fs";

for (const path of [".output", ".nitro", "dist", "dist-ssr"]) {
  rmSync(path, { recursive: true, force: true });
}

console.log("Cleaned cached build output directories before production build.");
