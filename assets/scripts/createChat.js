document.getElementById('createChatForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const chatnavn = document.getElementById('chatnavn').value;

    try {
        const response = await fetch('/createchat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ chatnavn }),
        });

        const result = await response.json();

        if (result.success) {
            alert(result.message); // Show success message
            window.location.href = `/chats/${result.chatId}`; // Redirect to the new chat
        } else {
            alert(result.message); // Show error message
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Der opstod en fejl under oprettelsen af chatten.');
    }
});