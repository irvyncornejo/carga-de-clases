class Session{
  constructor(e){
    this.numberSession = e.nameSheet
    this.ss = SpreadsheetApp.openById(e.id)
    this.userEmail = e.userEmail
    this.nameBook = e.nameBook
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
      const grade = data.getRange('F3').getValue().replace('°', '')
      const section = this.getSection(grade)
      const method = data.getRange('C10').getValue()
      const content = data.getRange(`B17:C${lastRow}`).getValues()
      const dataSession = {
        course: data.getRange('C2').getValue(),
        teachers: data.getRange('C3:C4').getValues().map(teacher => teacher[0]),
        session: data.getRange('C5').getValue(),
        period: data.getRange('F2').getValue(),
        grade: Object.keys(section).includes('area') ? `${grade}${section.area.substring(1)}` : grade,
        hours: data.getRange('F5').getValue(),
        title: data.getRange('C6').getValue(),
        purposes: data.getRange('C8').getValue(),
        type: this.numberSession,
        order: data.getRange(`B17:B${lastRow}`).getValues().map((content,index) => `${index}|${content[0].toLowerCase()}`),
        section: section.section,
        subscription: data.getRange('F10').getValue() === 'Free' ? 'free' : 'premium',
        previousKnowledge: data.getRange('H4').getValue(),
        method: method
      }
      dataSession['content'] = this.processContent(content, method)
      return dataSession
  }

  processContent(content, method){
    const contentSession = {}
    content.forEach((value, index) =>{
      if((value[0] === 'Diagrama|Imagen' || value[0] === 'Vídeo') && method === 'Clásica'){
        const links = this.trasnformLinksMedia(value[1])
        contentSession[`${index}|${value[0].toLowerCase()}`] = links
      }
      else if(value[0] === 'Vídeo' && method === 'First Vídeo'){
        const links = this.trasnformLinksMedia(value[1])
        contentSession[`${index}|${value[0].toLowerCase()}`] = links
      }
      else if(value[0] === 'Documento'){
        contentSession[`${index}|${value[0].toLowerCase()}`] = this.splitLinks(value[1])
                                                          .map(url => `${url}?embedded=true`)
      }
      else if(value[0] === 'Link' || value[0] === 'Presentación'){
        contentSession[`${index}|${value[0].toLowerCase()}`] = this.splitLinks(value[1])
      }
      else{
        contentSession[`${index}|${value[0].toLowerCase()}`] = value[1]
      }
    })
    return contentSession
  }

  getId(link, limit){
    const index = ['d/', limit].map(ind => link.indexOf(ind))
    const id = link.substring(index[0]+2, index[1])
    return id
  }

  trasnformLinksMedia(links){
    const linksArray = this.splitLinks(links)
    const linksT = []
    linksArray.forEach(link =>{
        if(link.includes('drive.google.com')){
          const idImage = this.getId(link, '/view')
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

  getSection(grade){
    const listNameBook = this.nameBook.split('|')
                            .map(elem => elem.trim())
    return listNameBook[1].toLowerCase() === 'preparatoria' && grade == 6
                              ? {area: this.getArea(listNameBook[2]), section: listNameBook[1].toLowerCase()}
                              : {section: listNameBook[1].toLowerCase()}
  }

  getArea(area){
    const rex = /[A1-A2]/
    const indexArea = area.search(rex)
    return indexArea > 1 ? area.substring(indexArea) : null
  }

}
