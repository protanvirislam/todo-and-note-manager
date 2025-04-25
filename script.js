//DOM Selector

const all_tab = document.querySelectorAll("div[data-set]");
const all_model = document.querySelectorAll(".container-right > div");
const add_task_btn = document.getElementById("button-addon2");
const input_field = document.querySelector("#task-field");
const task_container = document.querySelector("tbody");

const completedList = [];

//---------------------------------------------------------------------------
//------------------------------------------------------------------------------
// OPERATION FOR ALL-TODOS MODEL

//Event Trigger Functions

//--Tab & Model Functionality

function getModel(e) {
  showActive(e.target.parentNode);

  let getId = e.target.parentNode.classList[0];

  el = document.querySelector(`#${getId}`);

  all_model.forEach((model) => {
    model.style.opacity = 0;
    model.style.zIndex = 0;
  });

  el.style.opacity = 1;
  el.style.zIndex = 1;
}

//--Add Task Functionality
function addTask(e) {
  e.preventDefault();

  //--/--get Input Field Value
  const task = input_field.value.trim();

  if (!task) {
    alert("Please Provide a value in input field");
  } else {
    //--/-- Clear Input Field
    clearField();

    //--/-- Add Item to Local Storage
    addTaskToStorage(task);

    //--/-- Render The Task to Display
    renderAllTasks();
  }
}

//--Render task to List

function renderAllTasks() {
  task_container.innerHTML = "";
  getTaskFromStorage().forEach((task, index) => {
    let tr = document.createElement("tr");
    tr.setAttribute("data-index", index);

    tr.innerHTML = `
           
                          <td>${task}</td>
                          <td><i class="fa-solid fa-check"></i><i class="fa-solid fa-pen-to-square edit"></i> <i class="fa-solid fa-xmark close"></i></td>
                        
          `;
    task_container.insertAdjacentElement("afterbegin", tr);
  });
}

//-- / -- Remove Task From TaskList and Storage Also

function removeTask(e) {
  if (
    e.target.classList.contains("close") ||
    e.target.classList.contains("fa-check")
  ) {
    let parent = e.target.parentNode.parentNode;
    let getIndex = +parent.getAttribute("data-index");

    let taskList = getTaskFromStorage();

    if (e.target.classList.contains("fa-check")) {
      addCompletTaskToStorage(taskList.splice(getIndex, 1));
      localStorage.setItem("taskList", JSON.stringify(taskList));
      renderAllTasks();
      renderAllCompletedTask();
    } else {
      taskList.splice(getIndex, 1);
      localStorage.setItem("taskList", JSON.stringify(taskList));
      renderAllTasks();
    }
  }

  
}

// --/---- Edit Task from List

function editTask(e) {
  const icon = e.target;

  if (!icon.classList.contains("edit")) return;

  const row = icon.closest("tr");
  const cell = row.firstElementChild;

  // If currently in "Edit" mode
  if (icon.classList.contains("fa-pen-to-square")) {
    const value = cell.innerText;
    cell.innerHTML = `<input value="${value}" />`;

    icon.classList.remove("fa-pen-to-square");
    icon.classList.add("fa-floppy-disk");
  } else if (icon.classList.contains("fa-floppy-disk")) {
    const input = cell.querySelector("input");
    cell.innerText = input.value;

    icon.classList.remove("fa-floppy-disk");
    icon.classList.add("fa-pen-to-square");

    //Modify also Storage Array
    const index = +row.getAttribute("data-index");

    const taskList = getTaskFromStorage();

    taskList.splice(index, 1, input.value);

    localStorage.setItem("taskList", JSON.stringify(taskList));
  }
}

// Helper Function

// --/-- Clear Input Field Fn
function clearField() {
  input_field.value = "";
}

// --/ -- Initial Active Tab
function initialActiveElement() {
  all_tab[0].classList.add("active");

  document.getElementById(all_tab[0].classList[0]).style.opacity = 1;
  document.getElementById(all_tab[0].classList[0]).style.zIndex = 2;
}

// --/--/-- Initial Active Tab Fn Calling
initialActiveElement();

//--/-- Switch active Trigger Fn
function showActive(target) {
  all_tab.forEach((tab) => {
    tab.classList.remove("active");
  });

  target.classList.add("active");
}

//--/-- add Task To Local Storage

function addTaskToStorage(task) {
  let taskList = [];
  if (localStorage.taskList) {
    JSON.parse(localStorage.getItem("taskList")).forEach((item) => {
      taskList.push(item);
    });
    taskList.push(task);
    localStorage.setItem("taskList", JSON.stringify(taskList));
  } else {
    taskList.push(task);
    localStorage.setItem("taskList", JSON.stringify(taskList));
  }
}

//--/-- retrive task From Local Storate

function getTaskFromStorage() {
  if (localStorage.taskList) {
    return JSON.parse(localStorage.getItem("taskList"));
  } else {
    return [];
  }
}

//--Event Handling

//-- / -- Edit Text from row

task_container.addEventListener("click", editTask);
task_container.addEventListener("keydown", editTask);

