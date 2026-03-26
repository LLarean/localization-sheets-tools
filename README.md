# 🌐 Localization Sheets Tools

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![stability-experimental](https://img.shields.io/badge/stability-experimental-orange.svg)]()
[![Platform: Google Sheets](https://img.shields.io/badge/Platform-Google%20Sheets-green.svg)]()

Google Apps Script utilities for managing game localization in Google Sheets.
Designed for projects using [Unity Localization](https://docs.unity3d.com/Packages/com.unity.localization@1.5/manual/index.html) or any JSON-based localization workflow.

## Features

- **Export JSON** — exports all sheets into a structured localization JSON, ready for Unity or any JSON-driven pipeline
- **Find Key** — instantly navigates to a key across all sheets
- **Find Key + Duplicates** — same, but also reports all duplicate entries
- **Unique Chars (current sheet)** — collects unique characters for a specific language; useful for font atlas generation
- **Unique Chars (all sheets)** — same across all sheets and languages

## Quick Start

No package manager required — copy the script files directly into your Apps Script project:

1. Open your Google Sheet
2. Go to **Extensions → Apps Script**
3. Create four script files and paste the contents from [`Scripts/`](Scripts/)
4. Save and reload the spreadsheet
5. The **Localization Tools** menu will appear in the menu bar

## Sheet Structure

Scripts expect the following layout:

| key | en | ru | ja | ... |
|-----|----|----|-----|-----|
| ui.start | Start | Начать | スタート | ... |
| ui.settings | Settings | Настройки | 設定 | ... |

- First column — localization keys
- First row — language identifiers (column headers)
- Multiple sheets are supported and processed together

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
| `FindKey.gs` | Finds a key by exact match; navigates to its cell |
| `UniqueChars.gs` | Collects unique characters per language or across all languages |

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
