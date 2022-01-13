import React, { useCallback, useContext, useEffect } from 'react';
import { EditorState } from 'draft-js';
import { ACTION_TYPES } from '../redux/constants';
import { EditorProviderContext } from '../components/EditorProvider';
import ReduxContext from '../components/ReduxContext';

interface useToggleProps {
  /**
   * If `true`, inline style will not be available from keyboard shortcuts
   * @default false
   */
  disableKeyboardShortcuts?: boolean;
  keyCommand: string;
  onToggle: (editorState: EditorState) => void;
  onClick?: (
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => void;
  onMouseDown?: (
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => void;
}

const useToggle = ({
  disableKeyboardShortcuts,
  keyCommand,
  onToggle,
  onClick,
  onMouseDown,
}: useToggleProps) => {
  const { editorState } = useContext(EditorProviderContext);
  const { dispatch } = useContext(ReduxContext);

  useEffect(() => {
    if (!disableKeyboardShortcuts) {
      dispatch({
        type: ACTION_TYPES.ADD_KEY_COMMAND,
        payload: keyCommand,
      });
    }
  }, []);

  const executeToggle = useCallback(() => {
    setTimeout(
      () =>
        onToggle(
          editorState.getSelection().getHasFocus() ?
          editorState: EditorState.forceSelection(
            editorState,
            editorState.getSelection()
          )
        ),
      1
    );
  }, [onToggle, editorState]);

  const handleClick = (
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    if (editorState) {
      event.preventDefault();

      if (onClick) {
        onClick(event);
      }

      executeToggle();
    }
  };

  const handleMouseDown = (
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    if (editorState) {
      event.preventDefault();

      if (onMouseDown) {
        onMouseDown(event);
      }
    }
  };

  return {
    onClick: handleClick,
    onMouseDown: handleMouseDown,
  };
};

export default useToggle;
