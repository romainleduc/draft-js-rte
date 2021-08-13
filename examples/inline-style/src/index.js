import React from "react";
import ReactDOM from "react-dom";
import { Editor, EditorProvider } from "draft-js-rte";
import { EditorState } from "draft-js";
import InlineToggleButton from "./InlineToggleButton";
import "draft-js/dist/Draft.css";
import "draft-js-rte/lib/Draft.css";
import "./index.css";

const App = () => {
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  const editor = React.useRef(null);

  React.useEffect(() => {
    if (editor) {
      editor.current.focus();
    }
  }, []);

  return (
    <EditorProvider editorState={editorState} onChange={setEditorState}>
      <InlineToggleButton value="BOLD">Bold</InlineToggleButton>
      <InlineToggleButton value="ITALIC">Italic</InlineToggleButton>
      <InlineToggleButton value="UNDERLINE">Underline</InlineToggleButton>
      <InlineToggleButton value="STRIKETHROUGH">
        Strikethrough
      </InlineToggleButton>
      <InlineToggleButton value="CODE">Code</InlineToggleButton>
      <Editor ref={editor} placeholder="Enter some text.." />
    </EditorProvider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
