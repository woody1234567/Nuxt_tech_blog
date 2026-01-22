<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('content').path(route.path).first()
})

useSeoMeta({
  title: page.value?.title || 'Nuxt Skills Blog',
  description: page.value?.description || 'Learn Nuxt skills with us!'
})
</script>

<template>
  <UContainer class="py-8">
    <div v-if="page">
      <div class="mb-8 flex items-center gap-4 border-b pb-4 border-gray-200 dark:border-gray-800">
        <img src="~/assets/images/Triceratops/Icon/happy-right.png" alt="Happy Triceratops" class="w-16 h-16" />
        <div>
          <h1 class="text-4xl font-bold text-primary-500 mb-2">{{ page.title }}</h1>
          <p v-if="page.description" class="text-gray-500 dark:text-gray-400">{{ page.description }}</p>
        </div>
      </div>
      
      <article class="prose dark:prose-invert max-w-none">
        <ContentRenderer :value="page" />
      </article>
    </div>
    
    <div v-else class="text-center py-20 flex flex-col items-center">
      <img src="~/assets/images/Triceratops/Icon/confused-right.png" alt="Confused Triceratops" class="w-32 h-32 mb-6" />
      <h1 class="text-3xl font-bold mb-2">Page not found</h1>
      <p class="text-gray-500 mb-6">The triceratops couldn't find what you were looking for.</p>
      <UButton to="/" color="primary" variant="solid">Go Home</UButton>
    </div>
  </UContainer>
</template>
