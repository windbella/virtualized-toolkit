import isEqual from 'lodash.isequal';
import {ScrollController} from './ScrollController';
import {VirtualizedEngine} from './VirtualizedEngine';
import {ScrollState, VirtualizedOptions, VirtualizedState} from './types';
import {getRect, getScroll, getThrottleDistance} from './utils';

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
  private preState?: VirtualizedState = undefined;

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
      options.axis ||
      options.extraRate
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
    const {width, height} = getRect(target);
    const {x, y} = getScroll(target);
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
      throttleDistance: getThrottleDistance(target, axis, extraRate),
      onScroll: this.onScroll,
    });
  }

  private onScroll({width, height, x, y}: ScrollState) {
    const {axis} = this.options;
    if (axis === 'x') {
      return this.handleScroll(width, x);
    } else {
      return this.handleScroll(height, y);
    }
  }

  private handleScroll(listSize: number, position: number) {
    const {target, itemSize, itemCount, extraRate, axis}: VirtualizedOptions =
      this.options;
    const state = this.engine.compute({
      listSize,
      itemSize,
      itemCount,
      extraRate,
      position,
    });
    this.controller.setOptions({
      throttleDistance: getThrottleDistance(target, axis, extraRate),
    });
    if (!isEqual(state, this.preState)) {
      this.options.onChange(state);
      this.preState = state;
    }
    return state;
  }
}

export {Virtualized};
