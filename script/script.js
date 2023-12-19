let inputText = document.querySelector("#todo-input-1");
let inputEstimation = document.querySelector("#todo-input-2");
let inputDescription = document.querySelector("#todo-input-3")
let addTaskbutton = document.querySelector(".button");
let cancelButton = document.querySelector(".cancelButton")
const tasksList = document.querySelectorAll(".swim-lane");
const toDoBlock = document.querySelector('#todo-lane-1');
let blockButton = document.querySelector(".blockButton");
let activeElement;
let columnToInsert;
let editedTask = null;

let tasks = [];

let data = localStorage.getItem('taskBlockList')

try {
	if (data) {
		tasks = JSON.parse(data)
	}
} catch (error) {
	alert("can not get data from local storage...")
}

function pageReload() {
	location.reload();
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

addTaskbutton.onclick = function () {

	if (!editedTask) {

		let taskObj = {
			name: inputText.value,
			estimation: inputEstimation.value,
			description: inputDescription.value,
			status: 0,
			id: tasks.length ? Math.max(...tasks.map((a) => a.id)) + 1 : 1
		}

		if (!taskObj.name) {
			alert("Name is required!!!")
			return;
		}

		if (!taskObj.estimation) {
			taskObj.estimation = null;
		}

		const taskBlock = createTaskBlock(taskObj);
		toDoBlock.appendChild(taskBlock);

		tasks.push(taskObj)
		localStorage.setItem('taskBlockList', JSON.stringify(tasks))

		clearInputs();
	} else {
		let selectedTask = tasks.find(task => task.id === editedTask.id);

		// проверка на постую строку сделать
		if (selectedTask) {
			selectedTask.name = inputText.value;
			selectedTask.estimation = inputEstimation.value;
			selectedTask.description = inputDescription.value;

		} else {
			alert("selected task is not finded...");
			return;
		}

		localStorage.setItem('taskBlockList', JSON.stringify(tasks));

		// pageReload();
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

		if (confirm("cancel?")) {

			taskBlock.remove();

			tasks = tasks.filter((t) => t.id !== task.id)
			localStorage.setItem('taskBlockList', JSON.stringify(tasks));
		} else {
			return;
		}
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
// const cancelClick = ()=>{
	// вынести 3 строчки в другую функцию switchToAddMode
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

		let parentId = activeElement.parentNode.id

		columnToInsert = document.querySelector('#todo-lane-' + (+parentId[parentId.length - 1] + 1));
		if (!columnToInsert) return;
		columnToInsert.appendChild(activeElement);
	}
});

document.addEventListener("keydown", (event) => {

	if (event.keyCode === 37 && activeElement) {

		let parentId = activeElement.parentNode.id

		columnToInsert = document.querySelector('#todo-lane-' + (+parentId[parentId.length - 1] - 1));
		if (!columnToInsert) return;
		columnToInsert.appendChild(activeElement);
	}

});