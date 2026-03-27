function findMissingTranslations() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.toast('Scanning all sheets for missing translations\u2026', 'Missing Translations', 30);

  const byLang = {};
  let total = 0;

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
        if (val === '' || val === null || val === undefined) {
          if (!byLang[lang]) byLang[lang] = 0;
          byLang[lang]++;
          total++;
        }
      });
    }
  }

  if (total === 0) {
    ss.toast('No missing translations found.', 'Missing Translations', 5);
    return;
  }

  const summary = Object.entries(byLang)
    .sort((a, b) => b[1] - a[1]);

  const html = HtmlService.createHtmlOutput(`
    <style>
      body { font-family: Arial, sans-serif; font-size: 13px; padding: 16px; margin: 0; }
      h2 { margin: 0 0 4px; font-size: 15px; }
      .subtitle { color: #888; margin: 0 0 12px; font-size: 12px; }
      table { width: 100%; border-collapse: collapse; }
      th, td { text-align: left; padding: 5px 8px; border-bottom: 1px solid #e0e0e0; }
      th { background: #f5f5f5; font-weight: 600; }
      .count { text-align: right; font-variant-numeric: tabular-nums; }
    </style>
    <h2>Missing Translations</h2>
    <p class="subtitle">${total} missing entries across ${summary.length} language(s)</p>
    <table>
      <thead><tr><th>Language</th><th class="count">Missing</th></tr></thead>
      <tbody>
        ${summary.map(([lang, count]) =>
          `<tr><td>${lang}</td><td class="count">${count}</td></tr>`
        ).join('')}
      </tbody>
    </table>
  `).setWidth(400).setHeight(Math.min(140 + summary.length * 32, 560));

  SpreadsheetApp.getUi().showModalDialog(html, 'Missing Translations');
}
