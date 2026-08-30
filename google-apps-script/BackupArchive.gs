/**
 * Daily backup, storage monitoring, automatic database rollover and maintenance triggers.
 */

function createDailyBackup() {
  const ss = getSpreadsheet();
  const props = PropertiesService.getScriptProperties();
  const today = dateKey(new Date());
  const lastBackup = props.getProperty("LAST_BACKUP_DATE");

  if (lastBackup === today) {
    Logger.log("Backup hôm nay đã tồn tại.");
    return "already-backed-up";
  }

  const folder = getOrCreateBackupFolder();
  const file = DriveApp.getFileById(ss.getId());
  const name =
    "BSCN_BACKUP_" + Utilities.formatDate(new Date(), APP.TZ, "yyyyMMdd_HHmmss") + "_" + ss.getName();
  const copy = file.makeCopy(name, folder);
  props.setProperty("LAST_BACKUP_DATE", today);
  props.setProperty("LAST_BACKUP_FILE_ID", copy.getId());
  Logger.log("✅ Backup: " + copy.getUrl());
  return copy.getUrl();
}

function forceBackupNow() {
  PropertiesService.getScriptProperties().deleteProperty("LAST_BACKUP_DATE");
  return createDailyBackup();
}

function getOrCreateBackupFolder() {
  const props = PropertiesService.getScriptProperties();
  const existingId = props.getProperty("BACKUP_FOLDER_ID");
  if (existingId) {
    try {
      const folder = DriveApp.getFolderById(existingId);
      folder.getName();
      return folder;
    } catch (error) {
      props.deleteProperty("BACKUP_FOLDER_ID");
    }
  }

  const folders = DriveApp.getFoldersByName(APP.BACKUP.BACKUP_FOLDER_NAME);
  const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(APP.BACKUP.BACKUP_FOLDER_NAME);
  props.setProperty("BACKUP_FOLDER_ID", folder.getId());
  return folder;
}

function pruneOldDailyBackups() {
  const folder = getOrCreateBackupFolder();
  const cutoff = Date.now() - APP.BACKUP.DAILY_RETENTION_DAYS * 24 * 60 * 60 * 1000;
  const files = folder.getFiles();
  let removed = 0;
  while (files.hasNext()) {
    const file = files.next();
    if (!String(file.getName()).startsWith("BSCN_BACKUP_")) continue;
    if (file.getDateCreated().getTime() < cutoff) {
      file.setTrashed(true);
      removed += 1;
    }
  }
  Logger.log("Đã dọn " + removed + " daily backup cũ.");
  return removed;
}

function getSpreadsheetCellUsage(ss) {
  let used = 0;
  ss.getSheets().forEach(function (sheet) {
    used += sheet.getMaxRows() * sheet.getMaxColumns();
  });
  return {
    cells: used,
    limit: APP.BACKUP.GOOGLE_SHEETS_CELL_LIMIT,
    ratio: used / APP.BACKUP.GOOGLE_SHEETS_CELL_LIMIT,
  };
}

function checkAndRolloverDatabase() {
  const ss = getSpreadsheet();
  const usage = getSpreadsheetCellUsage(ss);
  Logger.log(
    "Cell usage: " +
      usage.cells +
      "/" +
      usage.limit +
      " (" +
      (usage.ratio * 100).toFixed(1) +
      "%)",
  );

  if (usage.ratio < APP.BACKUP.ROLLOVER_RATIO) {
    try {
      SpreadsheetApp.getActive().toast(
        "Dung lượng ước tính: " + (usage.ratio * 100).toFixed(1) + "% — chưa cần rollover.",
        "BSCN CRM",
        5,
      );
    } catch (error) {
      // no active UI during scheduled trigger
    }
    return { rolledOver: false, usage: usage };
  }

  const newUrl = rolloverDatabase(ss, usage);
  return { rolledOver: true, usage: usage, newUrl: newUrl };
}

