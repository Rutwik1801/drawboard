import React, { useContext, useEffect } from "react"
import { useIndexedDB } from "../indexedDB/useIndexedDB"

export type NotesContextType = {
  notes: NoteType[] | null,
  setNotes: React.Dispatch<React.SetStateAction<NoteType[]>>,
  addNote: (value: NoteType) => Promise<void>,
  deleteNote: () => void,
  editNote: () => void,
}
const defaultContextState = {
  key: 1,
  notes: []
}
export type NoteType = {
  id: number,
  value: string,
  timestamp: number,
  title: string
}
export const NotesContext = React.createContext<NotesContextType | undefined>(undefined)

export const NotesProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const [notes, setNotes] = React.useState<NoteType[]>(defaultContextState.notes)
  const {isConnected, putEntry, getEntry} = useIndexedDB('drawboard-db', ["notes", "settings", "notePositions"]);


  const addNote = async (value: NoteType) => {
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
    editNote: editNote
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