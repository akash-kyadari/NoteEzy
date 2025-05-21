import React from "react";
import useRoomStore from "../store/roomStore";

const ParticipantsSidebar = () => {
  const participants = useRoomStore((state) => state.participants);
  const admin = useRoomStore((state) => state.admin);
  console.log(admin);
  return (
    <div className="w-1/5 bg-gray-900 p-4 text-white">
      <h2 className="font-bold mb-4">Participants</h2>
      <ul>
        {participants.map((p) => (
          <li key={p._id}>
            {p.fullName}
            {admin && admin._id === p._id && (
              <span className="ml-2 text-xs bg-indigo-600 px-2 py-0.5 rounded">
                (Admin)
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParticipantsSidebar;
