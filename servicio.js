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
    response['ss'].getRange(response['cell']).setValue(this.type)
  }

  insertRow(){
    const ss = defineSheet()
    const lastRow = ss.getLastRow()
    ss.insertRowsAfter(lastRow, 1)
    ss.getRange(`C${lastRow+1}:H${lastRow+1}`).mergeAcross()
    return {cell:`B${lastRow+1}`, ss: ss}
  }

}

const insertVideo = () => new Row('Vídeo').create()
const insertImage = () => new Row('Diagrama|Imagen').create()
const insertDoc = () => new Row('Doc.Google').create()
const insertPresentation = () => new Row('Pres.Google').create()
const insertText = () => new Row('Texto').create()
const insertLink = () => new Row('Link').create()


