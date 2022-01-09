import { CompositeDecorator, ContentBlock, ContentState } from 'draft-js';
import { findEntitiesRangeByType } from './blockUtils';
import ImageDecorator from '../components/Decorator/ImageDecorator';
import LinkDecorator from '../components/Decorator/LinkDecorator';

export const findImageEntities = (
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState
) => {
  findEntitiesRangeByType(contentBlock, callback, contentState, 'IMAGE');
};

export const findLinkEntities = (
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState
) => {
  findEntitiesRangeByType(contentBlock, callback, contentState, 'LINK');
};

export const defaultDecorators = {
  image: {
    strategy: findImageEntities,
    component: ImageDecorator,
  },
  link: {
    strategy: findLinkEntities,
    component: LinkDecorator,
  }
}

export const getDefaultCompositeDecorator = () => {
  return new CompositeDecorator([
    defaultDecorators.image,
    defaultDecorators.link,
  ])
}
