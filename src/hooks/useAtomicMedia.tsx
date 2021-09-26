import { useContext } from 'react';
import { EditorProviderContext } from '../components/EditorProvider';
import { insertAtomicBlock } from '../utils';
import { isVideo, isAudio, isEmbeddedLink, isImage } from './patterns';

interface AtomicMediaConfig {
  strict?: boolean;
}

const useAtomicMedia = (config: AtomicMediaConfig) => {
  const { editorState, setEditorState } = useContext(EditorProviderContext);
  const isStrict = config?.strict;

  const insertAtomicImage = (
    data: string | React.ImgHTMLAttributes<HTMLImageElement>,
    sourcesProps?: React.SourceHTMLAttributes<HTMLSourceElement>[],
    onInserted?: () => void
  ) => {
    const src = typeof data === 'string' ? data : data.src;

    insertAtomicMedia(
      { atomicImageProps: typeof data === 'string' ? { src } : data },
      sourcesProps,
      !isStrict || (src && isImage(src)) ? 'image' : undefined,
      onInserted
    );
  };

  const insertAtomicAudio = (
    data: string | React.AudioHTMLAttributes<HTMLAudioElement>,
    sourcesProps?: React.SourceHTMLAttributes<HTMLSourceElement>[],
    onInserted?: () => void
  ) => {
    const src = typeof data === 'string' ? data : data.src;

    insertAtomicMedia(
      { atomicAudioProps: typeof data === 'string' ? { src } : data },
      sourcesProps,
      !isStrict || (src && isAudio(src)) ? 'audio' : undefined,
      onInserted
    );
  };

  const insertAtomicVideo = (
    data: string | React.VideoHTMLAttributes<HTMLVideoElement>,
    sourcesProps?: React.SourceHTMLAttributes<HTMLSourceElement>[],
    onInserted?: () => void
  ) => {
    const src = typeof data === 'string' ? data : data.src;

    insertAtomicMedia(
      { atomicVideoProps: typeof data === 'string' ? { src } : data },
      sourcesProps,
      !isStrict || (src && isVideo(src)) ? 'video' : undefined,
      onInserted
    );
  };

  const insertAtomicEmbeddedLink = (
    data: string | React.IframeHTMLAttributes<HTMLIFrameElement>,
    onInserted?: () => void
  ) => {
    const src = typeof data === 'string' ? data : data.src;

    insertAtomicMedia(
      { atomicIframeProps: typeof data === 'string' ? { src } : data },
      undefined,
      !isStrict || (src && isEmbeddedLink(src)) ? 'embedded_link' : undefined,
      onInserted
    );
  };

  const insertAtomicMedia = (
    atomicMediaProps: {
      atomicImageProps?: React.ImgHTMLAttributes<HTMLImageElement>;
      atomicVideoProps?: React.VideoHTMLAttributes<HTMLVideoElement>;
      atomicAudioProps?: React.AudioHTMLAttributes<HTMLAudioElement>;
      atomicIframeProps?: React.IframeHTMLAttributes<HTMLIFrameElement>;
    },
    sourcesProps?: React.SourceHTMLAttributes<HTMLSourceElement>[],
    atomicMediaType?: string,
    onInserted?: () => void
  ): void => {
    setTimeout(
      () =>
        setEditorState(
          insertAtomicBlock(editorState, 'media', {
            ...atomicMediaProps,
            sourcesProps,
            atomicMediaType,
          })
        ),
      0
    );

    onInserted?.();
  };

  return {
    insertAtomicImage,
    insertAtomicAudio,
    insertAtomicVideo,
    insertAtomicEmbeddedLink,
  };
};

export default useAtomicMedia;
