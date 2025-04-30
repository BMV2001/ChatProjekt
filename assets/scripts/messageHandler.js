function sendMessage(message, owner, chatid){
    let messageObject = {messageid: owner+chatid+formDate, owner: owner, message: message, timestamp: formDate, chatroomid: chatid}
                //Messageid må gerne være lidt mindre uoverskuelig
    console.log(messageObject);
    return messageObject
}

export {sendMessage}
