<script setup lang="ts">
const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});

const links = [
  { label: "Home", to: "/" },
  { label: "AI", to: "/blogs/ai" },
  { label: "Nuxt", to: "/blogs/nuxt" },
  { label: "Python", to: "/blogs/python" },
  { label: "Web Dev", to: "/blogs/web_dev" },
];
</script>

<template>
  <header
    class="border-b border-gray-200 dark:border-gray-800 bg-white/75 dark:bg-gray-900/75 backdrop-blur sticky top-0 z-50"
  >
    <UContainer class="flex items-center justify-between py-4">
      <NuxtLink
        to="/"
        class="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <ThemeIcon
          name="logo-normal.png"
          alt="Nuxt Skills Logo"
          class="h-10 w-10 object-contain"
        />
        <span class="font-bold text-xl text-primary-500"
          >Woody's Tech blog</span
        >
      </NuxtLink>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center gap-4">
        <div class="flex gap-2">
          <UButton
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            variant="ghost"
            color="neutral"
          >
            {{ link.label }}
          </UButton>
        </div>

        <ClientOnly>
          <UButton
            :icon="
              isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'
            "
            color="neutral"
            variant="ghost"
            aria-label="Theme"
            @click="isDark = !isDark"
          />
        </ClientOnly>
      </nav>

      <!-- Mobile Navigation -->
      <div class="md:hidden flex items-center gap-2">
        <ClientOnly>
          <UButton
            :icon="
              isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'
            "
            color="neutral"
            variant="ghost"
            aria-label="Theme"
            @click="isDark = !isDark"
          />
        </ClientOnly>

        <UDrawer direction="right">
          <UButton
            icon="i-heroicons-bars-3-20-solid"
            color="neutral"
            variant="ghost"
            aria-label="Menu"
          />

          <template #content>
            <div class="p-4 flex flex-col gap-4">
              <div
                class="flex items-center justify-between border-b pb-4 border-gray-200 dark:border-gray-800"
              >
                <span class="font-bold text-lg text-primary-500"
                  >選單 Menu</span
                >
              </div>

              <div class="flex flex-col gap-2">
                <UButton
                  v-for="link in links"
                  :key="link.to"
                  :to="link.to"
                  variant="ghost"
                  color="neutral"
                  class="justify-start text-lg py-3"
                  block
                >
                  {{ link.label }}
                </UButton>
              </div>
            </div>
          </template>
        </UDrawer>
      </div>
    </UContainer>
  </header>
</template>
