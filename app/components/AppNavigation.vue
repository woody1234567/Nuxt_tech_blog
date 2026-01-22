<script setup lang="ts">
const links = [
  { label: 'Home', to: '/' },
  { label: 'AI', to: '/AI' },
  { label: 'Nuxt', to: '/Nuxt' },
  { label: 'Python', to: '/python' },
  { label: 'Web Dev', to: '/web_dev' }
]
</script>

<template>
  <header class="border-b border-gray-200 dark:border-gray-800 bg-white/75 dark:bg-gray-900/75 backdrop-blur sticky top-0 z-50">
    <UContainer class="flex items-center justify-between py-4">
      <NuxtLink to="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <img src="~/assets/images/Triceratops/Icon/logo-normal.png" alt="Nuxt Skills Logo" class="h-10 w-10 object-contain" />
        <span class="font-bold text-xl text-primary-500">Nuxt Skills</span>
      </NuxtLink>
      
      <nav class="flex gap-4">
        <UButton
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          variant="ghost"
          color="gray"
        >
          {{ link.label }}
        </UButton>
      </nav>
    </UContainer>
  </header>
</template>
