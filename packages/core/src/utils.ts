import {ScrollState} from './types';

export const getElement = (target: EventTarget) => {
  return target === window
    ? document.documentElement || document.body
    : (target as HTMLElement);
};

export const getScroll = (target: EventTarget) => {
  if (target === window) {
    return {
      x: window.scrollX ?? 0,
      y: window.scrollX ?? 0,
    };
  } else {
    return {
      x: (target as HTMLElement).scrollLeft ?? 0,
      y: (target as HTMLElement).scrollTop ?? 0,
    };
  }
};

export const getRect = (target: EventTarget) => {
  const element = getElement(target);
  return {
    width: element.clientWidth,
    height: element.clientHeight,
  };
};

export const getThrottleDistance = (
  {width, height}: ScrollState,
  axis: 'x' | 'y',
  extraRate: number,
) => {
  if (axis === 'x') {
    return (width * extraRate) / 2;
  } else {
    return (height * extraRate) / 2;
  }
};

export const getPosition = ({x, y}: ScrollState, axis: 'x' | 'y') => {
  return axis === 'x' ? x : y;
};

export const getListSize = ({width, height}: ScrollState, axis: 'x' | 'y') => {
  return axis === 'x' ? width : height;
};