function rolloverDatabase(oldSs, usage) {
  // Luôn tạo backup trước khi chuyển database active.
  PropertiesService.getScriptProperties().deleteProperty("LAST_BACKUP_DATE");
  createDailyBackup();

  const now = new Date();
  const stamp = Utilities.formatDate(now, APP.TZ, "yyyyMMdd_HHmmss");
  const oldName = oldSs.getName();
  const oldId = oldSs.getId();
  const archiveName = oldName.replace(/_ACTIVE.*/i, "") + "_ARCHIVE_" + stamp;
  DriveApp.getFileById(oldId).setName(archiveName);

  const newName = "nhaxecuongnguyetdatabase_ACTIVE_" + stamp;
  const newSs = SpreadsheetApp.create(newName);
  setupSystemForSpreadsheet(newSs);

  // Giữ bộ nhớ khách hàng, lịch sử kế toán và index archive qua các thế hệ database.
  copyPersistentSheetValues(oldSs, newSs, APP.SHEETS.PHONE_REGISTRY);
  copyPersistentSheetValues(oldSs, newSs, APP.SHEETS.ACCOUNTING_DAILY);
  copyPersistentSheetValues(oldSs, newSs, APP.SHEETS.ARCHIVE_INDEX);
  copyPersistentSheetValues(oldSs, newSs, APP.SHEETS.CONFIG);

  const archiveIndex = newSs.getSheetByName(APP.SHEETS.ARCHIVE_INDEX);
  const leadSheet = oldSs.getSheetByName(APP.SHEETS.LEADS_RAW);
  const requestSheet = oldSs.getSheetByName(APP.SHEETS.REQUEST_LOG);
  const range = getDataDateRange(oldSs);
  archiveIndex.appendRow([
    now,
    oldId,
    archiveName,
    oldSs.getUrl(),
    range.from || "",
    range.to || "",
    leadSheet ? Math.max(0, leadSheet.getLastRow() - 1) : 0,
    requestSheet ? Math.max(0, requestSheet.getLastRow() - 1) : 0,
    "AUTO_ROLLOVER_" + (usage.ratio * 100).toFixed(1) + "%",
  ]);

  const props = PropertiesService.getScriptProperties();
  props.setProperty("ACTIVE_SPREADSHEET_ID", newSs.getId());
  props.setProperty("PREVIOUS_SPREADSHEET_ID", oldId);
  props.setProperty("LAST_ROLLOVER_AT", now.toISOString());
  props.deleteProperty("LAST_BACKUP_DATE");

  refreshAccountingDaily(newSs);
  refreshDashboard(newSs);
  Logger.log("✅ Rollover hoàn tất: " + newSs.getUrl());
  return newSs.getUrl();
}

function copyPersistentSheetValues(sourceSs, targetSs, sheetName) {
  const source = sourceSs.getSheetByName(sheetName);
  const target = targetSs.getSheetByName(sheetName);
  if (!source || !target || source.getLastRow() < 1 || source.getLastColumn() < 1) return;

  const values = source.getRange(1, 1, source.getLastRow(), source.getLastColumn()).getValues();
  target.clearContents();
  if (target.getMaxColumns() < values[0].length) {
    target.insertColumnsAfter(target.getMaxColumns(), values[0].length - target.getMaxColumns());
  }
  if (target.getMaxRows() < values.length) {
    target.insertRowsAfter(target.getMaxRows(), values.length - target.getMaxRows());
  }
  target.getRange(1, 1, values.length, values[0].length).setValues(values);
}

function getDataDateRange(ss) {
  const leads = ss.getSheetByName(APP.SHEETS.LEADS_RAW);
  if (!leads || leads.getLastRow() < 2) return { from: "", to: "" };
  const times = leads.getRange(2, 2, leads.getLastRow() - 1, 1).getValues();
  let min = null;
  let max = null;
  times.forEach(function (row) {
    const d = parseDateSafe(row[0]);
    if (!d) return;
    if (!min || d.getTime() < min.getTime()) min = d;
    if (!max || d.getTime() > max.getTime()) max = d;
  });
  return { from: min || "", to: max || "" };
}

function installMaintenanceTriggers() {
  const handlers = ["maintenanceDaily", "maintenanceHourly"];
  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    if (handlers.indexOf(trigger.getHandlerFunction()) >= 0) {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger("maintenanceDaily").timeBased().everyDays(1).atHour(2).create();
  ScriptApp.newTrigger("maintenanceHourly").timeBased().everyHours(1).create();

  try {
    SpreadsheetApp.getActive().toast(
      "Đã cài trigger: backup/bảo trì hằng ngày + dashboard mỗi giờ.",
      "BSCN CRM",
      5,
    );
  } catch (error) {
    // Scheduled execution has no UI.
  }
  return true;
}

function maintenanceDaily() {
  try {
    createDailyBackup();
  } catch (error) {
    Logger.log("Daily backup error: " + error.toString());
  }
  try {
    pruneOldDailyBackups();
  } catch (error) {
    Logger.log("Backup pruning error: " + error.toString());
  }
  try {
    checkAndRolloverDatabase();
  } catch (error) {
    Logger.log("Rollover check error: " + error.toString());
  }
  try {
    const ss = getSpreadsheet();
    refreshAccountingDaily(ss);
    refreshDashboard(ss);
  } catch (error) {
    Logger.log("Daily report refresh error: " + error.toString());
  }
}

function maintenanceHourly() {
  try {
    const ss = getSpreadsheet();
    refreshAccountingDaily(ss);
    refreshDashboard(ss);
  } catch (error) {
    Logger.log("Hourly report refresh error: " + error.toString());
  }
}
