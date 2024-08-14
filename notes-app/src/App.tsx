import { useEffect, useState } from "react";
import "./App.css";
import { title } from "process";
import { StringMappingType } from "typescript";
import {Note} from './Note'

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note|null>(null);
  useEffect(() => {
    const fetchNotes = async() => {
      try{
        const response = await fetch("http://localhost:5001/api/notes");
        const notes : Note[] = await response.json();
        setNotes(notes);
      }catch (error) {
        console.log(error)
      }
    }

    fetchNotes();
  }, []);

  const handleAddNote = async(event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/api/notes",
        {
          method: "POST",
          headers: {
            "Content-Type" : "application/json",
          },
          body: JSON.stringify({
            title,
            content,
          }),
        }
      );

      const newNote : Note = await response.json();
      setNotes([newNote, ...notes]);
      setTitle("");
      setContent("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleNoteClick = (note : Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    console.log(note.title);
  };

  const handleUpdateNote = async (event: React.FormEvent) => {
    event.preventDefault();

    if(selectedNote == null){
      return;
    }

    const response = await fetch(`http://localhost:5001/api/notes/${selectedNote.id}`,
      {
        method : "PUT",
        headers: {
          "Content-Type" : "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      }
    );

    const updatedNote : Note = await response.json();
    const updatedNotesList = notes.map((note) => note.id == selectedNote.id ? updatedNote : note);

    setNotes(updatedNotesList);
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  const handleDeleteNote = async (event: React.MouseEvent, noteId: number) => {
    event.stopPropagation();

    try {
      await fetch(`http://localhost:5001/api/notes/${noteId}`, 
        {
          method: "DELETE",
        });
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      setNotes(updatedNotes);
    } catch (error) {
      console.log(error);
    }
  }

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
            <button onClick={(event) => handleDeleteNote(event, note.id)}>x</button>
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