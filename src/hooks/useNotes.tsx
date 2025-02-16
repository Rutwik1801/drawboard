import React, { useContext, useEffect } from "react"
import { useIndexedDB } from "../indexedDB/useIndexedDB"
import { useBroadcastChannel } from "./useBroadcastChannel"

export type NotesContextType = {
  notes: NoteType[] | null,
  setNotes: React.Dispatch<React.SetStateAction<NoteType[]>>,
  addNote: (value: NoteType) => Promise<void>,
  deleteNote: () => void,
  editNote: () => void,
  handleNoteDrag: (note: NoteType, e: React.MouseEvent) => void,
  notesRef: React.RefObject<{ [id: number]: (React.RefObject<HTMLDivElement> | null)}> | null
}
const defaultContextState = {
  key: 1,
  notes: []
}
export type NoteType = {
  id: number,
  value: string,
  timestamp: number,
  title: string,
  position: number[]
}
export const NotesContext = React.createContext<NotesContextType | undefined>(undefined)

export const NotesProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const [notes, setNotes] = React.useState<NoteType[]>(defaultContextState.notes)
  const {isConnected, putEntry, getEntry} = useIndexedDB('drawboard-db', ["notes", "settings", "notePositions"]);
  const notesRef = React.useRef<{ [id: number]: React.RefObject<HTMLDivElement> }>({});
  const {message, sendMessage} = useBroadcastChannel("notes");

  const addNote = async (value: NoteType) => {
    value = {...value, position: getRandomPosition()};
    await putEntry('notes', {id: 1, notes: [...notes, value]});
    setNotes([...notes, value]);
    sendMessage([...notes, value])
  }
  const deleteNote = () => {

  }
  const editNote = () => {
    
  }
  const handleNoteDrag = async (note: NoteType, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default drag behavior

    const noteRef = notesRef.current[note.id]?.current;
    if (!noteRef) return;

    const notePosition = noteRef.getBoundingClientRect();
    const offsetX = e.clientX - notePosition.left;
    const offsetY = e.clientY - notePosition.top;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const x = moveEvent.clientX - offsetX;
      const y = moveEvent.clientY - offsetY;
      noteRef.style.left = `${x}px`;
      noteRef.style.top = `${y}px`;
    };

    const handleMouseUp = async () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      const finalRect = noteRef.getBoundingClientRect();
      const finalPos: [number, number] = [finalRect.left, finalRect.top];

      await updateNotePosition(note.id, finalPos);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const updateNotePosition = async (id: number, position: [number, number]) => {
    const updatedNotes = notes.map((note) => note.id === id ? { ...note, position } : note);
    try {
      await putEntry('notes', {id: 1, notes: updatedNotes})
      setNotes(updatedNotes);
      sendMessage(updatedNotes)
    } catch(err) {
      console.error(err, "error updating db");
    }
  };

  useEffect(() => {
    const initDB = async () => {
      const res = await getEntry('notes', 1);
      if(!res) {
        console.log("no settings found, storing new settings in DB")
      await putEntry('notes', notes);
      setNotes(defaultContextState?.notes || [])
      } else {
        console.log("found existing settings in DB");
        setNotes(res?.notes);
      }
    }
    if(isConnected) {
      initDB()
    }
  },[isConnected])
  useEffect(() => {
    if(message) {
      setNotes(message)
    }
  }, [message])

  const value = {
    notes: notes,
    setNotes: setNotes,
    addNote: addNote,
    deleteNote: deleteNote,
    editNote: editNote,
    handleNoteDrag: handleNoteDrag,
    notesRef: notesRef
  }
  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
}

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}

const getRandomPosition = () => {
  const drawboardDimensions = document.getElementById("drawboard")?.getBoundingClientRect();
  if(drawboardDimensions) {
    const maxX = drawboardDimensions.width;
    const maxY = drawboardDimensions.height;
    return [Math.floor(Math.random() * maxX), Math.floor(Math.random()*maxY)];
  }
  throw new Error("drawboard is not available")
}