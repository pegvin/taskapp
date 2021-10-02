// This JavaScript File Handles Window Buttons!

const { ipcRenderer } = require('electron')
const path = require('path')
const { writeFile, readFile } = require('fs')
var oldData;

document.getElementById("btn-minimize").addEventListener("click", () => {
	ipcRenderer.send("app:minimize")
})

document.getElementById("btn-zoom").addEventListener("click", () => {
	ipcRenderer.send("app:zoom")
})

document.getElementById("btn-exit").addEventListener("click", () => {
	saveData()
	ipcRenderer.send("app:exit")
})

async function loadData() {
	await readFile(path.join(__dirname, "tasks.json"), 'utf-8', (err, data) => {
		if (err) if (err.code == "ENOENT") return;
		var data = JSON.parse(data)
		oldData = data
		for (let key in data) {
			if (data.hasOwnProperty(key)) {
				taskHandler.render(data[key].task, data[key].completed)
			}
		}
	})

}

async function saveData() {
	var data = {}
	var id, completed

	for (let i = 0; i < tasks.length; i++) {
		id = tasks[i]
		if ( document.getElementById(id).getAttribute("checked") == null ) completed = false
		else completed = true
		data[i] = {
			task: document.querySelector(`label[for="${id}"]`).innerText,
			completed: completed
		}
	}

	if (Object.keys(data).length == 0) return; // Don't Write Anything to "tasks.json" if there is no data to write
	if (JSON.stringify(oldData) == JSON.stringify(data)) return; // Don't Write Anything to "tasks.json" if nothing has changed

	await writeFile(path.join(__dirname, "tasks.json"), JSON.stringify(data), 'utf-8', (err) => {
		if (err) return alert("Unable to save tasks")
	})
}

loadData()