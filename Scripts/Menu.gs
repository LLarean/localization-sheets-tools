function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Localization Tools')
    .addItem('Export JSON', 'exportToJson')
    .addItem('Import JSON', 'importFromJson')
    .addSeparator()
    .addItem('Find Key', 'findKey')
    .addItem('Find Key + Duplicates', 'findKeyWithDuplicates')
    .addItem('Find Text', 'findText')
    .addSeparator()
    .addItem('Missing Translations', 'findMissingTranslations')
    .addItem('Sort Keys', 'sortKeys')
    .addSeparator()
    .addItem('Unique Chars (current sheet)', 'exportUniqueCharacters')
    .addItem('Unique Chars (all sheets)', 'exportUniqueCharactersAll')
    .addSeparator()
    .addItem('Help', 'showHelp')
    .addToUi();
}
