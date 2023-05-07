interface VirtualizedOptions {
  target: EventTarget;
  itemSize: number | number[];
  itemCount: number;
  extraRate: number;
  throttleTime: number;
  onChange: VirtualizedChangeEventHandler;
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

type VirtualizedChangeEventHandler = (state: VirtualizedState) => void;

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
  target: EventTarget;
  onScroll: ScrollEventHandler;
  throttleTime: number;
  throttleDistance: number;
}

type ScrollEventHandler = (state: ScrollState) => void;

export type {
  VirtualizedOptions,
  VirtualizedState,
  VirtualizedEngineOptions,
  VirtualizedChangeEventHandler,
  ScrollState,
  ScrollOptions,
  ScrollEventHandler,
};
