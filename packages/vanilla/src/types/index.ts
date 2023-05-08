import {VirtualizedState} from '@virtualized-toolkit/core';

interface VirtualizedOptions {
  target: EventTarget;
  itemSize: number | number[];
  itemCount: number;
  extraRate: number;
  throttleTime: number;
  onChange: VirtualizedChangeEventHandler;
  axis: 'x' | 'y';
}

type VirtualizedChangeEventHandler = (state: VirtualizedState) => void;

export {VirtualizedOptions, VirtualizedChangeEventHandler};
