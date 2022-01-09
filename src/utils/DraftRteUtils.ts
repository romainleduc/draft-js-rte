import { EditorState, RichUtils, SelectionState } from "draft-js";

class DraftRteUtils {
  static toggleLink(editorState: EditorState, selectionState: SelectionState, data: React.AnchorHTMLAttributes<HTMLAnchorElement> | null): EditorState {
    if (data === null) {
      return RichUtils.toggleLink(editorState, selectionState, null)
    }
  
    const currentContentState = editorState.getCurrentContent();
  
    const contentStateWithEntity = currentContentState.createEntity(
      'LINK',
      'MUTABLE',
      data
    );
  
    return RichUtils.toggleLink(EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    }), selectionState, contentStateWithEntity.getLastCreatedEntityKey())
  }
}

export default DraftRteUtils;