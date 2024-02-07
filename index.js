
// se connecter à un namespace
const socket = io()
const admin = io('/admin')

// envoyr des messages à un namespace
socket.on('connect', () =>{
    console.log(socket)
    console.log("connected on /")
    admin.emit("message", 'slash')
})

const message = document.getElementById('message')

admin.on("chatMessage", (msg) => {
    // admin.emit("message", 'hello')
    console.log("depuis le server : " +msg)
    message.insertAdjacentHTML('beforeend',"<div>"+msg+"</div>")

})

const formulaire = document.getElementById('formulaire')
const messageInput = document.getElementById('messageInput')

formulaire.addEventListener('submit', (event) => {
    event.preventDefault()
    const valueMessageInput = messageInput.value
    admin.emit("chatMessage", valueMessageInput)


})



