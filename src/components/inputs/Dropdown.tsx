import { useState } from "react";
import { SettingsObject } from "../../hooks/useSettings";

export type DropdownOption = {
  label: string;
  value: string;
}

type DropdownProps = {
  label: string,
  options: DropdownOption[] | undefined,
  defaultValue?: DropdownOption | undefined,
  handleChange: (key: keyof SettingsObject, option: DropdownOption) => void,
  forr: keyof SettingsObject
}

export const Dropdown = ({ label, defaultValue, options, handleChange, forr }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<DropdownOption | undefined>(defaultValue);
  const handleClick = (option: DropdownOption) => {
    setSelectedValue(option)
    setIsOpen(false)
    handleChange(forr, option)
  }

  return <div style={{ display: "flex", alignItems:"center", flexDirection:"row" }}>
    <label>{label} : </label>
    <div style={{border:"2px solid black", width:"150px"}}>
      <div style={{ display: "flex", position:"relative", justifyContent:"space-between" }}>
        <p>{selectedValue?.label}</p>
        <p onClick={() => {
          setIsOpen(!isOpen)
        }}>=</p>
      </div>
      {isOpen && <ul style={{position: "absolute", backgroundColor: "black", listStyle: "none", width:"inherit", zIndex: 3}}>
        {options?.map((option: DropdownOption) => {
          return <li onClick={() => handleClick(option)} key={option.value}>{option.label}</li>
        })}
      </ul>}
    </div>
  </div>
}