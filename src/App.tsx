
import { useEffect, useState } from 'react'
import './App.css'
import { useIndexedDB } from './indexedDB/useIndexedDB'

type SettingsObject = {
  backgroundColor: string,
  noteColor: string,
  textColor: string,
  fontSize: number,
  id: number
}
const defaultSettings: SettingsObject = {
  id: 1,
  backgroundColor: "black",
  noteColor: "yellow",
  textColor: "red",
  fontSize: 12
}
function App() {
  const [settings, setSettings] = useState(defaultSettings)
  const {isConnected, putEntry, getEntry, deleteEntry, getTransaction} = useIndexedDB('drawboard-db', ["notes", "settings", "notePositions"]);
  useEffect(() => {
    // indexedDB background color setting here
    const initDB = async () => {
      const res = await getEntry('settings', 1);
      if(!res) {
        console.log("no settings found, storing new settings in DB")
      await putEntry('settings', defaultSettings);
      } else {
        console.log("found existing settings in DB");
      }
      setSettings(res);
    }
    if(isConnected) {
      initDB()
    }
  },[isConnected])
  return (
    <div style={{width:"100%", height:"100%"}}>
      <h1 style = {{marginBottom: "40px"}}>DrawBoard</h1>
      {isConnected ? <div style={{width: "100vw", padding:"20px", height:"100vh", overflow:"scroll", border:"1px solid red", backgroundColor: settings.backgroundColor}}>
        <button onClick={async () => {
          const newSettings = {...settings, backgroundColor: settings.backgroundColor === "red" ? "black" : "red"};
          setSettings(newSettings);
          await putEntry('settings', newSettings);
        }}>Change bg color</button>
      </div> : <h1>loading data</h1>}
    </div>
  )
}

export default App
