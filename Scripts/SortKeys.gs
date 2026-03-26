function sortKeys() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Sort Keys',
    'Sort all rows alphabetically by key (column A) on all sheets?',
    ui.ButtonSet.OK_CANCEL
  );
  if (response !== ui.Button.OK) return;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.toast('Sorting\u2026', 'Sort Keys');

  for (const sheet of ss.getSheets()) {
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    if (lastRow < 3) continue;

    sheet.getRange(2, 1, lastRow - 1, lastCol).sort({ column: 1, ascending: true });
  }

  ui.alert('Done. All sheets sorted by key.');
}
