import {
  ScrollController,
  ScrollState,
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
  const engine = new VirtualizedEngine();
  const controller = new ScrollController({
    target: getEventTarget(target),
    throttleTime: unref(throttleTime),
    onScroll(state) {
      scrollState.value = state;
    },
  });
  const scrollState = ref<ScrollState>(controller.getScrollState());
  const curStateRef: {current: VirtualizedState} = {
    current: null as unknown as VirtualizedState,
  };

  const state = computed<VirtualizedState>(() => {
    const listSize = virtualizedUtils.getListSize(
      scrollState.value,
      unref(axis),
    );
    const position = virtualizedUtils.getPosition(
      scrollState.value,
      unref(axis),
    );
    const newState = engine.compute({
      listSize,
      itemCount: unref(itemCount),
      itemSize: unref(itemSize),
      extraRate: unref(extraRate),
      position,
    });
    if (!isEqual(curStateRef.current, newState)) {
      curStateRef.current = newState;
      const throttleDistance = virtualizedUtils.getThrottleDistance(
        scrollState.value,
        unref(axis),
        unref(extraRate),
      );
      controller.setOptions({throttleDistance});
    }
    return curStateRef.current;
  });

  watch(
    () =>
      [getEventTarget(target), unref(throttleTime)] as [EventTarget, number],
    ([target, throttleTime]) => {
      controller.setOptions({
        target,
        throttleTime,
      });
      scrollState.value = controller.getScrollState();
    },
  );

  onUnmounted(() => {
    controller.dispose();
  });

  return state;
}
