import React from 'react';
import { ContentState, ContentBlock } from 'draft-js';
import clsx from 'clsx';

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

interface AtomicImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  sourcesProps?: React.SourceHTMLAttributes<HTMLSourceElement>[];
}

export const AtomicImage = ({
  className,
  src,
  sourcesProps,
  ...other
}: AtomicImageProps): JSX.Element => {
  return (
    <>
      {!sourcesProps ? (
        <img className={clsx(className)} src={src} {...other} />
      ) : (
        <picture>
          {sourcesProps.map((sourceProps, key) => (
            <source key={`${src}-${key}`} {...sourceProps} />
          ))}
          <img src={src} {...other} />
        </picture>
      )}
    </>
  );
};

interface AtomicVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  sourcesProps?: React.SourceHTMLAttributes<HTMLSourceElement>[];
}

const AtomicVideo = ({
  src,
  sourcesProps,
  ...other
}: AtomicVideoProps): JSX.Element => (
  <video src={!sourcesProps && src} {...other}>
    {sourcesProps?.map((sourceProps, key) => (
      <source key={`${src}-${key}`} {...sourceProps} />
    ))}
  </video>
);

interface AtomicAudioProps extends React.AudioHTMLAttributes<HTMLAudioElement> {
  sourcesProps?: React.SourceHTMLAttributes<HTMLSourceElement>[];
}

const AtomicAudio = ({
  src,
  sourcesProps,
  ...other
}: AtomicAudioProps): JSX.Element => (
  <audio src={!sourcesProps && src} {...other}>
    {sourcesProps?.map((sourceProps, key) => (
      <source key={`${src}-${key}`} {...sourceProps} />
    ))}
  </audio>
);

interface AtomicIframeProps
  extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  sourcesProps?: React.SourceHTMLAttributes<HTMLSourceElement>[];
}

const AtomicIframe = ({
  src,
  sourcesProps,
  className,
  children,
  ...other
}: AtomicIframeProps): JSX.Element => <iframe {...other}>{children}</iframe>;

export const Media = (props: MediaProps): JSX.Element => {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0));
  const { atomicMediaProps, atomicMediaType } = entity.getData();

  const getAtomicMediaType = () => {
    switch (atomicMediaType) {
      case 'img':
        return <AtomicImage {...atomicMediaProps} />;
      case 'video':
        return (
          <AtomicVideo
            className={clsx(atomicMediaProps.className)}
            {...atomicMediaProps}
          />
        );
      case 'audio':
        return (
          <AtomicAudio
            className={clsx(atomicMediaProps.className)}
            {...atomicMediaProps}
          />
        );
      case 'iframe':
        return (
          <AtomicIframe
            className={clsx(atomicMediaProps.className)}
            {...atomicMediaProps}
          />
        );
      default:
        return (
          <img
            className={clsx(atomicMediaProps.className)}
            {...atomicMediaProps}
          />
        );
    }
  };

  return getAtomicMediaType();
};
