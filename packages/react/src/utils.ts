const nullElement = document.createElement('div');

export const isRef = (
  target: {current: EventTarget | null | undefined} | EventTarget,
) => {
  return !('addEventListener' in target);
};

export const getEventTarget = (
  target: {current: EventTarget | null | undefined} | EventTarget,
) => {
  if ('addEventListener' in target) {
    return target;
  } else {
    return target.current ?? nullElement;
  }
};
