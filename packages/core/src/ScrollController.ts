import {ScrollOptions, ScrollState} from './types';
import throttle from 'lodash.throttle';
import {getMaxScroll, getRect, getScroll} from './utils';
import merge from 'lodash.merge';

const nullElement = document.createElement('div');

const defaultScrollOptions: ScrollOptions = {
  target: nullElement,
  onScroll: () => {
    // ignore
  },
  throttleTime: 0,
  throttleDistance: 0,
};

class ScrollController {
  private bindKey?: object = undefined;
  private handler?: (event: Event) => void;
  private options: ScrollOptions = defaultScrollOptions;
  private preState?: ScrollState;

  constructor(options: Partial<ScrollOptions>) {
    this.getOptions = this.getOptions.bind(this);
    this.setOptions = this.setOptions.bind(this);
    this.getScrollState = this.getScrollState.bind(this);
    this.dispose = this.dispose.bind(this);
    this.setOptions(options);
  }

  getOptions(): ScrollOptions {
    return this.options;
  }

  setOptions(options: Partial<ScrollOptions>) {
    const needsSetHandler =
      options.target !== undefined ||
      options.onScroll !== undefined ||
      options.throttleTime !== undefined;
    if (needsSetHandler) {
      this.clearHandler();
    }
    this.options = merge(this.options, options);
    if (needsSetHandler) {
      this.setHandler();
    }
  }

  getScrollState(): ScrollState {
    return this.compute();
  }

  dispose() {
    this.clearHandler();
    this.bindKey = undefined;
  }

  private compute(): ScrollState {
    const state = {
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      isTop: false,
      isBottom: false,
      isLeading: false,
      isTrailing: false,
    };
    const {target} = this.options;
    const {x, y} = getScroll(target);
    const {width, height} = getRect(target);
    const {maxX, maxY} = getMaxScroll(target);
    state.x = x;
    state.y = y;
    state.width = width;
    state.height = height;
    state.isLeading = state.x <= 0;
    state.isTrailing = Math.abs(maxX - state.x) < 1;
    state.isTop = state.y <= 0;
    state.isBottom = Math.abs(maxY - state.y) < 1;
    return state;
  }

  private clearHandler() {
    const {target} = this.options;
    if (target && this.handler) {
      target.removeEventListener('scroll', this.handler);
    }
  }

  private setHandler() {
    const {target, throttleTime} = this.options;
    const bindKey = this.bindKey;
    this.handler = () => {
      if (bindKey !== this.bindKey) {
        return;
      }
      const {throttleDistance, onScroll} = this.options;
      const state = this.compute();
      if (
        throttleDistance === 0 ||
        this.preState === undefined ||
        Math.abs(this.preState.y - state.y) > throttleDistance ||
        Math.abs(this.preState.x - state.x) > throttleDistance
      ) {
        onScroll(state);
        this.preState = state;
      }
    };
    if (throttleTime > 0) {
      this.handler = throttle(this.handler, throttleTime, {
        leading: true,
        trailing: true,
      });
    }
    if (this.handler) {
      target.addEventListener('scroll', this.handler, {passive: true});
    }
  }
}

export {ScrollController};
