import {VirtualizedOptions} from '@virtualized-toolkit/core';
import {UseVirtualizedOptions} from './types';

const nullElement = document.createElement('div');

export const isRef = (target: {current: EventTarget | null} | EventTarget) => {
  return !('addEventListener' in target);
};

export const getEventTarget = (
  target: {current: EventTarget | null} | EventTarget,
) => {
  if ('addEventListener' in target) {
    return target;
  } else {
    return target.current ?? nullElement;
  }
};

export const diffOptions = (
  prevOptions: Partial<UseVirtualizedOptions>,
  newOptions: Partial<UseVirtualizedOptions>,
): Partial<UseVirtualizedOptions> => {
  const diffOptions: {[key: string]: unknown} = {};
  [
    'target',
    'itemSize',
    'itemCount',
    'extraRate',
    'throttleTime',
    'axis',
  ].forEach((keyString) => {
    const key = keyString as keyof UseVirtualizedOptions;
    if (key !== 'target' && newOptions[key] !== prevOptions[key]) {
      diffOptions[key] = newOptions[key];
    }
  });
  return diffOptions as Partial<UseVirtualizedOptions>;
};

export const convertOptions = (
  options: Partial<UseVirtualizedOptions>,
): Partial<VirtualizedOptions> => {
  const newOptions: Partial<VirtualizedOptions> = {
    ...options,
  } as Partial<VirtualizedOptions>;
  if (options.target) {
    newOptions.target = getEventTarget(options.target);
  }
  return newOptions;
};
