<script setup lang="ts">
const props = defineProps<{
  name: string;
  alt?: string;
  class?: string;
}>();

const colorMode = useColorMode();

// Use glob import to ensure assets are included in the build
const icons = import.meta.glob("~/assets/images/Icon-*/*.png", {
  eager: true,
  import: "default",
});

const computedSrc = computed(() => {
  const folder = colorMode.value === "dark" ? "Icon-light" : "Icon-thick";
  // Create a partial path to search for
  const filePart = `/assets/images/${folder}/${props.name}`;

  // Find the key that contains our file path
  // keys will look like "/_nuxt/app/assets/images/..." or absolute paths or "~/assets/..." depending on setup
  // Checking for inclusion is safe enough for this specific structure
  const matchedKey = Object.keys(icons).find((k) => k.includes(filePart));

  return matchedKey ? (icons[matchedKey] as string) : "";
});
</script>

<template>
  <img :src="computedSrc" :alt="alt" :class="props.class" />
</template>
