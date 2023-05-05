interface VerticalVirtualizedOptions {
  target: HTMLElement | Window;
  itemSize: number | number[];
  itemCount: number;
  extraRate: number;
  throttleTime: number;
  onChange: (state: VerticalVirtualizedState) => void;
  axis?: 'y';
}

interface HorizontalVirtualizedOptions {
  target: HTMLElement | Window;
  itemSize: number | number[];
  itemCount: number;
  extraRate: number;
  throttleTime: number;
  onChange: (state: HorizontalVirtualizedState) => void;
  axis: 'x';
}

type RequiredVirtualizedOptions =
  | VerticalVirtualizedOptions
  | HorizontalVirtualizedOptions;

type VirtualizedOptions =
  | (Omit<VerticalVirtualizedOptions, 'extraRate' | 'throttleTime'> &
      Partial<VerticalVirtualizedOptions>)
  | (Omit<HorizontalVirtualizedOptions, 'extraRate' | 'throttleTime'> &
      Partial<HorizontalVirtualizedOptions>);

type DefaultVirtualizedOptions = Pick<
  RequiredVirtualizedOptions,
  'extraRate' | 'throttleTime'
>;

interface VerticalVirtualizedState {
  offset: number;
  limit: number;
  top: number;
  bottom: number;
  scrollHeight: number;
}

interface HorizontalVirtualizedState {
  offset: number;
  limit: number;
  left: number;
  right: number;
  scrollWidth: number;
}

type VirtualizedState = VerticalVirtualizedState | HorizontalVirtualizedState;

interface VerticalVirtualizedEngineOptions {
  height: number;
  itemSize: number | number[];
  itemCount: number;
  extraRate: number;
  y: number;
}

interface HorizontalVirtualizedEngineOptions {
  width: number;
  itemSize: number | number[];
  itemCount: number;
  extraRate: number;
  x: number;
}

type VirtualizedEngineOptions =
  | VerticalVirtualizedEngineOptions
  | HorizontalVirtualizedEngineOptions;

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
  VerticalVirtualizedOptions,
  HorizontalVirtualizedOptions,
  RequiredVirtualizedOptions,
  VirtualizedOptions,
  DefaultVirtualizedOptions,
  VerticalVirtualizedState,
  HorizontalVirtualizedState,
  VirtualizedState,
  VerticalVirtualizedEngineOptions,
  HorizontalVirtualizedEngineOptions,
  VirtualizedEngineOptions,
  ScrollState,
  ScrollEventHandler,
  ScrollOptions,
};
