import express, { response } from 'express'
import session from 'express-session'
import { validateLogin, createUser } from './assets/scripts/userHandler.js'
import methodOverride from 'method-override'
import { sendMessage } from './assets/scripts/messageHandler.js'

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

//Test
app.use(methodOverride('_method'))


//endpoints
app.post('/login', (request, response) => {
    let username = request.body.un
    let password = request.body.pw
    validateLogin(username, password).then((user) => {
        if (user != undefined){
            setSession(user, request.session)
        }
            response.redirect("/")
    })
})

app.post('/logud', (request, response) => {
    request.session.destroy()
    response.redirect('/')
})

//Bør være en PUT request! Men da pug-Form ikke understøtter det...
app.put('/createuser', (request, response) => {
    let username = request.body.un
    let password = request.body.pw
    createUser(username, password).then((user) => {
        if (user != undefined){
            setSession(user, request.session)
        }
        response.redirect("/")        
    })
})

app.post('/postmessage', (request, response) => {
    let roomID = request.body.chatid.data
    let messageOwner = request.body.username.data
    let message = request.body.message

    console.log(roomID+", "+message+", "+messageOwner);
    //sendMessage(username, roomID, message, messageOwner)

    response.redirect('/chats/'+roomID)

})

//Obligatoriske endpoints
app.get('/', (request, response) => {
    if (request.session.chatlist === undefined){
        request.session.chatlist = []
        request.session.login = false
        request.session.un = "guest"
        request.session.lv = 1
    }
    response.render('home', {usersession: request.session, chatlist: request.session.chatlist, globalchats: globalrooms})
})

app.get('/chats/:id', (request, response) => {
    let id = request.params.id
    let specificRoom = globalrooms.find((chat) => chat.id == id)
    response.render('chatside', {chatnavn: specificRoom.chatnavn, chatcontainer: specificRoom.chat, chatid: specificRoom.id, username: request.session.un})
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

app.listen(6789, () => console.log("Det spiller chef"))

//funktioner

function setSession(user, session){
    session.login = true;
    session.username = user.un
    session.lv = user.lv
}
