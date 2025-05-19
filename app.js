import express from 'express'
import session from 'express-session'
import { validateLogin, createUser, getUsers, updateLvl } from './assets/scripts/userHandler.js'
import { newChat, getChatList, createdChatrooms } from './assets/scripts/chatHandler.js'
import { deleteMessage, sendMessage } from './assets/scripts/messageHandler.js'


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
app.use(express.urlencoded({ extended: true }))
app.use(guestSession)
app.use(express.static('assets'))

//endpoints
app.post('/login', (request, response) => {
    let username = request.body.un
    let password = request.body.pw
    validateLogin(username, password).then((user) => {
        if (user != undefined) {
            setSession(user, request.session)
        }
        response.redirect("/")
    })
})

app.post('/logud', (request, response) => {
    request.session.destroy()
    response.redirect('/')
})

app.post('/createUser', (request, response) => {   
    let username = request.body.un
    let password = request.body.pw
    createUser(username, password).then((user) => {
        if (user != undefined) {
            setSession(user, request.session)
            response.redirect('/')
        }
        else {
            response.sendStatus(409) //konflikt med navn
        }
    })
})

app.post('/postmessage', async (request, response) => {
    let data = await getChatList()
    let chatID = request.body.chatid
    let owner = request.body.username
    let message = request.body.message
    let chatroom = data.find((chat) => chat.id == chatID)
    sendMessage(message, owner, chatID, chatroom.chat)
    response.redirect(`/chats/${chatID}/messages`)
})

//Virker kun med node, da delete genstarter serveren og nulstiller sessionen
app.delete('/deletemessage/:chatid/:messageid', (request, response) => {
    const chatid = request.params.chatid
    const messageid = request.params.messageid
    deleteMessage(chatid, messageid)
    response.sendStatus(200)
})

//Obligatoriske endpoints

//Endpointet /chats og /chats/:id er tilgængeligt fra /(root) endpointet 

app.get('/', async (request, response) => {
    let data = await getChatList()
    response.render('home', { usersession: request.session, chatlist: request.session.chatlist, globalchats: data })
})

app.get('/chats/:id/messages', async (request, response) => {
    let id = request.params.id
    let data = await getChatList()
    let specificRoom = data.find((chat) => chat.id == id)

    response.render('chatside', { 
        chatnavn: specificRoom.chatnavn,
        chatcontainer: specificRoom.chat,
        chatid: specificRoom.id,
        username: request.session.un })
})

app.get('/:chats/messages/:id', async (request, response) => {
    let data = await getChatList()

    let specificmessage = data.find((room) => room.id == request.params.chats).chat.find((message) => message.messageid === request.params.id)
    response.render('specificmessage', {message: specificmessage, sessionname: request.session.un, sessionlv: request.session.lv})
});

/////lv.3 superbruger adgange/////
app.get('/users', (request, response) => {
    if (request.session.lv != 3){
        response.redirect('/')
    }
    else {
        try {
            getUsers().then((userlist) => {response.render('users', { userlist: userlist })})
        
        } catch (error) {
            console.error('Error fetching users:', error.message)
            response.status(500).send('Serverfejl')
        }
    }
});

app.get('/user/:username', async (request, response) => {
    try {
        const username = request.params.username
        const userlist = await getUsers()

        const user = userlist.find(user => user.un === username)
        if (user) {
            const chats = await getChatList()
            const messages = chats
                .flatMap(chat => chat.chat)
                .filter(message => message.owner === username)

            const userCreatedChatrooms = await createdChatrooms(username)
            response.render('profil', { user, 
                sessionlv: request.session.lv, 
                messages, 
                createdChatrooms: userCreatedChatrooms })
        } else {
            response.status(404).send('Bruger ikke fundet')
        }
    } catch (error) {
        console.error('Error fetching user:', error.message)
        response.status(500).send('Serverfejl');
    }
});

app.post('/user/:username/lvl', async (request, response) => {
    if (request.session.lv != 3) {
        return response.redirect('/user')
    }

    try {
        const username = request.params.username
        const newLevel = request.body.newlvl

        await updateLvl(username, newLevel)
    } catch (error) {
        response.status(500).send('Serverfejl')
    }
})

app.post('/createchat', async (request, response) => {
    const chatnavn = request.body.chatnavn
    let data = await getChatList()

    try {
        const newChatObj = await newChat(chatnavn, request.session.un, data)
        response.redirect(`/chats/${newChatObj.id}/messages`)
    } 
    catch (error) {
        console.error('Error creating chat:', error.message)
        response.render('home', {
            usersession: request.session,
            chatlist: request.session.chatlist,
            globalchats: data,
            error: error.message
        })
    }
})

app.listen(6789, () => console.log("Det spiller chef"))

//funktioner

function setSession(user, session) {
    session.login = true;
    session.un = user.un
    session.lv = user.lv
}

//middleware function til default guest-bruger oprettelse
function guestSession(request, response, next) {
    if (request.session.lv === undefined) {
        request.session.chatlist = []
        request.session.login = false
        request.session.un = "guest"
        request.session.lv = 1
    }
    next()
}
