import { useNotes } from "../hooks/useNotes"

export const NoteButton = () => {
  const {addNote} = useNotes();
  return <button onClick={() => {
    const newNote = {
      id: Date.now(),
      value: "testValue",
      timestamp: Date.now(),
      title: "test"
    }
    addNote(newNote)}} style={{fontSize:"24px", width:"50px", height:"50px", borderRadius: "50%", padding: "5px", position:"fixed", zIndex: 4, top:"90%", right:"5%"}}>+</button>
}