export const getEventTarget = (
  target: {current: EventTarget | null | undefined} | EventTarget,
) => {
  if ('addEventListener' in target) {
    return target;
  } else {
    return target.current ?? undefined;
  }
};
