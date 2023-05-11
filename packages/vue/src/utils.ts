import {Ref, unref} from 'vue';

export const getEventTarget = (
  target: EventTarget | Ref<EventTarget | null | undefined>,
) => {
  return unref(target) ?? undefined;
};
