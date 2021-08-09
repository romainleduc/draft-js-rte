import React, { useReducer } from 'react';
import { EditorState } from 'draft-js';
import EditorContext from '../Editor/EditorContext';
import keyCommandsReducer from '../../redux/reducers/keyCommandsReducer';
import ReduxContext from '../ReduxContext';
import { initialState } from '../../redux/reducers/keyCommandsReducer';

export interface EditorTestProviderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  editorState: EditorState;
  onChange(editorState: EditorState): void;
  noSsr?: boolean;
}

const EditorTestProvider = ({
  editorState,
  onChange,
  children,
}: EditorTestProviderProps) => {
  const [state, dispatch] = useReducer(keyCommandsReducer, initialState);

  return (
    <ReduxContext.Provider value={{ state, dispatch }}>
      <EditorContext.Provider
        value={{
          editorState,
          setEditorState: onChange,
        }}
      >
        {children}
      </EditorContext.Provider>
    </ReduxContext.Provider>
  );
};

EditorTestProvider.displayName = 'EditorTestProvider';

export default EditorTestProvider;
