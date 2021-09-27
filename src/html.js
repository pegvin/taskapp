// Contains all the javascript for html

const { ipcRenderer } = require('electron')
const ipc = ipcRenderer

document.getElementById("btn-minimize").addEventListener("click", () => {
    ipc.send("app:minimize")
})

document.getElementById("btn-zoom").addEventListener("click", () => {
    ipc.send("app:zoom")
})

document.getElementById("btn-exit").addEventListener("click", () => {
    ipc.send("app:exit")
})
