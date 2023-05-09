<script setup lang="ts">
import {ref} from 'vue';

const items = ref(
  new Array(100)
    .fill(0)
    .map((_, index) => ({name: `Item ${index + 1}`, index})),
);
</script>

<template>
  <div class="scroller">
    <div class="wrapper">
      <ul class="list">
        <li v-for="item in items" :key="item.index">
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
