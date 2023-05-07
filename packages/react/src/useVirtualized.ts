import {useEffect, useMemo, useRef, useState} from 'react';
import {Virtualized, VirtualizedState} from '@virtualized-toolkit/core';
import {UseVirtualizedOptions} from './types';
import {convertOptions, diffOptions, getEventTarget, isRef} from './utils';

export function useVirtualized(
  options: Omit<UseVirtualizedOptions, 'extraRate' | 'throttleTime' | 'axis'> &
    Partial<UseVirtualizedOptions>,
): VirtualizedState {
  const {target, itemCount, itemSize, extraRate, throttleTime, axis} = options;
  const [state, setState] = useState<VirtualizedState>({
    offset: 0,
    limit: 0,
    leading: 0,
    trailing: 0,
    scrollSize: 0,
  });
  const prevVirtualizedOptionsRef = useRef<Partial<UseVirtualizedOptions>>({});
  const virtualizedRef = useRef<Virtualized>({} as Virtualized);
  const prevScrollSizeRef = useRef(0);

  useMemo(() => {
    virtualizedRef.current = new Virtualized({
      ...convertOptions(options),
      onChange(state) {
        setState(state);
      },
    });
  }, []);

  const scrollSize = useMemo(() => {
    const prevOptions = prevVirtualizedOptionsRef.current;
    const newOptions = diffOptions(prevOptions, options);
    if (newOptions.target && isRef(newOptions.target)) {
      delete newOptions.target;
    }
    if (Object.keys(newOptions).length > 0) {
      const {scrollSize} = virtualizedRef.current.setOptions(
        convertOptions(newOptions),
      );
      prevVirtualizedOptionsRef.current = options;
      prevScrollSizeRef.current = scrollSize;
    }
    return prevScrollSizeRef.current;
  }, [target, itemCount, itemSize, extraRate, throttleTime, axis]);

  useEffect(() => {
    if (isRef(target)) {
      virtualizedRef.current.setOptions({target: getEventTarget(target)});
    }
  }, [target]);

  return {
    ...state,
    scrollSize,
  };
}
