interface VirtualizedOptions {
  target: HTMLElement | Window;
  itemSize: number | number[];
  itemCount: number;
  extraRate: number;
  throttleTime: number;
  onChange: (state: VirtualizedState) => void;
  axis: 'x' | 'y';
}

interface VirtualizedState {
  offset: number;
  limit: number;
  leading: number;
  trailing: number;
  scrollSize: number;
}

interface VirtualizedEngineOptions {
  listSize: number;
  itemSize: number | number[];
  itemCount: number;
  extraRate: number;
  position: number;
}

interface ScrollState {
  width: number;
  height: number;
  x: number;
  y: number;
  isTop: boolean;
  isBottom: boolean;
  isLeading: boolean;
  isTrailing: boolean;
}

interface ScrollOptions {
  target: HTMLElement | Window;
  onScroll: ScrollEventHandler;
  throttleTime: number;
  throttleDistance: number;
}

type ScrollEventHandler = (state: ScrollState) => void;

export type {
  VirtualizedOptions,
  VirtualizedState,
  VirtualizedEngineOptions,
  ScrollState,
  ScrollEventHandler,
  ScrollOptions,
};
