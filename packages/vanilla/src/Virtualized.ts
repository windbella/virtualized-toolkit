import isEqual from 'lodash.isequal';
import {
  ScrollController,
  VirtualizedEngine,
  ScrollState,
  VirtualizedState,
  virtualizedUtils,
} from '@virtualized-toolkit/core';
import {} from '@virtualized-toolkit/core';
import {VirtualizedOptions} from './types';

const defaultOptions: VirtualizedOptions = {
  target: window,
  itemSize: 0,
  itemCount: 0,
  onChange: () => {
    // ignore
  },
  extraRate: 1,
  throttleTime: 150,
  axis: 'y',
};

class Virtualized {
  private engine = new VirtualizedEngine();
  private options: VirtualizedOptions = {
    ...defaultOptions,
  };
  private controller = new ScrollController({});
  private preState: VirtualizedState = null as unknown as VirtualizedState;

  constructor(options: Partial<VirtualizedOptions>) {
    this.setOptions = this.setOptions.bind(this);
    this.dispose = this.dispose.bind(this);
    this.update = this.update.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.setOptions(options);
  }

  setOptions(options: Partial<VirtualizedOptions>) {
    this.options = {
      ...this.options,
      ...options,
    };

    if (
      options.target ||
      options.throttleTime ||
      options.extraRate ||
      options.axis
    ) {
      this.setHandler();
    }
    return this.update();
  }

  dispose() {
    this.controller.dispose();
  }

  update(): VirtualizedState {
    const {target} = this.options;
    const {width, height} = virtualizedUtils.getRect(target);
    const {x, y} = virtualizedUtils.getScroll(target);
    return this.onScroll({
      x,
      y,
      width,
      height,
      isBottom: false,
      isLeading: false,
      isTop: false,
      isTrailing: false,
    });
  }

  private setHandler() {
    const {target, throttleTime, extraRate, axis} = this.options;

    this.controller.setOptions({
      target,
      throttleTime,
      throttleDistance: virtualizedUtils.getThrottleDistance(
        target,
        axis,
        extraRate,
      ),
      onScroll: this.onScroll,
    });
  }

  private onScroll({width, height, x, y}: ScrollState) {
    const {target, itemSize, itemCount, extraRate, axis}: VirtualizedOptions =
      this.options;
    const listSize = axis === 'x' ? width : height;
    const position = axis === 'x' ? x : y;
    const state = this.engine.compute({
      listSize,
      itemSize,
      itemCount,
      extraRate,
      position,
    });
    if (!isEqual(state, this.preState)) {
      this.preState = state;
      this.options.onChange(this.preState);
      this.controller.setOptions({
        throttleDistance: virtualizedUtils.getThrottleDistance(
          target,
          axis,
          extraRate,
        ),
      });
    }
    return this.preState;
  }
}

export {Virtualized};
