interface UseVirtualizedOptions {
  target: HTMLElement | Window;
  itemSize: number | number[];
  itemCount: number;
  extraRate: number;
  throttleTime: number;
  axis: 'x' | 'y';
}

export {UseVirtualizedOptions};
