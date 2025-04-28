let sendButton = document.getElementById("send")

sendButton.addEventListener("click", sendMessage)



function sendMessage(){
    let message = document.getElementById("message").value
    let owner = document.getElementById("message").getAttribute("owner")
    let chatid = document.getElementById("message").getAttribute("chatid")

    let messageObject = {messageid: owner+chatid+formDate, owner: owner, message: message, timestamp: formDate, chatroomid: chatid}
                //Messageid må gerne være lidt mindre uoverskuelig

    console.log(messageObject);
    return undefined
}
