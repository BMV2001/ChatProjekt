const button = document.getElementById("deletebutton")

if (button != undefined){
button.addEventListener("click", deletemessage)
}

async function deletemessage(){
    const messageid = document.getElementById("messageid").attributes.getNamedItem("itemid").value
    const chatroomid = document.getElementById("chatid").attributes.getNamedItem("itemid").value

    let htmlRes = await fetch('/deleteMessage/'+chatroomid+"/"+messageid, {
                method: "DELETE"})

    if (htmlRes.status == 200){
        document.body.innerHTML += "<p> Beskeden er slettet - du kan gå tilbage til chatten nu </p>"
    }
}