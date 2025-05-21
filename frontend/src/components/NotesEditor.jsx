import React from "react";

const NotesEditor = ({ note, onNoteChange }) => {
  return (
    <div className="flex-1 bg-white p-6">
      <h2 className="font-bold mb-4">Notes</h2>
      <textarea
        className="w-full h-96 p-3 rounded border border-gray-300 text-black"
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
        placeholder="Start typing your collaborative notes here..."
      />
    </div>
  );
};

export default NotesEditor;
