function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Localization Tools')
    .addItem('Export JSON', 'exportToJson')
    .addSeparator()
    .addItem('Find Key', 'findKey')
    .addItem('Find Key + Duplicates', 'findKeyWithDuplicates')
    .addSeparator()
    .addItem('Unique Chars (current sheet)', 'exportUniqueCharacters')
    .addItem('Unique Chars (all sheets)', 'exportUniqueCharactersAll')
    .addToUi();
}