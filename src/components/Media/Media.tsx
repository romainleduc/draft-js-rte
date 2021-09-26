import React from 'react';
import { ContentState, ContentBlock } from 'draft-js';

export interface MediaData {
  title?: string;
  src: string;
  alt?: string;
}

export type MediaType = 'image' | 'video' | 'audio' | 'embedded_link';

export interface MediaProps {
  contentState: ContentState;
  block: ContentBlock;
  blockProps: any;
}

export const Media = (props: any): JSX.Element | null => {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0));
  const {
    atomicImageProps,
    atomicAudioProps,
    atomicVideoProps,
    atomicIframeProps,
    atomicMediaType,
    sourcesProps,
  } = entity.getData() as {
    atomicImageProps: React.ImgHTMLAttributes<HTMLImageElement>;
    atomicVideoProps: React.VideoHTMLAttributes<HTMLVideoElement>;
    atomicAudioProps: React.AudioHTMLAttributes<HTMLAudioElement>;
    atomicIframeProps: React.IframeHTMLAttributes<HTMLIFrameElement>;
    atomicMediaType?: MediaType;
    sourcesProps?: React.SourceHTMLAttributes<HTMLSourceElement>[];
  };

  if (atomicMediaType === 'image') {
    if (!sourcesProps) {
      return <img {...atomicImageProps} />;
    }

    return (
      <picture>
        {sourcesProps.map((sourceProps, key) => (
          <source key={`atomic-image-source-${key}`} {...sourceProps} />
        ))}
        <img {...atomicImageProps} />
      </picture>
    );
  }

  if (atomicMediaType === 'video') {
    return (
      <video {...atomicVideoProps}>
        {sourcesProps?.map((sourceProps, key) => (
          <source key={`atomic-video-source-${key}`} {...sourceProps} />
        ))}
      </video>
    );
  }

  if (atomicMediaType === 'audio') {
    return (
      <audio {...atomicAudioProps}>
        {sourcesProps?.map((sourceProps, key) => (
          <source key={`atomic-audio-source-${key}`} {...sourceProps} />
        ))}
      </audio>
    );
  }

  if (atomicMediaType === 'embedded_link') {
    return <iframe {...atomicIframeProps} />;
  }

  return null;
};
