const functions = require("firebase-functions")
const admin = require('firebase-admin')

admin.initializeApp()
const db = admin.firestore()
const evaluationAspects = {
    'Asistencia':{'type':'bool'},
    'Participación':{'type':'int'},
    'Recompensas':{'type':'int'},
    'Retos':{'type':'int'},
    'Programación': {'type':'int'},
    'Creatividad':{'type':'bool'},
}
exports.addUsers = functions.https.onRequest((req, res)=>{
    const users = req.body.data
    users.forEach(async (u) =>{await db.collection('users').doc(`${u[0]}`).set(u[1])})
    res.json({result: `Se registraron ${users.length} usuario(s)`}) 
})

exports.addSession = functions.https.onRequest(async (req, res)=>{
    const data = req.body.data
    const writeResult = await db.collection(`ifp/${data.group}/${data.sessionName}`)
                                    .doc(`${data.nameDoc}`)
                                    .set(data.description)
    res.json({result: `Se registró la sesión ${data.nameDoc}`})
})

exports.assignedSession = functions.firestore
    .document('ifp/{group}/{session}/{nameSession}')
    .onCreate(async(snap, context) =>{
        const data = snap.data()
        const aspects = data.criterios
        const studens = await getUsers(data.group)
        const path = snap.ref.path
        createStackForEvaluation(studens, aspects, path)
    })

const getUsers = async (group) =>{
    const usersId = []
    const users = await db.collection('/users/').get()
    users.forEach(user => user.data().group === `${group}` ? usersId.push(user.id) : '')
    return usersId
}

const createStackForEvaluation = async (studens, aspects,path) =>{
    //studens:[], aspects:{}
    const realTimeEvaluation = {}
    realTimeEvaluation['studens'] = studens
    realTimeEvaluation['aspects'] = aspects.reduce((aspectsEva, key)=>{
        aspectsEva[key] = evaluationAspects[key]
        return aspectsEva
    },{})
    await db.doc(path).set({realTimeEvaluation:realTimeEvaluation}, {merge:true})
}