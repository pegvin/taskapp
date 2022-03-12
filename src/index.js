import { v4 as uuidv4 } from "./lib/uuid.min";

var tasks = {}
var completeTasks = {};

function saveTasks() {
	return Neutralino.storage.setData('tasks', JSON.stringify(tasks))
}

function loadTasks() {
	return Neutralino.storage.getData('tasks');
}

function onCloseClick() {
	saveTasks()
		.then(() => {
			Neutralino.app.exit(0);
		})
}

function onMaximizeClick() {
	Neutralino.window.isMaximized().then(isMaximized => {
		if (isMaximized) {
			Neutralino.window.unmaximize()
		} else {
			Neutralino.window.maximize()
		}
	}).catch(err => console.log(err))
}

function onMinimizeClick() {
	saveTasks()
		.then(() => {
			Neutralino.window.minimize()
		})
}

function updateFooter() {
	document.getElementById("task-percent").innerText = `${getCompletedPercentage()}% of all tasks complete.`;
	document.getElementById("task-done").children[0].innerText = Object.keys(completeTasks).length
	document.getElementById("task-pending").children[0].innerText = Object.keys(tasks).length - Object.keys(completeTasks).length
	document.getElementById("task-total").children[0].innerText = Object.keys(tasks).length
}

function getCompletedPercentage() {
	return parseInt(
		100 * Object.keys(completeTasks).length / Object.keys(tasks).length
	);
}

function renderList(tasks) {
	const taskOL = document.getElementById("taskOL");
	taskOL.innerHTML = null;
	for (var key in tasks) {
		let listItem = document.createElement("li");
		let checkbox = document.createElement("input");
		let label = document.createElement("label");

		checkbox.type = "checkbox";
		checkbox.setAttribute("checked", tasks[key].complete)
		if (tasks[key].complete) {
			completeTasks[key] = tasks[key]
		} else {
			delete completeTasks[key];
		}
		checkbox.id = key;
		checkbox.onclick = (e) => {
			if (e.target.checked == true) {
				e.target.setAttribute("checked", true)
				tasks[e.target.id].complete = true;
				completeTasks[e.target.id] = tasks[e.target.id];
			} else {
				e.target.removeAttribute("checked")
				tasks[e.target.id].complete = false;
				delete completeTasks[e.target.id];
			}
			updateFooter()
		}

		label.setAttribute("for", key);
		label.textContent = tasks[key].text

		listItem.appendChild(checkbox);
		listItem.appendChild(label);
		taskOL.appendChild(listItem);
		updateFooter()
	}
}

function addItem() {
	let item = document.getElementById("taskInput").value;
	if (!item) {
		return;
	}
	document.getElementById("taskInput").value = null;
	const newUUID = uuidv4();
	tasks[newUUID] = {
		text: item,
		complete: false
	};
	renderList(tasks)
}

Neutralino.init()
Neutralino.events.on("windowClose", onCloseClick)
Neutralino.events.on("ready", () => {
	Neutralino.window.setDraggableRegion(document.getElementById("titleBar"));
	document.addEventListener('contextmenu', event => event.preventDefault());
	document.getElementById("btn-exit").onclick = onCloseClick;
	document.getElementById("btn-zoom").onclick = onMaximizeClick;
	document.getElementById("btn-minimize").onclick = onMinimizeClick;
	document.getElementById("taskSubmit").onclick = addItem;
	document.getElementById("taskInput").onkeyup = function(event) {
		if (event.key.toLowerCase() == "enter") addItem()
	}

	loadTasks()
		.then(loadedTasks => {
			loadedTasks = JSON.parse(loadedTasks)
			tasks = loadedTasks || {};
			renderList(tasks);
			console.log(loadedTasks);
		})
		.catch(err => {
			if (err.code == "NE_ST_NOSTKEX") {
				tasks = {};
			} else {
				console.log(err);
				Neutralino.os.showMessageBox(
					"Unknown Error", 
					`An Unknown Error Occured When Loading Tasks From LocalStorage.\n\nCODE: ${err.code}\n\nERROR: ${err.message}`,
					"OK",
					"ERROR"
				)
			}
		})
})