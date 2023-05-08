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

export const getMaxScroll = (target: EventTarget) => {
  const element = getElement(target);
  return {
    maxX: element.scrollWidth - element.clientWidth,
    maxY: element.scrollHeight - element.clientHeight,
  };
};

export const getThrottleDistance = (
  target: EventTarget,
  axis: 'x' | 'y',
  extraRate: number,
) => {
  const {width, height} = getRect(target);
  if (axis === 'x') {
    return (width * extraRate) / 2;
  } else {
    return (height * extraRate) / 2;
  }
};

export const getPosition = (target: EventTarget, axis: 'x' | 'y') => {
  const {x, y} = getScroll(target);
  return axis === 'x' ? x : y;
};

export const getListSize = (target: EventTarget, axis: 'x' | 'y') => {
  const {width, height} = getRect(target);
  return axis === 'x' ? width : height;
};
