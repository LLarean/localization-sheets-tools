// ============================================================
// CONFIG — adjust to match your spreadsheet structure
// ============================================================

// Map spreadsheet column headers to exported language names.
// Remove or leave empty to use column headers as-is.
const LANG_MAP = {
  'en': 'English',
  'ru': 'Russian',
  'fr': 'French',
  'de': 'German',
  'es': 'Spanish',
  'pt': 'Portuguese',
  'it': 'Italian',
  'ja': 'Japanese',
  'ko': 'Korean',
  'cn': 'ChineseTraditional',
  'id': 'Indonesian',
  'ar': 'Arabic',
  'Da': 'Danish',
  'Ni': 'Dutch',
  'No': 'Norwegian',
  'Fi': 'Finnish',
  'Th': 'Thai',
  'Tr': 'Turkish',
  'Sv': 'Swedish',
  'Vi': 'Vietnamese',
  'hi': 'Hindi',
  'ms': 'Malay',
  'Polish': 'Polish',
  'Portuguese-PT': 'PortuguesePT',
  'Китайский упр': 'ChineseSimplified',
  'Spanish-LA': 'SpanishLA',
  'CZ': 'Czech',
  'HU': 'Hungarian',
  'RO': 'Romanian',
  'UK': 'Ukrainian'
};

// Defines the order of languages in the exported JSON.
// Languages not listed here will be appended at the end in discovery order.
const LANG_ORDER = [
  'English', 'Russian', 'French', 'German', 'Spanish', 'Portuguese',
  'Italian', 'Japanese', 'Korean', 'ChineseTraditional', 'Indonesian',
  'Arabic', 'Danish', 'Dutch', 'Norwegian', 'Finnish', 'Thai',
  'Turkish', 'Swedish', 'Vietnamese', 'Hindi', 'Malay',
  'Polish', 'PortuguesePT', 'ChineseSimplified', 'SpanishLA',
  'Czech', 'Hungarian', 'Romanian', 'Ukrainian'
];

// ============================================================

function exportToJson() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.toast('Exporting\u2026', 'Export JSON');
  const langDicts = {};
  const discoveredOrder = [];

  for (const sheet of ss.getSheets()) {
    const data = sheet.getDataRange().getValues();
    if (data.length < 2) continue;

    const langs = data[0].slice(1).map(h => LANG_MAP[h] ?? h);

    langs.forEach(lang => {
      if (lang && !discoveredOrder.includes(lang)) discoveredOrder.push(lang);
    });

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const key = row[0];
      if (!key || key === '') continue;

      langs.forEach((lang, idx) => {
        if (!lang) return;
        let value = row[idx + 1];
        if (!value && value !== 0) return;

        if (typeof value === 'string' && (value.trim().startsWith('[') || value.trim().startsWith('{'))) {
          try { value = JSON.parse(value); } catch (e) {}
        }

        if (!langDicts[lang]) langDicts[lang] = {};
        langDicts[lang][key] = value;
      });
    }
  }

  // Merge LANG_ORDER with any discovered langs not listed there
  const order = [
    ...LANG_ORDER.filter(l => discoveredOrder.includes(l)),
    ...discoveredOrder.filter(l => !LANG_ORDER.includes(l))
  ];

  const result = { Localization: { files: [] } };

  for (const lang of order) {
    const dict = langDicts[lang];
    if (!dict || Object.keys(dict).length === 0) continue;
    result.Localization.files.push({ name: lang, content: JSON.stringify(dict) });
  }

  const jsonString = JSON.stringify(result, null, 2);
  const html = HtmlService.createHtmlOutput(`
    <button onclick="copyToClipboard()" style="margin-bottom:8px; padding:6px 16px; cursor:pointer;">
      Copy to clipboard
    </button>
    <textarea id="output" style="width:100%; height:88%; font-family:monospace;"></textarea>
    <script>
      document.getElementById('output').value = ${JSON.stringify(jsonString)};
      function copyToClipboard() {
        const el = document.getElementById('output');
        el.select();
        document.execCommand('copy');
      }
    </script>
  `).setWidth(800).setHeight(600);

  SpreadsheetApp.getUi().showModalDialog(html, 'Export Localization JSON');
}
