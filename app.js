import express from 'express'
import session from 'express-session'

//bør ligge i en database 
let globalrooms = [{id: 1, chatnavn: "Jazzkaj ved søen", opretDato: undefined, ejer: undefined, chat: []}, {id: 2, chatnavn: "Andreas papegøjefest", opretDato: undefined, ejer: undefined, chat: []}, {id: 3, chatnavn: "Connys strikkeklub", opretDato: undefined, ejer: undefined, chat: []}]

//init
const app = express()
app.set('view engine', 'pug')

//middleware
app.use(session({
    secret: "Super god nøgle makker :)",
    saveUninitialized: true,
    resave: true
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('assets'))
//app.use(validateLogin)

function validateLogin(){
    //todo
}


//endpoints
app.get('/login', (request, response) => {
    //todo - benyt validateLogin() metoden
    /*if (validateLogin() == true){
    gør noget med brugerens session
    }
    else {
    giv bruger besked om fejlet login
    }
    */
})

//Obligatoriske endpoints
app.get('/', (request, response) => {
    if (request.session.chatlist === undefined){
        request.session.chatlist = []
    }
    response.render('home', {usersession: request.session, chatlist: request.session.chatlist, globalchats: globalrooms})
})

app.get('/chats/:id', (request, response) => {
    let id = request.params.id
    let specificRoom = globalrooms.find((chat) => chat.id == id)
    response.render('chatside', {chatroom: specificRoom})
})

app.get('/chats/:id/messages', (request, response) => {
    //To do
})

app.get('/chats/messages/:id', (request, response) => {
    //To do
});

app.get('/users', (request, response) => {
    //To do
});

app.get('/users/:id', (request, response) => {
    //To do
});

app.get('/users/:id/messages', (request, response) => {
    //To do
});

app.listen(6789, () => console.log("localhost:6789"))