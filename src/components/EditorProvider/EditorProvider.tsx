import React, { useReducer } from 'react';
import { EditorState } from 'draft-js';
import EditorProviderContext, { CustomStyleMap } from './EditorProviderContext';
import keyCommandsReducer, {
  initialState,
} from '../../redux/reducers/keyCommandsReducer';
import ReduxContext from '../ReduxContext';

export interface EditorProviderProps {
  customStyleMaps?: CustomStyleMap[];
  editorState: EditorState;
  onChange(editorState: EditorState): void;
  children: any;
}

const EditorProvider = ({
  customStyleMaps = [],
  editorState,
  onChange,
  children,
}: EditorProviderProps): JSX.Element => {
  const [state, dispatch] = useReducer(keyCommandsReducer, initialState);

  const getCustomStyleMapOfKey = (key: string) => {
    return customStyleMaps.find((customStyleMap) =>
      Object.keys(customStyleMap.styles)
        .map((style) => `${customStyleMap.group}_${style}`)
        .includes(key)
    );
  };

  const getCustomStyleMap = (group: string) => {
    return customStyleMaps.find(
      (customStyleMap) => customStyleMap.group === group
    );
  };

  return (
    <ReduxContext.Provider value={{ state, dispatch }}>
      <EditorProviderContext.Provider
        value={{
          editorState,
          setEditorState: onChange,
          customStyleMaps,
          getCustomStyleMapOfKey,
          getCustomStyleMap,
        }}
      >
        {children}
      </EditorProviderContext.Provider>
    </ReduxContext.Provider>
  );
};

export default EditorProvider;
