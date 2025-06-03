import React, { useEffect, useCallback, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";
import useAuthStore from "../store/store";
import useRoomStore from "../store/roomStore";
import ParticipantsSidebar from "../components/ParticipantsSidebar";
import NotesEditor from "../components/NotesEditor";
import ChatWidget from "../components/ChatBotWidget";

const Room = () => {
  const { roomId } = useParams();
  const userId = useAuthStore((state) => state.userId);
  const setParticipants = useRoomStore((state) => state.setParticipants);
  const [note, setNoteState] = useState("");
  const [typingUserId, setTypingUserId] = useState(null);
  const typingTimeoutRef = useRef(null);
  const roomName = useRoomStore((state) => state.roomName);

  useEffect(() => {
    if (!roomId || !userId) return;

    socket.emit("join-room", { roomId, userId });
    socket.emit("get-room-data", { roomId });

    socket.on("room-data", ({ participants, admin, currNotes, roomName }) => {
      setParticipants(participants);
      useRoomStore.getState().setAdmin(admin);
      setNoteState(currNotes || "");
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
      setNoteState(content);
    });

    socket.on("typing-update", ({ userId: typingId }) => {
      setTypingUserId(typingId);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (typingId) {
        typingTimeoutRef.current = setTimeout(() => {
          setTypingUserId(null);
        }, 3000);
      }
    });

    socket.on("typing-rejected", ({ reason }) => {
      console.warn("Typing rejected:", reason);
    });

    return () => {
      socket.off("room-data");
      socket.off("participants-update");
      socket.off("receive-note");
      socket.off("typing-update");
      socket.off("typing-rejected");
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [roomId, userId, setParticipants]);

  const typingEmitTimeout = useRef(null);
  const isTyping = useRef(false);

  const handleNoteChange = useCallback(
    (newNote) => {
      setNoteState(newNote);
      socket.emit("note-change", { roomId, content: newNote });

      if (!isTyping.current) {
        socket.emit("start-typing", { roomId, userId });
        isTyping.current = true;
      }

      if (typingEmitTimeout.current) clearTimeout(typingEmitTimeout.current);
      typingEmitTimeout.current = setTimeout(() => {
        socket.emit("stop-typing", { roomId, userId });
        isTyping.current = false;
      }, 1500);
    },
    [roomId, userId]
  );

  const handleBlur = () => {
    if (typingEmitTimeout.current) {
      clearTimeout(typingEmitTimeout.current);
      typingEmitTimeout.current = null;
    }
    if (isTyping.current) {
      socket.emit("stop-typing", { roomId, userId });
      isTyping.current = false;
    }
  };

  const isLockedForCurrentUser = typingUserId && typingUserId !== userId;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 py-6 px-4">
      <div className="w-full max-w-6xl mx-auto rounded-2xl shadow border border-gray-200 overflow-hidden">
        <div className="bg-white px-6 py-4 border-b border-gray-200 text-center text-xl font-semibold text-gray-800">
          {roomName || "Room"}
          <p className="text-sm text-gray-500 mt-1">
            Real-time collaboration space for ideas and notes
          </p>
        </div>

        <div className="flex flex-col md:flex-row h-[85vh]">
          <aside className="w-full md:w-[32%] max-w-full md:min-w-[260px] md:max-w-[360px] border-b md:border-b-0 md:border-r border-gray-200 bg-white">
            <ParticipantsSidebar typingUserId={typingUserId} />
          </aside>

          <main className="flex-1 bg-gray-50">
            <NotesEditor
              note={note}
              onNoteChange={handleNoteChange}
              onBlur={handleBlur}
              typingUserId={typingUserId}
              userId={userId}
              disabled={isLockedForCurrentUser}
            />
          </main>
        </div>

        <div className="bg-white border-t border-gray-200 px-4 py-2">
          <ChatWidget notes={note} />
        </div>
      </div>
    </div>
  );
};

export default Room;
