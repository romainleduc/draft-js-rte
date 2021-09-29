import React from 'react';
import { render } from 'test-utils';
import { ContentState, EditorState, RichUtils } from 'draft-js';
import Editor from './Editor';
import EditorProvider from '../EditorProvider';

let editorState: EditorState;

beforeEach(() => {
  editorState = EditorState.createEmpty();
});

describe('placeholder', () => {
  test('should not add the `DraftEditor-hidePlaceholder` class if the block type is unstyled', () => {
    const newEditorState = RichUtils.toggleBlockType(editorState, 'unstyled');

    const { getByTestId } = render(
      <EditorProvider editorState={newEditorState} onChange={() => {}}>
        <Editor wrapperProps={{ 'data-testid': 'root' }} />
      </EditorProvider>
    );

    expect(getByTestId('root')).not.toHaveClass('DraftEditor-hidePlaceholder');
  });

  test('should add the `DraftEditor-hidePlaceholder` class if the block type is not unstyled', () => {
    const newEditorState = RichUtils.toggleBlockType(
      editorState,
      'other-block-type'
    );

    const { getByTestId } = render(
      <EditorProvider editorState={newEditorState} onChange={() => {}}>
        <Editor wrapperProps={{ 'data-testid': 'root' }} />
      </EditorProvider>
    );

    expect(getByTestId('root')).toHaveClass('DraftEditor-hidePlaceholder');
  });

  test('should not use the `DraftEditor-hidePlaceholder` class to hide placeholder when content state has text', () => {
    const newEditorState = RichUtils.toggleBlockType(
      EditorState.createWithContent(ContentState.createFromText('With text')),
      'other-block-type'
    );

    const { getByTestId } = render(
      <EditorProvider editorState={newEditorState} onChange={() => {}}>
        <Editor wrapperProps={{ 'data-testid': 'root' }} />
      </EditorProvider>
    );

    expect(getByTestId('root')).not.toHaveClass('DraftEditor-hidePlaceholder');
  });
});
