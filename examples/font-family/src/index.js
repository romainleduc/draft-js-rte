import React from "react";
import ReactDOM from "react-dom";
import { Editor, EditorProvider } from "draft-js-rte";
import { EditorState } from "draft-js";
import InlineStyleToggleButton from "./InlineStyleToggleButton";
import "draft-js/dist/Draft.css";
import "draft-js-rte/lib/Draft.css";
import "./index.css";

const customStyleMaps = [
  {
    group: "FONT_FAMILY",
    exclusive: true,
    styles: {
      ROBOTO: {
        fontFamily: '"Roboto", sans-serif'
      },
      DANCING: {
        fontFamily: '"Dancing Script", cursive'
      }
    }
  }
];

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
    <EditorProvider
      customStyleMaps={customStyleMaps}
      editorState={editorState}
      onChange={setEditorState}
    >
      <InlineStyleToggleButton value="FONT_FAMILY_ROBOTO">
        Roboto
      </InlineStyleToggleButton>
      <InlineStyleToggleButton value="FONT_FAMILY_DANCING">
        Dancing
      </InlineStyleToggleButton>
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
