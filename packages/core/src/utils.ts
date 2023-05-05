export const getElement = (target: Window | HTMLElement) => {
  return target === window
    ? document.documentElement || document.body
    : (target as HTMLElement);
};

export const getScroll = (target: Window | HTMLElement) => {
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

export const getRect = (target: Window | HTMLElement) => {
  const element = getElement(target);
  return {
    width: element.clientWidth,
    height: element.clientHeight,
  };
};

export const getMaxScroll = (target: Window | HTMLElement) => {
  const element = getElement(target);
  return {
    maxX: element.scrollWidth - element.clientWidth,
    maxY: element.scrollHeight - element.clientHeight,
  };
};

export const getThrottleDistance = (
  target: Window | HTMLElement,
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
