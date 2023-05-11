import {useEffect, useMemo, useRef, useState} from 'react';
import {
  ScrollController,
  VirtualizedEngine,
  VirtualizedState,
  virtualizedUtils,
} from '@virtualized-toolkit/core';
import {UseVirtualizedOptions} from './types';
import {getEventTarget} from './utils';
import isEqual from 'lodash.isequal';

export function useVirtualized({
  target,
  itemCount,
  itemSize,
  extraRate = 1,
  throttleTime = 150,
  axis = 'y',
}: Omit<UseVirtualizedOptions, 'extraRate' | 'throttleTime' | 'axis'> &
  Partial<UseVirtualizedOptions>): VirtualizedState {
  const [scrollSignal, setScrollSignal] = useState({});
  const prevStateRef = useRef<VirtualizedState>(
    null as unknown as VirtualizedState,
  );

  const {engine, controller} = useMemo(
    () => ({
      engine: new VirtualizedEngine(),
      controller: new ScrollController({
        target: getEventTarget(target),
        onScroll() {
          setScrollSignal({});
        },
      }),
    }),
    [],
  );

  const state = useMemo(() => {
    const eventTarget = getEventTarget(target);
    const listSize = virtualizedUtils.getListSize(eventTarget, axis);
    const position = virtualizedUtils.getPosition(eventTarget, axis);
    const newState = engine.compute({
      listSize,
      itemCount,
      itemSize,
      extraRate,
      position,
    });
    if (!isEqual(newState, prevStateRef.current)) {
      prevStateRef.current = newState;
      const throttleDistance = virtualizedUtils.getThrottleDistance(
        eventTarget,
        axis,
        extraRate,
      );
      controller.setOptions({throttleDistance});
    }
    return prevStateRef.current;
  }, [
    scrollSignal,
    target,
    itemCount,
    itemSize,
    extraRate,
    throttleTime,
    axis,
  ]);

  useEffect(() => {
    const {target: prevEventTarget, throttleTime: prevThrottleTime} =
      controller.getOptions();
    const eventTarget = getEventTarget(target);
    if (
      !isEqual(
        {target: eventTarget, throttleTime},
        {target: prevEventTarget, throttleTime: prevThrottleTime},
      )
    ) {
      controller.setOptions({
        target: eventTarget,
        throttleTime,
      });
      setScrollSignal({});
    }
  });

  useEffect(() => {
    return () => {
      controller.dispose();
    };
  }, []);

  return state;
}
