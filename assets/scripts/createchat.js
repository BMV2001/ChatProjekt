let createButton = document.getElementById("create")

createButton.addEventListener("click", () =>{
    let chatnavn = document.getElementById("chatnavn")
    //her skal selve chat objektet oprettes og tilføjes til serverens globalchats liste
    if (chatnavn.textContent != null){
        console.log(chatnavn.innerText);
    }
})
