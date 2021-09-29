import { useContext } from 'react';
import { EditorProviderContext } from '../components/EditorProvider';
import { insertAtomicBlock } from '../utils';
import { isVideo, isAudio, isEmbeddedLink, isImage } from './patterns';

interface AtomicMediaConfig {
  strict?: boolean;
}

const useAtomicMedia = (config?: AtomicMediaConfig) => {
  const { editorState, setEditorState } = useContext(EditorProviderContext);
  const isStrict = config?.strict;

  const insertAtomicImage = (
    data: string | React.ImgHTMLAttributes<HTMLImageElement>,
    sourcesProps?: React.SourceHTMLAttributes<HTMLSourceElement>[],
    onInserted?: () => void
  ) => {
    const src = typeof data === 'string' ? data : data.src;

    insertAtomicMediaBlock(
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

    insertAtomicMediaBlock(
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

    insertAtomicMediaBlock(
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

    insertAtomicMediaBlock(
      { atomicIframeProps: typeof data === 'string' ? { src } : data },
      undefined,
      !isStrict || (src && isEmbeddedLink(src)) ? 'embedded_link' : undefined,
      onInserted
    );
  };

  const insertAtomicMedia = (
    data:
      | string
      | React.ImgHTMLAttributes<HTMLImageElement>
      | React.AudioHTMLAttributes<HTMLAudioElement>
      | React.VideoHTMLAttributes<HTMLVideoElement>,
    sourcesProps?: React.SourceHTMLAttributes<HTMLSourceElement>[],
    onInserted?: () => void
  ) => {
    const src = typeof data === 'string' ? data : data.src;

    if (!src) {
      return;
    }

    if (isImage(src)) {
      insertAtomicImage(
        data as string | React.ImgHTMLAttributes<HTMLImageElement>,
        sourcesProps,
        onInserted
      );
    }

    if (isAudio(src)) {
      insertAtomicAudio(
        data as string | React.AudioHTMLAttributes<HTMLAudioElement>,
        sourcesProps,
        onInserted
      );
    }

    if (isVideo(src)) {
      insertAtomicVideo(
        data as string | React.VideoHTMLAttributes<HTMLVideoElement>,
        sourcesProps,
        onInserted
      );
    }
  };

  const insertAtomicMediaBlock = (
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
    insertAtomicMedia,
  };
};

export default useAtomicMedia;
