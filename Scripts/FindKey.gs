function findKey() {
  const key = Browser.inputBox('Find Key', 'Enter localization key:', Browser.Buttons.OK_CANCEL);
  if (key === 'cancel' || !key) return;
  findKeyInSheets(key, false);
}

function findKeyWithDuplicates() {
  const key = Browser.inputBox('Find Key', 'Enter localization key:', Browser.Buttons.OK_CANCEL);
  if (key === 'cancel' || !key) return;
  findKeyInSheets(key, true);
}

function findKeyInSheets(key, checkDuplicates) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const found = [];

  for (const sheet of ss.getSheets()) {
    const data = sheet.getRange(1, 1, sheet.getLastRow(), 1).getValues();
    data.forEach((r, i) => {
      if (r[0] === key) found.push({ sheet, row: i + 1 });
    });
    if (!checkDuplicates && found.length > 0) break;
  }

  if (found.length === 0) {
    SpreadsheetApp.getUi().alert(`Key "${key}" not found`);
    return;
  }

  const first = found[0];
  ss.setActiveSheet(first.sheet);
  first.sheet.setActiveRange(first.sheet.getRange(first.row, 1));

  if (checkDuplicates && found.length > 1) {
    const list = found.map(f => `"${f.sheet.getName()}", row ${f.row}`).join('\n');
    SpreadsheetApp.getUi().alert(`Duplicates found:\n${list}`);
  }
}