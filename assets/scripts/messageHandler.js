import {readFile, writeFile} from 'fs/promises';

async function sendMessage(message, owner, chatid){
    let formDate = Date().substring(0, 24)
    let messageid = owner+chatid+formDate
    let messageObject = {messageid: messageid, owner: owner, message: message, timestamp: formDate, chatroomid: chatid}

    let rawtext = await readFile("assets/DB/chatDB.JSON", "utf8")
    let chatList = JSON.parse(rawtext)

    chatList.find((room) => room.id == chatid).chat.push(messageObject)

    await writeFile('assets/DB/chatDB.JSON', JSON.stringify(chatList))
}

async function deleteMessage(chatroomid, messageid){
    let rawtext = await readFile("assets/DB/chatDB.JSON", "utf8")
    let chatList = JSON.parse(rawtext)
    let chatroom = chatList.find((chat) => chat.id = chatroomid)
    
    let updatedChat = chatroom.chat.filter((message) => message.messageid !== messageid)
    chatroom.chat = updatedChat
    //kæmpe skamfuld metode som tager vitterligt ALLE chats, ændrer EN besked, og sætter HELE LORTET ind igen
    //Jeg giver hermed alle rettidheder til at eksperterne fratager mig mit endelige eksamensbevis når den skæbnes svanger dag kommer frem
    await writeFile('assets/DB/chatDB.JSON', JSON.stringify(chatList))
}

export {sendMessage, deleteMessage}
