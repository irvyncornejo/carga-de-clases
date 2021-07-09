const defineSheet = () => SpreadsheetApp.getActiveSheet()
const getUi = () => SpreadsheetApp.getUi()

const onOpen = (e) => { 
  const ui = getUi()
  try {
    const ss = defineSheet()
    for(cell in ranges){
      insertOpcions(ss, ranges[cell], Object.keys(examples)[cell])
      ss.getRange(ranges[cell]).setValue(Object.keys(examples)[cell])
    }
    const menu = new Menu(values, ui).create()
  }catch(e){
    ui.alert(`Error: ${e}`)
  }
}

const onEdit = (e) => {
  const range = e['range'].getA1Notation()
  const oldValue = e['oldValue'].trim()
  const keys = Object.keys(examples)
  if (ranges.includes(range) && keys.includes(oldValue)){
    viewExample(range, oldValue)
  }
  if(range === 'C5' || range === 'D5'){
    setNameSheet()
  }
}

const setNameSheet = () =>{
  const ss = defineSheet()
  const values = ['C5' , 'D5'].map(range => ss.getRange(range).getValue())
  ss.setName(`${values[1]}-${values[0]}`)
}

const openHelp = () => {
  ui = getUi()
  const htmlOutput = HtmlService
    .createHtmlOutputFromFile('index')
    .setTitle('Taxonomia Bloom')
  ui.showSidebar(htmlOutput);
}

const insertOpcions = (ss, cell, value) => {
  ss.getRange(cell).activate()
  ss.getRange(cell).setDataValidation(SpreadsheetApp.newDataValidation()
  .setAllowInvalid(false)
  .requireValueInList([`${value}`, 'Ejemplo'], true)
  .build())
}

const setValues = (range, value) => {
  const ss = defineSheet()
  ss.getRange(range).setValue(value)
}

const viewExample = (range, value) => {    
  const ui = getUi()
  const example = examples[`${value}`]
  ui.alert(example)
  setValues(range, value)
}
