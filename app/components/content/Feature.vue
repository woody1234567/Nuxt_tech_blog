<script setup lang="ts">
defineProps<{
  title?: string;
  description?: string;
  features?: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
}>();
</script>

<template>
  <section class="py-24 sm:py-32">
    <UContainer>
      <div class="mx-auto max-w-2xl text-center mb-16">
        <h2
          v-if="title"
          class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white"
        >
          {{ title }}
        </h2>
        <p
          v-if="description"
          class="mt-4 text-lg text-gray-600 dark:text-gray-300"
        >
          {{ description }}
        </p>
      </div>

      <div
        class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3"
      >
        <slot>
          <div
            v-for="feature in features"
            :key="feature.title"
            class="flex flex-col"
          >
            <dt
              class="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white"
            >
              <UIcon
                v-if="feature.icon"
                :name="feature.icon"
                class="h-5 w-5 flex-none text-primary-600"
                aria-hidden="true"
              />
              {{ feature.title }}
            </dt>
            <dd
              class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300"
            >
              <p class="flex-auto">{{ feature.description }}</p>
            </dd>
          </div>
        </slot>
      </div>
    </UContainer>
  </section>
</template>
