import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execSync } from "child_process";

const ROOT_DIR = path.resolve(".");
const ZIP_NAME = "bacson-modern-transit-SEASONAL-2-9-FINAL.zip";
const ZIP_PATH = path.resolve(ZIP_NAME);
const PUBLIC_ZIP_PATH = path.resolve("public", ZIP_NAME);

console.log("=== ĐÓNG GÓI TOÀN BỘ DỰ ÁN ===");

// 1. Clean previous zips if any
if (fs.existsSync(ZIP_PATH)) fs.unlinkSync(ZIP_PATH);
if (fs.existsSync(PUBLIC_ZIP_PATH)) fs.unlinkSync(PUBLIC_ZIP_PATH);

// 2. Prepare files to include
// Files and directories to package:
const INCLUDE_ITEMS = [
  "src",
  "public",
  "scripts",
  "UI_REVIEW",
  "UI_SEASONAL_29",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "vite.config.ts",
  "eslint.config.js",
  "components.json",
  ".prettierrc",
  ".gitignore",
  "AGENTS.md",
  "README.md",
  "PRODUCTION_SEO_AUDIT.md",
];

// Create a temporary packaging folder
const TEMP_DIR = path.resolve(".temp_project_package");
if (fs.existsSync(TEMP_DIR)) {
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
}
fs.mkdirSync(TEMP_DIR, { recursive: true });

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      // Skip unwanted build/cache files
      if (["node_modules", ".output", ".nitro", ".wrangler", "dist"].includes(entry)) {
        continue;
      }
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    // Skip if it's a huge zip file
    if (src.endsWith(".zip") && stat.size > 10 * 1024 * 1024) {
      return;
    }
    fs.copyFileSync(src, dest);
  }
}

for (const item of INCLUDE_ITEMS) {
  const itemPath = path.join(ROOT_DIR, item);
  if (fs.existsSync(itemPath)) {
    console.log(`Adding: ${item}`);
    copyRecursive(itemPath, path.join(TEMP_DIR, item));
  }
}

// 3. Compress using PowerShell
console.log(`Compressing into ${ZIP_NAME}...`);
execSync(
  `powershell -NoProfile -Command "Compress-Archive -Path '${TEMP_DIR}\\*' -DestinationPath '${ZIP_PATH}' -Force -CompressionLevel Optimal"`,
  { stdio: "inherit" },
);

// Clean up temp dir
fs.rmSync(TEMP_DIR, { recursive: true, force: true });

// Copy to public directory for browser access
fs.mkdirSync(path.resolve("public"), { recursive: true });
fs.copyFileSync(ZIP_PATH, PUBLIC_ZIP_PATH);

const stat = fs.statSync(ZIP_PATH);
const buf = fs.readFileSync(ZIP_PATH);
const hash = crypto.createHash("sha256").update(buf).digest("hex");

console.log("\n=== HOÀN TẤT ĐÓNG GÓI ===");
console.log(`Tên tệp: ${ZIP_NAME}`);
console.log(`Đường dẫn: ${ZIP_PATH}`);
console.log(
  `Dung lượng: ${stat.size.toLocaleString()} bytes (${(stat.size / (1024 * 1024)).toFixed(2)} MB)`,
);
console.log(`Mã băm SHA-256: ${hash}`);
