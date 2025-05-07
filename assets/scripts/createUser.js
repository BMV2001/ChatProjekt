
document.getElementById("createuser").addEventListener('click', x)

function x(){ //virker ej!
    let username = document.getElementById("un").value
    let password = document.getElementById("pw").value
    let body = JSON.stringify({un: username, pw: password})
    let response = {
        method: "POST",
        body: body
    }
    createUser(response).then(response => { 
        if (response.ok){
            console.log("det spiller");
        }
        else {
            console.log(response);
        }
    }).catch(e => console.log(e))
}


async function createUser(responseBody){
    let response = await fetch('/createuser', responseBody)
    return response;
}