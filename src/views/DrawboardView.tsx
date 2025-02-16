import { useState } from "react";
import { SettingsModal } from "../components/SettingsModal";
import { useSettings } from "../hooks/useSettings";
import { useIndexedDB } from "../indexedDB/useIndexedDB";
import { NoteButton } from "../components/NoteButton";
import { NotesView } from "./NotesView";
import { PopupButton } from "../components/PopupButton";

export const DrawboardView = () => {
  const { isConnected } = useIndexedDB('drawboard-db', ["notes", "settings", "notePositions"]);
  const [openSettingsModal, setOpenSettingsModal] = useState(false)
  const { settings } = useSettings()

  return (
    <div id="drawboard" style={{ width: "100%", minHeight: "100vh" }}>
      <NoteButton />
      <PopupButton />
      <div style={{display:"flex", justifyContent: "space-between", alignItems:"center"}}>
      <h1 style={{ marginBottom: "40px", color: settings?.textColor?.value }}>DrawBoard</h1>
      <button onClick={() => {
        setOpenSettingsModal(true)
      }}>Settings</button>
      </div>
      {isConnected ? <div style={{position: "relative", width: "100vw", padding: "20px", height: "100vh", border: "1px solid red", backgroundColor: settings?.backgroundColor?.value }}>
      <NotesView />
      </div> : <h1>loading data</h1>}
      <SettingsModal open={openSettingsModal} setOpen={setOpenSettingsModal} />
    </div>
  );
}