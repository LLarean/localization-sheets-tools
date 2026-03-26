# 🌐 Localization Sheets Tools

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![stability-experimental](https://img.shields.io/badge/stability-experimental-orange.svg)]()
[![Platform: Google Sheets](https://img.shields.io/badge/Platform-Google%20Sheets-green.svg)]()

Google Apps Script utilities for managing game localization in Google Sheets.
Designed for projects using [Unity Localization](https://docs.unity3d.com/Packages/com.unity.localization@1.5/manual/index.html) or any JSON-based localization workflow.

## Features

- **Export JSON** — exports all sheets into a structured localization JSON, ready for Unity or any JSON-driven pipeline
- **Import JSON** — parses a localization JSON and writes values back into the sheet
- **Find Key** — instantly navigates to a key across all sheets
- **Find Key + Duplicates** — same, but also reports all duplicate entries
- **Find Text** — searches for a substring across all translation values on all sheets
- **Missing Translations** — scans all sheets and lists keys with empty cells per language
- **Sort Keys** — sorts all rows alphabetically by key across all sheets
- **Unique Chars (current sheet)** — collects unique characters for a specific language; useful for font atlas generation
- **Unique Chars (all sheets)** — same across all sheets and languages

## Quick Start

Two ways to install — manually or via [clasp](https://github.com/google/clasp).

### Option A — Manual

No package manager required:

1. Open your Google Sheet
2. Go to **Extensions → Apps Script**
3. Create a file for each script in [`Scripts/`](Scripts/) and paste the contents
4. Save and reload the spreadsheet
5. The **Localization Tools** menu will appear in the menu bar

### Option B — clasp (recommended for updates)

[clasp](https://github.com/google/clasp) is Google's official CLI for Apps Script — push all files in one command.

**First time setup:**

```bash
npm install -g @google/clasp
clasp login
```

1. Open your Google Sheet → **Extensions → Apps Script**
2. Go to **Project Settings** and copy the **Script ID**
3. In the repo root, copy `.clasp.json.example` to `.clasp.json` and paste your Script ID:
```json
{
  "scriptId": "YOUR_SCRIPT_ID_HERE",
  "rootDir": "./Scripts"
}
```
4. Push all scripts:
```bash
clasp push
```
5. Reload the spreadsheet — the **Localization Tools** menu will appear

**Updating later:**

```bash
clasp push
```

That's it — all changes are live immediately.

## Sheet Structure

Scripts expect the following layout:

| key | en | ru | ja | ... |
|-----|----|----|-----|-----|
| ui.start | Start | Начать | スタート | ... |
| ui.settings | Settings | Настройки | 設定 | ... |

- First column — localization keys
- First row — language identifiers (column headers)
- Multiple sheets are supported and processed together

## Usage

All tools are available via the **Localization Tools** menu in the spreadsheet menu bar.

### Export JSON
Click **Export JSON** — a dialog opens with the full localization JSON. Use the **Copy to clipboard** button to copy it for use in your project.

### Import JSON
Click **Import JSON** — paste a localization JSON into the dialog and click **Import**. The script matches each language by name (using `LANG_MAP` if configured) and updates the corresponding cells. Only existing keys are updated; new keys are not added.

### Find Text
Click **Find Text** — enter any text fragment. The script searches case-insensitively across all translation columns on all sheets and shows results in a table: sheet, row, key, language, and matched value.

### Find Key / Find Key + Duplicates
Click **Find Key** — enter a key name. The sheet will scroll to the first match.
Click **Find Key + Duplicates** — same, but scans all sheets and reports every occurrence if the key appears more than once.

### Missing Translations
Click **Missing Translations** — the script scans all sheets and shows a dialog with all keys that have at least one empty cell, grouped by language.

### Sort Keys
Click **Sort Keys** — confirm the prompt. All rows on all sheets are sorted alphabetically by key (column A). Row 1 (headers) is not affected.

### Unique Chars (current sheet)
Click **Unique Chars (current sheet)** — enter a language name from the header row, or leave empty to collect characters from all languages on the active sheet. The dialog shows a character string, a JSON array, and a Unicode range — ready to paste into a font tool.

### Unique Chars (all sheets)
Click **Unique Chars (all sheets)** — same as above, but aggregates characters across all sheets, grouped by language.

## Configuration

Open `ExportJson.gs` and adjust the config section at the top of the file:
```javascript
// Map spreadsheet column headers to exported language names.
// Remove or leave empty to use column headers as-is.
const LANG_MAP = {
  'en': 'English',
  'ru': 'Russian',
  // ...
};

// Defines the order of languages in the exported JSON.
const LANG_ORDER = [
  'English', 'Russian', // ...
];
```

If your column headers already match the names you want in the JSON output — clear `LANG_MAP` and leave it as an empty object `{}`.

## Export Format

The exported JSON follows this structure:
```json
{
  "Localization": {
    "files": [
      {
        "name": "English",
        "content": "{\"ui.start\":\"Start\",\"ui.settings\":\"Settings\"}"
      },
      {
        "name": "Russian",
        "content": "{\"ui.start\":\"Начать\",\"ui.settings\":\"Настройки\"}"
      }
    ]
  }
}
```

## Scripts

| File | Description |
|------|-------------|
| `Menu.gs` | Registers the **Localization Tools** menu on spreadsheet open |
| `ExportJson.gs` | Exports all sheets to a localization JSON |
| `ImportJson.gs` | Parses a localization JSON and updates matching cells in the sheet |
| `FindKey.gs` | Finds a key by exact match; navigates to its cell |
| `FindText.gs` | Searches for a text substring across all translation values |
| `MissingTranslations.gs` | Reports keys with empty translations, grouped by language |
| `SortKeys.gs` | Sorts all rows alphabetically by key across all sheets |
| `UniqueChars.gs` | Collects unique characters per language or across all languages |
| `Help.gs` | Shows a help dialog with tool descriptions and links to related utilities |

## Related Tools

This script set is part of a broader localization pipeline for Unity projects:

| Tool | Description |
|------|-------------|
| [unity-glyph-font-checker](https://github.com/LLarean/unity-glyph-font-checker) | Editor utility for checking character coverage in TMP and Unity fonts |
| [localization-char-extractor](https://github.com/LLarean/localization-char-extractor) | Browser-based utility for extracting unique characters from localization JSON files |
| [unity-localization-key-collector](https://github.com/LLarean/unity-localization-key-collector) | Editor utility for collecting localization keys from prefabs, scenes, and code |

## Requirements

- Google Sheets
- Google Apps Script (no additional dependencies)

## Contributing

Contributions are welcome:

- **Bug reports**: [Open an issue](../../issues)
- **Feature requests**: Describe your use case in an issue
- **Pull requests**: For bug fixes or improvements

---

<div align="center">

**Made with ❤️ for the gamedev community**

⭐ If this project helped you, please consider giving it a star!

</div>
