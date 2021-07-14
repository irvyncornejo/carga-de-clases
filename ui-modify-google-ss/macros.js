const clearCell = () => {
  var spreadsheet = SpreadsheetApp.getActive()
  spreadsheet.getCurrentCell().setValue('')
}