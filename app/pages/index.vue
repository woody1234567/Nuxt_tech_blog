<script setup lang="ts">
const { data: page } = await useAsyncData('home', () => {
  return queryCollection('content').path('/').first()
})

useSeoMeta({
  title: page.value?.hero?.name || 'Woody\'s Tech Blog',
  description: page.value?.hero?.text || 'A place to share my learning notes'
})

const heroImage = '/assets/images/Triceratops/Visualization/讀書.png'
</script>

<template>
  <div>
    <section class="relative py-20 overflow-hidden">
      <div class="absolute inset-0 bg-primary-50/50 dark:bg-primary-950/20 -z-10" />
      
      <UContainer class="flex flex-col md:flex-row items-center gap-12">
        <div class="flex-1 text-center md:text-left z-10">
          <h1 class="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-indigo-600">
            {{ page?.hero?.name || "Woody's Tech Blog" }}
          </h1>
          <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 font-light">
            {{ page?.hero?.text || "Keep close to the tech wave" }}
          </p>
          
          <div class="flex flex-wrap gap-4 justify-center md:justify-start">
            <UButton 
              v-for="action in page?.hero?.actions || []" 
              :key="action.link"
              :to="action.link"
              size="xl"
              :color="action.theme === 'brand' ? 'primary' : 'gray'"
              :variant="action.theme === 'brand' ? 'solid' : 'outline'"
            >
              {{ action.text }}
            </UButton>
          </div>
        </div>
        
        <div class="flex-1 flex justify-center relative">
          <div class="absolute -inset-4 bg-primary-500/20 blur-3xl rounded-full" />
          <img 
            src="~/assets/images/Triceratops/Visualization/讀書.png" 
            alt="Studying Triceratops" 
            class="relative w-full max-w-md hover:scale-105 transition-transform duration-500"
          />
        </div>
      </UContainer>
    </section>

    <UContainer class="py-20">
      <div class="grid md:grid-cols-3 gap-8">
        <UCard 
          v-for="(feature, index) in page?.features || []" 
          :key="index"
          class="hover:shadow-lg transition-shadow border-t-4 border-t-primary-500"
        >
          <div class="flex items-center gap-3 mb-4">
            <img src="~/assets/images/Triceratops/Icon/curious-right.png" class="w-8 h-8 opacity-80" />
            <h3 class="text-xl font-bold">{{ feature.title }}</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ feature.details }}
          </p>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>
