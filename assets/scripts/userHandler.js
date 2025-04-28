import {readFile, writeFile} from "node:fs/promises"
import { error } from "node:console";
import { write } from "node:fs";

async function validateLogin(username, password) {
    try {
    let rawtext = await readFile("assets/DB/loginDB.JSON", "utf8")
    let objectList = JSON.parse(rawtext)
    
    for (let user of objectList){
        if (user.un === username && user.pw === password){
            return user
        }
    }
    }
    catch {
        throw error
    }
}


async function createUser(username, password){
    try {
        let rawtext = await readFile("assets/DB/loginDB.JSON", "utf8")
        let objectList = JSON.parse(rawtext)
        let userNameOccupied = false
        
        for (let user of objectList){
            if (user.un == username){
                userNameOccupied = true;
            }
        }
        let newUserObject;
        if (!userNameOccupied){
            newUserObject = {un:username, pw:password, lv:2}
            objectList.push(newUserObject)
            await writeFile('assets/DB/loginDB.JSON', JSON.stringify(objectList))
        }
        return newUserObject
    }
    catch {
        console.log("fejl i createUser");
        throw err
    }
}

async function getUsers(){
    let rawtext = await readFile("assets/DB/loginDB.JSON", "utf8")
    return JSON.parse(rawtext)
}

export {validateLogin, createUser, getUsers}
