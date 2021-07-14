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
    return `Escritura éxitosa de la sesión ${data.session}`
  }
  getSession(data){
    try{
      const session = this.connect.getDocument(`${data.section}-${data.grade}/${data.session}`)
      return session
    }
    catch(e){
      return null
    }
  }
  createSession(data){
    this.connect.createDocument(`${data.section}-${data.grade}/${data.session}`, {data})
  }
  deteleSession(){
    // TODO
    // Añadir una lista de personas que puedan borrar
    return null
  }
  updateSession(data){
    this.connect.updateDocument(`${data.section}-${data.grade}/${data.session}`, {data})
  }
}
