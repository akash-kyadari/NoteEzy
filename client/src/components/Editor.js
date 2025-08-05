"use client";
import ExampleTheme from "./themes/ExampleTheme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import ToolbarPlugin from "@/components/plugins/ToolBarPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import InitialContentPlugin from "./plugins/InitialContentPlugin";
import ActionsPlugin from "./plugins/ActionsPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import prepopulatedText from "./sampleText.js";
import "./editor.css";
import LogEditorStatePlugin from "./plugins/LogEditorStatePlugin";
import SocketSyncPlugin from "./plugins/socketSyncPlugin";
import { useRoomStore } from "@/stores/roomStore";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
function Placeholder() {
  return (
    <div className="editor-placeholder">
      Play around with the Markdown plugin...
    </div>
  );
}

const editorConfig = {
  editorState: null,
  theme: ExampleTheme,
  // Handling of errors during update
  onError(error) {
    throw error;
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
  ],
};

export default function Editor({ socket, roomId, userId }) {
  const room = useRoomStore((state) => state.room);

  return (
    <LexicalComposer initialConfig={editorConfig} className=" ">
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <CodeHighlightPlugin />
          <LogEditorStatePlugin />
          {socket && roomId && userId && (
            <SocketSyncPlugin socket={socket} roomId={roomId} userId={userId} />
          )}
        </div>
        <InitialContentPlugin />
        <ActionsPlugin />
      </div>
    </LexicalComposer>
  );
}
