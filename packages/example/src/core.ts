import {
  Virtualized,
  VirtualizedChangeEventHandler,
} from '@virtualized-toolkit/core';

const scroller = document.querySelector('.scroller') as HTMLElement;
const wrapper = document.querySelector('.wrapper') as HTMLElement;
const list = document.querySelector('.list') as HTMLElement;
const cache: {
  items: {[key: number]: HTMLElement};
  prevItems: {[key: number]: HTMLElement};
  offset: number;
} = {
  items: {},
  prevItems: {},
  offset: 0,
};
const items = new Array(100)
  .fill(0)
  .map((_, index) => ({name: `Item ${index + 1}`, index}));
const onChange: VirtualizedChangeEventHandler = (state) => {
  const {offset, limit, leading, scrollSize} = state;
  const sliceItems = items.slice(offset, offset + limit);
  const prevItems: {[key: number]: HTMLElement} = {};
  const prependItems: HTMLElement[] = [];
  const appendItems: HTMLElement[] = [];
  sliceItems.forEach(({name, index}) => {
    let li;
    if (cache.items[index]) {
      li = cache.items[index];
    } else {
      li = document.createElement('li');
      li.innerHTML = `${name}`;
      cache.items[index] = li;
    }
    if (cache.prevItems[index]) {
      delete cache.prevItems[index];
    } else if (index < cache.offset) {
      prependItems.push(li);
    } else {
      appendItems.push(li);
    }
    prevItems[index] = li;
  });
  list.prepend(...prependItems);
  list.append(...appendItems);
  Object.keys(cache.prevItems).forEach((index) => {
    list.removeChild(cache.prevItems[index as unknown as number]);
  });
  cache.prevItems = prevItems;
  cache.offset = offset;
  wrapper.style.height = `${scrollSize}px`;
  list.style.transform = `translate(0, ${leading}px)`;
};
new Virtualized({
  target: scroller,
  itemSize: 30,
  itemCount: 100,
  onChange,
});
