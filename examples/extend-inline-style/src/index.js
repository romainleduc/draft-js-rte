import React from "react";
import ReactDOM from "react-dom";
import { Editor, EditorProvider } from "draft-js-rte";
import { EditorState } from "draft-js";
import InlineStyleToggleButton from "./InlineStyleToggleButton";
import { customStyleMaps } from "./customStyleMaps";
import ToggleButtonGroup from "./ToggleButtonGroup";
import EditorToolbar from "./EditorToolbar";
import "draft-js/dist/Draft.css";
import "draft-js-rte/lib/Draft.css";
import "./index.css";

const App = () => {
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  return (
    <EditorProvider
      customStyleMaps={customStyleMaps}
      editorState={editorState}
      onChange={setEditorState}
    >
      <EditorToolbar>
        <ToggleButtonGroup label="Font family">
          <InlineStyleToggleButton value="FONT_FAMILY_ROBOTO">
            Roboto
          </InlineStyleToggleButton>
          <InlineStyleToggleButton value="FONT_FAMILY_DANCING">
            Dancing
          </InlineStyleToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup label="Size">
          <InlineStyleToggleButton value="FONT_SIZE_SMALL">
            Small
          </InlineStyleToggleButton>
          <InlineStyleToggleButton value="FONT_SIZE_LARGE">
            Large
          </InlineStyleToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup label="Color">
          <InlineStyleToggleButton value="COLOR_RED">
            Red
          </InlineStyleToggleButton>
          <InlineStyleToggleButton value="COLOR_GREEN">
            Green
          </InlineStyleToggleButton>
        </ToggleButtonGroup>
      </EditorToolbar>
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
