class FoldersSession{
  constructor(){
    this.idFolderRefe = principalSheet().getSheetByName('Referencia').getRange('B3')
    this.IDFOLDER = IDFOLDER
  }
  getBucket(id){
    return DriveApp.getFolderById(id)
  }
  create(mainName, secondaryName){
    if(mainName){
      const foldersName = this.getFolders()
      const existsId = this.idFolderRefe.getValue().length > 10
      foldersName.includes(mainName) || existsId
        ? this.setNameFolder(this.idFolderRefe.getValue(), mainName)
        : this.createMainFolder(mainName)
    }
    if(secondaryName){
      const cellValueIdFolder = defineSheet().getRange('H9')
      const existsId = cellValueIdFolder.getValue().length > 10
      const foldersName = this.getFolders(this.idFolderRefe.getValue())
      foldersName.includes(secondaryName) || existsId
        ? this.setNameFolder(cellValueIdFolder.getValue(), defineSheet().getSheetName())
        : this.createSecondFolder(secondaryName, this.idFolderRefe.getValue(), cellValueIdFolder)
    }
  }
  getFolders(id=false){
    const bucket = id ? this.getBucket(id) : this.getBucket(this.IDFOLDER)
    const foldersName = []
    const folders = bucket.getFolders()
    while (folders.hasNext()){
      let folderName = folders.next()
      foldersName.push(`${folderName}`)
    }
    return foldersName
  }
  createMainFolder(mainName){
    const bucket = this.getBucket(this.IDFOLDER)
    const folderId = bucket.createFolder(mainName).getId()
    this.idFolderRefe.setValue(`${folderId}`)
    return folderId
  }
  setNameFolder(id, mainName){
    DriveApp.getFolderById(id).setName(mainName)
  }
  createSecondFolder(name, id, cell){
    const bucket = this.getBucket(id)
    const folderId = bucket.createFolder(name).getId()
    cell.setValue(`${folderId}`)
  }
}

class Examples{
  constructor(ss){
    this.ss = ss
    this.ui = getUi()
  }
  view(range, value){
    const example = examples[`${value}`]
    this.ui.alert(example)
    this.setValues(range, value)
  }
  setValues(range, value){
    this.ss.getRange(range).setValue(value)
  }
}

class SetName{
  constructor(ss){
    this.ss = ss
  }
  sheet(){
    const values = ['C5' , 'D5'].map(range => this.ss.getRange(range).getValue())
    this.ss.setName(`${values[1]}-${values[0]}`)
    return `${values[1]}-${values[0]}`
  }
  book(){
    const book = SpreadsheetApp.getActive()
    const nameList = this.ss.getRange('B2:D2')
    const name = nameList.getValues()[0].join(' | ')
    book.rename(name)
    return name
  }
}

class Help{
  constructor(){
    this.ui = getUi()
  }
  open(){
    const htmlOutput = HtmlService
      .createHtmlOutputFromFile('index')
      .setTitle('Taxonomia Bloom')
    this.ui.showSidebar(htmlOutput)
  }
}

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
    const url = URLAPI
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
    message(req.response.result)
  }
  catch(e){
    message(e)
  }
  
}


