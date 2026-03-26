# Changelog

## [1.2.0] — 2026-03-26

### Added
- `FindText.gs` — case-insensitive substring search across all translation values on all sheets; results shown as a table

### Changed
- `ExportJson.gs`, `SortKeys.gs`, `UniqueChars.gs` — added toast notifications during processing

## [1.1.0] — 2026-03-26

### Added
- `ImportJson.gs` — imports a localization JSON and updates matching cells in the sheet
- `MissingTranslations.gs` — scans all sheets and reports keys with empty translations, grouped by language
- `SortKeys.gs` — sorts all rows alphabetically by key across all sheets

### Changed
- `FindKey.gs` — replaced deprecated `Browser.inputBox` with `SpreadsheetApp.getUi().prompt()`
- `UniqueChars.gs` — prompt now lists available language names from sheet headers
- `Menu.gs` — added menu items for Import JSON, Missing Translations, and Sort Keys

## [1.0.0] — 2026-03-26

### Added
- `Menu.gs` — single `onOpen` registering the **Localization Tools** menu
- `ExportJson.gs` — multi-sheet JSON export with configurable `LANG_MAP` and `LANG_ORDER`
- `FindKey.gs` — key search with optional duplicate detection across all sheets
- `UniqueChars.gs` — unique character extraction per language with Unicode range output