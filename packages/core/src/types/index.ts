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
  target: EventTarget;
  onScroll: ScrollEventHandler;
  throttleTime: number;
  throttleDistance: number;
}

type ScrollEventHandler = (state: ScrollState) => void;

export type {
  VirtualizedState,
  VirtualizedEngineOptions,
  ScrollState,
  ScrollOptions,
  ScrollEventHandler,
};
