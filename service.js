class Menu{
  constructor(values, ui){
    this.values = values
    this.ui = ui
  }
  create(){
    const menus = Object.keys(this.values)
    menus.forEach(menu => {
      const menuUI = this.ui.createMenu(menu)
      const items = this.values[`${menu}`]
      items.forEach(item => {
        menuUI.addItem(item[0], item[1])
      })
    menuUI.addToUi()
    })
  }
}

class Row{
  constructor(type){
    this.type = type
  }
  create(){
    const response = this.insertRow()
    this.setValueCell(response)
  }
  setValueCell(response){
    const descriptionType = getDescriptionType(this.type)
    response['range'].setValue(descriptionType)
    response['ss'].getRange(response['cell']).setValue(this.type)
  }

  insertRow(){
    const ss = defineSheet()
    const lastRow = ss.getLastRow()
    ss.insertRowsAfter(lastRow, 1)
    const rangeValue = ss.getRange(`C${lastRow+1}:H${lastRow+1}`)
    rangeValue.mergeAcross()
    rangeValue.setBorder(null, true, true, true, null, null, '#000000', SpreadsheetApp.BorderStyle.DASHED)
    ss.setRowHeight(lastRow+1, 60)
    return {cell:`B${lastRow+1}`, ss: ss, range: rangeValue}
  }
}

const insertVideo = () => new Row('Vídeo').create()
const insertImage = () => new Row('Diagrama|Imagen').create()
const insertDoc = () => new Row('Documento').create()
const insertPresentation = () => new Row('Presentación').create()
const insertText = () => new Row('Texto').create()
const insertLink = () => new Row('Link').create()


