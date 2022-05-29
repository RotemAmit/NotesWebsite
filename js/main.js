const notesContainer = document.getElementById("app");
const addNoteButton = notesContainer.querySelector(".add-note");
const searchInput = document.getElementById('searchBar');
const deleteModal = document.querySelector(".modal");
const span = document.querySelector(".close");

let notesDict = {};
let filteredNotes = {};

getNotes().forEach((note) => {
    const noteElement = createNoteElement(note.id, note.content);    
    notesContainer.insertBefore(noteElement, addNoteButton);
});

addNoteButton.addEventListener("click", () => addNote());

span.addEventListener("click", () => {
    hideModal();
});

function hideModal() {
    deleteModal.style.display = "none";
}

function getNotes() {
    return JSON.parse(localStorage.getItem("stickynotes-notes") || "[]");
}

function saveNotes(notes) {
    localStorage.setItem("stickynotes-notes", JSON.stringify(notes));
}

function createNoteElement(id, content) {
    const element = document.createElement("textarea");
    
    element.classList.add("note");
    element.value = content;
    element.placeholder = "Empty Sticky Note";

    element.addEventListener("change", () => {
        updateNote(id, element.value);
    });

    const divElement = document.createElement("div");
    divElement.appendChild(element);

    //add the delete icon to the note
    const deleteBtnEl = document.createElement("i");
    deleteBtnEl.classList.add("deleteBtn");
    deleteBtnEl.classList.add("fa");
    deleteBtnEl.classList.add("fa-trash-o");
    divElement.appendChild(deleteBtnEl);

    deleteBtnEl.addEventListener("click", () => {
        deleteModal.style.display = "block";
        localStorage.setItem("noteId", id);
    });

    notesDict[id] = divElement;
    
    return divElement;
}

function addNote() {
    const notes = getNotes();
    const noteObject = {
        id: Math.floor(Math.random() * 100000),
        content: ""
    };

    const noteElement = createNoteElement(noteObject.id, noteObject.content);
    notesContainer.insertBefore(noteElement, addNoteButton);

    notes.push(noteObject);
    saveNotes(notes);

    //start typing immediately
    noteElement.childNodes[0].focus();
    noteElement.childNodes[0].select();
}

function updateNote(id, newContent) {
    const notes = getNotes();
    const targetNote = notes.filter((note) => note.id == id)[0];

    targetNote.content = newContent;
    saveNotes(notes);
}

function deleteNote() {
    const id = localStorage.getItem("noteId");
    const element = notesDict[id];
    
    const notes = getNotes().filter((note) => note.id != id);
    saveNotes(notes);
    notesContainer.removeChild(element);
    
    delete notesDict[id];
    
    deleteModal.style.display = "none";
}

searchInput.addEventListener('input', e =>{
    const NotesList = getNotes();
    const value = e.target.value.toLowerCase();
    
    if(NotesList.length > 0){
        NotesList.forEach(note => {
            checkVisibility(note, value, true);
        });
    }
    
    for(let id in filteredNotes){
        const noteContent = filteredNotes[id].childNodes[0].value;
        const note = {
            id: id,
            content: noteContent
        };
        checkVisibility(note, value, false);
    }
});


function checkVisibility(note, value, remove){
    const visible = note.content.toLowerCase().includes(value);
    
    if(!visible && remove){
        filteredNotes[note.id] = notesDict[note.id];
        localStorage.setItem("noteId", note.id);
        deleteNote();
    }
    else if(visible && !remove){
        const element = filteredNotes[note.id];
        delete filteredNotes[note.id];
        addSearchNote(note, element);
    }
}

function addSearchNote(note, noteElement){
    notesDict[note.id] = noteElement;
    notesContainer.insertBefore(noteElement, addNoteButton);
    
    const notes = getNotes();
    const noteObject = {
        id: note.id,
        content: note.content
    };

    notes.push(noteObject);
    saveNotes(notes);
}

