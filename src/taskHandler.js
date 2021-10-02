// This File Handles saving, reading and rendering all the tasks

const { v1: uuid } = require('uuid')
const taskSubmit = document.getElementById("taskSubmit")
const taskInput = document.getElementById("taskInput")
const taskList = document.getElementById("taskOL")

var tasks = []
var completeTasks = []

const taskHandler = {
	render: (task, done) => {
		if (!task) return 1;
		let id = uuid()
		tasks.push(id)
		task = task.replace('<', '&lt;').replace('</', '&lt;/').replace('>', '&gt;') // HTML Code Insertion Prevention

		if (done) {
			taskList.innerHTML += `<li><input type="checkbox" id="${id}" checked><label for="${id}">${task}</label></li>`
			completeTasks.push(id);
		}
		else taskList.innerHTML += `<li><input type="checkbox" id="${id}"><label for="${id}">${task}</label></li>`

		let labels = document.querySelectorAll('label')

		for (let i = 0; i < labels.length; i++) {
			labels[i].addEventListener("click", (e) => {
				const id = e.target.getAttribute('for')

				if ( completeTasks.includes(id) ) { // If The Item is Already Completed Then it means user is unchecking it so remove the item's id from the `completeTasks` array
					let index = completeTasks.indexOf(id);
					if (index > -1) completeTasks.splice(index, 1)

					document.getElementById(id).removeAttribute("checked")
				} else {
					completeTasks.push(id); // Else Push the item's id to `completeTasks` array
					document.getElementById(id).setAttribute("checked", "")
				}

				taskHandler.update();
			})
		}

		taskHandler.update()

		return 0;
	},
	handle: () => {
		if (taskInput.value) taskHandler.render(taskInput.value)
		taskInput.value = ""
		taskInput.focus()
	},
	update: () => {
		document.getElementById("task-pending").innerHTML = `<span style='color: #831fe0'>${tasks.length - completeTasks.length}</span> pending`
		document.getElementById("task-total").innerHTML = `<span style='color: #0081bd'>${tasks.length}</span> total`
		document.getElementById("task-percent").innerText = `${parseInt(100 * completeTasks.length / tasks.length)}% of all tasks complete.`
	}
}

taskSubmit.addEventListener("click", taskHandler.handle)
taskInput.addEventListener("keyup", (e) => {
	if (e.key === "Enter") taskHandler.handle()
});
