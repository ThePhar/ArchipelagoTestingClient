const electron = require("electron");
const ap = require("archipelago.js");
const app = electron.app;
const ipc = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;
let client;

app.on("window-all-closed", () => {
    app.quit();
});

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        nodeIntegration: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.webContents.openDevTools();

    mainWindow.loadURL("file://" + __dirname + "/index.html");
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
});

ipc.on("connect", (event, hostname, game, name, password) => {
    client = new ap.ArchipelagoClient(hostname, new ap.NetworkVersion(0, 3, 2));

    client
        .connect(game, name, password)
        .then(() => {
            event.sender.send("connected");
        });

    client.addListener("print", (packet) => {
        event.sender.send("chat", packet.text);
    });
});

ipc.on("chat", (event, message) => {
    client?.send({ cmd: "Say", text: message });
})