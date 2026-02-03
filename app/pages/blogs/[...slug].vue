<script setup lang="ts">
const route = useRoute();

// 1. Fetch current page
const { data: page } = await useAsyncData(route.path, () => {
  // Normalize path to lowercase to match content collection keys
  // Nuxt Content seemingly stores paths in lowercase
  return queryCollection("content").path(route.path.toLowerCase()).first();
});

// 2. Fetch ALL content for navigation and surround
// We will filter and process this in JS to avoid multiple queries
const { data: allContent } = await useAsyncData("all-content", () => {
  return queryCollection("content")
    .select("title", "path", "meta", "description")
    .order("path", "ASC") // Sort by path or date? Default path usually works for structure
    .all();
});

if (import.meta.client) {
  // console.log("Current route path:", route.path);
  // console.log("Page data:", page.value);
  // console.log(
  //   "All content sample:",
  //   allContent.value?.map((p) => p.path).slice(0, 5),
  // );
}

// 3. Process Navigation (Sidebar)
// Group by top-level folder (e.g., /AI, /Nuxt)
const navigation = computed(() => {
  if (!allContent.value) return [];

  const groups: Record<
    string,
    { title: string; path: string; children: any[] }
  > = {};

  allContent.value.forEach((item) => {
    // Skip index pages if they are just redirects or lists (optional logic)
    // For this blog, index.md often exists.

    // Use more robust path normalization
    const relativePath = item.path.replace(/^\/blogs\/?/, "");
    const parts = relativePath.split("/").filter(Boolean);
    const section = parts[0];

    if (!section) return; // Skip if no section (e.g. root blogs index)

    // Create section group if not exists
    if (!groups[section]) {
      groups[section] = {
        title:
          section.charAt(0).toUpperCase() + section.slice(1).replace(/_/g, " "),
        path: `/blogs/${section}`,
        children: [],
      };
    }

    // Add item to children
    groups[section].children.push({
      title: item.title,
      path: item.path,
    });
  });

  // Let's filter to show ONLY the current section's sidebar.
  const currentPathRelative = route.path.replace(/^\/blogs\/?/, "");
  const currentSection = currentPathRelative.split("/")[0];

  if (currentSection && groups[currentSection]) {
    return [groups[currentSection]];
  }

  // Fallback: show all sections
  return Object.values(groups);
});

// 4. Process Surround (Prev/Next)
const surround = computed(() => {
  if (!allContent.value || !page.value) return { prev: null, next: null };

  const currentIndex = allContent.value.findIndex(
    (item) => item.path === page.value?.path,
  );

  if (currentIndex === -1) return { prev: null, next: null };

  return {
    prev: currentIndex > 0 ? allContent.value[currentIndex - 1] : null,
    next:
      currentIndex < allContent.value.length - 1
        ? allContent.value[currentIndex + 1]
        : null,
  };
});

useSeoMeta({
  title: page.value?.title || "Nuxt Skills Blog",
  description: page.value?.description || "Learn Nuxt skills with us!",
});
</script>

<template>
  <UContainer class="py-8">
    <div v-if="page" class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- LEFT SIDEBAR (Navigation) -->
      <aside
        class="hidden lg:block lg:col-span-3 border-r border-gray-200 dark:border-gray-800"
      >
        <ContentSidebar :navigation="navigation" :current-path="route.path" />
      </aside>

      <!-- MAIN CONTENT -->
      <main class="col-span-1 lg:col-span-6 min-w-0">
        <div
          class="mb-8 flex items-center gap-4 border-b pb-4 border-gray-200 dark:border-gray-800"
        >
          <ThemeIcon
            name="happy-right.png"
            alt="Happy Triceratops"
            class="w-16 h-16"
          />
          <div>
            <h1 class="text-3xl sm:text-4xl font-bold text-primary-500 mb-2">
              {{ page.title }}
            </h1>
            <p v-if="page.description" class="text-gray-500 dark:text-gray-400">
              {{ page.description }}
            </p>
          </div>
        </div>

        <!-- Metadata Section -->
        <div v-if="page" class="flex flex-wrap items-center gap-3 mb-6 text-sm">
          <UBadge
            v-if="page.category"
            color="primary"
            variant="soft"
            class="capitalize"
          >
            {{ page.category }}
          </UBadge>

          <span
            v-if="page.date"
            class="text-gray-500 dark:text-gray-400 flex items-center gap-1"
          >
            <UIcon name="i-heroicons-calendar-days" class="w-4 h-4" />
            {{ new Date(page.date).toLocaleDateString() }}
          </span>

          <div v-if="page.tags?.length" class="flex flex-wrap gap-2">
            <UBadge
              v-for="tag in page.tags"
              :key="tag"
              color="gray"
              variant="outline"
              size="s"
            >
              #{{ tag }}
            </UBadge>
          </div>
        </div>

        <article class="prose dark:prose-invert max-w-none">
          <ContentRenderer :value="page" />
        </article>

        <!-- PREV/NEXT NAV -->
        <ContentSurround :prev="surround.prev" :next="surround.next" />
      </main>

      <!-- RIGHT SIDEBAR (TOC) -->
      <aside class="hidden lg:block lg:col-span-3">
        <ContentToc
          v-if="page.body?.toc?.links?.length"
          :links="page.body.toc.links"
        />
      </aside>
    </div>

    <!-- 404 STATE -->
    <div v-else class="text-center py-20 flex flex-col items-center">
      <ThemeIcon
        name="confused-right.png"
        alt="Confused Triceratops"
        class="w-32 h-32 mb-6"
      />
      <h1 class="text-3xl font-bold mb-2">Page not found</h1>
      <p class="text-gray-500 mb-6">
        The triceratops couldn't find what you were looking for.
      </p>
      <UButton to="/" color="primary" variant="solid">Go Home</UButton>
    </div>
  </UContainer>
</template>
