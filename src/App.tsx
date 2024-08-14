import { useState } from "react";
import "./App.css";
import { title } from "process";
import { StringMappingType } from "typescript";
import {Note} from '../src/Note'

const App = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: "Note1",
      content: "note1 content",
    },
    {
      id: 2,
      title: "Note2",
      content: "note2 content",
    },
    {
      id: 3,
      title: "Note3",
      content: "note3 content",
    },
    {
      id: 4,
      title: "Note4",
      content: "note4 content",
    },
    ]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note|null>(null);

  const handleAddNote = (event: React.FormEvent) => {
    event.preventDefault();
    const newNote: Note = {
      id: notes.length + 1,
      title: title,
      content: content,
    };
    setNotes([newNote, ...notes]);
    setTitle("");
    setContent("");
  };

  const handleNoteClick = (note : Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    console.log(note.title);
  };

  const handleUpdateNote = (event: React.FormEvent) => {
    event.preventDefault();

    if(selectedNote == null){
      return;
    }

    const updatedNote: Note = {
      id: selectedNote.id,
      title: title,
      content: content,
    };

    //TODO: get rid of iterating over whole notes list
    const updatedNotesList = notes.map((note) => note.id == selectedNote.id ? updatedNote : note);

    setNotes(updatedNotesList);
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  const handleCancel = () => {
      setTitle("");
      setContent("");
      setSelectedNote(null);
  };

  return(
    <div className="app-container">
      <form onSubmit={(event) => selectedNote? handleUpdateNote(event) : handleAddNote(event)} className="note-form">
        <input
          value={title}
          placeholder="Title"
          onChange={(event) => setTitle(event.target.value)}
          required
          tabIndex={1}>
        </input>

        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Content"
          rows={10} required
          tabIndex={2}>
        </textarea>

        {selectedNote ? (
          <div className="edit-buttons">
            <button
              type="submit"
              tabIndex={5}>Save
            </button>
            <button
              onClick={handleCancel}
              tabIndex={6}>Cancel
            </button>
          </div>
        ): (
          <button
            type="submit"
            tabIndex={3}>Add Note
          </button>
        )}
      </form>

      <div className="notes-grid">
        {notes.map((note)=> (
          <div key={note.id} className="notes-item" onClick={() => handleNoteClick(note)}>
          <div className="notes-header">
            <button>x</button>
          </div>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
        </div>
        ))}
      </div>
    </div>
  )
};

export default App;