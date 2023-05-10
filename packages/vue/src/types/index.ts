import {Ref} from 'vue';

interface UseVirtualizedOptions {
  target: EventTarget | Ref<EventTarget | null | undefined>;
  itemSize: number | number[] | Ref<number | number[]>;
  itemCount: number | Ref<number>;
  extraRate: number | Ref<number>;
  throttleTime: number | Ref<number>;
  axis: ('x' | 'y') | Ref<'x' | 'y'>;
}

export {UseVirtualizedOptions};
