const openDialogBtn = document.querySelector(".add");

const dialog = document.querySelector(".dialog");
const view = document.querySelector(".view");
const deletePrompt = document.querySelector(".deletePrompt");
const discardPrompt = document.querySelector(".discardPrompt");

const editBtn = document.querySelector(".view .editBtn");
const saveEdit = document.querySelector(".saveEdit");

const backBtn = document.querySelector(".close");
const viewBack = document.querySelector(".viewBack");
const saveBtn = document.querySelector(".save");
const form = document.getElementById("form");
const container = document.querySelector(".container");
const background = document.querySelector(".background");
const colors = ['#FD99FF','#91F48F','#FFF599','#9EFFFF','#B69CFF'];

let edit = false;
let viewState = false;
let clickedElementID;


let title = document.querySelector(".title");
let description = document.querySelector(".description");

window.addEventListener("DOMContentLoaded",clearBackground);

window.addEventListener('DOMContentLoaded',setUpItems);

form.addEventListener("submit",addItem);

openDialogBtn.addEventListener("click",()=>{
    openDialog(dialog);
});

editBtn.addEventListener("click",()=>{
    edit = true;
    saveEdit.classList.remove('hidden');
    editBtn.classList.add("hidden");
  
})

saveEdit.addEventListener("click",()=>{
   let editTitle = document.querySelector('.view .title').value;
   let editDescription = document.querySelector(".view .description").value;

    document.querySelector(".selected p").textContent = editTitle;
    document.querySelector('.selected').classList.remove('selected');

   updateNote(clickedElementID,editTitle,editDescription);
   saveEdit.classList.add("hidden");
   editBtn.classList.remove('hidden');
   setDefault();

});

viewBack.addEventListener("click",()=>{
    let currentDescription = document.querySelector(".view .description").value;
    let currentTitle = document.querySelector(".view .title").value;

    let noteInfo = getNotesFromLocalStorage().filter((item)=>{
        return item.id == clickedElementID;
    });
    let inputString;

    discardPrompt.addEventListener("close",()=>{
      

        inputString = discardPrompt.returnValue;

        if (inputString == 'Discard'){
            view.close();
            saveEdit.classList.add("hidden");
            editBtn.classList.remove('hidden');

        } else if(inputString=='Back to note'){
            discardPrompt.close();
        }
      });

  if (edit) {
      if ((currentTitle !== noteInfo[0].title)||(currentDescription!==noteInfo[0].description)) {

      openDialog(discardPrompt); 

    }
    else {
        view.close();
    }
  }
  else if (!edit) {
    if((currentTitle !== noteInfo[0].title)||(currentDescription!==noteInfo[0].description)){
        view.close();
    } 
    else {
        view.close();
    }
    
  }

});

function generateColor(colorArray){
    let index = Math.floor(Math.random()*colorArray.length);
    return colorArray[index];
}

function addItem(){
    let noteTitle = title.value;
    let noteDescription = description.value; 
    let id = new Date().getTime();

    if(noteTitle && !edit){
        createNoteElement(id,noteTitle);
        clearBackground();
        addNoteToLocalStorage(id,noteTitle,noteDescription);
        setDefault();
    }
    
}



function clearBackground(){
        if(container.childElementCount==1){
            background.classList.remove("hidden");
        }else {
            background.classList.add("hidden");
        }
      
   
}


/* Operation functions */
function getNotesFromLocalStorage(){

    return localStorage.getItem("notes")?JSON.parse(localStorage.getItem("notes")):[];

}

function addNoteToLocalStorage(id,title,description){

    let stickyNote = {id, title, description};
    let allNotes = getNotesFromLocalStorage();

    allNotes.push(stickyNote);

    localStorage.setItem('notes', JSON.stringify(allNotes));


}

function createNoteElement(id,content){

        let element = document.createElement('article');
        let dataID = document.createAttribute("data-id");
        element.setAttributeNode(dataID);
        element.dataset.id = id;
        element.classList.add("sticky-note");
        element.classList.add(`bg-[${generateColor(colors)}]`);

    element.innerHTML = `<button class="absolute top-2 right-4 more">
        More
        <i class="fa-solid fa-ellipsis-vertical"></i>
      </button>
     
     <div class="absolute w-full h-full duration-[.5s] top-0 left-0 hidden editDelete">
     <div class="absolute top-2 right-4 z-20">
     <button class="text-white p-1 rounded-[1rem] hover:bg-green-600 duration-[.5s] goBack">
       Back
     </button>
   </div>
      <div class="absolute p-2 w-full h-full top-0 left-0 rounded-xl bg-[#FD99FF]">

      <div class="text-white flex items-center justify-center bg-black w-full h-full rounded-xl">
        <button class="rounded-xl w-full h-full hover:bg-red-700 duration-[.5s] text-[1rem] md:text-[1.5rem] deleteBtn">Delete</button>
      </div>
      </div>
     </div><p class="text-[1.5rem] font-[400]">${content}</p>`;

        // Add the title element to the page
        container.appendChild(element);


        const more = element.querySelector(".more");
        const editDelete = element.querySelector(".editDelete");
        const editBtn = element.querySelector(".editBtn");
        const deleteBtn = element.querySelector(".deleteBtn");
        const goBackBtn = element.querySelector('.goBack');


        goBackBtn.addEventListener("click",(event)=>{
            event.stopPropagation();
            editDelete.classList.add("hidden");
        });

        deleteBtn.addEventListener("click",(event)=>{
            let string;
            event.stopPropagation();
            deletePrompt.showModal();

            deletePrompt.addEventListener("close",()=>{
              string = deletePrompt.returnValue;

                if (string =='delete') {
                    deleteNote(id,element);
                   }
            });

          
            
        });

        more.addEventListener("click",(event)=>{
            event.stopPropagation();
            editDelete.classList.toggle("hidden");
        });

        element.addEventListener("click",(e)=>{
            openDialog(view);
            viewState = true;
            clickedElementID = id;

            element.classList.add("selected");

            let selectedNote = e.currentTarget;
            let noteInfo = getNotesFromLocalStorage().filter((item)=>{
                return item.id === parseInt(selectedNote.dataset.id)
            });
        
            document.querySelector(".view .title").value = noteInfo[0].title;
            document.querySelector(".view .description").value = noteInfo[0].description;
        });
}


function openDialog(dialog){ 
    dialog.showModal();
}

function updateNote(uniqueID,title,description){ /* Also updates the local storage */

    let allNotes = getNotesFromLocalStorage();
    let update = allNotes.map((item)=>{
        if (item.id === uniqueID) {
            item.title = title;
            item.description = description;
        }
        return item;
    });
    
    localStorage.setItem('notes',JSON.stringify(update));

}

function deleteNote(id,note){
    /* Also deletes the element from the local storage */
    note.remove();

    let allNotes = getNotesFromLocalStorage();
    allNotes = allNotes.filter((item)=>{
        return item.id !== id;
    });

    localStorage.setItem('notes',JSON.stringify(allNotes));

}

function setDefault(){
    title.value = '';
    description.value = '';
    edit = false;
}

function setUpItems(){
    let allItems = getNotesFromLocalStorage();
    if (allItems.length > 0) {
        allItems.forEach((item)=>{
            createNoteElement(item.id,item.title);
        })
    }
}

