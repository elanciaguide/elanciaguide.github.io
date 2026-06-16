<script setup lang="ts">
const site = useSiteConfig()

/** GEO: 사이트 전역 구조화 데이터(WebSite) */
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: '일랜시아 가이드',
        url: site.url,
        inLanguage: 'ko',
        description: '일랜시아(Elancia) 베타 공식 커뮤니티 가이드',
      }),
    },
  ],
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>