class SetNumberProject{
  constructor(){
    this.book = SpreadsheetApp.getActive()
    this.emailSoport = 'i@cualitec.com'
  }
  validate(){
    try{
      this.addEditor()
      this.sendEmail()
      this.createValue()
    }
    catch(e){
      Logger.log(e)
    }
  }

  addEditor(){
    this.book.addEditor(this.emailSoport)
  }
  sendEmail(){
    MailApp.sendEmail(this.emailSoport,
                  "Petición para validar el número de proyecto en GCP",
                  `Documento ${this.book.getUrl()}`);
  }

  createValue(){
    PropertiesService.getScriptProperties().setProperty('setNumber_', true)
  }
}

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
    const url = "https://script.googleapis.com/v1/scripts/AKfycbxVjihmW_tPmruq2Ys7xRbSGgZL809-W3e8xDFEOBmj1jxerNa9a57ONnDZYSuR8DJw:run"
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

const sendSession = async () =>{
  const message = (msj) => getUi().alert(msj)
  try{
    PropertiesService.getScriptProperties().getProperty('setNumber_') ? '' : new SetNumberProject().validate() 
    const dataRequest = {
      nameFuncion: 'readPeticion',
      parameters: [{
        id: `${SpreadsheetApp.getActiveSpreadsheet().getId()}`, 
        nameSheet: defineSheet().getSheetName(),
        userEmail: Session.getActiveUser().getEmail(),
        nameBook: SpreadsheetApp.getActive().getName(),
        erase: false,
      }],
      method: 'post'
    }
    const req = await new Send(dataRequest).doRequest()
    Logger.log(req)
    message(req.response.result)
  }
  catch(e){
    message(e)
  }
  
}

const insertVideo = () => new Row('Vídeo').create()
const insertImage = () => new Row('Diagrama|Imagen').create()
const insertDoc = () => new Row('Documento').create()
const insertPresentation = () => new Row('Presentación').create()
const insertText = () => new Row('Texto').create()
const insertLink = () => new Row('Link').create()


