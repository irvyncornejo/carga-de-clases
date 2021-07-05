/**
 * Principal Function
 */
const readPeticion = (e) =>{
  try{
    Logger.log(e)
    const dataSession = new Session(e).create()
    const db = new DB().sessionCreate(dataSession)
    return 'Escritura éxitosa'
  }
  catch(e){
    return `Válida que los datos sean correctos | ${e}`
  }
}