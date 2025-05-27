import React, { useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket";
import useAuthStore from "../store/store";
import useRoomStore from "../store/roomStore";
import ParticipantsSidebar from "../components/ParticipantsSidebar";
import NotesEditor from "../components/NotesEditor";
import ChatWidget from "../components/ChatBotWidget";

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.userId);
  const setRoomData = useRoomStore((state) => state.setRoomData);
  const setParticipants = useRoomStore((state) => state.setParticipants);
  const [note, setNote] = React.useState("");
  const roomName = useRoomStore((state) => state.roomName);
  // Join room and set up listeners
  useEffect(() => {
    if (!roomId || !userId) {
      console.warn("Missing roomId or userId", { roomId, userId });
      return;
    }

    socket.emit("join-room", { roomId, userId });

    // Fetch latest room data after joining
    socket.emit("get-room-data", { roomId });

    socket.on("room-data", ({ participants, admin, currNotes, roomName }) => {
      setParticipants(participants);
      useRoomStore.getState().setAdmin(admin);
      setNote(currNotes || "");
      if (roomName)
        useRoomStore
          .getState()
          .setRoomData(roomId, participants, admin, roomName);
    });

    socket.on("participants-update", ({ participants, admin }) => {
      setParticipants(participants);
      useRoomStore.getState().setAdmin(admin);
    });

    socket.on("receive-note", (content) => {
      setNote(content);
      //console.log(content);
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
      //console.log("sending note change", newNote);
    },
    [roomId]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 flex flex-col items-center justify-center py-6">
      <div className="w-full max-w-6xl text-center py-4 bg-white rounded-t-2xl shadow font-semibold text-xl tracking-wide border border-b-0 border-gray-200 mb-[-1px]">
        {roomName || "Room"}
      </div>
      <div className="flex flex-col md:flex-row w-full max-w-6xl h-[90vh] md:h-[80vh] rounded-bl-2xl rounded-br-2xl shadow-2xl overflow-hidden bg-white border border-gray-200">
        {/* Sidebar */}
        <aside className="w-full md:w-[36%] min-w-0 max-w-full md:min-w-[280px] md:max-w-[400px] bg-white flex flex-col border-b md:border-b-0 md:border-r border-gray-200">
          <ParticipantsSidebar />
        </aside>
        {/* Notes */}
        <main className="flex-1 bg-gray-50 flex flex-col">
          <NotesEditor note={note} onNoteChange={handleNoteChange} />
        </main>
      </div>
      <ChatWidget notes={note} />
    </div>
  );
};

export default Room;
