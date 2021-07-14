/**
 * Principal Function
 */
const readPeticion = (e) =>{
  try{
    Logger.log(e)
    const dataSession = new Session(e).create()
    const db = new DB().sessionCreate(dataSession)
    return db
  }
  catch(e){
    return `Válida que los datos sean correctos | ${e}`
  }
}