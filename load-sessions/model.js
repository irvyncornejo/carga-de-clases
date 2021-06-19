class Session{
  constructor(ssId='1RLCFNbERRAE1W4QBtMt3LHKmemFV0oHmHzQTxVuWgts', numberSession='Taller | Hoja 2'){
    this.numberSession = numberSession
    this.ss = SpreadsheetApp.openById(ssId)
  }
  create(){
    const dataSession = this.getSession()
    Logger.log(dataSession)
  }
  validate(){
    const sheetData = this.ss.getSheetByName(this.numberSession)
    return sheetData
  }
  getSession(){
    const data = this.validate()
    const lastRow = data.getLastRow()
    const dataSession = {
      course: data.getRange('C2').getValue(),
      teachers: data.getRange('C3:C4').getValues().map(teacher => teacher[0]),
      session: data.getRange('C5').getValue(),
      period: data.getRange('F2').getValue(),
      grade: data.getRange('F3').getValue(),
      hours: data.getRange('F5').getValue(),
      purposes: data.getRange('C7').getValue()
    }
    dataSession['content'] = this.process(data.getRange(`B16:C${lastRow}`).getValues())
    return dataSession
  }
  process(content){
    const contentSession = {}
    content.forEach(value =>{
      if(value[0] === 'Diagrama|Imagen'){
        const links = this.trasnformLinksImg(value[1])
        contentSession[`${value[0].toLowerCase()}`] = links
      }
      else if(value[0] === 'Vídeo'){
        contentSession[`${value[0].toLowerCase()}`] = this.splitLinks(value[1])
      }
      else{
        contentSession[`${value[0].toLowerCase()}`] = value[1]
      }
    })
    return contentSession
  }
  
  trasnformLinksImg(links){
    const linksArray = this.splitLinks(links)
    const linksT = [] 
    linksArray.forEach(link => {
        if(link.includes('drive.google.com')){
          const indices = ['d/', '/view'].map(ind => link.indexOf(ind))
          const idImage = link.substring(indices[0]+2,indices[1])
          linksT.push(`https://drive.google.com/uc?export=view&id=${idImage}`)
        }
        else{
          linksT.push(link)
        }
    })
    return linksT
  }

  splitLinks(links){
    return links.includes(',') ? links.split(',') : [links]
  }

  update(){
    // TODO CONEXION CON LA BASE DE DATOS PARA AÑADIR EL VALOR DE LAS CLASES
  }
}

const test = () => new Session().create()


