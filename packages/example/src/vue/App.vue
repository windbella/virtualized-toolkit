<script setup lang="ts">
import {computed, reactive, ref} from 'vue';
import {useVirtualized} from '@virtualized-toolkit/vue';

const scroller = ref<EventTarget>();
const items = reactive(
  new Array(100)
    .fill(0)
    .map((_, index) => ({name: `Item ${index + 1}`, index})),
);
const itemCount = computed(() => items.length);

const state = useVirtualized({
  target: scroller,
  itemSize: 30,
  itemCount,
});

const slicedItems = computed(() =>
  items.slice(state.value.offset, state.value.offset + state.value.limit),
);
</script>

<template>
  <div class="scroller" ref="scroller">
    <div class="wrapper" :style="{height: `${state.scrollSize}px`}">
      <ul class="list" :style="{transform: `translate(0, ${state.leading}px)`}">
        <li v-for="item in slicedItems" :key="item.index">
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
