import React, { useContext, useEffect } from "react"
import { useIndexedDB } from "../indexedDB/useIndexedDB"

export type NotesContextType = {
  notes: NoteType[] | null,
  setNotes: React.Dispatch<React.SetStateAction<NoteType[]>>,
  addNote: (value: NoteType) => Promise<void>,
  deleteNote: () => void,
  editNote: () => void,
  notesRef: React.RefObject<{ [id: number]: (React.RefObject<HTMLDivElement> | null)}>
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


  const addNote = async (value: NoteType) => {
    value = {...value, position: getRandomPosition()};
    await putEntry('notes', {id: 1, notes: [...notes, value]});
    setNotes([...notes, value]);
  }
  const deleteNote = () => {

  }
  const editNote = () => {
    
  }

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

  const value = {
    notes: notes,
    setNotes: setNotes,
    addNote: addNote,
    deleteNote: deleteNote,
    editNote: editNote,
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