import {
  ScrollController,
  VirtualizedEngine,
  VirtualizedState,
  virtualizedUtils,
} from '@virtualized-toolkit/core';
import isEqual from 'lodash.isequal';
import {ref, onUnmounted, computed, ComputedRef, unref, watch} from 'vue';
import {UseVirtualizedOptions} from './types';
import {getEventTarget} from './utils';

export function useVirtualized({
  target,
  itemCount,
  itemSize,
  extraRate = 1,
  throttleTime = 150,
  axis = 'y',
}: Omit<UseVirtualizedOptions, 'extraRate' | 'throttleTime' | 'axis'> &
  Partial<UseVirtualizedOptions>): ComputedRef<VirtualizedState> {
  const scrollSignal = ref({});
  const engine = new VirtualizedEngine();
  const controller = new ScrollController({
    target: getEventTarget(target),
    onScroll() {
      scrollSignal.value = {};
    },
  });
  const prevStateRef: {current: VirtualizedState | null} = {current: null};

  const state = computed<VirtualizedState>(() => {
    if (scrollSignal.value) {
      const eventTarget = getEventTarget(target);
      const listSize = virtualizedUtils.getListSize(eventTarget, unref(axis));
      const position = virtualizedUtils.getPosition(eventTarget, unref(axis));
      const newState = engine.compute({
        listSize,
        itemCount: unref(itemCount),
        itemSize: unref(itemSize),
        extraRate: unref(extraRate),
        position,
      });
      if (!isEqual(newState, prevStateRef.current)) {
        prevStateRef.current = newState;
        const throttleDistance = virtualizedUtils.getThrottleDistance(
          eventTarget,
          unref(axis),
          unref(extraRate),
        );
        controller.setOptions({throttleDistance});
      }
      return newState;
    }
    return null as unknown as VirtualizedState;
  });

  watch(
    () =>
      [getEventTarget(target), unref(throttleTime)] as [EventTarget, number],
    ([target, throttleTime]) => {
      controller.setOptions({
        target,
        throttleTime,
      });
    },
  );

  onUnmounted(() => {
    controller.dispose();
  });

  return state;
}
