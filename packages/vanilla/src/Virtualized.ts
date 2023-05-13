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
import merge from 'lodash.merge';

const defaultOptions: Omit<VirtualizedOptions, 'target'> = {
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
  private controller = new ScrollController({
    onScroll: this.onScroll.bind(this),
  });
  private engine = new VirtualizedEngine();
  private options: VirtualizedOptions = {
    target: this.controller.getOptions().target,
    ...defaultOptions,
  };

  private curState: VirtualizedState = null as unknown as VirtualizedState;

  constructor(options: Partial<VirtualizedOptions>) {
    this.setOptions = this.setOptions.bind(this);
    this.getState = this.getState.bind(this);
    this.update = this.update.bind(this);
    this.dispose = this.dispose.bind(this);
    this.setOptions(options);
  }

  setOptions(options: Partial<VirtualizedOptions>) {
    const needsSetController = options.target || options.throttleTime;
    this.options = merge(this.options, options);

    if (needsSetController) {
      this.setController();
    }
    this.update();
  }

  getState() {
    return this.curState;
  }

  update() {
    this.onScroll(this.controller.getScrollState());
  }

  dispose() {
    this.controller.dispose();
  }

  private setController() {
    const {target, throttleTime} = this.options;

    this.controller.setOptions({
      target,
      throttleTime,
    });
  }

  private onScroll(scrollState: ScrollState) {
    const {width, height, x, y} = scrollState;
    const {itemSize, itemCount, extraRate, axis}: VirtualizedOptions =
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
    if (!isEqual(this.curState, state)) {
      this.curState = state;
      this.options.onChange(this.curState);
      this.controller.setOptions({
        throttleDistance: virtualizedUtils.getThrottleDistance(
          scrollState,
          axis,
          extraRate,
        ),
      });
    }
    return this.curState;
  }
}

export {Virtualized};
