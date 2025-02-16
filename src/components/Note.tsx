import React from "react";
import { NoteType, useNotes } from "../hooks/useNotes";

export type NoteProps = {
  note: NoteType;
};

export const Note = ({ note }: NoteProps) => {
  const { notesRef, setNotes } = useNotes();

  // Ensure ref is created for each note
  if (!notesRef.current[note.id]) {
    notesRef.current[note.id] = React.useRef<HTMLDivElement | null>(null);
  }

  const xPos = note.position[0];
  const yPos = note.position[1];

  const handleNoteDrag = (e: React.MouseEvent) => {
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

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      const finalRect = noteRef.getBoundingClientRect();
      const finalPos: [number, number] = [finalRect.left, finalRect.top];

      updateNotePosition(note.id, finalPos);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const updateNotePosition = (id: number, position: [number, number]) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, position } : note
      )
    );
  };

  return (
    <div
      ref={notesRef.current[note.id]}
      onMouseDown={handleNoteDrag}
      style={{
        position: "absolute",
        width: "100px",
        height: "100px",
        backgroundColor: "magenta",
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
