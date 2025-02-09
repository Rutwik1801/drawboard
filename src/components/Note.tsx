import { NoteType } from "../hooks/useNotes";

export type NoteProps = {
  note: NoteType
}

export const Note = ({note}: NoteProps) => {
  return (
    <div style={{width:" 100px", height:"100px", backgroundColor:"magenta"}}>
      <h1>{note.title}</h1>
      <p>{note.value}</p>
    </div>
  );
}