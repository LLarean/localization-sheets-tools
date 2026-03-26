function exportUniqueCharacters() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const data = ss.getActiveSheet().getDataRange().getValues();
  const langs = data[0].slice(1);
  const ui = SpreadsheetApp.getUi();

  const response = ui.prompt(
    'Unique Characters',
    'Enter language name (as in header) or leave empty for all:',
    ui.ButtonSet.OK_CANCEL
  );
  if (response.getSelectedButton() !== ui.Button.OK) return;

  const targetLang = response.getResponseText().trim();
  const uniqueChars = new Set();

  let langIndices = targetLang
    ? [langs.findIndex(l => l === targetLang)]
    : langs.map((_, i) => i);

  if (targetLang && langIndices[0] === -1) {
    ui.alert(`Language "${targetLang}" not found`);
    return;
  }

  for (let i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    langIndices.forEach(idx => {
      const val = data[i][idx + 1];
      if (val) String(val).split('').forEach(c => uniqueChars.add(c));
    });
  }

  showCharsDialog(Array.from(uniqueChars).sort(), 'Unique Characters');
}

function exportUniqueCharactersAll() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();
  const langChars = {};

  for (const sheet of sheets) {
    const data = sheet.getDataRange().getValues();
    if (data.length < 2) continue;
    const langs = data[0].slice(1);

    langs.forEach(lang => { if (lang) langChars[lang] = langChars[lang] || new Set(); });

    for (let i = 1; i < data.length; i++) {
      if (!data[i][0]) continue;
      langs.forEach((lang, idx) => {
        const val = data[i][idx + 1];
        if (lang && val) String(val).split('').forEach(c => langChars[lang].add(c));
      });
    }
  }

  const sectionsData = Object.entries(langChars)
    .filter(([, set]) => set.size > 0)
    .map(([lang, set]) => ({ lang, chars: Array.from(set).sort() }));

  const html = HtmlService.createHtmlOutput(`
    <div id="container" style="padding:20px; font-family:monospace; font-size:12px;"></div>
    <script>
      const sections = ${JSON.stringify(sectionsData)};
      const container = document.getElementById('container');

      sections.forEach(({ lang, chars }) => {
        const unicodeRange = generateUnicodeRange(chars);
        const div = document.createElement('div');
        div.style.marginBottom = '24px';

        const h3 = document.createElement('h3');
        h3.textContent = lang + ' \u2014 ' + chars.length + ' chars';

        const h4a = document.createElement('h4');
        h4a.textContent = 'String (Custom Characters):';
        const ta1 = document.createElement('textarea');
        ta1.style.cssText = 'width:100%; height:60px;';
        ta1.value = chars.join('');

        const h4b = document.createElement('h4');
        h4b.textContent = 'Unicode Range:';
        const ta2 = document.createElement('textarea');
        ta2.style.cssText = 'width:100%; height:40px;';
        ta2.value = unicodeRange;

        div.append(h3, h4a, ta1, h4b, ta2, document.createElement('hr'));
        container.appendChild(div);
      });

      function generateUnicodeRange(chars) {
        const codes = chars.map(c => c.charCodeAt(0)).sort((a, b) => a - b);
        const ranges = [];
        let start = codes[0], end = codes[0];
        for (let i = 1; i <= codes.length; i++) {
          if (codes[i] === end + 1) {
            end = codes[i];
          } else {
            ranges.push(start === end
              ? start.toString(16).toUpperCase()
              : start.toString(16).toUpperCase() + '-' + end.toString(16).toUpperCase()
            );
            start = end = codes[i];
          }
        }
        return ranges.join(',');
      }
    </script>
  `).setWidth(700).setHeight(700);

  SpreadsheetApp.getUi().showModalDialog(html, 'Unique Characters \u2014 All Languages');
}

function showCharsDialog(chars, title) {
  const charsString = chars.join('');
  const charsJson = JSON.stringify(chars);
  const unicodeRange = generateUnicodeRange(chars);

  const html = HtmlService.createHtmlOutput(`
    <div style="padding:20px; font-family:monospace;">
      <h3 id="count"></h3>
      <h4>String (Custom Characters):</h4>
      <textarea id="chars-string" style="width:100%; height:80px;"></textarea>
      <h4>Array:</h4>
      <textarea id="chars-array" style="width:100%; height:160px;"></textarea>
      <h4>Unicode Range:</h4>
      <textarea id="chars-unicode" style="width:100%; height:60px;"></textarea>
    </div>
    <script>
      document.getElementById('count').textContent = ${chars.length} + ' unique characters';
      document.getElementById('chars-string').value = ${JSON.stringify(charsString)};
      document.getElementById('chars-array').value = ${JSON.stringify(charsJson)};
      document.getElementById('chars-unicode').value = ${JSON.stringify(unicodeRange)};
    </script>
  `).setWidth(600).setHeight(450);

  SpreadsheetApp.getUi().showModalDialog(html, title);
}

function generateUnicodeRange(chars) {
  const codes = chars.map(c => c.charCodeAt(0)).sort((a, b) => a - b);
  const ranges = [];
  let start = codes[0], end = codes[0];

  for (let i = 1; i <= codes.length; i++) {
    if (codes[i] === end + 1) {
      end = codes[i];
    } else {
      ranges.push(start === end
        ? start.toString(16).toUpperCase()
        : `${start.toString(16).toUpperCase()}-${end.toString(16).toUpperCase()}`
      );
      start = end = codes[i];
    }
  }

  return ranges.join(',');
}