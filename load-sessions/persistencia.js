/**
 * Conexión con la base de Datos de firestore
 */
const connectionFirestore = () =>{
  const info = datosConexionFirestores
  const firestore = FirestoreApp.getFirestore(info.email, info.key, info.projectId, 'v1beta1')
  return firestore
}

class DB{
  constructor(){
    this.connect = connectionFirestore()
  }
  sessionCreate(data){
    const response = this.getSession(data)
    if (response){
      this.updateSession(data)
    }
    else{
      this.createSession(data)
    }
  }
  getSession(data){
    try{
      const session = this.connect.getDocument(`clasesMuestra3/${data.session}`)
      return session
    }
    catch(e){
      return null
    }
  }
  createSession(data){
    this.connect.createDocument(`clasesMuestra3/${data.session}`, {data})
  }
  deteleSession(){
    // TODO
  }
  updateSession(data){
    this.connect.updateDocument(`clasesMuestra3/${data.session}`, {data})
  }
}
