<script setup lang="ts">
defineProps<{
  title?: string;
  description?: string;
  links?: Array<{
    label: string;
    to: string;
    icon?: string;
    color?: string;
    variant?: string;
  }>;
}>();
</script>

<template>
  <section class="py-24 sm:py-32">
    <UContainer>
      <div class="mx-auto max-w-2xl text-center">
        <h1
          v-if="title || $slots.title"
          class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white"
        >
          <slot name="title">{{ title }}</slot>
        </h1>
        <p
          v-if="description || $slots.description"
          class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300"
        >
          <slot name="description">{{ description }}</slot>
        </p>
        <div
          v-if="links || $slots.links"
          class="mt-10 flex items-center justify-center gap-x-6"
        >
          <slot name="links">
            <UButton
              v-for="link in links"
              :key="link.to"
              v-bind="link"
              :to="link.to"
            />
          </slot>
        </div>
        <slot />
      </div>
    </UContainer>
  </section>
</template>
