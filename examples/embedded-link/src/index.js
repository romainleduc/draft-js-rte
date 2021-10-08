import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Editor, EditorProvider } from "draft-js-rte";
import { EditorState } from "draft-js";
import EmbeddedLinkPopover from "./EmbeddedLinkPopover";
import "draft-js/dist/Draft.css";
import "draft-js-rte/lib/Draft.css";
import "./index.css";

const App = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [isOpen, setIsOpen] = useState(false);

  function toggleModal() {
    setIsOpen(!isOpen);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <EditorProvider editorState={editorState} onChange={setEditorState}>
      <EmbeddedLinkPopover
        toggleButton={<button onClick={toggleModal}>Embedded link</button>}
        isOpen={isOpen}
        onClickOutside={closeModal}
      />
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
