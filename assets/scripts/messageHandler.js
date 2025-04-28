
function sendMessage(message, owner, chatid){
    let formDate = Date().substring(0, 24)
    let messageid = owner+chatid+formDate
    let messageObject = {messageid: messageid, owner: owner, message: message, timestamp: formDate, chatroomid: chatid}
    return messageObject
}

export {sendMessage}
