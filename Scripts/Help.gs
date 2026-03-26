function showHelp() {
  const html = HtmlService.createHtmlOutput(`
    <div style="padding:20px; font-family:sans-serif; font-size:13px; line-height:1.6;">
      <h3 style="margin-top:0;">Localization Sheets Tools</h3>
      <p>Google Apps Script utilities for managing game localization in Google Sheets.</p>

      <table style="width:100%; border-collapse:collapse; margin-bottom:16px;">
        <tr><td style="padding:4px 0; color:#555;">Export JSON</td><td style="padding:4px 8px;">Exports all sheets to a structured localization JSON</td></tr>
        <tr><td style="padding:4px 0; color:#555;">Import JSON</td><td style="padding:4px 8px;">Parses a JSON and writes values back into the sheet</td></tr>
        <tr><td style="padding:4px 0; color:#555;">Find Key</td><td style="padding:4px 8px;">Navigates to a key; detects duplicates across all sheets</td></tr>
        <tr><td style="padding:4px 0; color:#555;">Find Text</td><td style="padding:4px 8px;">Searches for a text substring across all translation values</td></tr>
        <tr><td style="padding:4px 0; color:#555;">Missing Translations</td><td style="padding:4px 8px;">Lists keys with empty cells, grouped by language</td></tr>
        <tr><td style="padding:4px 0; color:#555;">Sort Keys</td><td style="padding:4px 8px;">Sorts all rows alphabetically by key across all sheets</td></tr>
        <tr><td style="padding:4px 0; color:#555;">Unique Chars</td><td style="padding:4px 8px;">Extracts unique characters per language with Unicode range</td></tr>
      </table>

      <hr style="border:none; border-top:1px solid #e0e0e0; margin:16px 0;">

      <p style="margin-bottom:6px;"><strong>Documentation &amp; source</strong></p>
      <p><a href="https://github.com/LLarean/localization-sheets-tools" target="_blank">github.com/LLarean/localization-sheets-tools</a></p>

      <p style="margin-bottom:6px; margin-top:16px;"><strong>Related tools</strong></p>
      <ul style="margin:0; padding-left:18px;">
        <li><a href="https://github.com/LLarean/localization-char-extractor" target="_blank">localization-char-extractor</a> — extract unique chars from JSON</li>
        <li><a href="https://github.com/LLarean/unity-glyph-font-checker" target="_blank">unity-glyph-font-checker</a> — check character coverage in TMP fonts</li>
        <li><a href="https://github.com/LLarean/unity-localization-key-collector" target="_blank">unity-localization-key-collector</a> — collect keys from prefabs and scenes</li>
      </ul>
    </div>
  `).setWidth(560).setHeight(420);

  SpreadsheetApp.getUi().showModalDialog(html, 'Help');
}
