import { useRoomStore } from "@/stores/roomStore";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";
import { $getRoot, $getSelection } from "lexical";

export default function InitialContentPlugin() {
  const [editor] = useLexicalComposerContext();
  const room = useRoomStore((state) => state.room);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (
      !hasInitialized.current &&
      room?.currNotes &&
      typeof room.currNotes === "string"
    ) {
      try {
        const parsedEditorState = editor.parseEditorState(room.currNotes);

        // Optional: You can log the root content to inspect what's there
        parsedEditorState.read(() => {
          const root = $getRoot();
          const hasContent = root.getChildrenSize() > 0;

          if (hasContent) {
            editor.update(() => {
              editor.setEditorState(parsedEditorState);
            });
            hasInitialized.current = true;
          } else {
            console.warn("Empty editor content. Skipping.");
          }
        });
      } catch (err) {
        console.error("Error parsing room.currNotes:", err);
      }
    }
  }, [editor, room?.currNotes]);

  return null;
}
