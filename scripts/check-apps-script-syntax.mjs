import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const directory = "google-apps-script";
const files = readdirSync(directory)
  .filter((name) => name.endsWith(".gs"))
  .sort();

if (!files.length) {
  throw new Error("No Google Apps Script .gs files found.");
}

for (const file of files) {
  const source = readFileSync(join(directory, file), "utf8").replace(/^\uFEFF/, "");
  try {
    // Parse only. The function is intentionally never executed because Apps Script globals
    // (SpreadsheetApp, DriveApp, ScriptApp, etc.) do not exist in Node.js.
    new Function(source);
  } catch (error) {
    console.error(`Syntax error in ${file}`);
    throw error;
  }
}

console.log(`Google Apps Script syntax OK (${files.length} files).`);
