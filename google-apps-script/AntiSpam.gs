/**
 * Anti-spam engine + persistent phone registry.
 */

function analyzeSubmission(ss, payload, registry, now) {
  // Dùng trong writeRequestLog để không phải truyền lặp lại toàn bộ payload qua mọi nhánh.
  globalThis.__BSCN_CURRENT_PAYLOAD = payload;

  let score = 0;
  const reasons = [];
  let hardBlock = false;

  if (payload.honeypot) {
    score += 100;
    reasons.push("HONEYPOT");
    hardBlock = true;
  }

  if (registry) {
    const customerType = String(registry.customerType || "").toUpperCase();
    const verification = String(registry.verification || "").toUpperCase();
    const status = String(registry.status || "").toUpperCase();

    if (["SPAM", "BLOCKED"].indexOf(customerType) >= 0 || status === "BLOCKED") {
      score += 100;
      reasons.push("PHONE_BLACKLISTED");
      hardBlock = true;
    }
    if (["SAI_SỐ", "BỠN_CỢT"].indexOf(verification) >= 0) {
      score += 95;
      reasons.push("PHONE_PREVIOUSLY_REJECTED");
      hardBlock = true;
    }
    if (customerType === "SUSPECT") {
      score += 30;
      reasons.push("PHONE_SUSPECT");
    }
    if (["KHÁCH_QUEN", "VIP"].indexOf(customerType) >= 0 && verification === "ĐÃ_XÁC_MINH") {
      score -= 15;
      reasons.push("TRUSTED_CUSTOMER");
    }
  }

  const recent = getRecentRequestStats(ss, payload, now);
  if (recent.samePhoneWindow >= APP.SPAM.MAX_PER_WINDOW) {
    score += 45;
    reasons.push("PHONE_RATE_LIMIT_15M");
  }
  if (recent.samePhoneDay >= APP.SPAM.MAX_PER_DAY) {
    score += 35;
    reasons.push("PHONE_RATE_LIMIT_DAY");
  }
  if (recent.samePayloadWindow >= 2) {
    score += 35;
    reasons.push("DUPLICATE_PAYLOAD");
  }
  if (recent.distinctNamesForPhoneDay >= 3) {
    score += 25;
    reasons.push("PHONE_MANY_NAMES");
  }

  if (looksSuspiciousName(payload.name)) {
    score += 28;
    reasons.push("SUSPICIOUS_NAME");
  }

  if (looksSuspiciousText([payload.pickup, payload.dropoff, payload.note].join(" "))) {
    score += 18;
    reasons.push("SUSPICIOUS_TEXT");
  }

  const formDurationMs = calculateFormDurationMs(payload);
  if (formDurationMs !== null && formDurationMs >= 0 && formDurationMs < 1200) {
    score += 15;
    reasons.push("FORM_TOO_FAST");
  }

  if (!isKnownSource(payload.source)) {
    score += 10;
    reasons.push("UNKNOWN_SOURCE");
  }

  if (payload.clientRequestId && recent.sameClientRequestId > 0) {
    score += 40;
    reasons.push("REUSED_CLIENT_REQUEST_ID");
  }

  score = Math.max(0, Math.min(100, score));
  return {
    score: score,
    reasons: reasons,
    hardBlock: hardBlock,
    stats: recent,
    formDurationMs: formDurationMs,
  };
}

function looksSuspiciousName(name) {
  const value = String(name || "").trim().toLowerCase();
  if (!value) return true;
  if (value.length < 2) return true;
  if (/(.)\1{4,}/i.test(value)) return true;
  if (/https?:\/\/|www\./i.test(value)) return true;
  if (/\b(test|testing|asdf|qwerty|spam|fake|xxx|haha|hehe|hihi|đùa|dua|bỡn|bon|kkk)\b/i.test(value)) {
    return true;
  }

  const alphaCount = (value.match(/[a-zà-ỹđ]/gi) || []).length;
  const digitCount = (value.match(/[0-9]/g) || []).length;
  if (alphaCount < 2 || digitCount > Math.max(2, alphaCount)) return true;
  return false;
}

function looksSuspiciousText(text) {
  const value = String(text || "").trim().toLowerCase();
  if (!value) return false;
  if (/(.)\1{8,}/i.test(value)) return true;
  if (/https?:\/\/|www\.|<script|javascript:/i.test(value)) return true;
  if (/\b(spam|fake|asdf|qwerty|đùa|dua|bỡn|bon|chọc|choc|phá|pha)\b/i.test(value)) return true;
  return false;
}

function isKnownSource(source) {
  return [
    "hero_callback",
    "fares_callback",
    "schedule_card",
    "schedule_section",
    "contact_dock",
    "inline_section",
    "mobile_sticky",
    "final_cta",
    "direct",
    "website",
  ].indexOf(String(source || "")) >= 0;
}

function calculateFormDurationMs(payload) {
  const started = parseDateSafe(payload.formStartedAt);
  const submitted = parseDateSafe(payload.submittedAt);
  if (!started || !submitted) return null;
  return submitted.getTime() - started.getTime();
}

