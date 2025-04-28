import express, { response } from 'express'
import session from 'express-session'
import { validateLogin, createUser, getUsers } from './assets/scripts/userHandler.js'
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
app.use(guestSession)
app.use(express.static('assets'))
//methodOverride -> opretter proper put-requests for opretBruger
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
    let chatID = request.body.chatid
    let owner = request.body.username
    let message = request.body.message
    let chatroom = globalrooms.find((chat) => chat.id == chatID)
    chatroom.chat.push(sendMessage(message, owner, chatID, chatroom.chat))

    response.redirect(`/chats/${chatID}/messages`)

})

//Obligatoriske endpoints

//Endpointet /chats og /chats/:id er tilgængeligt fra /(root) endpointet 

app.get('/', (request, response) => {
    response.render('home', {usersession: request.session, chatlist: request.session.chatlist, globalchats: globalrooms})
})

app.get('/chats/:id/messages', (request, response) => {
    let id = request.params.id
    let specificRoom = globalrooms.find((chat) => chat.id == id)

    response.render('chatside', {chatnavn: specificRoom.chatnavn, chatcontainer: specificRoom.chat, chatid: specificRoom.id, username: request.session.un})
})

app.get('/:chats/messages/:id', (request, response) => {
    let specificmessage = globalrooms.find((room) => room.id == request.params.chats).chat.find((message) => message.messageid === request.params.id)
    response.render('specificmessage', {message: specificmessage})
});

/////lv.3 superbruger adgange/////
app.get('/users', (request, response) => {
    if (request.session.lv != 3){
        response.redirect('/')
    }
    else{
        getUsers().then((userlist) => {response.render('users', {userlist: userlist})})
    }
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
    session.un = user.un
    session.lv = user.lv
}

//middleware function til default guest-bruger oprettelse
function guestSession(request, response, next){
    if (request.session.lv === undefined){
        request.session.chatlist = []
        request.session.login = false
        request.session.un = "guest"
        request.session.lv = 1
    }
    next()
}
