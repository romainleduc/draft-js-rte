import React from "react";
import ReactDOM from "react-dom";
import { Editor, EditorProvider } from "draft-js-rte";
import { EditorState } from "draft-js";
import TextAlignToggleButton from "./TextAlignToggleButton";
import "draft-js/dist/Draft.css";
import "draft-js-rte/lib/Draft.css";
import "./index.css";

const App = () => {
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  return (
    <EditorProvider editorState={editorState} onChange={setEditorState}>
      <TextAlignToggleButton value="left">Left</TextAlignToggleButton>
      <TextAlignToggleButton value="center">Center</TextAlignToggleButton>
      <TextAlignToggleButton value="right">Right</TextAlignToggleButton>
      <Editor placeholder="Enter some text.." />
    </EditorProvider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
