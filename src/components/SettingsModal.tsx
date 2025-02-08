import { Dispatch, SetStateAction } from "react"
import { useSettings } from "../hooks/useSettings"
import { Dropdown } from "./inputs/Dropdown"

const colorOptions = [
  { value: "red", label: "Red" },
  { value: "green", label: "Green" },
  { value: "blue", label: "Blue" },
  {value: "black", label: "Black"}
]

type ModalProps = {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>
  // handleCancel: () => void,
  // handleSubmit: () => void,
  // handleChange: () => void
}

export const SettingsModal = ({open, setOpen}: ModalProps) => {
  const { changedSettings: settings, handleChange, handleCancel, handleSubmit }= useSettings();
const handleCancelClick = () => {
  setOpen(false);
  handleCancel();
}
const handleSubmitClick = (e: React.FormEvent) => {
  setOpen(false)
  handleSubmit(e)
}

  if(!open) return;
  return <>
  {open && <div style={{position:"absolute", backgroundColor:"rgba(0,0,0,0.5)", width:"100%", height:"100vh", zIndex:15, top: 0, left: 0}}></div>}
  <div style={{position: "absolute", top:"50%", left: "50%", transform:"translate(-50%,-50%)", backgroundColor:"pink", zIndex: 20}}>
    <form method="POST" onSubmit={handleSubmit}>
      <Dropdown forr="backgroundColor" options={colorOptions} defaultValue={settings?.backgroundColor} label="Background Color" handleChange={handleChange} />
      <Dropdown forr="textColor" options={colorOptions} defaultValue={settings?.textColor} label="Text Color" handleChange={handleChange} />
      <Dropdown forr="noteColor" options={colorOptions} defaultValue={settings?.noteColor} label="Note Background" handleChange={handleChange} />
      {/* <Slider /> */}
      <button type="submit" onClick={handleSubmitClick}>Submit</button>
      <button type="button" onClick={handleCancelClick}>Cancel</button>
    </form>
  </div>
  </>
}