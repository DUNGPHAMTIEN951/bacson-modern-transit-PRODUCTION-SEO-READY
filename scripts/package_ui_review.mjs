import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execSync } from "child_process";

const REVIEW_DIR = path.resolve("UI_REVIEW");
const ZIP_PATH = path.resolve("UI_REVIEW_FULL.zip");
const CHUNKS_PATH = path.resolve("src/data/ui-review-chunks.json");

// 1. Validate all PNG files
console.log("=== 1. Validating PNG Files ===");
function getFilesRecursively(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(full));
    } else {
      results.push(full);
    }
  });
  return results;
}

const allFiles = getFilesRecursively(REVIEW_DIR);
let pngCount = 0;
let invalidPngCount = 0;

for (const file of allFiles) {
  const stat = fs.statSync(file);
  if (file.endsWith(".png")) {
    pngCount++;
    if (stat.size < 100) {
      console.error(`Invalid small PNG: ${file} (${stat.size} bytes)`);
      invalidPngCount++;
    }
    // Check PNG header (89 50 4E 47 0D 0A 1A 0A)
    const buf = Buffer.alloc(8);
    const fd = fs.openSync(file, "r");
    fs.readSync(fd, buf, 0, 8, 0);
    fs.closeSync(fd);
    const isPng =
      buf[0] === 0x89 &&
      buf[1] === 0x50 &&
      buf[2] === 0x4e &&
      buf[3] === 0x47 &&
      buf[4] === 0x0d &&
      buf[5] === 0x0a &&
      buf[6] === 0x1a &&
      buf[7] === 0x0a;
    if (!isPng) {
      console.error(`Corrupted PNG header: ${file}`);
      invalidPngCount++;
    }
  }
}

console.log(`Total files in package: ${allFiles.length}`);
console.log(`Total valid PNG screenshots: ${pngCount} (invalid: ${invalidPngCount})`);

if (invalidPngCount > 0) {
  throw new Error(`Validation failed with ${invalidPngCount} invalid PNGs.`);
}

// 2. Create ZIP using PowerShell Compress-Archive
console.log("=== 2. Creating UI_REVIEW_FULL.zip ===");
if (fs.existsSync(ZIP_PATH)) {
  fs.unlinkSync(ZIP_PATH);
}

// Compress UI_REVIEW directory
execSync(
  `powershell -NoProfile -Command "Compress-Archive -Path '${REVIEW_DIR}' -DestinationPath '${ZIP_PATH}' -Force -CompressionLevel Optimal"`,
  { stdio: "inherit" },
);

const zipStat = fs.statSync(ZIP_PATH);
const zipBuffer = fs.readFileSync(ZIP_PATH);
const hash = crypto.createHash("sha256").update(zipBuffer).digest("hex");

console.log(`ZIP created successfully!`);
console.log(`ZIP Path: ${ZIP_PATH}`);
console.log(
  `ZIP Size: ${zipStat.size.toLocaleString()} bytes (${(zipStat.size / (1024 * 1024)).toFixed(2)} MB)`,
);
console.log(`ZIP SHA-256: ${hash}`);

// Also copy to public directory for direct download if supported
fs.mkdirSync(path.resolve("public"), { recursive: true });
fs.copyFileSync(ZIP_PATH, path.resolve("public/UI_REVIEW_FULL.zip"));

// 3. Base64 Chunking for the client-side reconstructor route
console.log("=== 3. Generating Base64 Chunks for UI Review Download Route ===");
const base64Str = zipBuffer.toString("base64");
const CHUNK_SIZE = 500 * 1024; // 500KB per chunk
const chunks = [];

for (let i = 0; i < base64Str.length; i += CHUNK_SIZE) {
  chunks.push(base64Str.slice(i, i + CHUNK_SIZE));
}

fs.mkdirSync(path.dirname(CHUNKS_PATH), { recursive: true });
const chunkData = {
  filename: "UI_REVIEW_FULL.zip",
  totalBytes: zipStat.size,
  totalScreenshots: pngCount,
  sha256: hash,
  totalChunks: chunks.length,
  chunks: chunks,
};

fs.writeFileSync(CHUNKS_PATH, JSON.stringify(chunkData), "utf8");
console.log(`Generated ${chunks.length} base64 chunks in: ${CHUNKS_PATH}`);

console.log("=== PACKAGE COMPLETED SUCCESSFULLY ===");
