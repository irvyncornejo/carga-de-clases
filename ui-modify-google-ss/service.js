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

class Send{
  constructor(dataRequest){
    this.dataRequest = dataRequest
  }
  doRequest(){
    const access_token=ScriptApp.getOAuthToken()
    const url = "https://script.googleapis.com/v1/scripts/AKfycbyIpEaCY0AndtPsVIp6ncRRgZhdIws22iS33giEveI:run"
    const headers = {
      "Authorization": "Bearer " + access_token,
      "Content-Type": "application/json"
    }
    const payload = {
      'function': this.dataRequest.nameFuncion,
      'parameters': this.dataRequest.parameters,
      devMode: false
    }
    const res = UrlFetchApp.fetch(url, {
      method: this.dataRequest.method,
      headers: headers,
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    })  
    return JSON.parse(res)
    }
}

const sendSession = () =>{
  const dataRequest = {
    nameFuncion: 'readPeticion',
    parameters: [{
      id: `${SpreadsheetApp.getActiveSpreadsheet().getId()}`, 
      name: defineSheet().getSheetName()
    }],
    method: 'post'
  }
  const req = new Send(dataRequest).doRequest()
}

const insertVideo = () => new Row('Vídeo').create()
const insertImage = () => new Row('Diagrama|Imagen').create()
const insertDoc = () => new Row('Documento').create()
const insertPresentation = () => new Row('Presentación').create()
const insertText = () => new Row('Texto').create()
const insertLink = () => new Row('Link').create()


