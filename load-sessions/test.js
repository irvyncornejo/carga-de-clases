const testDB = () => new DB().createSession()

const testSession = () =>{
  const dataSession = new Session().create()
  const db = new DB().sessionCreate(dataSession)
  Logger.log(db)
}
