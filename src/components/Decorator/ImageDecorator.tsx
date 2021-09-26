import React from 'react';

const ImageDecorator = (props: any) => {
  const imageProps = props.contentState.getEntity(props.entityKey).getData();

  return <img {...imageProps} />;
};

export default ImageDecorator;
