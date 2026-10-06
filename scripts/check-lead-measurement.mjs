import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

// Isolated protocol tests: no network requests or real advertising events.
function harness({ hostname = "xekhachbaccuongnguyet.com", storageBlocked = false } = {}) {
  const events = [];
  const storage = new Map();
  const sessionStorage = {
    getItem(key) {
      if (storageBlocked) throw new Error("blocked");
      return storage.get(key) ?? null;
    },
    setItem(key, value) {
      if (storageBlocked) throw new Error("blocked");
      storage.set(key, value);
    },
  };
  let response = { success: true, leadId: "LD-20261006-120000-1234" };
  let requests = 0;
  const sandbox = {
    console,
    URL,
    URLSearchParams,
    AbortController,
    Date,
    Math,
    JSON,
    Error,
    sessionStorage,
    localStorage: sessionStorage,
    document: { referrer: "" },
    window: {
      location: { hostname, pathname: "/" },
      sessionStorage,
      setTimeout,
      clearTimeout,
      gtag: (...args) => events.push(args),
    },
    fetch: async () => {
      requests++;
      return { ok: true, json: async () => response };
    },
  };
  function load(file, dependencies = {}) {
    const exports = {};
    const source = fs
      .readFileSync(file, "utf8")
      .replaceAll(
        "import.meta.env",
        "({ VITE_BOOKING_FORM_ENDPOINT: 'https://script.google.com/macros/s/TEST/exec', DEV: false })",
      );
    const code = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    vm.runInNewContext(
      code,
      {
        ...sandbox,
        exports,
        require: (name) => {
          assert.ok(dependencies[name], `Unexpected dependency: ${name}`);
          return dependencies[name];
        },
      },
      { filename: file },
    );
    return exports;
  }
  const measurement = load("src/lib/adsMeasurement.ts");
  const booking = load("src/lib/bookingLead.ts", { "@/lib/adsMeasurement": measurement });
  return {
    events,
    measurement,
    booking,
    setResponse: (value) => {
      response = value;
    },
    requestCount: () => requests,
  };
}

const lead = { name: "Protocol Test", phone: "0901234567", consent: true, source: "website" };
const accepted = harness();
assert.equal((await accepted.booking.submitBookingLead(lead)).success, true);
assert.equal(accepted.events.length, 1);
assert.equal(accepted.events[0][1], "conversion");
assert.equal(accepted.events[0][2].transaction_id, "LD-20261006-120000-1234");
assert.deepEqual(Object.keys(accepted.events[0][2]).sort(), ["send_to", "transaction_id"]);
accepted.measurement.trackSavedLead("LD-20261006-120000-1234");
assert.equal(accepted.events.length, 1, "Same persisted lead must not be counted twice");
assert.equal((await accepted.booking.submitBookingLead(lead)).success, false);
assert.equal(accepted.requestCount(), 1, "Cooldown must not resubmit or claim a new success");

const quarantined = harness();
quarantined.setResponse({ success: true, leadId: "RQ-20261006-120000-1234" });
await quarantined.booking.submitBookingLead(lead);
assert.equal(quarantined.events.length, 0, "Spam acknowledgement is not a persisted lead");

const suppressed = harness();
suppressed.setResponse({
  success: true,
  leadId: "LD-20261006-120000-1234",
  conversionEligible: false,
});
assert.equal((await suppressed.booking.submitBookingLead(lead)).success, true);
assert.equal(
  suppressed.events.length,
  0,
  "Backend suppression must prevent conversion measurement",
);

for (const response of [
  { success: true },
  { success: false, leadId: "LD-20261006-120000-1234" },
  null,
]) {
  const rejected = harness();
  rejected.setResponse(response);
  assert.equal((await rejected.booking.submitBookingLead(lead)).success, false);
  assert.equal(rejected.events.length, 0);
}

const preview = harness({ hostname: "localhost" });
assert.equal((await preview.booking.submitBookingLead(lead)).success, true);
assert.equal(preview.events.length, 0, "Preview must not pollute production conversion data");
const restricted = harness({ storageBlocked: true });
assert.equal((await restricted.booking.submitBookingLead(lead)).success, true);
restricted.measurement.trackSavedLead("LD-20261006-120000-1234");
assert.equal(
  restricted.events.length,
  1,
  "Blocked storage must preserve success and in-memory deduplication",
);
console.log(
  "Lead measurement checks passed: persisted IDs, deduplication, cooldown, quarantine, invalid responses, preview isolation, blocked storage, no contact data.",
);
