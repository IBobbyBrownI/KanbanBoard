const inputText = document.querySelector("#todo-input-1");
const inputEstimation = document.querySelector("#todo-input-2");
const inputDescription = document.querySelector("#todo-input-3")
const saveTaskButton = document.querySelector(".button");
const cancelButton = document.querySelector(".cancelButton")
const tasksList = document.querySelectorAll(".swim-lane");
const toDoBlock = document.querySelector('#todo-lane-1');
let activeElement;
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

tasksList.forEach((box, index) => {
  let selectedTasks = tasks.filter((task) => task.status === index)
  selectedTasks.forEach((task) => {
    taskBlock = createTaskBlock(task);

    box.appendChild(taskBlock);
  })
});

saveTaskButton.onclick = function () {
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

    if (selectedTask) {

      // разбить на отдельные сообщения
      if (!inputText.value.trim() || !inputEstimation.value || inputEstimation.value <= 0) {
        alert("invalid input");
        return;
      }
      selectedTask.name = inputText.value;
      //приведение типов
      selectedTask.estimation = inputEstimation.value;
      selectedTask.description = inputDescription.value;
    } else {
      alert("selected task is not found...");
      return;
    }

    localStorage.setItem('taskBlockList', JSON.stringify(tasks));

    const taskNameBlock = document.getElementById("task_name_" + selectedTask.id)
    const taskDescriptionBlock = document.getElementById("task_description_" + selectedTask.id)
    const taskEstimationBlock = document.getElementById("task_estimation_" + selectedTask.id)
    taskNameBlock.textContent = inputText.value;
    taskDescriptionBlock.textContent = inputDescription.value;
    taskEstimationBlock.textContent = inputEstimation.value;

    switchMode(null);
  }
};

cancelButton.addEventListener('click', () => switchMode(null));

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

    let columnToInsert = document.querySelector('#todo-lane-' + (+parentId[parentId.length - 1] + 1));
    if (!columnToInsert) return;

    columnToInsert.appendChild(activeElement);

    const pattern = /(\d+)$/;
    const id = +activeElement.id.match(pattern)[1];

	tasks = tasks.map(t => t.id === id?  { ...t, status: t.status + 1 }: t);

    localStorage.setItem('taskBlockList', JSON.stringify(tasks));
  }
});

document.addEventListener("keydown", (event) => {

  if (event.keyCode === 37 && activeElement) {

    let parentId = activeElement.parentNode.id

    let columnToInsert = document.querySelector('#todo-lane-' + (+parentId[parentId.length - 1] - 1));
    if (!columnToInsert) return;
    columnToInsert.appendChild(activeElement);

    const pattern = /(\d+)$/;
    const id = +activeElement.id.match(pattern)[1];

	tasks = tasks.map(t => t.id === id?  { ...t, status: t.status - 1 }: t);

    localStorage.setItem('taskBlockList', JSON.stringify(tasks));
  }
});


function switchMode(task) {
  if (task) {
    editedTask = task;

    document.getElementById('addButton').textContent = "Save"

    inputText.value = editedTask.name
    inputText.value = inputText.value
    cancelButton.style.display = "initial"
    inputEstimation.value = editedTask.estimation;
    inputEstimation.value = inputEstimation.value;
    inputDescription.value = editedTask.description;

  } else {
    document.getElementById('addButton').textContent = "Add Task"
    cancelButton.style.display = 'none';
    editedTask = null;

    clearInputs();
  }
}

function clearInputs() {
  inputText.value = '';
  inputEstimation.value = '';
  inputDescription.value = '';
}

function createTaskBlock(task) {

  let taskBlock = document.createElement('div');

  // ---------------------------- Task Block ----------------------------

  taskBlock.className = 'task';
  taskBlock.id = 'task_' + task.id;

  taskBlock.addEventListener('click', (event) => {
    event.stopPropagation();

    const currentAE = document.querySelector(".activeElement")

    if (currentAE) {
      currentAE.classList.remove("activeElement");
    }

    if (activeElement === event.target) {
      activeElement.classList.remove("activeElement")
      activeElement = null;
    } else if (taskBlock === event.target) {
      activeElement = event.target
      activeElement.classList.add("activeElement")
    }
  });

  // ---------------------------- Name ----------------------------

  const nameElement = document.createElement('span');
  nameElement.placeholder = "Name"
  nameElement.id = 'task_name_' + task.id;
  nameElement.textContent = task.name;


  // ---------------------------- Description ----------------------------

  let descriptionP = document.createElement('p');
  descriptionP.id = 'task_description_' + task.id;
  descriptionP.classList.add("description")
  descriptionP.placeholder = "Description"

  if (task.description) {
    descriptionP.textContent = task.description
  }

  // ---------------------------- Estimation ----------------------------

  let estimationDiv = document.createElement('div')
  estimationDiv.id = 'task_estimation_' + task.id;
  estimationDiv.classList.add("estimation")
  descriptionP.placeholder = "Estimation"
  estimationDiv.textContent = task.estimation;

// ---------------------------- Edit Button ----------------------------

  let editButton = document.createElement('button');
  editButton.textContent = "Edit";
  editButton.classList.add("blockButton")
  editButton.addEventListener('click', () => switchMode(task));

  // ---------------------------- Delete Button ----------------------------

  let deleteButton = document.createElement('button');
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("blockButton")
  deleteButton.addEventListener('click', () => {
    if (!confirm("Are you sure want to delete?"))
      return;

    taskBlock.remove();
    tasks = tasks.filter((t) => t.id !== task.id)
    localStorage.setItem('taskBlockList', JSON.stringify(tasks));
  });



  // ---------------------------- Append Childs ----------------------------

  taskBlock.appendChild(nameElement);
  taskBlock.appendChild(descriptionP);
  taskBlock.appendChild(estimationDiv);
  taskBlock.appendChild(editButton);
  taskBlock.appendChild(deleteButton);

  return taskBlock;
}