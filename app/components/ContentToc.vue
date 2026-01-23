<script setup lang="ts">
defineProps<{
  links: Array<{
    id: string;
    text: string;
    depth: number;
    children?: Array<{
      id: string;
      text: string;
      depth: number;
    }>;
  }>;
}>();
</script>

<template>
  <nav class="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
    <h3
      class="font-bold text-gray-900 dark:text-gray-100 mb-4 text-sm uppercase tracking-wide"
    >
      On this page
    </h3>
    <ul class="space-y-2 text-sm">
      <li v-for="link in links" :key="link.id">
        <a
          :href="`#${link.id}`"
          class="block text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors truncate"
          :class="{ 'pl-4': link.depth === 3 }"
        >
          {{ link.text }}
        </a>
        <ul v-if="link.children" class="mt-2 space-y-2">
          <li v-for="child in link.children" :key="child.id">
            <a
              :href="`#${child.id}`"
              class="block pl-4 text-gray-500 dark:text-gray-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors truncate"
            >
              {{ child.text }}
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>
