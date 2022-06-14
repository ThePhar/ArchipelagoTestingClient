let hostname = "localhost:38281";
let game = "Archipelago";
let name = "Test";
let password = "";
let connected = false;

const ipc = require("electron").ipcRenderer;

window.addEventListener("load", () => {
    document.getElementById("hostname").value = hostname;
    document.getElementById("game").value = game;
    document.getElementById("name").value = name;
    document.getElementById("password").value = password;

    const connectButton = document.getElementById("connect-button");
    connectButton.addEventListener("click", (ev) => {
        ev.preventDefault();

        const hostnameElement = document.getElementById("hostname");
        const gameElement = document.getElementById("game");
        const nameElement = document.getElementById("name");
        const passwordElement = document.getElementById("password");

        if (!connected) {
            hostname = hostnameElement.value;
            game = gameElement.value;
            name = nameElement.value;
            password = passwordElement.value;

            hostnameElement.setAttribute("disabled", "true");
            gameElement.setAttribute("disabled", "true");
            nameElement.setAttribute("disabled", "true");
            passwordElement.setAttribute("disabled", "true");

            ipc.send("connect", hostname, game, name, password);
            connectButton.innerText = "Connecting...";
            connected = true;
        } else {
            hostnameElement.setAttribute("disabled", "false");
            gameElement.setAttribute("disabled", "false");
            nameElement.setAttribute("disabled", "false");
            passwordElement.setAttribute("disabled", "false");

            ipc.send("disconnect");
            connectButton.innerText = "Connect";
            connected = false;
        }
    });

    const chatInput = document.getElementById("chat-input");
    chatInput.addEventListener("keydown", (ev) => {
        if (ev.code === "Enter") {
            ev.preventDefault();
            ipc.send("chat", chatInput.value);
            chatInput.value = "";
        }
    })
})

ipc.on("connected", () => {
    document.getElementById("status").innerText = "Logged into Archipelago Server";
    document.getElementById("status").style.backgroundColor = "green";
    document.getElementById("connect-button").innerText = "Connected";
});

ipc.on("chat", (event, message) => {
    const msgElement = document.createElement("div");
    msgElement.innerText = message;
    msgElement.className = "chat";
    document.getElementById("chat").append(msgElement);
    document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
});
