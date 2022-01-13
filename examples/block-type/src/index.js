import React from "react";
import ReactDOM from "react-dom";
import { Editor, EditorProvider } from "draft-js-rte";
import { EditorState } from "draft-js";
import BlockTypeToggleButton from "./BlockTypeToggleButton";
import "draft-js/dist/Draft.css";
import "draft-js-rte/lib/Draft.css";
import "./index.css";

const App = () => {
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  return (
    <EditorProvider editorState={editorState} onChange={setEditorState}>
      <BlockTypeToggleButton value="unstyled">Paragraph</BlockTypeToggleButton>
      <BlockTypeToggleButton value="header-one">H1</BlockTypeToggleButton>
      <BlockTypeToggleButton value="header-two">H2</BlockTypeToggleButton>
      <BlockTypeToggleButton value="header-three">H3</BlockTypeToggleButton>
      <BlockTypeToggleButton value="header-four">H4</BlockTypeToggleButton>
      <BlockTypeToggleButton value="header-five">H5</BlockTypeToggleButton>
      <BlockTypeToggleButton value="header-six">H6</BlockTypeToggleButton>
      <BlockTypeToggleButton value="blockquote">
        Blockquote
      </BlockTypeToggleButton>
      <BlockTypeToggleButton value="code-block">
        Code Block
      </BlockTypeToggleButton>
      <BlockTypeToggleButton value="unordered-list-item">
        UL
      </BlockTypeToggleButton>
      <BlockTypeToggleButton value="ordered-list-item">
        OL
      </BlockTypeToggleButton>
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
