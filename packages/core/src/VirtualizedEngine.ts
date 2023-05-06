import {VirtualizedEngineOptions, VirtualizedState} from './types';

class VirtualizedEngine {
  constructor() {
    this.compute = this.compute.bind(this);
  }

  compute({
    listSize,
    itemSize,
    itemCount,
    extraRate,
    position,
  }: VirtualizedEngineOptions): VirtualizedState {
    if (Array.isArray(itemSize)) {
      return this.computeVariable(listSize, itemSize, extraRate, position);
    } else {
      return this.computeFixed(
        listSize,
        itemSize,
        itemCount,
        extraRate,
        position,
      );
    }
  }

  private computeFixed(
    listSize: number,
    itemSize: number,
    itemCount: number,
    extraRate: number,
    position: number,
  ) {
    const scrollSize = itemSize * itemCount;
    const extraSize = listSize * extraRate;
    const leadingPosition = Math.max(position - extraSize, 0);
    const trailingPosition = Math.min(
      position + listSize + extraSize,
      scrollSize,
    );
    const offset = Math.floor(leadingPosition / itemSize);
    const limit = Math.ceil(trailingPosition / itemSize) - offset;
    const leading = offset * itemSize;
    const trailing = Math.max(0, itemCount - (offset + limit)) * itemSize;
    return {offset, limit, leading, trailing, scrollSize};
  }

  private computeVariable(
    listSize: number,
    itemSizes: number[],
    extraRate: number,
    position: number,
  ) {
    const result = {
      offset: 0,
      limit: 0,
      leading: 0,
      trailing: 0,
      scrollSize: 0,
    };
    const extraSize = listSize * extraRate;
    const leadingPosition = position - extraSize;
    const trailingPosition = position + listSize + extraSize;
    result.scrollSize = itemSizes.reduce((sum, itemSize) => {
      const itemLeading = sum;
      const itemTrailing = sum + itemSize;
      if (itemLeading < leadingPosition) {
        result.offset++;
        result.leading += itemSize;
      } else if (itemTrailing <= trailingPosition) {
        result.limit++;
      } else {
        result.trailing += itemSize;
      }
      return sum + itemSize;
    }, 0);
    return result;
  }
}

export {VirtualizedEngine};
