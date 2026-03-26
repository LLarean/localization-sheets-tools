function findMissingTranslations() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const missing = [];

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
          missing.push({ sheet: sheet.getName(), key, lang });
        }
      });
    }
  }

  if (missing.length === 0) {
    SpreadsheetApp.getUi().alert('No missing translations found.');
    return;
  }

  const byLang = {};
  missing.forEach(({ sheet, key, lang }) => {
    if (!byLang[lang]) byLang[lang] = [];
    byLang[lang].push(`${sheet} \u2192 ${key}`);
  });

  const sectionsData = Object.entries(byLang).map(([lang, keys]) => ({ lang, keys }));

  const html = HtmlService.createHtmlOutput(`
    <div id="container" style="padding:20px; font-family:monospace; font-size:13px;"></div>
    <script>
      const sections = ${JSON.stringify(sectionsData)};
      const container = document.getElementById('container');

      sections.forEach(({ lang, keys }, i) => {
        if (i > 0) container.appendChild(document.createElement('hr'));
        const div = document.createElement('div');
        div.style.marginBottom = '20px';

        const h3 = document.createElement('h3');
        h3.textContent = lang + ' \u2014 ' + keys.length + ' missing';

        const ta = document.createElement('textarea');
        ta.style.cssText = 'width:100%; height:120px;';
        ta.value = keys.join('\n');

        div.append(h3, ta);
        container.appendChild(div);
      });
    </script>
  `).setWidth(600).setHeight(500);

  SpreadsheetApp.getUi().showModalDialog(html, `Missing Translations \u2014 ${missing.length} total`);
}
