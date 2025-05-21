import React, { useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket";
import useAuthStore from "../store/store";
import useRoomStore from "../store/roomStore";
import ParticipantsSidebar from "../components/ParticipantsSidebar";
import NotesEditor from "../components/NotesEditor";
import GroupChat from "../components/GroupChat";

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.userId);
  const setRoomData = useRoomStore((state) => state.setRoomData);
  const setParticipants = useRoomStore((state) => state.setParticipants);
  const [note, setNote] = React.useState("");

  // Join room and set up listeners
  useEffect(() => {
    if (!roomId || !userId) return;

    socket.emit("join-room", { roomId, userId });

    // Fetch latest room data after joining
    socket.emit("get-room-data", { roomId });

    socket.on("room-data", ({ participants, admin, currNotes }) => {
      setParticipants(participants);
      useRoomStore.getState().setAdmin(admin); // <-- set admin in store
      setNote(currNotes || "");
    });

    socket.on("participants-update", ({ participants, admin }) => {
      setParticipants(participants);
      useRoomStore.getState().setAdmin(admin); // <-- set admin in store
    });

    socket.on("receive-note", (content) => {
      setNote(content);
    });

    return () => {
      socket.off("room-data");
      socket.off("participants-update");
      socket.off("receive-note");
    };
  }, [roomId, userId, setParticipants]);

  // Emit note changes to server
  const handleNoteChange = useCallback(
    (newNote) => {
      setNote(newNote);
      socket.emit("note-change", { roomId, content: newNote });
    },
    [roomId]
  );

  return (
    <div className="flex h-screen">
      <ParticipantsSidebar />
      <NotesEditor note={note} onNoteChange={handleNoteChange} />
      <GroupChat />
    </div>
  );
};

export default Room;
