import { EditorState } from 'draft-js';
import React from 'react';

export interface CustomStyleMap {
  group: string;
  exclusive?: boolean;
  styles: any;
}

const EditorProviderContext = React.createContext<{
  editorState: EditorState;
  setEditorState(editorState: EditorState): void;
  customStyleMaps: CustomStyleMap[];
  getCustomStyleMapOfKey: (key: string) => any;
  getCustomStyleMap: (group: string) => any;
}>({
  editorState: EditorState.createEmpty(),
  setEditorState: () => {},
  customStyleMaps: [],
  getCustomStyleMapOfKey: () => {},
  getCustomStyleMap: () => {},
});

export default EditorProviderContext;
