import fs from 'fs/promises';

const rawtext = await fs.readFile("assets/DB/chatDB.JSON", "utf8");
const chatList = JSON.parse(rawtext);


async function roomExists(chatnavn, chatList) {
    if (chatList.some(chat => chat.chatnavn === chatnavn)) {
        return true;
    }
}

async function newChat(chatnavn, username, chatList) {
    if (await roomExists(chatnavn, chatList)) {
        throw new Error(`Name "${chatnavn}" already exists.`);
    }

    const newChatObj = {
        id: chatList.length + 1,
        chatnavn: chatnavn,
        opretDato: new Date(),
        ejer: username,
        chat: []
    }
    
    try {
        chatList.push(newChatObj);

        await fs.writeFile('assets/DB/chatDB.JSON', JSON.stringify(chatList, null, 2));
    } catch (error) {
        console.error("Error reading or writing chatDB.JSON:", error);
        throw new Error("Failed to save chat to database.");
    }

    return newChatObj;
}

async function getChatList() {
    try {
        const rawtext = await fs.readFile("assets/DB/chatDB.JSON", "utf8");
        const chatList = JSON.parse(rawtext);
        return chatList;
    } catch (error) {
        console.error("Error reading chatDB.JSON:", error);
        throw new Error("Failed to retrieve chat list.");
    }
}

async function createdChatrooms(username) {
    try {
        const chatList = await getChatList();
        const userChatrooms = chatList.filter(chat => chat.ejer === username);
        return userChatrooms;
    }
    catch (error) {
        console.error("fejl", error);
    }
}

export { newChat, roomExists, getChatList, createdChatrooms };