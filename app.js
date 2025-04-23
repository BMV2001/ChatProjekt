import express from 'express'
import session from 'express-session'

//bør ligge i en database 
let globalrooms = [{chatnavn: "Jazzkaj ved søren"}, {chatnavn: "Connys strikkeklub"}, {chatnavn: "Hell Angels årlige velgørenhedsoptog"}]

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


//endpoints
app.get('/', (request, response) => {
    if (request.session.chatlist === undefined){
        request.session.chatlist = []
    }
    response.render('home', {usersession: request.session, chatlist: request.session.chatlist, globalchats: globalrooms})
})

app.get('/chats/:id', (request, response) => {
    response.render('chatside', {})
})

app.get("/createchat", (request, response) => {
    response.render('create', {})
})

app.post("/createroom", (request, response) => {
    //opret den nye chat og tilføj den til globale chats her!
    response.redirect("/")
})

app.listen(6789, () => console.log("Det spiller chef"))