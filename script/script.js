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

// Достаем данные из local storage и записываем их в data
let data = localStorage.getItem('taskBlockList')

//Проверка на наличие данных в data, в противном случае появится ошибка
try {
  if (data) {
    tasks = JSON.parse(data)
  }
} catch (error) {
  alert("can not get data from local storage...")
}

//Проходится по всему массиву tasksList и вызывает функцию, которая отрисовывает объект
tasksList.forEach((box, index) => {
  let selectedTasks = tasks.filter((task) => task.status === index)
  selectedTasks.forEach((task) => {
    taskBlock = createTaskBlock(task);

    box.appendChild(taskBlock);
  })
});

//Функция создающая или изменяющая таск
saveTaskButton.onclick = function () {
  //Если не editedTask = null, то есть кнопка "edit" не была нажата, то идет добавление таски
  if (!editedTask) {

    let taskObj = {
      name: inputText.value,
      estimation: inputEstimation.value,
      description: inputDescription.value,
      status: 0,
      id: tasks.length ? Math.max(...tasks.map((a) => a.id)) + 1 : 1
    }

	//Имя должно быть обязательным
    if (!taskObj.name) {
      alert("Name is required!!!")
      return;
    }
	
	//Если не указать оценку, то estimation = null
    if (!taskObj.estimation) {
      taskObj.estimation = null;
    }

	//Создание объекта и добавление в массив и local storage
    const taskBlock = createTaskBlock(taskObj);
    toDoBlock.appendChild(taskBlock);
    tasks.push(taskObj)
    localStorage.setItem('taskBlockList', JSON.stringify(tasks))

    clearInputs();
  } else {
	//Этот блок срабатывает, если была нажата кнока "edit"
	//Ищет выбранную таску в массиве
    let selectedTask = tasks.find(task => task.id === editedTask.id);

	//Если находит, идет валидация входных данных
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
	  //иначе, выводит ошибку
      alert("selected task is not found...");
      return;
    }

	//Изменяет объект в local storage
    localStorage.setItem('taskBlockList', JSON.stringify(tasks));

	//Вставляет измененные значения в таску
	const taskNameBlock = document.getElementById("task_name_" + selectedTask.id)
    const taskDescriptionBlock = document.getElementById("task_description_" + selectedTask.id)
    const taskEstimationBlock = document.getElementById("task_estimation_" + selectedTask.id)
    taskNameBlock.textContent = inputText.value;
    taskDescriptionBlock.textContent = inputDescription.value;
    taskEstimationBlock.textContent = inputEstimation.value;

	//Переключение в add mode
    switchMode(null);
  }
};

//Вешаем событие на кноку "cancel", нажимая, меняем на add mode
cancelButton.addEventListener('click', () => switchMode(null));

//Вешаем событие на саму страницу, если кликаем не на объект, то есть на любое другое место, Active Elemet
//становиться null

document.addEventListener('click', (event) => {
  if (!activeElement) {
    return;
  }
  activeElement.classList.remove("activeElement")
  activeElement = null;
});

//Вешаем события на нажатие клавиши
document.addEventListener("keydown", (event) => {

  //Если код клавиши = 39 и есть active element, то меняем его расположение
  if (event.keyCode === 39 && activeElement) {

	//Находим id родителя
    let parentId = activeElement.parentNode.id

	//Изменяем id, добавляя единичку, а по скольку у объекта не может быть 2 родителя, удалять не приходится
    let columnToInsert = document.querySelector('#todo-lane-' + (+parentId[parentId.length - 1] + 1));
    if (!columnToInsert) return;

    columnToInsert.appendChild(activeElement);

	//Ищем id Active element
    const pattern = /(\d+)$/;
    const id = +activeElement.id.match(pattern)[1];

	//Находим в массиве и изменяем
	tasks = tasks.map(t => t.id === id?  { ...t, status: t.status + 1 }: t);

	//Записываем измененный массив в local storage
    localStorage.setItem('taskBlockList', JSON.stringify(tasks));
  }
});

document.addEventListener("keydown", (event) => {

  //Если код клавиши = 39 и есть active element, то меняем его расположение
  if (event.keyCode === 37 && activeElement) {

	//Находим id родителя
    let parentId = activeElement.parentNode.id

	//Изменяем id, добавляя единичку, а по скольку у объекта не может быть 2 родителя, удалять не приходится
    let columnToInsert = document.querySelector('#todo-lane-' + (+parentId[parentId.length - 1] - 1));
    if (!columnToInsert) return;
    columnToInsert.appendChild(activeElement);

	//Ищем id Active element
    const pattern = /(\d+)$/;
    const id = +activeElement.id.match(pattern)[1];

	//Находим в массиве и изменяем
	tasks = tasks.map(t => t.id === id?  { ...t, status: t.status - 1 }: t);

	//Записываем измененный массив в local storage
    localStorage.setItem('taskBlockList', JSON.stringify(tasks));
  }
});

//Функция изменения режима add и edit
function switchMode(task) {
  //Если передаем таску в качестве параметра, тогда срабатывает edit mode
  if (task) {
    editedTask = task;

	//Изменяем textContent кнопки на "Save"
    document.getElementById('addButton').textContent = "Save"

	//Изменяем значения
    inputText.value = editedTask.name
    inputText.value = inputText.value
	//Показываем кнопку "Cancel"
    cancelButton.style.display = "initial"
    inputEstimation.value = editedTask.estimation;
    inputEstimation.value = inputEstimation.value;
    inputDescription.value = editedTask.description;

  } else {
	//Если в качетсве параметра был передан null, срабатывает add mode
	//Меняем text content на Add Task
    document.getElementById('addButton').textContent = "Add Task"
	//Убираем кнопку cancel с глаз долой :)
    cancelButton.style.display = 'none';
	//убираем editTask, присваивая ему null
    editedTask = null;

    clearInputs();
  }
}

//Инквизиция инпутов
function clearInputs() {
  inputText.value = '';
  inputEstimation.value = '';
  inputDescription.value = '';
}

//Функция отрисовки таски
function createTaskBlock(task) {

  //Создаем div элемент
  let taskBlock = document.createElement('div');

  // ---------------------------- Task Block ----------------------------

  //Добавлем класс таске
  taskBlock.className = 'task';
  //Сетаем Idшник
  taskBlock.id = 'task_' + task.id;

  //Кидаем обработчик событий на клик по таске.
  taskBlock.addEventListener('click', (event) => {
    event.stopPropagation();

	//Создаем переменную currentAE и кидаем в нее Active Element
    const currentAE = document.querySelector(".activeElement")

	//Если currentAE не равен null, то удаляем класс activeElement 
    if (currentAE) {
      currentAE.classList.remove("activeElement");
    }

	//Если произошел повторный клик на active element, то удаляется класс activeElement
    if (activeElement === event.target) {
      activeElement.classList.remove("activeElement")
      activeElement = null;
	//Устанавливаем класс activeElement таске
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

  //Функция подтверждения действия удаления
  deleteButton.addEventListener('click', () => {
	//Если в качестев ответа на confirm был передан null -> return
    if (!confirm("Are you sure want to delete?"))
      return;

	//иначе, удаляем из массива tasks и local storage
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