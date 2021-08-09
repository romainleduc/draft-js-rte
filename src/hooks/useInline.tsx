import { EditorState, Modifier, RichUtils } from 'draft-js';
import React, { useCallback, useContext } from 'react';
import { EditorContext } from '../components/Editor';
import EditorThemeContext from '../components/EditorProvider/EditorProviderContext';
import useToggle from './useToggle';

interface Options {
  /**
   * If `true`, inline style will not be available from keyboard shortcuts
   * @default false
   */
  disableKeyboardShortcuts?: boolean;
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

const useInlineToggle = (
  /**
   * The inline style value to associate with the button
   */
  value: string
) => {
  const { editorState, setEditorState } = useContext(EditorContext) || {};
  const { customStyleMaps, getCustomStyleMapOfKey } = useContext(EditorThemeContext);

  const handleToggle = useCallback(
    (newEditorState: EditorState): void => {
      const group = getCustomStyleMapOfKey(value);

      let nextEditorState: EditorState;

      if (group?.exclusive) {
        const selection = newEditorState.getSelection();
        const currentStyle = newEditorState.getCurrentInlineStyle();

        // Unset style override for current color.
        if (selection.isCollapsed()) {
          nextEditorState = currentStyle.reduce((state: any, style: any) => {
            const styleGroup = getCustomStyleMapOfKey(style);
            const valueGroup = getCustomStyleMapOfKey(value);

            if (styleGroup?.group === valueGroup?.group) {
              return RichUtils.toggleInlineStyle(state, style);
            }

            return state;
          }, newEditorState);
        } else {
          // Let's just allow one style at a time. Turn off all active styles group.
          const nextContentState = Object.keys(group.styles).reduce(
            (contentState, style) => {
              return Modifier.removeInlineStyle(
                contentState,
                selection,
                `${group.group}_${style}`
              );
            },
            newEditorState.getCurrentContent()
          );

          nextEditorState = EditorState.push(
            newEditorState,
            nextContentState,
            'change-inline-style'
          );
        }

        // If the style is being toggled on, apply it.
        if (!currentStyle.has(value)) {
          nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, value);
        }
      } else {
        nextEditorState = RichUtils.toggleInlineStyle(newEditorState, value);
      }

      setEditorState?.(nextEditorState);
    },
    [customStyleMaps, value]
  );

  return {
    keyCommand: value.toLowerCase(),
    onToggle: handleToggle,
    selected: editorState ? editorState.getCurrentInlineStyle().toArray().includes(value) : false,
  }
}

const useInline = (
  /**
   * The inline style value to associate with the button
   */
    value: string,
    options?: Options
) => {
  const { keyCommand, onToggle, selected } = useInlineToggle(value);

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

export default useInline;
