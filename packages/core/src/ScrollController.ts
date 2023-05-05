import {ScrollOptions, ScrollState} from './types';
import throttle from 'lodash.throttle';

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
  private preState?: ScrollState;

  constructor() {
    this.bind = this.bind.bind(this);
    this.clean = this.clean.bind(this);
    this.compute = this.compute.bind(this);
  }

  bind(options: Partial<ScrollOptions>) {
    this.clean();
    const {target, onScroll, throttleTime, throttleDistance} = {
      ...defaultScrollOptions,
      ...options,
    };
    const bindKey = {};
    this.bindKey = bindKey;
    this.target = target;
    this.handler = () => {
      if (bindKey !== this.bindKey) {
        return;
      }
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
    this.preState = undefined;
    if (this.handler) {
      this.target.addEventListener('scroll', this.handler);
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

  private compute(): ScrollState {
    const state = {
      x: 0,
      y: 0,
      isTop: false,
      isBottom: false,
      isLeading: false,
      isTrailing: false,
    };
    let target: HTMLElement;
    if (this.target === window) {
      target = document.documentElement || document.body;
      state.x = window.scrollX ?? 0;
      state.y = window.scrollX ?? 0;
    } else {
      target = this.target as HTMLElement;
      state.x = target.scrollLeft ?? 0;
      state.y = target.scrollTop ?? 0;
    }
    const maxX = target.scrollWidth - target.clientWidth;
    const maxY = target.scrollHeight - target.clientHeight;
    state.isLeading = state.x <= 0;
    state.isTrailing = Math.abs(maxX - state.x) < 1;
    state.isTop = state.y <= 0;
    state.isBottom = Math.abs(maxY - state.y) < 1;
    return state;
  }
}

export {ScrollController};
