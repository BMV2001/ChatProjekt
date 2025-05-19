let htmlButton = document.getElementById("createuser")

if (htmlButton != null){
    htmlButton.addEventListener('click', x)
}

async function x(){ 
    let username = document.getElementById("newun").value
    let password = document.getElementById("newpw").value
    let body = JSON.stringify({un: username, pw: password})
    let messageNode = document.getElementById("createStatus")

    const response = await fetch('/createUser', 
               {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                redirect: 'follow',
                body: body
                });   
    if (response.status != 409){
        messageNode.innerHTML = "Din bruger er nu oprettet!"
    }
    else {
        messageNode.innerHTML = "Brugernavn er optaget!"
    }
}