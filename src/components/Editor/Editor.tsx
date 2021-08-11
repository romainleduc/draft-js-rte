import React, { forwardRef, useContext } from 'react';
import {
  EditorState,
  EditorProps as DraftEditorProps,
  Editor as DraftEditor,
  RichUtils,
  DraftHandleValue,
  DraftStyleMap,
} from 'draft-js';
import { indentSelection, mergeBlockData, draftToHtml } from '../../utils';
import EditorContext from './EditorContext';
import ReduxContext from '../ReduxContext';
import {
  getDefaultBlockRenderer,
  getDefaultBlockStyle,
  getDefaultKeyBinding,
} from '../../utils/editorUtils';
import EditorProviderContext from '../EditorProvider/EditorProviderContext';
import clsx from 'clsx';
import './Editor.css';

export interface EditorProps
  extends Omit<DraftEditorProps, 'editorState' | 'onChange'> {
  className?: string;
  keyCommands?: string[];
  keyBinding?: string[];
  onChange?(html: string): void;
  onClick?: (event: any, editorState: EditorState | undefined) => void;
  wrapperProps?: any;
}

enum IndentCommand {
  Increase = 'increase-indent',
  Decrease = 'decrease-indent',
}

const Editor = forwardRef<HTMLDivElement, EditorProps>(
  (
    { className, keyCommands, onChange, onClick, wrapperProps, ...rest }: EditorProps,
    ref
  ) => {
    const { editorState, setEditorState } = useContext(EditorContext) || {};
    const { state } = useContext(ReduxContext);
    const { customStyleMaps } = useContext(EditorProviderContext);

    const shouldHidePlaceholder = () => {
      const contentState = editorState?.getCurrentContent();

      return (
        contentState &&
        !contentState.hasText() &&
        contentState.getFirstBlock().getType() !== 'unstyled'
      );
    };

    const getCustomStyleMap = (): DraftStyleMap => {
      const nextCustomStyleMap = new Map();

      customStyleMaps.forEach((customStyleMap) => {
        Object.keys(customStyleMap.styles).forEach((style) => {
          nextCustomStyleMap.set(
            [`${customStyleMap.group}_${style}`],
            customStyleMap.styles[style]
          );
        });
      });

      return Object.fromEntries(nextCustomStyleMap);
    };

    const handleKeyCommand = (
      command: string,
      editorState: EditorState
    ): DraftHandleValue => {
      if (
        keyCommands?.includes(command) ||
        state.keyCommands.includes(command)
      ) {
        if (Object.values(IndentCommand).includes(command as IndentCommand)) {
          const contentState = editorState.getCurrentContent();
          const indentType =
            command === IndentCommand.Increase ? 'increase' : 'decrease';

          if (!setEditorState) {
            return 'not-handled';
          }

          setEditorState(
            indentSelection(editorState, contentState, indentType)
          );

          return 'handled';
        } else {
          const newState = RichUtils.handleKeyCommand(editorState, command);

          if (newState && setEditorState) {
            setEditorState(newState);
            return 'handled';
          }
        }
      }

      return 'not-handled';
    };

    const handleReturn = (): DraftHandleValue => {
      if (editorState && setEditorState) {
        const contentState = editorState.getCurrentContent();
        const startKey = editorState.getSelection().getStartKey();

        if (contentState) {
          setEditorState(mergeBlockData(editorState, contentState, startKey));
          return 'handled';
        }
      }

      return 'not-handled';
    };

    const handleChange = (newEditorState: EditorState) => {
      if (onChange) {
        onChange(draftToHtml(newEditorState.getCurrentContent()));
      }

      setEditorState?.(newEditorState);
    };

    return (
      <div
        className={clsx(
          className,
          'DraftEditor-container',
          shouldHidePlaceholder() && 'DraftEditor-hidePlaceholder'
        )}
        onClick={(event) => onClick?.(event, editorState)}
        {...wrapperProps}
      >
        {editorState && setEditorState && (
          <DraftEditor
            ref={ref as any}
            editorState={editorState}
            blockRendererFn={getDefaultBlockRenderer}
            blockStyleFn={getDefaultBlockStyle}
            keyBindingFn={getDefaultKeyBinding}
            handleKeyCommand={handleKeyCommand}
            handleReturn={handleReturn}
            onChange={handleChange}
            customStyleMap={getCustomStyleMap()}
            {...rest}
          />
        )}
      </div>
    );
  }
);

Editor.displayName = 'Editor';
export default Editor;