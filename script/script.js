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

console.log("data: ", data)

if(data) {
	tasks = JSON.parse(data)
}

console.log("console is working");

button.onclick = function() {

	if(!editedTask) {
	console.log("click is working");

	console.log(...tasks.map(a => a.id))

	let taskObj = {
		name: inputText.value,
		estimation: inputEstimation.value,
		description: inputDescription.value,
		status: 0,
		id: tasks.length ? Math.max(...tasks.map((a) => a.id )) + 1 : 1//пребирает и возвращает новое значение
	}

	if(!taskObj.name) {
		alert("Undefind task input, task = Unnamed")	
		taskObj.name = "Unnamed";	
	}

	if (!taskObj.estimation) {
		alert("Undefind Estimation input, estimation = 0")
		taskObj.estimation = 0;
	}

	console.log("name:", taskObj.name);
	console.log("estimation:", taskObj.estimation);
	console.log(taskObj);

	console.log(tasks)

	const taskBlock = createTaskBlock(taskObj);
	toDoBlock.appendChild(taskBlock);

	tasks.push(taskObj)
	localStorage.setItem('taskBlockList', JSON.stringify(tasks))

	const value = document.getElementById("todo-input-1");
	const value2 = document.getElementById("todo-input-2");
	const value3 = document.getElementById("todo-input-3");
	
	if(value) {
		value.value = '';
	}
	if(value2) {
		value2.value = '';
	}
	if(value3) {
		value3.value = '';
	}
} else {

	//сохранение редактируемого (найти элементы, схранить в ls)
	let data = localStorage.getItem('taskBlockList');
	let tasksFromLocalStorage = JSON.parse(data);

	let selectedTaskId = editedTask.id;
	console.log("selectedTaskId: ", selectedTaskId)

	let selectedTask = tasksFromLocalStorage.find(task => task.id === selectedTaskId);
	console.log("SelectedTask: ", selectedTask)

	if(selectedTask) {
		let a = document.getElementById('todo-input-1')
		let b = document.getElementById('todo-input-2')
		let c = document.getElementById('todo-input-3')

		selectedTask.name = a.value;
		selectedTask.estimation = b.value;
		selectedTask.description = c.value;
		
		if(a) {
			a.value = '';
		}
		if(b) {
			b.value = '';
		}
		if(c) {
			c.value = '';
		}
	}

	localStorage.setItem('taskBlockList', JSON.stringify(tasksFromLocalStorage));
	console.log("tasksFromLocalStorage: ", tasksFromLocalStorage)

	button.textContent = "Add"
	cancelButton.style.display = 'none'
	editedTask = null;
	location.reload()
}
};

console.log(tasksList)

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

		if(currentAE) {
			currentAE.classList.remove("activeElement");
		}
		
		if(activeElement === event.target){
		  activeElement.classList.remove("activeElement")
		  activeElement = null;
		}
		else if(taskBlock === event.target){
			activeElement = event.target
			activeElement.classList.add("activeElement")
		}
	});

	// ---------------------------- Description ----------------------------

	let descriptionP = document.createElement('p');	
	descriptionP.classList.add("description")
	descriptionP.textContent = "Description: "
	if(task.description) {
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
	deleteButton.addEventListener('click', function() {

	taskBlock.remove();

	let taskIndex = tasks.findIndex(t => t.id === task.id);
	if (taskIndex !== -1) {
    	tasks.splice(taskIndex, 1); //Метод splice удаляет или добавляет элементы в массив. Можно только удалять элементы, только добавлять или делать и то и другое одновременно.
		localStorage.setItem('taskBlockList', JSON.stringify(tasks));
	}
});


	// --------------------- Setting values in inputs ---------------------
	
	function buttonClick() {
		editedTask = task;

		// change addButton in "save"
		document.getElementById('addButton').textContent = "Save"

		// set input values...
		let a = document.getElementById('todo-input-1');
		a.value = editedTask.name;
		console.log("setting name!", a.value)
		document.getElementById('todo-input-1').value = a.value;
		cancelButton.style.display = "initial"

		let b = document.getElementById('todo-input-2');
		b.value = editedTask.estimation;
		console.log("setting estimation!", b.value)
		document.getElementById('todo-input-2').value = b.value;

		let c = document.getElementById('todo-input-3');
		c.value = editedTask.description;
		console.log("setting description!", c.value)

		console.log("Edited task before cancel: ", editedTask)
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

		let input1 = document.getElementById('todo-input-1');
		let input2 = document.getElementById('todo-input-2');
		let input3 = document.getElementById('todo-input-3');

		if(input1) {
			input1.value = '';
		}
		if(input2) {
			input2.value = '';
		}
		if(input3) {
			input3.value = '';
		}

		document.getElementById('addButton').textContent = "Add"
		cancelButton.style.display = 'none';
		editedTask = null;
		console.log("Edited task = ",editedTask)
	}

document.addEventListener('click', (event) => {
	if(!activeElement){
		return;	
	}
  activeElement.classList.remove("activeElement")
  activeElement = null;
//   activeElement.classList.remove("activeElement")
  console.log("Active is null")

});

document.addEventListener("keydown", (event) => {

  if(event.keyCode === 39 && activeElement) {
	console.log("activeElement", activeElement)
 	console.log("key is pressed!", event.keyCode)
    const parent = activeElement.parentElement;

	let parentId = activeElement.parentNode.id // geting parentId

// ------------------------- First way ------------------------- // 

	let value = 1;
	if (parentId === 'todo-lane-'+value) {
		columnToInsert = document.querySelector('#todo-lane-'+(value+1));
	} else if (parentId === 'todo-lane-'+(value+1)) {
		columnToInsert = document.querySelector('#todo-lane-'+(value+2));
	} else if (parentId === 'todo-lane-'+(value+2)) {
		columnToInsert = document.querySelector('#todo-lane-'+(value+3));
	}

    columnToInsert.appendChild(activeElement);
  }

});

document.addEventListener("keydown", (event) => {

	if(event.keyCode === 37 && activeElement) {
	  console.log("activeElement", activeElement)
	   console.log("key is pressed!", event.keyCode)
	  const parent = activeElement.parentElement;
  
	  let parentId = activeElement.parentNode.id // geting parentId
    
  // ------------------------- First way ------------------------- // 
	  if(parentId === 'todo-lane-4') {
		columnToInsert = document.querySelector('#todo-lane-3')
	  } else if(parentId === 'todo-lane-3') {
	  	columnToInsert = document.querySelector('#todo-lane-2');
	  	// console.log('Column To Insert: ', columnToInsert)
	  } else if (parentId === 'todo-lane-2') {
	  	// console.log('Column 2 To Insert: ', columnToInsert)
	  	columnToInsert = document.querySelector('#todo-lane-1');
	  } else if (parentId === 'todo-lane-1') {
	  	columnToInsert = document.querySelector('#todo-lane-1');
	  }
  
	  columnToInsert.appendChild(activeElement);
	}
  
  });