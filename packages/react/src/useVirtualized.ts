import {useEffect, useMemo, useRef, useState} from 'react';
import {
  ScrollController,
  VirtualizedEngine,
  VirtualizedState,
  virtualizedUtils,
} from '@virtualized-toolkit/core';
import {UseVirtualizedOptions} from './types';
import {getEventTarget, isRef} from './utils';
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
  const engineRef = useRef<VirtualizedEngine>(
    null as unknown as VirtualizedEngine,
  );
  const controller = useRef<ScrollController>(
    null as unknown as ScrollController,
  );
  const prevStateRef = useRef<VirtualizedState>(
    null as unknown as VirtualizedState,
  );

  useMemo(() => {
    if (!engineRef.current) {
      engineRef.current = new VirtualizedEngine();
    }

    if (!controller.current) {
      controller.current = new ScrollController({
        target: getEventTarget(target),
        throttleTime: throttleTime,
        onScroll() {
          setScrollSignal({});
        },
      });
    } else {
      if (!isRef(target)) {
        controller.current.setOptions({
          target: getEventTarget(target),
          throttleTime,
        });
      }
    }
  }, [target, throttleTime]);

  const state = useMemo(() => {
    const eventTarget = getEventTarget(target);
    const listSize = virtualizedUtils.getListSize(eventTarget, axis);
    const position = virtualizedUtils.getPosition(eventTarget, axis);
    const newState = engineRef.current.compute({
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
      controller.current.setOptions({throttleDistance});
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
    if (isRef(target)) {
      controller.current.setOptions({
        target: getEventTarget(target),
        throttleTime,
      });
      setScrollSignal({});
    }
  }, [target, throttleTime]);

  useEffect(() => {
    return () => {
      controller.current.dispose();
    };
  }, []);

  return state;
}
