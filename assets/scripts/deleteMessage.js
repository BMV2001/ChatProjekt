const button = document.getElementById("deletebutton")

button.addEventListener("click", deletemessage)

async function deletemessage(){
    const messageid = document.getElementById("messageid").attributes.getNamedItem("itemid").value
    const chatroomid = document.getElementById("chatid").attributes.getNamedItem("itemid").value

    const formdata = new FormData()
    formdata.append('messageid', messageid)
    formdata.append('chatroomid', chatroomid)

    await fetch('/deleteMessage/'+chatroomid+"/"+messageid, {
        method: "DELETE"
    })
} 