import React from "react";
import useRoomStore from "../src/store/store";
import WhiteboardPage from "./whiteBoard";

const Room = () => {
  const { name, userId, roomId, isAdmin } = useRoomStore();

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Whiteboard Room: {roomId}</h2>
      <p>
        User: {name} ({userId})
      </p>
      <p>Role: {isAdmin ? "Admin" : "Participant"}</p>

      {/* Whiteboard Canvas + Socket Logic will come next */}
      <WhiteboardPage />
    </div>
  );
};

export default Room;
