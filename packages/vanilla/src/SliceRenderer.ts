import {SliceRendererOptions} from './types';

class SliceRenderer<T> {
  private items: T[] = [];
  private cache = {
    render: new Map<number, Element>(),
    current: new Map<number, Element>(),
    offset: 0,
  };

  constructor(private options: SliceRendererOptions<T>) {
    this.setItem = this.setItem.bind(this);
    this.render = this.render.bind(this);
    this.clear = this.clear.bind(this);
  }

  setItem(items: T[]) {
    this.items = items;
    this.clear();
  }

  render(offset: number, limit: number) {
    const {items, cache} = this;
    const {parent} = this.options;
    if (cache.current.size === 0) {
      this.emptyParent();
    }
    const sliceItems = items.slice(offset, offset + limit);
    const newCurrent = new Map<number, Element>();
    const prependElements: Element[] = [];
    const appendElements: Element[] = [];
    sliceItems.forEach((item, sliceIndex) => {
      const index = offset + sliceIndex;
      let element = cache.current.get(index);
      if (element) {
        newCurrent.set(index, element);
        cache.current.delete(index);
      } else {
        element = this.getElement(item, index);
        newCurrent.set(index, element);
        if (index < cache.offset) {
          prependElements.push(element);
        } else {
          appendElements.push(element);
        }
      }
    });
    cache.current.forEach((element) => {
      parent.removeChild(element);
    });
    parent.prepend(...prependElements);
    parent.append(...appendElements);
    cache.current = newCurrent;
    cache.offset = offset;
  }

  clear() {
    const {cache} = this;
    cache.current.clear();
    cache.render.clear();
    cache.offset = 0;
  }

  private getElement(item: T, index: number) {
    const {items, cache} = this;
    const {renderer} = this.options;
    let element = cache.render.get(index);
    if (!element) {
      element = renderer(item, index, items);
      cache.render.set(index, element);
    }
    return element;
  }

  private emptyParent() {
    const {parent} = this.options;
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
}

export {SliceRenderer};
