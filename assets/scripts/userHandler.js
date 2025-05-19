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

async function updateLvl(username, newLvl) {
    try {
        
        const rawtext = await readFile("assets/DB/loginDB.JSON", "utf8")
        const objectList = JSON.parse(rawtext)
        
        const user = objectList.find(user => user.un === username)
        if (!user) {
            throw new Error(`User ${username} not found`)
        }

        const level = parseInt(newLvl, 10)
        user.lv = level

        await writeFile('assets/DB/loginDB.JSON', JSON.stringify(objectList, null, 2))
        return user
    }
    catch (error) {
        console.error("Error updating user level:", error)
        throw error
    }
}

export {validateLogin, createUser, getUsers, updateLvl}
