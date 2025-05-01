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

export {sendMessage}
