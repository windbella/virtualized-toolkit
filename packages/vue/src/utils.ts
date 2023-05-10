import {Ref, unref} from 'vue';

const nullElement = document.createElement('div');

export const getEventTarget = (
  target: EventTarget | Ref<EventTarget | null | undefined>,
) => {
  return unref(target) ?? nullElement;
};
