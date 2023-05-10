interface UseVirtualizedOptions {
  target: {current: EventTarget | null | undefined} | EventTarget;
  itemSize: number | number[];
  itemCount: number;
  extraRate: number;
  throttleTime: number;
  axis: 'x' | 'y';
}

export {UseVirtualizedOptions};
