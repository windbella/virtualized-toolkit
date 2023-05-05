import {ScrollOptions, ScrollState} from './types';
import throttle from 'lodash.throttle';
import {getElement, getMaxScroll, getRect, getScroll} from './utils';

const defaultScrollOptions: ScrollOptions = {
  target: window,
  onScroll: () => {
    // ignore
  },
  throttleTime: 0,
  throttleDistance: 0,
};

class ScrollController {
  private bindKey?: object = undefined;
  private target?: HTMLElement | Window;
  private handler?: (event: Event) => void;
  private options: ScrollOptions = defaultScrollOptions;
  private preState?: ScrollState;

  constructor() {
    this.bind = this.bind.bind(this);
    this.clean = this.clean.bind(this);
  }

  bind(options: Partial<ScrollOptions>) {
    this.clean();
    this.options = {
      ...defaultScrollOptions,
      ...options,
    };
    const bindKey = {};
    this.bindKey = bindKey;
    this.target = this.options.target;
    this.setHandler();
    this.preState = undefined;
    if (this.handler) {
      this.target.addEventListener('scroll', this.handler, {passive: true});
    }
  }

  clean() {
    if (this.target && this.handler) {
      this.target.removeEventListener('scroll', this.handler);
    }
    this.bindKey = undefined;
    this.target = undefined;
    this.handler = undefined;
    this.preState = undefined;
  }

  setOptions(options: Partial<Omit<ScrollOptions, 'target'>>) {
    this.options = {
      ...this.options,
      ...options,
    };
    if (options.onScroll || options.throttleTime) {
      this.setHandler();
    }
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
    if (!this.target) {
      return state;
    }
    const {x, y} = getScroll(this.target);
    const {width, height} = getRect(this.target);
    const {maxX, maxY} = getMaxScroll(this.target);
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

  private setHandler() {
    const {throttleTime} = this.options;
    const bindKey = this.bindKey;
    this.handler = () => {
      if (bindKey !== this.bindKey) {
        return;
      }
      const {throttleDistance, onScroll} = this.options;
      const state = this.compute();
      if (
        this.options.throttleDistance === 0 ||
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
  }
}

export {ScrollController};
