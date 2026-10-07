<template>
  <footer class="py-20 px-6 border-t border-white/5">
    <div
      class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12"
    >
      <div class="text-center md:text-left">
        <BrandLogo mark-class="h-12" wordmark-class="h-6" />
        <p class="text-gray-500 text-sm mt-4">
          © {{ year }} Morphe Creatives. All rights reserved.
        </p>
      </div>
      <div class="flex gap-12 text-xs uppercase tracking-widest text-gray-400">
        <a
          v-for="social in socials"
          :key="social.label"
          :href="social.href"
          class="hover:text-white transition-colors"
        >
          {{ social.label }}
        </a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',

  data() {
    return {
      year: new Date().getFullYear(),
      socials: [
        { label: 'Twitter', href: '#' },
        { label: 'LinkedIn', href: '#' },
        { label: 'Behance', href: '#' },
        { label: 'Instagram', href: '#' }
      ]
    }
  }
}
</script>
