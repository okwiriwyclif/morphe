<template>
  <div>
    <nav
      class="fixed top-0 w-full z-50 px-6 py-8 flex justify-between items-center mix-blend-difference"
    >
      <NuxtLink
        to="/"
        v-magnetic
        class="text-2xl font-bold tracking-tighter flex items-center gap-2"
      >
        <span class="w-2 h-2 bg-white rounded-full" />
        MORPHE
      </NuxtLink>

      <div class="hidden md:flex gap-12 text-xs font-medium tracking-widest uppercase">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="nav-link relative"
        >
          {{ link.label }}
        </a>
      </div>

      <button class="md:hidden" aria-label="Open menu" @click="menuOpen = true">
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
  }
}
</script>
