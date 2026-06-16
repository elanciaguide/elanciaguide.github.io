<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData('page-' + route.path, () => {
  return queryCollection('content').path(route.path).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const site = useSiteConfig()
const pageTitle = computed(() => page.value?.title ?? '가이드')
const pageDescription = computed(
  () => page.value?.description ?? '일랜시아(Elancia) 베타 공식 커뮤니티 가이드',
)
const canonicalUrl = computed(() => `${site.url}${route.path}`)

/** frontmatter → 검색/공유 메타 반영 */
useSeoMeta({
  title: () => pageTitle.value,
  description: () => pageDescription.value,
  ogTitle: () => pageTitle.value,
  ogDescription: () => pageDescription.value,
  ogUrl: () => canonicalUrl.value,
})

useHead({
  link: [{ rel: 'canonical', href: () => canonicalUrl.value }],
  /** GEO: 문서 구조화 데이터(JSON-LD Article) */
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: pageTitle.value,
          description: pageDescription.value,
          inLanguage: 'ko',
          isPartOf: { '@type': 'WebSite', name: '일랜시아 가이드', url: site.url },
        }),
      ),
    },
  ],
})
</script>

<template>
  <article class="content-prose">
    <ContentRenderer
      v-if="page"
      :value="page"
    />
  </article>
</template>
