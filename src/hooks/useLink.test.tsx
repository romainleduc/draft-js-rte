import React, { useState } from 'react';
import {
  renderHook,
  act,
  RenderHookResult,
} from '@testing-library/react-hooks';
import {
  ContentState,
  convertFromHTML,
  EditorState,
  SelectionState,
} from 'draft-js';
import useLink, { UseLinkResult } from './useLink';
import EditorProvider from '../components/EditorProvider/EditorProvider';

let editorState: EditorState;
let editorStateWithContent: EditorState;

const Wrapper = ({
  editorState: editorStateProps,
  children,
}: {
  editorState: EditorState;
  children: React.ReactNode;
}): JSX.Element => {
  const [editorState, setEditorState] = useState(editorStateProps);

  return (
    <EditorProvider editorState={editorState} onChange={setEditorState}>
      {children}
    </EditorProvider>
  );
};

beforeEach(() => {
  editorState = EditorState.createEmpty();
  const blocksFromHTML = convertFromHTML(
    'Editor state with link to <a href="https://draftjs.org/">Draft.js</a>'
  );
  editorStateWithContent = EditorState.createWithContent(
    ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    )
  );
});

const renderLinkHook = (
  editorState: EditorState
): RenderHookResult<{}, UseLinkResult> => {
  return renderHook(() => useLink(), {
    wrapper: ({ children }) => (
      <Wrapper editorState={editorState}>{children}</Wrapper>
    ),
  });
};

describe('states', () => {
  test('should be able to retrieve the selected link when the selection is reduced', async () => {
    const { result } = renderLinkHook(
      EditorState.set(editorStateWithContent, {
        selection: editorStateWithContent
          .getSelection()
          .merge({ anchorOffset: 28, focusOffset: 28 }),
      })
    );
    expect(result.current.data.href).toBe('https://draftjs.org/');
    expect(result.current.text).toBe('Draft.js');
  });
});

describe('insert', () => {
  test('should update data after insert', async () => {
    const { result } = renderLinkHook(editorState);

    const linkData = {
      href: 'href',
      target: '_blank',
    };

    act(() => {
      result.current.insert(linkData);
    });

    expect(result.current.data).toStrictEqual(linkData);
  });

  test('should use the href passed in data to write a default text', async () => {
    const { result } = renderLinkHook(editorState);

    const linkData = {
      href: 'href',
      target: '_blank',
    };

    act(() => {
      result.current.insert(linkData);
    });

    expect(result.current.text).toBe(linkData.href);
  });

  test('should use the text passed in parameter to replace the default text', async () => {
    const { result } = renderLinkHook(editorState);

    const linkData = {
      href: 'href',
      target: '_blank',
    };

    act(() => {
      result.current.insert(linkData, 'Click here');
    });

    expect(result.current.text).toBe('Click here');
  });
});

describe('toggle', () => {
  test('should toggle the selection range link', async () => {
    const blockKey = editorStateWithContent
      .getCurrentContent()
      .getFirstBlock()
      .getKey();
    const { result } = renderLinkHook(
      EditorState.set(editorStateWithContent, {
        selection: new SelectionState({
          anchorOffset: 0,
          anchorKey: blockKey,
          focusOffset: 6,
          focusKey: blockKey,
        }),
      })
    );

    const linkData = {
      href: 'href',
      target: '_blank',
    };

    act(() => {
      result.current.toggle(linkData);
    });

    expect(result.current.data).toStrictEqual(linkData);
    expect(result.current.text).toBe('Editor');
  });

  test('should toggle the reduced selection link', async () => {
    const { result } = renderLinkHook(
      EditorState.set(editorStateWithContent, {
        selection: editorStateWithContent
          .getSelection()
          .merge({ anchorOffset: 28, focusOffset: 28 }),
      })
    );

    const linkData = {
      href: 'href',
      target: '_blank',
    };

    act(() => {
      result.current.toggle(linkData);
    });

    expect(result.current.data).toStrictEqual(linkData);
    expect(result.current.text).toBe('Draft.js');
  });

  test('should remove the link from the selection if the value passed in parameter is null', async () => {
    const { result } = renderLinkHook(
      EditorState.set(editorStateWithContent, {
        selection: editorStateWithContent
          .getSelection()
          .merge({ anchorOffset: 28, focusOffset: 28 }),
      })
    );

    act(() => {
      result.current.toggle(null);
    });

    expect(result.current.data).toBe(undefined);
    expect(result.current.text).toBe(undefined);
  });
});
