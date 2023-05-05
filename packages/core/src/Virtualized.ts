import isEqual from 'lodash.isequal';
import {ScrollController} from './ScrollController';
import {VirtualizedEngine} from './VirtualizedEngine';
import {
  DefaultVirtualizedOptions,
  RequiredVirtualizedOptions,
  ScrollState,
  VirtualizedOptions,
  VirtualizedState,
} from './types';
import {getRect, getScroll, getThrottleDistance} from './utils';

const defaultOptions: DefaultVirtualizedOptions = {
  extraRate: 1,
  throttleTime: 150,
};

class Virtualized {
  private controller = new ScrollController();
  private engine = new VirtualizedEngine();
  private options: RequiredVirtualizedOptions = {
    target: window,
    itemSize: 0,
    itemCount: 0,
    onChange: () => {
      // ignore
    },
    ...defaultOptions,
  };
  private preState?: VirtualizedState = undefined;
  private handleScroll: (size: number, position: number) => void = () => {
    // ignore
  };

  constructor() {
    this.bind = this.bind.bind(this);
    this.clean = this.clean.bind(this);
  }

  bind(options: VirtualizedOptions) {
    this.options = {
      ...defaultOptions,
      ...options,
    };
    const {
      target,
      itemSize,
      itemCount,
      extraRate,
      throttleTime,
      axis = 'y',
    }: RequiredVirtualizedOptions = this.options;
    let onScroll;
    if (options.axis === 'x') {
      this.handleScroll = (width: number, x: number) => {
        const state = this.engine.compute({
          width,
          itemSize,
          itemCount,
          extraRate,
          x,
        });
        this.controller.setOptions({
          throttleDistance: getThrottleDistance(target, axis, extraRate),
        });
        if (!isEqual(state, this.preState)) {
          options.onChange(state);
          this.preState = state;
        }
      };
      onScroll = ({width, x}: ScrollState) => {
        this.handleScroll(width, x);
      };
    } else {
      this.handleScroll = (height: number, y: number) => {
        const state = this.engine.compute({
          height,
          itemSize,
          itemCount,
          extraRate,
          y,
        });
        this.controller.setOptions({
          throttleDistance: getThrottleDistance(target, axis, extraRate),
        });
        if (!isEqual(state, this.preState)) {
          options.onChange(state);
          this.preState = state;
        }
      };
      onScroll = ({height, y}: ScrollState) => {
        this.handleScroll(height, y);
      };
    }
    this.controller.bind({
      target,
      throttleTime,
      throttleDistance: getThrottleDistance(target, axis, extraRate),
      onScroll,
    });
    this.update();
  }

  clean() {
    this.controller.clean();
    this.preState = undefined;
  }

  update() {
    const {target, axis} = this.options;
    const {width, height} = getRect(target);
    const {x, y} = getScroll(target);
    if (axis === 'x') {
      this.handleScroll(width, x);
    } else {
      this.handleScroll(height, y);
    }
  }
}

export {Virtualized};
