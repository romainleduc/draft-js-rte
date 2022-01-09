import { ContentState, EditorState, SelectionState } from 'draft-js';
import React, { useEffect, useRef } from 'react';
import { EditorProviderContext } from '../components/EditorProvider';

const useEditor = () => {
  const { editorState, setEditorState } = React.useContext(EditorProviderContext);
  const currentContentRef = useRef<ContentState>(editorState.getCurrentContent());

  useEffect(() => {
    if (editorState.getCurrentContent() !== currentContentRef.current) {
      currentContentRef.current = editorState.getCurrentContent();
    }
  }, [editorState])

  const getSelection = () => {
    return editorState.getSelection();
  }

  const forceSelection = (selectionState: SelectionState): void => {
    setEditorState(EditorState.forceSelection(editorState, selectionState));
  }

  const acceptSelection = (selectionState: SelectionState): void => {
    setEditorState(EditorState.acceptSelection(editorState, selectionState));
  }

  return {
    currentContent: currentContentRef.current,
    getSelection,
    forceSelection,
    acceptSelection
  }
}

export default useEditor;