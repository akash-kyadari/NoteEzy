"use client";

import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export default function LogEditorStatePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const unregister = editor.registerUpdateListener(({ editorState }) => {
      // Logs full lexical editor state in JSON format
      const json = editorState.toJSON();
      //   console.log("🧠 Lexical EditorState (JSON):", json);
    });

    return () => unregister();
  }, [editor]);

  return null;
}
