<script setup lang="ts">
import type { PropType } from "vue";

const props = defineProps({
  navigation: {
    type: Array as PropType<
      Array<{
        title: string;
        path: string;
        children?: any[];
      }>
    >,
    required: true,
  },
  currentPath: {
    type: String,
    required: true,
  },
});

// Function to determine if a link is active
const isActive = (path: string) => props.currentPath === path;
</script>

<template>
  <nav class="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pr-4">
    <div v-for="group in navigation" :key="group.path" class="mb-8">
      <h3
        v-if="group.title"
        class="font-bold text-gray-900 dark:text-gray-100 mb-3 text-sm uppercase tracking-wide"
      >
        {{ group.title }}
      </h3>

      <ul class="space-y-1">
        <li v-for="link in group.children" :key="link.path">
          <NuxtLink
            :to="link.path"
            class="block px-3 py-2 rounded-md text-sm transition-colors"
            :class="[
              isActive(link.path)
                ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 font-medium'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200',
            ]"
          >
            {{ link.title }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>
