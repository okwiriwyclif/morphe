<template>
  <div>
    <nav
      class="fixed top-0 w-full z-50 px-4 sm:px-6 flex justify-between items-center transition-all duration-500"
      :class="scrolled ? 'py-3 md:py-4 bg-black/60 backdrop-blur-xl border-b border-white/5' : 'py-5 md:py-8'"
    >
      <NuxtLink to="/" v-magnetic aria-label="Morphe Creatives home">
        <BrandLogo mark-class="h-9" wordmark-class="h-4 hidden sm:block" />
      </NuxtLink>

      <div class="hidden md:flex gap-8 lg:gap-12 text-xs font-medium tracking-widest uppercase">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="nav-link relative py-2"
        >
          {{ link.label }}
        </a>
      </div>

      <button class="md:hidden p-3 -mr-3" aria-label="Open menu" :aria-expanded="menuOpen" @click="menuOpen = true">
        <Menu />
      </button>
    </nav>

    <MobileMenu :open="menuOpen" :links="mobileLinks" @close="menuOpen = false" />
  </div>
</template>

<script>
import { Menu } from 'lucide-vue-next'

export default {
  name: 'AppNav',

  components: { Menu },

  data() {
    return {
      menuOpen: false,
      scrolled: false,
      links: [
        { label: 'Ethos', href: '/#ethos' },
        { label: 'Capabilities', href: '/#capabilities' },
        { label: 'Selected Work', href: '/#work' },
        { label: 'Start a Project', href: '/#contact' }
      ],
      mobileLinks: [
        { label: 'Ethos', href: '/#ethos' },
        { label: 'Capabilities', href: '/#capabilities' },
        { label: 'Work', href: '/#work' },
        { label: 'Contact', href: '/#contact' }
      ]
    }
  },

  mounted() {
    this.onScroll()
    window.addEventListener('scroll', this.onScroll, { passive: true })
  },

  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  },

  methods: {
    onScroll() {
      this.scrolled = window.scrollY > 40
    }
  }
}
</script>
