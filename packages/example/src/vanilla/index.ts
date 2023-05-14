import {
  SliceRenderer,
  Virtualized,
  VirtualizedChangeEventHandler,
} from '@virtualized-toolkit/vanilla';

const scroller = document.querySelector('.scroller') as HTMLElement;
const wrapper = document.querySelector('.wrapper') as HTMLElement;
const list = document.querySelector('.list') as HTMLElement;
const items = new Array(100)
  .fill(0)
  .map((_, index) => ({name: `Item ${index + 1}`}));
const sliceRenderer = new SliceRenderer<{name: string}>({
  parent: list,
  renderer: ({name}) => {
    const li = document.createElement('li');
    li.innerHTML = `${name}`;
    return li;
  },
});
sliceRenderer.setItem(items);
const onChange: VirtualizedChangeEventHandler = (state) => {
  const {offset, limit, leading, scrollSize} = state;
  sliceRenderer.render(offset, limit);
  wrapper.style.height = `${scrollSize}px`;
  list.style.transform = `translate(0, ${leading}px)`;
};
const virtualized = new Virtualized({
  target: scroller,
  itemSize: 30,
  itemCount: items.length,
  onChange,
});
virtualized.getState();
