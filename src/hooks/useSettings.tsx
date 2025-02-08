import {  createContext, useContext, useEffect, useState } from "react"
import { useIndexedDB } from "../indexedDB/useIndexedDB"
import { DropdownOption } from "../components/inputs/Dropdown"

export type SettingsObject = {
  backgroundColor: DropdownOption,
  noteColor: DropdownOption,
  textColor: DropdownOption,
  fontSize: number,
  id: number
}
type SettingsContextType = {
  settings: SettingsObject | null,
  changedSettings: SettingsObject | null,
  handleChange: (key: keyof SettingsObject, value: DropdownOption) => void,
  handleSubmit: (e: React.FormEvent) => void,
  handleCancel: () => void
}
const defaultSettings: SettingsObject = {
  id: 1,
  backgroundColor: {value: "black", label: "Black"},
  noteColor: {value: "black", label: "Black"},
  textColor: {value: "black", label: "Black"},
  fontSize: 12
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [changedSettings, setChangedSettings] = useState(defaultSettings)
  const {isConnected, putEntry, getEntry} = useIndexedDB('drawboard-db', ["notes", "settings", "notePositions"]);

  const handleChange = (key: string, value: DropdownOption) => {
    setChangedSettings((prev) => {
      const newSettings = { ...prev, [key]: value };
      return newSettings;
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await putEntry('settings', changedSettings);
    const updatedSettings = await getEntry('settings', 1);
    setSettings(updatedSettings);
    setChangedSettings(updatedSettings)
  }

  const handleCancel = () => {
    setChangedSettings(settings)
  }

  useEffect(() => {
    const initDB = async () => {
      const res = await getEntry('settings', 1);
      if(!res) {
        console.log("no settings found, storing new settings in DB")
      await putEntry('settings', settings);
      setSettings(defaultSettings)
      setChangedSettings(defaultSettings)
      } else {
        console.log("found existing settings in DB");
        setSettings(res);
        setChangedSettings(res)
      }
    }
    if(isConnected) {
      initDB()
    }
  },[isConnected])
  const value = {
    changedSettings, settings, handleChange, handleSubmit, handleCancel
  }
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context
}