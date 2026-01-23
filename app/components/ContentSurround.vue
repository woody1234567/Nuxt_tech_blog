<script setup lang="ts">
import type { PropType } from "vue";

defineProps({
  prev: {
    type: Object as PropType<{
      title: string;
      path: string;
    } | null>,
    default: null,
  },
  next: {
    type: Object as PropType<{
      title: string;
      path: string;
    } | null>,
    default: null,
  },
});
</script>

<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 pt-8 border-t border-gray-200 dark:border-gray-800"
  >
    <NuxtLink
      v-if="prev"
      :to="prev.path"
      class="group flex flex-col p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
    >
      <span
        class="text-sm text-gray-500 dark:text-gray-400 mb-1 group-hover:text-primary-500"
        >Previous</span
      >
      <span class="font-medium text-primary-500">{{ prev.title }}</span>
    </NuxtLink>
    <div v-else class="hidden sm:block" />

    <NuxtLink
      v-if="next"
      :to="next.path"
      class="group flex flex-col items-end p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500 transition-colors text-right"
    >
      <span
        class="text-sm text-gray-500 dark:text-gray-400 mb-1 group-hover:text-primary-500"
        >Next</span
      >
      <span class="font-medium text-primary-500">{{ next.title }}</span>
    </NuxtLink>
  </div>
</template>
