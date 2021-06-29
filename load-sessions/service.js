/**
 * Principal Function
 */
const readPeticion = (e) =>{
  const dataSession = new Session(e).create()
  const db = new DB().sessionCreate(dataSession)
}