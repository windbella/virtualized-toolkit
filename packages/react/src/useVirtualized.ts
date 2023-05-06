import {useMemo, useRef, useState} from 'react';
import {Virtualized, VirtualizedState} from '@virtualized-toolkit/core';
import {UseVirtualizedOptions} from './types';

export function useVirtualized(
  options: UseVirtualizedOptions,
): VirtualizedState {
  const {target, itemCount, itemSize, extraRate, throttleTime, axis} = options;
  const [state, setState] = useState<VirtualizedState>({
    offset: 0,
    limit: 0,
    leading: 0,
    trailing: 0,
    scrollSize: 0,
  });
  const virtualizedRef = useRef<Virtualized>(
    new Virtualized({
      target,
      itemCount,
      itemSize,
      extraRate,
      throttleTime,
      axis,
      onChange(state) {
        setState(state);
      },
    }),
  );
  const prevVirtualizedOptionsRef = useRef<UseVirtualizedOptions>({
    target,
    itemCount,
    itemSize,
    extraRate,
    throttleTime,
    axis,
  });

  const scrollSize = useMemo(() => {
    const prevOptions = prevVirtualizedOptionsRef.current;
    const virtualizedOptions: {[key: string]: unknown} = {};
    Object.keys(options).forEach((keyString) => {
      const key = keyString as keyof UseVirtualizedOptions;
      if (options[key] !== prevOptions[key]) {
        virtualizedOptions[key] = options[key];
      }
    });
    const {scrollSize} = virtualizedRef.current.setOptions(virtualizedOptions);
    prevVirtualizedOptionsRef.current = options;
    return scrollSize;
  }, [target, itemCount, itemSize, extraRate, throttleTime, axis]);

  return {
    ...state,
    scrollSize,
  };
}
