import { EditorState } from 'draft-js';
import React, { useCallback, useContext } from 'react';
import { setBlockData, setBlocksData } from '../utils';
import { EditorContext } from '../components/Editor';
import useToggle from './useToggle';

interface Options {
  /**
   * If `true`, align will not be available from keyboard shortcuts
   * @default false
   */
  disableKeyboardShortcuts?: boolean;
  /**
   *
   */
  value: 'left' | 'center' | 'right' | 'justify';
  /**
   *
   */
  ignoreSelection?: boolean;
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

const useTextAlignToggle = (
  /**
   * The align value to associate with the button
   */
  value: string,
  ignoreSelection?: boolean
) => {
  const { editorState, setEditorState } = useContext(EditorContext) || {};

  const handleToggle = useCallback(
    (newEditorState: EditorState): void => {
      const contentState = newEditorState.getCurrentContent();
      const selectionState = newEditorState.getSelection();
      const blockData = { textAlign: value };

      if (ignoreSelection) {
        const contentBlocks = contentState.getBlocksAsArray();

        if (!contentBlocks.length) {
          return;
        }

        setEditorState?.(
          setBlocksData(
            newEditorState,
            contentState,
            contentBlocks[0].getKey(),
            contentBlocks[contentBlocks.length - 1].getKey(),
            blockData
          )
        );
      } else {
        setEditorState?.(
          setBlockData(newEditorState, contentState, selectionState, blockData)
        );
      }
    },
    [ignoreSelection]
  );

  return {
    keyCommand: `align-${value}`,
    onToggle: handleToggle,
    selected:
      editorState &&
      editorState
        .getCurrentContent()
        .getBlockForKey(editorState.getSelection().getStartKey())
        .getData()
        .toArray()
        .includes(value),
  };
};

const useTextAlign = (
  /**
   * The align value to associate with the button
   */
  value: string,
  options?: Options
) => {
  const { keyCommand, onToggle, selected } = useTextAlignToggle(
    value,
    options?.ignoreSelection
  );
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

export default useTextAlign;
