function findText() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt('Find Text', 'Enter text to search (case-insensitive):', ui.ButtonSet.OK_CANCEL);
  if (response.getSelectedButton() !== ui.Button.OK) return;
  const query = response.getResponseText().trim();
  if (!query) return;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.toast('Searching\u2026', 'Find Text');

  const queryLower = query.toLowerCase();
  const results = [];

  for (const sheet of ss.getSheets()) {
    const data = sheet.getDataRange().getValues();
    if (data.length < 2) continue;
    const langs = data[0].slice(1);

    for (let i = 1; i < data.length; i++) {
      const key = data[i][0];
      if (!key) continue;

      langs.forEach((lang, idx) => {
        if (!lang) return;
        const val = data[i][idx + 1];
        if (!val && val !== 0) return;
        if (String(val).toLowerCase().includes(queryLower)) {
          results.push({ sheet: sheet.getName(), row: i + 1, key, lang, value: String(val) });
        }
      });
    }
  }

  if (results.length === 0) {
    ui.alert(`No results found for "${query}"`);
    return;
  }

  const html = HtmlService.createHtmlOutput(`
    <div style="padding:16px; font-family:monospace; font-size:12px;">
      <p id="summary" style="margin-top:0; color:#555;"></p>
      <table id="table" style="width:100%; border-collapse:collapse;"></table>
    </div>
    <script>
      const results = ${JSON.stringify(results)};
      const query = ${JSON.stringify(query)};

      document.getElementById('summary').textContent = results.length + ' result' + (results.length === 1 ? '' : 's') + ' for "' + query + '"';

      const table = document.getElementById('table');
      const header = table.insertRow();
      ['Sheet', 'Row', 'Key', 'Language', 'Value'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        th.style.cssText = 'text-align:left; padding:4px 8px; border-bottom:2px solid #ccc; white-space:nowrap;';
        header.appendChild(th);
      });

      results.forEach(({ sheet, row, key, lang, value }) => {
        const tr = table.insertRow();
        tr.style.borderBottom = '1px solid #eee';
        [sheet, row, key, lang, value].forEach((text, i) => {
          const td = tr.insertCell();
          td.textContent = text;
          td.style.cssText = 'padding:4px 8px; vertical-align:top;' + (i === 4 ? ' max-width:220px; word-break:break-word;' : ' white-space:nowrap;');
        });
      });
    </script>
  `).setWidth(750).setHeight(500);

  SpreadsheetApp.getUi().showModalDialog(html, `Find Text — ${results.length} result${results.length === 1 ? '' : 's'}`);
}
