import React from "react";
import { NoteType, useNotes } from "../hooks/useNotes";
import { useSettings } from "../hooks/useSettings";

export type NoteProps = {
  note: NoteType;
};

export const Note = ({ note }: NoteProps) => {
  const { notesRef, handleNoteDrag } = useNotes();
  const { settings } = useSettings();
  // Ensure ref is created for each note
  if (!notesRef?.current[note.id]) {
    notesRef.current[note.id] = React.useRef<HTMLDivElement | null>(null);
  }

  const xPos = note.position[0];
  const yPos = note.position[1];

  return (
    <div
      ref={notesRef?.current[note.id]}
      onMouseDown={(e) => handleNoteDrag(note, e)}
      style={{
        position: "absolute",
        width: "100px",
        height: "100px",
        backgroundColor: settings?.noteColor?.value,
        top: yPos,
        left: xPos,
        cursor: "grab",
      }}
    >
      <h1>{note.title}</h1>
      <p>{note.value}</p>
    </div>
  );
};
