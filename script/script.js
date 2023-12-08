let inputText = document.querySelector("#todo-input-1");
let inputEstimation = document.querySelector("#todo-input-2");
let inputDescription = document.querySelector("#todo-input-3")
let button = document.querySelector(".button");
let cancelButton = document.querySelector(".cancelButton")
const tasksList = document.querySelectorAll(".swim-lane");
const toDoBlock = document.querySelector('#todo-lane-1');
let blockButton = document.querySelector(".blockButton");
let activeElement;
let columnToInsert;
let editedTask = null;

let tasks = [];

let data = localStorage.getItem('taskBlockList')

if (data) {
	tasks = JSON.parse(data)
}

function clearInputs() {
	if (inputText) {
		inputText.value = '';
	}
	if (inputEstimation) {
		inputEstimation.value = '';
	}
	if (inputDescription) {
		inputDescription.value = '';
	}
}

button.onclick = function () {

	if (!editedTask) {

		let taskObj = {
			name: inputText.value,
			estimation: inputEstimation.value,
			description: inputDescription.value,
			status: 0,
			id: tasks.length ? Math.max(...tasks.map((a) => a.id)) + 1 : 1
		}

		if (!taskObj.name) {
			alert("Undefind task input, task = Unnamed")
			taskObj.name = "Unnamed";
		}

		if (!taskObj.estimation) {
			alert("Undefind Estimation input, estimation = 0")
			taskObj.estimation = null;
		}

		const taskBlock = createTaskBlock(taskObj);
		toDoBlock.appendChild(taskBlock);

		tasks.push(taskObj)
		localStorage.setItem('taskBlockList', JSON.stringify(tasks))

		clearInputs();
	} else {

		let data = localStorage.getItem('taskBlockList');
		let tasksFromLocalStorage = JSON.parse(data);

		let selectedTaskId = editedTask.id;

		let selectedTask = tasksFromLocalStorage.find(task => task.id === selectedTaskId);

		if (selectedTask) {
			selectedTask.name = inputText.value;
			selectedTask.estimation = inputEstimation.value;
			selectedTask.description = inputDescription.value;

			clearInputs();
		}

		localStorage.setItem('taskBlockList', JSON.stringify(tasksFromLocalStorage));
		console.log("tasksFromLocalStorage: ", tasksFromLocalStorage)

		button.textContent = "Add"
		cancelButton.style.display = 'none'
		editedTask = null;
		location.reload()
	}
};

tasksList.forEach((box, index) => {
	let selectedTasks = tasks.filter((task) => task.status === index)
	selectedTasks.forEach((task) => {
		taskBlock = createTaskBlock(task);

		box.appendChild(taskBlock);
	})
});

function createTaskBlock(task) {

	let taskBlock = document.createElement('div');

	// ---------------------------- Task Block ----------------------------

	taskBlock.textContent = task.name
	taskBlock.className = 'task';
	taskBlock.id = task.id;

	taskBlock.addEventListener('click', (event) => {
		event.stopPropagation();

		const currentAE = document.querySelector(".activeElement")

		if (currentAE) {
			currentAE.classList.remove("activeElement");
		}

		if (activeElement === event.target) {
			activeElement.classList.remove("activeElement")
			activeElement = null;
		}
		else if (taskBlock === event.target) {
			activeElement = event.target
			activeElement.classList.add("activeElement")
		}
	});

	// ---------------------------- Description ----------------------------

	let descriptionP = document.createElement('p');
	descriptionP.classList.add("description")
	descriptionP.textContent = "Description: "
	if (task.description) {
		descriptionP.textContent = "Description: " + task.description
	}

	// ---------------------------- Estimation ----------------------------

	let estimationDiv = document.createElement('div')
	estimationDiv.classList.add("estimation")
	estimationDiv.textContent = "Estimation: " + task.estimation;

	// ---------------------------- Edit Button ----------------------------

	let editButton = document.createElement('button');
	editButton.textContent = "Edit";
	editButton.classList.add("blockButton")
	editButton.addEventListener('click', buttonClick);

	// ---------------------------- Delete Button ----------------------------

	let deleteButton = document.createElement('button');
	deleteButton.textContent = "Delete";
	deleteButton.classList.add("blockButton")
	deleteButton.addEventListener('click', function () {

		taskBlock.remove();

		tasks = tasks.filter((t) => t.id !== task.id)
		localStorage.setItem('taskBlockList', JSON.stringify(tasks));
	});


	// --------------------- Setting values in inputs ---------------------

	function buttonClick() {
		editedTask = task;

		document.getElementById('addButton').textContent = "Save"

		inputText.value = editedTask.name
		inputText.value = inputText.value
		cancelButton.style.display = "initial"

		inputEstimation.value = editedTask.estimation;
		inputEstimation.value = inputEstimation.value;

		inputDescription.value = editedTask.description;
	}

	// ---------------------------- Append Childs ----------------------------

	taskBlock.appendChild(descriptionP);
	taskBlock.appendChild(estimationDiv);
	taskBlock.appendChild(editButton);
	taskBlock.appendChild(deleteButton);

	return taskBlock;
}

cancelButton.addEventListener('click', cancelClick);

function cancelClick() {

	let cancelButton = document.getElementById('cancelButton');

	document.getElementById('addButton').textContent = "Add"
	cancelButton.style.display = 'none';
	editedTask = null;

	clearInputs();
}

document.addEventListener('click', (event) => {
	if (!activeElement) {
		return;
	}
	activeElement.classList.remove("activeElement")
	activeElement = null;

});

document.addEventListener("keydown", (event) => {

	if (event.keyCode === 39 && activeElement) {
		const parent = activeElement.parentElement;

		let parentId = activeElement.parentNode.id

		if (parentId === 'todo-lane-1') {
			columnToInsert = document.querySelector('#todo-lane-2');
		} else if (parentId === 'todo-lane-2') {
			columnToInsert = document.querySelector('#todo-lane-3');
		} else if (parentId === 'todo-lane-3') {
			columnToInsert = document.querySelector('#todo-lane-4');
		} else if (parentId === 'todo-lane-4') {
			return
		}
	}

	columnToInsert.appendChild(activeElement);
});

document.addEventListener("keydown", (event) => {

	if (event.keyCode === 37 && activeElement) {
		const parent = activeElement.parentElement;

		let parentId = activeElement.parentNode.id

		if (parentId === 'todo-lane-4') {
			columnToInsert = document.querySelector('#todo-lane-3')
		} else if (parentId === 'todo-lane-3') {
			columnToInsert = document.querySelector('#todo-lane-2');
		} else if (parentId === 'todo-lane-2') {
			columnToInsert = document.querySelector('#todo-lane-1');
		} else if (parentId === 'todo-lane-1') {
			return
		}

		columnToInsert.appendChild(activeElement);
	}

});