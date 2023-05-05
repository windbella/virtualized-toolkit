import {
  HorizontalVirtualizedEngineOptions,
  HorizontalVirtualizedState,
  VerticalVirtualizedEngineOptions,
  VerticalVirtualizedState,
  VirtualizedEngineOptions,
  VirtualizedState,
} from './types';

class VirtualizedEngine {
  constructor() {
    this.compute = this.compute.bind(this);
  }

  compute(options: VerticalVirtualizedEngineOptions): VerticalVirtualizedState;
  compute(
    options: HorizontalVirtualizedEngineOptions,
  ): HorizontalVirtualizedState;

  compute(options: VirtualizedEngineOptions): VirtualizedState {
    if ('height' in options) {
      const {height, itemSize, itemCount, extraRate, y} = options;
      if (Array.isArray(itemSize)) {
        return this.computeVariableVertical(height, itemSize, extraRate, y);
      } else {
        return this.computeFixedVertical(
          height,
          itemSize,
          itemCount,
          extraRate,
          y,
        );
      }
    } else {
      const {width, itemSize, itemCount, extraRate, x} = options;
      if (Array.isArray(itemSize)) {
        return this.computeVariableHorizontal(width, itemSize, extraRate, x);
      } else {
        return this.computeFixedHorizontal(
          width,
          itemSize,
          itemCount,
          extraRate,
          x,
        );
      }
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

  private computeFixedVertical(
    height: number,
    itemSize: number,
    itemCount: number,
    extraRate: number,
    y: number,
  ): VerticalVirtualizedState {
    const {offset, limit, leading, trailing, scrollSize} = this.computeFixed(
      height,
      itemSize,
      itemCount,
      extraRate,
      y,
    );
    return {
      offset,
      limit,
      top: leading,
      bottom: trailing,
      scrollHeight: scrollSize,
    };
  }

  private computeVariableVertical(
    height: number,
    itemSizes: number[],
    extraRate: number,
    y: number,
  ): VerticalVirtualizedState {
    const {offset, limit, leading, trailing, scrollSize} = this.computeVariable(
      height,
      itemSizes,
      extraRate,
      y,
    );
    return {
      offset,
      limit,
      top: leading,
      bottom: trailing,
      scrollHeight: scrollSize,
    };
  }

  private computeFixedHorizontal(
    width: number,
    itemSize: number,
    itemCount: number,
    extraRate: number,
    x: number,
  ): HorizontalVirtualizedState {
    const {offset, limit, leading, trailing, scrollSize} = this.computeFixed(
      width,
      itemSize,
      itemCount,
      extraRate,
      x,
    );
    return {
      offset,
      limit,
      left: leading,
      right: trailing,
      scrollWidth: scrollSize,
    };
  }

  private computeVariableHorizontal(
    width: number,
    itemSizes: number[],
    extraRate: number,
    x: number,
  ): HorizontalVirtualizedState {
    const {offset, limit, leading, trailing, scrollSize} = this.computeVariable(
      width,
      itemSizes,
      extraRate,
      x,
    );
    return {
      offset,
      limit,
      left: leading,
      right: trailing,
      scrollWidth: scrollSize,
    };
  }
}

export {VirtualizedEngine};
