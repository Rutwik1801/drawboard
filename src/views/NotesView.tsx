import { Note } from "../components/Note";
import { useNotes } from "../hooks/useNotes"

export const NotesView = () => {
  const { notes} = useNotes();
  return <>
  {notes && notes.length > 0 && notes?.map(note => <Note note={note} />)}
  </>
}