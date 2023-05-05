import {
  HorizontalVirtualizedOptions,
  HorizontalVirtualizedState,
  VerticalVirtualizedOptions,
  VerticalVirtualizedState,
} from './types';

class VirtualizedEngine {
  constructor() {
    this.compute = this.compute.bind(this);
    this.computeFixedVertical = this.computeFixedVertical.bind(this);
    this.computeVariableVertical = this.computeVariableVertical.bind(this);
    this.computeFixedHorizontal = this.computeFixedHorizontal.bind(this);
    this.computeVariableHorizontal = this.computeVariableHorizontal.bind(this);
  }

  compute(options: VerticalVirtualizedOptions): VerticalVirtualizedState;
  compute(options: HorizontalVirtualizedOptions): HorizontalVirtualizedState;

  compute(
    options: VerticalVirtualizedOptions | HorizontalVirtualizedOptions,
  ): VerticalVirtualizedState | HorizontalVirtualizedState {
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
    const leadingSize = Math.max(position - extraSize, 0);
    const trailingSize = Math.min(position + listSize + extraSize, scrollSize);
    const offset = Math.floor(leadingSize / itemSize);
    const limit = Math.ceil(trailingSize / itemSize) - offset;
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
    const leadingSize = position - extraSize;
    const trailingSize = position + listSize + extraSize;
    result.scrollSize = itemSizes.reduce((sum, itemSize) => {
      const itemTop = sum;
      const itemBottom = sum + itemSize;
      if (itemBottom < leadingSize) {
        result.offset++;
        result.leading += itemSize;
      } else if (itemTop <= trailingSize) {
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