function getRecentRequestStats(ss, payload, now) {
  const sheet = ss.getSheetByName(APP.SHEETS.REQUEST_LOG);
  const stats = {
    samePhoneWindow: 0,
    samePhoneDay: 0,
    samePayloadWindow: 0,
    distinctNamesForPhoneDay: 0,
    sameClientRequestId: 0,
  };
  if (!sheet || sheet.getLastRow() < 2) return stats;

  const lastRow = sheet.getLastRow();
  const scan = Math.min(APP.SPAM.LOG_SCAN_ROWS, lastRow - 1);
  const startRow = lastRow - scan + 1;
  const values = sheet.getRange(startRow, 1, scan, 11).getValues();
  const windowStart = now.getTime() - APP.SPAM.WINDOW_MINUTES * 60 * 1000;
  const day = dateKey(now);
  const names = {};

  for (let i = values.length - 1; i >= 0; i--) {
    const row = values[i];
    const timestamp = parseDateSafe(row[0]);
    if (!timestamp) continue;

    const rowPhone = String(row[2] || "");
    const rowHash = String(row[3] || "");
    const rowName = String(row[9] || "").trim().toLowerCase();
    const rowClientRequestId = String(row[10] || "");

    if (rowPhone === payload.phone) {
      if (dateKey(timestamp) === day) {
        stats.samePhoneDay += 1;
        if (rowName) names[rowName] = true;
      }
      if (timestamp.getTime() >= windowStart) stats.samePhoneWindow += 1;
    }

    if (rowHash === payload.payloadHash && timestamp.getTime() >= windowStart) {
      stats.samePayloadWindow += 1;
    }
    if (payload.clientRequestId && rowClientRequestId === payload.clientRequestId) {
      stats.sameClientRequestId += 1;
    }
  }

  if (payload.name) names[String(payload.name).trim().toLowerCase()] = true;
  stats.distinctNamesForPhoneDay = Object.keys(names).length;
  return stats;
}

function getPhoneRegistryRecord(ss, phone) {
  if (!phone) return null;
  const sheet = ss.getSheetByName(APP.SHEETS.PHONE_REGISTRY);
  if (!sheet || sheet.getLastRow() < 2) return null;

  const finder = sheet
    .getRange(2, 1, sheet.getLastRow() - 1, 1)
    .createTextFinder(phone)
    .matchEntireCell(true)
    .findNext();
  if (!finder) return null;

  const row = finder.getRow();
  const values = sheet.getRange(row, 1, 1, 16).getValues()[0];
  return {
    row: row,
    phone: values[0],
    customerType: values[1],
    verification: values[2],
    status: values[3],
    firstSeen: values[4],
    lastSeen: values[5],
    submissions: Number(values[6]) || 0,
    confirmedBookings: Number(values[7]) || 0,
    totalPaid: Number(values[8]) || 0,
    favoriteRoute: values[9],
    spamStrikes: Number(values[10]) || 0,
    riskScore: Number(values[11]) || 0,
    blockReason: values[12],
    notes: values[13],
    lastName: values[14],
    updatedAt: values[15],
  };
}

function upsertPhoneRegistry(ss, payload, registry, risk, now) {
  const previousType = registry ? String(registry.customerType || "MỚI") : "MỚI";
  const verification = registry ? String(registry.verification || "CHƯA_XÁC_MINH") : "CHƯA_XÁC_MINH";
  const submissions = (registry ? registry.submissions : 0) + 1;
  const spamStrike = risk.score >= APP.SPAM.QUARANTINE_SCORE ? 1 : 0;
  const spamStrikes = (registry ? registry.spamStrikes : 0) + spamStrike;

  let type = previousType;
  let status = registry ? String(registry.status || "ACTIVE") : "ACTIVE";
  if (type === "MỚI" && spamStrikes >= 3) {
    type = "SUSPECT";
    status = "WATCH";
  }

  const blockReason = registry && registry.blockReason
    ? registry.blockReason
    : risk.hardBlock
      ? risk.reasons.join(" | ")
      : "";

  const values = [
    payload.phone,
    type,
    verification,
    status,
    registry && registry.firstSeen ? registry.firstSeen : now,
    now,
    submissions,
    registry ? registry.confirmedBookings : 0,
    registry ? registry.totalPaid : 0,
    payload.route || (registry ? registry.favoriteRoute : ""),
    spamStrikes,
    risk.score,
    blockReason,
    registry ? registry.notes : "",
    payload.name,
    now,
  ];

  const sheet = ss.getSheetByName(APP.SHEETS.PHONE_REGISTRY);
  let row;
  if (registry) {
    row = registry.row;
    sheet.getRange(row, 1, 1, values.length).setValues([values]);
  } else {
    sheet.appendRow(values);
    row = sheet.getLastRow();
  }
  sheet.getRange(row, 1).setNumberFormat("@");

  return {
    row: row,
    phone: payload.phone,
    customerType: type,
    verification: verification,
    status: status,
    firstSeen: values[4],
    lastSeen: now,
    submissions: submissions,
    confirmedBookings: Number(values[7]) || 0,
    totalPaid: Number(values[8]) || 0,
    favoriteRoute: values[9],
    spamStrikes: spamStrikes,
    riskScore: risk.score,
    blockReason: blockReason,
    notes: values[13],
    lastName: payload.name,
    updatedAt: now,
  };
}

function writeRequestLog(ss, record) {
  const sheet = ss.getSheetByName(APP.SHEETS.REQUEST_LOG);
  const payload = globalThis.__BSCN_CURRENT_PAYLOAD || {};
  sheet.appendRow([
    record.now,
    record.requestId,
    record.phone || payload.phone || "",
    record.payloadHash || payload.payloadHash || "",
    record.outcome || "",
    Number(record.score) || 0,
    record.reasons || "",
    record.source || payload.source || "",
    record.page || payload.page || "",
    record.name || payload.name || "",
    record.clientRequestId || payload.clientRequestId || "",
  ]);
}
