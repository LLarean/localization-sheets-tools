function importFromJson() {
  const html = HtmlService.createHtmlOutput(`
    <div style="padding:16px; font-family:monospace; height:100%; box-sizing:border-box; display:flex; flex-direction:column;">
      <p style="margin-top:0;">Paste localization JSON:</p>
      <textarea id="input" style="flex:1; width:100%; font-family:monospace; margin-bottom:8px;" placeholder='{"Localization":{"files":[...]}}'></textarea>
      <div>
        <button onclick="submit()" style="padding:6px 16px; cursor:pointer;">Import</button>
        <span id="status" style="margin-left:12px; color:gray;"></span>
      </div>
    </div>
    <script>
      function submit() {
        const val = document.getElementById('input').value.trim();
        if (!val) return;
        const status = document.getElementById('status');
        status.style.color = 'gray';
        status.textContent = 'Processing\u2026';
        google.script.run
          .withSuccessHandler(msg => {
            status.style.color = 'green';
            status.textContent = msg;
          })
          .withFailureHandler(err => {
            status.style.color = 'red';
            status.textContent = err.message;
          })
          .processImport(val);
      }
    </script>
  `).setWidth(700).setHeight(500);

  SpreadsheetApp.getUi().showModalDialog(html, 'Import Localization JSON');
}

// Called from the client via google.script.run.
// References LANG_MAP from ExportJson.gs — all .gs files share the same global scope in Apps Script.
function processImport(jsonString) {
  let data;
  try {
    data = JSON.parse(jsonString);
  } catch (e) {
    throw new Error('Invalid JSON: ' + e.message);
  }

  const files = data?.Localization?.files;
  if (!Array.isArray(files)) throw new Error('Expected { Localization: { files: [...] } }');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let updatedCount = 0;

  for (const file of files) {
    const langName = file.name;
    let content;
    try {
      content = typeof file.content === 'string' ? JSON.parse(file.content) : file.content;
    } catch (e) {
      continue;
    }
    if (!content || typeof content !== 'object') continue;

    for (const sheet of ss.getSheets()) {
      const sheetData = sheet.getDataRange().getValues();
      if (sheetData.length < 2) continue;

      const headers = sheetData[0];
      // Match by mapped name or raw header name
      const langCol = headers.findIndex(
        (h, i) => i > 0 && ((LANG_MAP[h] ?? h) === langName)
      );
      if (langCol === -1) continue;

      for (let i = 1; i < sheetData.length; i++) {
        const key = sheetData[i][0];
        if (!key || !(key in content)) continue;
        let value = content[key];
        if (typeof value === 'object') value = JSON.stringify(value);
        sheet.getRange(i + 1, langCol + 1).setValue(value);
        updatedCount++;
      }
    }
  }

  return `Done. ${updatedCount} cells updated.`;
}
