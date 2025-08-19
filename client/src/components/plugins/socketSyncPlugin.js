"use client";

import { useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export default function SocketSyncPlugin({ socket, roomId, userId }) {
  const [editor] = useLexicalComposerContext();
  const isRemoteUpdate = useRef(false);
  const lastSentContent = useRef("");

  // OUTGOING: Emit note-change only if not remote-triggered
  useEffect(() => {
    if (!socket) return;

    const unregister = editor.registerUpdateListener(({ editorState }) => {
      if (isRemoteUpdate.current) {
        isRemoteUpdate.current = false; // Reset the flag
        return;
      }

      const json = editorState.toJSON();
      const content = JSON.stringify(json);

      // Prevent duplicate emits
      if (lastSentContent.current !== content) {
        socket.emit("note-change", { roomId, content });
        lastSentContent.current = content;
        // console.log("note-change emitted");
      }
    });

    return () => unregister();
  }, [editor, socket, roomId]);

  // INCOMING: Receive note from socket and update editor
  useEffect(() => {
    if (!socket) return;

    const handler = (content) => {
      if (!content) return;

      try {
        const parsed = JSON.parse(content);
        const current = editor.getEditorState().toJSON();
        const currentStr = JSON.stringify(current);

        // Only update if content is different
        if (currentStr !== content) {
          isRemoteUpdate.current = true; // prevent echo
          const newState = editor.parseEditorState(parsed);
          editor.setEditorState(newState);
          //   console.log("Editor updated from socket");
        }
      } catch (err) {
        console.warn("Failed to set editor content from socket", err);
      }
    };

    socket.on("receive-note", handler);
    return () => socket.off("receive-note", handler);
  }, [socket, editor]);

  return null;
}