//--/-- remove Task From List

task_container.addEventListener("click", removeTask);

//--/--Tab Button Functionalitiy
all_tab.forEach((tab) => {
  tab.addEventListener("click", getModel);
});

//--/--Add Item To List Button
add_task_btn.addEventListener("click", addTask);

//--/---Initial Render of all Task
renderAllTasks();

//---------------------------------------------------------------------------
//------------------------------------------------------------------------------
// OPERATION FOR COMPLETED MODEL

const completed_task_container = document.querySelector("#completed tbody");

//Event Trigger Functions

function renderAllCompletedTask() {
    completed_task_container.innerHTML = '';
  getCompleteTaskFromStorage().forEach((task, index) => {
    const tr = document.createElement("tr");
    tr.setAttribute("data-set", index);
    tr.innerHTML = `
          <td> <i class="fa-solid fa-circle-check"></i> ${task}</td>
          <td> <i class="fa-solid fa-trash remove"></i></td>
         
         `;
    
    completed_task_container.insertAdjacentElement("afterbegin", tr);
    
  });
}

renderAllCompletedTask();




//Remove Completed Task

function removeCompletedTask(e) {
    
    if(!e.target.classList.contains("remove")) return ;

      let parent = e.target.parentNode.parentNode;
      let getIndex = +parent.getAttribute("data-set");
  
      let completedList = getCompleteTaskFromStorage();
  
   
        completedList.splice(getIndex, 1);
        localStorage.setItem("completedList", JSON.stringify(completedList));

        renderAllCompletedTask();
      
    }
  
    
  



//--/--HELPER FUNCTIONS

function addCompletTaskToStorage(completeTask) {
  let completedList = [];
  if (localStorage.completedList) {
    JSON.parse(localStorage.getItem("completedList")).forEach((item) => {
      completedList.push(item);
    });
    completedList.push(completeTask);
    localStorage.setItem("completedList", JSON.stringify(completedList));
  } else {
    completedList.push(completeTask);
    localStorage.setItem("completedList", JSON.stringify(completedList));
  }
}

function getCompleteTaskFromStorage() {
  if (localStorage.completedList) {
    return JSON.parse(localStorage.getItem("completedList"));
  } else {
    return [];
  }
}

//--Event Handling

completed_task_container.addEventListener("click", removeCompletedTask)


//---------------------------------------------------------------------------
//------------------------------------------------------------------------------
// OPERATION FOR COMPLETED MODEL



const  addNote_btn =document.querySelector(".add-note");
const input_title = document.querySelector("#Title");
const input_description = document.querySelector("#Description");
const note_container = document.querySelector(".note-list")



//Main Working Funtion

function addNote(e) {
  e.preventDefault();
  if( !input_title.value.trim() && !input_description.value.trim()) {
    alert("Please Fill The Title and Descirption Field !!!");
    clearField();
  } else {
    const title = input_title.value.trim();
    const description = input_description.value.trim();
    addNoteToStorage({title, description});
    clearNoteField();
    renderAllNotes()
    
  }
}

function renderAllNotes() {

  note_container.innerHTML = "";

   if(getNotesFromStorage().length === 0) {
    const h4 = document.createElement("h4");
    h4.innerHTML = "No More Note Available !  please add note";
    note_container.appendChild(h4)
   }

 getNotesFromStorage().forEach((note, index) => {
   

  let li = document.createElement("li");
   li.setAttribute("dat-note", index)
  
  
  li.innerHTML = `
            <h5 class="note-title">${note.title}</h5>
                 <p class="note-description">${note.description}</p>
                <div class="list-close">X</div>
  `
   li.style.zIndex = `${index}`
  note_container.insertAdjacentElement("afterbegin", li);
 
 });




}



async function removeNote(e) {
   if(!e.target.classList.contains('list-close')) return ;
   const getIndex = e.target.parentNode.getAttribute("data-note");

   const noteList = getNotesFromStorage();
    noteList.splice(getIndex, 1);
    localStorage.setItem("noteList", JSON.stringify(noteList));

     e.target.parentNode.style.transform =  "scale(2)";
     e.target.parentNode.style.opacity =  "0";
    
     setTimeout(()=> {
      e.target.parentNode.remove();
      renderAllNotes();
     }, 1000);
  
     


}






//Helper Functions 

function addNoteToStorage(note) {
  console.log(note)
  let noteList = [];
  if(localStorage.noteList) {
    noteList = [...JSON.parse(localStorage.getItem("noteList"))];
    noteList.push(note);
    localStorage.setItem("noteList", JSON.stringify(noteList));
  }else {
    noteList.push(note)
    localStorage.setItem("noteList", JSON.stringify(noteList))
  }
}


function getNotesFromStorage() {
  if(localStorage.noteList) {
    return JSON.parse(localStorage.getItem("noteList"));
  }else {
    return [];
  }
}

function clearNoteField() {
  input_title.value = "";
  input_description.value= "";
}





// Event Handling

addNote_btn.addEventListener("click", addNote);
note_container.addEventListener("click" , removeNote)

//Initial rendering
renderAllNotes()