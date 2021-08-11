import { EditorState, RichUtils } from 'draft-js';
import React, { useCallback, useContext } from 'react';
import { EditorProviderContext } from '../components/EditorProvider';
import useToggle from './useToggle';

interface Options {
  /**
   * If `true`, block type will not be available from keyboard shortcuts
   * @default false
   */
  disableKeyboardShortcuts?: boolean;
  /**
   * The block type value to associate with the button
   */
  value: string;
  /**
   *
   */
  defaultSelected?: boolean;
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

const useBlockTypeToggle = (
  /**
   * The block type value to associate with the button
   */
  value: string
) => {
  const { editorState, setEditorState } = useContext(EditorProviderContext) || {};

  const handleToggle = useCallback(
    (newEditorState: EditorState): void => {
      setEditorState?.(RichUtils.toggleBlockType(newEditorState, value));
    },
    [value]
  );

  return {
    keyCommand: value,
    onToggle: handleToggle,
    selected:
      editorState && value === RichUtils.getCurrentBlockType(editorState),
  };
};

const useBlockType = (
  /**
   * The block type value to associate with the button
   */
  value: string,
  options: Options
) => {
  const { selected, onToggle, keyCommand } = useBlockTypeToggle(value);

  const props = useToggle({
    keyCommand,
    onToggle,
    ...options,
  });

  return {
    ...props,
    selected,
  };
};

export default useBlockType;
