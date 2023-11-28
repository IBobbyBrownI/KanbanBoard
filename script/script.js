let inputText = document.querySelector("#todo-input");
let button = document.querySelector("button");
const tasksList = document.querySelectorAll(".swim-lane");
const toDoBlock = document.querySelector('#todo-lane-1');
let blockButton = document.querySelector(".blockButton");
let activeElement;
let columnToInsert;

let tasks = [{
	name: "Sam",
	status: 0,
	id: 1,
}];

console.log("console is working");

button.onclick = function() {

	console.log("click is working");

	let taskObj = {
		name: inputText.value,
		status: 0,
		id: (Math.max(tasks.map((a) => a.id )) || 0) + 1 //пребирает и возвращает новое значение
	}

	console.log("name:", taskObj.name);
	console.log(taskObj);

	tasks.push(taskObj)
	console.log(tasks)

	const taskBlock = createTaskBlock(taskObj);
	toDoBlock.appendChild(taskBlock);
	// document.getElementById('#todo-input').value = 'Enter the task...';

	const value = document.getElementById("todo-input");
	
	if(value) {
		value.value ='';
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

	let a = document.createElement('button');
	a.textContent = "<- left";
	a.classList.add("blockButton");

	let b = document.createElement('button');
	b.textContent = "right ->";
	b.classList.add("blockButton");

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

	taskBlock.appendChild(a);
	taskBlock.appendChild(b);
	return taskBlock;

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

	// if(parentId === 'todo-lane-1') {
	// 	columnToInsert = document.querySelector('#todo-lane-2');
	// 	// console.log('Column To Insert: ', columnToInsert)
	// } else if (parentId === 'todo-lane-2') {
	// 	// console.log('Column 2 To Insert: ', columnToInsert)
	// 	columnToInsert = document.querySelector('#todo-lane-3');
	// } else if (parentId === 'todo-lane-3') {
	// 	columnToInsert = document.querySelector('#todo-lane-1');
	// }

// ------------------------- Second way ------------------------- // 
	let value = 1;
	if (parentId === 'todo-lane-'+value) {
		columnToInsert = document.querySelector('#todo-lane-'+(value+1))
	} else if (parentId === 'todo-lane-'+(value+1)) {
		columnToInsert = document.querySelector('#todo-lane-'+(value+2));
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
  
	  console.log(parentId)// print parentId
  
  // ------------------------- First way ------------------------- // 
  
	  if(parentId === 'todo-lane-3') {
	  	columnToInsert = document.querySelector('#todo-lane-2');
	  	// console.log('Column To Insert: ', columnToInsert)
	  } else if (parentId === 'todo-lane-2') {
	  	// console.log('Column 2 To Insert: ', columnToInsert)
	  	columnToInsert = document.querySelector('#todo-lane-1');
	  } else if (parentId === 'todo-lane-1') {
	  	columnToInsert = document.querySelector('#todo-lane-1');
	  }
  
  // ------------------------- Second way ------------------------- // 
	//   let value = 1;
	//   if (parentId === 'todo-lane-'+(value+2)) {
	// 	  columnToInsert = document.querySelector('#todo-lane-'+(value-1))
	//   } else if (parentId === 'todo-lane-'+(value+1)) {
	// 	  columnToInsert = document.querySelector('#todo-lane-'+(value-1));
	//   }
  
	  columnToInsert.appendChild(activeElement);
	}
  
  });





// document.addEventListener('keydown', (event) => {
// 	console.log(event.keyCode)
// });



//Кликая на элемент, добавляем класс эктив. Внутри лиссенара на "addEventListener('keydown')..." строке, проверяем: Если нажата одна из кнопок направления и есть элемент с классом active, тогда выполняется действие перемещения (вверх вниз, вправо влево.) 
// как перекинуть: найти элемент в массиве (найти элемент в дереве элементов и найти его родителя (найти элемент в блоке в котором он есть), но его сохраняю в переменную)















// const tasksList = document.querySelectorAll(".swim-lane")

// const tasks = [{
// 	id: 1,
// 	name: 'Make calculator',
// 	status: 0,
// 	estimation: 4
//   },{
// 	id: 2,
// 	name: 'Make sandwich',
// 	status: 0,
// 	estimation: 3
//   },{
// 	id: 3,
// 	name: 'Make pizza',
// 	status: 0,
// 	estimation: 4
//   },{
// 	id: 4,
// 	name: 'watch Stranger Things',
// 	status: 1,
// 	estimation: 3
//   },{	
// 	id: 4,
// 	name: 'learn js',
//   	status: 1,
//   	estimation: 3
// }];
  
//   // [todo{}, inprogres{}, done{}]

//   function addTask() {

//   }
  
//   tasksList.forEach((d, index) => { //перебераем большиме блоки
// 	const selectedTasks = tasks.filter((t)=> t.status === index); //фильтруем таски по статусу (которые соответствуют блоку)
	
// 	selectedTasks.forEach((task)=> { // Перебераем все таски относящиеся к этому статусу
// 	  const taskBlock = getTaskBlock(task); //создаем блоки соттветствующие таску
	  
// 	  d.appendChild(taskBlock); //всталяем блоки в родительский контейнер (зона с тасками (блок To do, in pr....))
// 	})
// });

// 	function getTaskBlock(task){ //функция, которая создает блоки тасок
// 		const taskBlock = document.createElement('p'); //Создает элемент
// 		taskBlock.id = task.id; //сетает айди
// 		taskBlock.className = 'task'; //сетает класс
// 		//taskBlock.draggable = true // сетает свойтсво draggable
// 		taskBlock.textContent = task.name //контент

// 		// taskBlock.addEventListener("dragstart", () => { //добавляем событие
// 		// 	taskBlock.classList.add("is-dragging"); //добавлем класс когда событие сробатывает
// 		// });
// 		// taskBlock.addEventListener("dragend", () => { //добавляем событие
// 		// 	taskBlock.classList.remove("is-dragging"); //убираем класс когда событие сробатывает
// 		// });

// 		return taskBlock;
// 	}