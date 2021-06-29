class Session{
  constructor(e){
    this.numberSession = e.name
    this.ss = SpreadsheetApp.openById(e.id)
  }
  create(){
    const dataSession = this.getSession()
    return dataSession
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
      title: data.getRange('C6').getValue(),
      purposes: data.getRange('C8').getValue()
    }
    dataSession['content'] = this.process(data.getRange(`B17:C${lastRow}`).getValues())
    return dataSession
  }
  process(content){
    const contentSession = {}
    content.forEach(value =>{
      if(value[0] === 'Diagrama|Imagen'){
        const links = this.trasnformLinksImg(value[1])
        contentSession[`${value[0].toLowerCase()}`] = links
      }
      else if(value[0] === 'Vídeo' || value[0] === 'Documento' || value[0] === 'Link'){
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
    linksArray.forEach(link =>{
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
    const separateLinks = links.includes(',') ? links.split(',') : [links]
    return separateLinks.map(link => link.trim())
  }
}
