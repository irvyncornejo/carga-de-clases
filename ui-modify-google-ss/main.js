const defineSheet = () => SpreadsheetApp.getActiveSheet()
const getUi = () => SpreadsheetApp.getUi()
const nameReferenceSheet = (ss, value) => ss.getName().includes(value)
const principalSheet = () => SpreadsheetApp.getActiveSpreadsheet()

const onOpen = (e) => {
  try{
    const ss = defineSheet()
    if(!(nameReferenceSheet(ss,'Referencia'))){
      for(cell in ranges){
        insertOpcions(ss, ranges[cell], Object.keys(examples)[cell])
        ss.getRange(ranges[cell]).setValue(Object.keys(examples)[cell])
      } 
    }
    new Menu(values, getUi()).create()
  }catch(e){
    getUi().alert(`Error: ${e}`)
  }
}

const onEdit = (e) => {
  const ss = defineSheet()
  try{
    const range = e['range'].getA1Notation()
    const oldValue = e['oldValue'].trim()
    const keys = Object.keys(examples)
    if(ranges.includes(range) && keys.includes(oldValue)){
      const example = new Examples(ss)
      example.view(range, oldValue)
    }
    if(range === 'C5' || range === 'D5'){
      new SetName(ss).sheet()
    }

    if((range === 'D2' || range === 'C2') && nameReferenceSheet(ss,'Referencia')){
      new SetName(ss).book()
    }

  }catch(e){
    Logger.log(e)
  }
}

const openHelp = () => {
  try{
    new Help().open()
  }
  catch(e){
    getUi().alert(e)
  }
}

const createMainFolder = () =>{
  const nameBook = SpreadsheetApp.getActive().getName()
  new FoldersSession().create(mainName=nameBook, null)
}

const createSecondaryFolder = () =>{
  const sheetName = defineSheet().getName()
  new FoldersSession().create(null, secondaryName=sheetName)
}

const insertOpcions = (ss, cell, value) => {
  ss.getRange(cell).setDataValidation(SpreadsheetApp.newDataValidation()
    .setAllowInvalid(false)
    .requireValueInList([`${value}`, 'Ejemplo'], true)
    .build())
}

const insertVideo = () => new Row('Vídeo').create()
const insertImage = () => new Row('Diagrama|Imagen').create()
const insertDoc = () => new Row('Documento').create()
const insertPresentation = () => new Row('Presentación').create()
const insertText = () => new Row('Texto').create()
const insertLink = () => new Row('Link').create()
