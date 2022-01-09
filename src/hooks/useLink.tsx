import React, { useEffect, useMemo, useRef } from 'react';
import {
  EditorState,
  EntityInstance,
  Modifier,
  SelectionState,
  CharacterMetadata,
  ContentState,
} from 'draft-js';
import { EditorProviderContext } from '../components/EditorProvider';
import { getTextSelection } from '../utils';
import DraftRteUtils from '../utils/DraftRteUtils';

type Position = { start: number; end: number };

interface EntityDataSelected {
  key: string;
  data: any;
  position: Position;
  blockKey: string;
}

export interface UseLinkResult {
  /**
   * Text of the currently selected link
   */
  text: string | undefined;
  /**
   * Data of the currently selected link
   */
  data: any | undefined;
  /**
   * Insert new link with text
   */
  insert: (
    data: React.AnchorHTMLAttributes<HTMLAnchorElement>,
    text?: string
  ) => void;
  /**
   * Change the text of the currently selected link
   */
  setText: (text: string) => void;
  /**
   * Toggles the specified link for selection. If the user's selection is reduced, will apply a new selection from the range of the selected link
   */
  toggle: (data: React.AnchorHTMLAttributes<HTMLAnchorElement> | null) => void;
}

const useLink = (): UseLinkResult => {
  const { editorState, setEditorState } =
    React.useContext(EditorProviderContext) || {};
  const selectionRef = useRef<SelectionState>();
  const currentContentRef = useRef<ContentState>();

  useEffect(() => {
    if (selectionRef.current !== editorState.getSelection()) {
      selectionRef.current = editorState.getSelection();
    }

    if (currentContentRef.current !== editorState.getCurrentContent()) {
      currentContentRef.current = editorState.getCurrentContent();
    }
  }, [editorState]);

  const [entityDataSelected, text] = useMemo<
    [EntityDataSelected | undefined, string | undefined]
  >(() => {
    const selection = editorState.getSelection();
    const startOffset = selection.getStartOffset();
    const endOffset = selection.getEndOffset();

    let entityWithKeySaved: { key: string; entity: EntityInstance };
    let entityDataSelected: EntityDataSelected | undefined;
    let text: string | undefined;

    editorState
      .getCurrentContent()
      .getBlocksAsArray()
      .forEach((block) => {
        block.findEntityRanges(
          (character: CharacterMetadata) => {
            const key = character.getEntity();

            if (key === null) {
              return false;
            }

            const entity = editorState.getCurrentContent().getEntity(key);
            const isLink = Boolean(entity && entity.getType() === 'LINK');

            if (isLink) {
              entityWithKeySaved = { entity, key };
            }

            return isLink;
          },
          (start, end) => {
            if (
              entityWithKeySaved &&
              !entityDataSelected &&
              start <= startOffset &&
              start <= endOffset &&
              end >= startOffset
            ) {
              entityDataSelected = {
                key: entityWithKeySaved.key,
                data: entityWithKeySaved.entity.getData(),
                position: { start, end },
                blockKey: block.getKey(),
              };
            }
          }
        );
      });

    if (entityDataSelected) {
      const { position, blockKey } = entityDataSelected;

      text = getTextSelection(
        editorState.getCurrentContent(),
        editorState.getSelection().isCollapsed()
          ? new SelectionState({
              anchorOffset: position.start,
              anchorKey: blockKey,
              focusOffset: position.end,
              focusKey: blockKey,
              isBackward: false,
              hasFocus: true,
            })
          : editorState.getSelection()
      );
    }

    return [entityDataSelected, text];
  }, [selectionRef.current, currentContentRef.current]);

  const insert = (
    data: React.AnchorHTMLAttributes<HTMLAnchorElement>,
    text?: string
  ): void => {
    const insertText = text || data.href;

    if (insertText && editorState.getSelection().isCollapsed()) {
      const contentStateWithEntity = editorState
        .getCurrentContent()
        .createEntity('LINK', 'MUTABLE', data);

      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

      setEditorState(
        EditorState.push(
          editorState,
          Modifier.insertText(
            contentStateWithEntity,
            editorState.getSelection(),
            insertText,
            editorState.getCurrentInlineStyle(),
            entityKey
          ),
          'insert-characters'
        )
      );
    }
  };

  const setText = (text: string): void => {
    if (entityDataSelected) {
      const { position, blockKey, key } = entityDataSelected;
      const selection = editorState.getSelection().isCollapsed()
        ? new SelectionState({
            anchorOffset: position.start,
            anchorKey: blockKey,
            focusOffset: position.end,
            focusKey: blockKey,
            isBackward: false,
            hasFocus: true,
          })
        : editorState.getSelection();

      setEditorState(
        EditorState.push(
          editorState,
          Modifier.replaceText(
            editorState.getCurrentContent(),
            selection,
            text,
            editorState.getCurrentInlineStyle(),
            key
          ),
          'insert-characters'
        )
      );
    }
  };

  const toggle = (
    data: React.AnchorHTMLAttributes<HTMLAnchorElement> | null
  ): void => {
    const selection =
      editorState.getSelection().isCollapsed() && entityDataSelected
        ? new SelectionState({
            anchorOffset: entityDataSelected.position.start,
            anchorKey: entityDataSelected.blockKey,
            focusOffset: entityDataSelected.position.end,
            focusKey: entityDataSelected.blockKey,
            isBackward: false,
            hasFocus: true,
          })
        : editorState.getSelection();

    setEditorState(DraftRteUtils.toggleLink(editorState, selection, data));
  };

  return {
    text,
    insert,
    setText,
    data: entityDataSelected?.data,
    toggle,
  };
};

export default useLink;
