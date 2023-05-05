interface VerticalVirtualizedOptions {
  height: number;
  itemSize: number | number[];
  itemCount: number;
  extraRate: number;
  y: number;
}

interface VerticalVirtualizedState {
  offset: number;
  limit: number;
  top: number;
  bottom: number;
  scrollHeight: number;
}

interface HorizontalVirtualizedOptions {
  width: number;
  itemSize: number | number[];
  itemCount: number;
  extraRate: number;
  x: number;
}

interface HorizontalVirtualizedState {
  offset: number;
  limit: number;
  left: number;
  right: number;
  scrollWidth: number;
}

interface ScrollState {
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
  VerticalVirtualizedOptions,
  VerticalVirtualizedState,
  HorizontalVirtualizedOptions,
  HorizontalVirtualizedState,
  ScrollState,
  ScrollEventHandler,
  ScrollOptions,
};
